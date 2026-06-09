import OpenAI from "openai";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { GitHubActivityRow } from "@/lib/types";

function isRawActivityText(text: string) {
  return (
    text.startsWith("Created or maintained public GitHub repository ") ||
    text.startsWith("Committed to ")
  );
}

async function createCareerMemorySentence(
  openai: OpenAI,
  activity: GitHubActivityRow
) {
  const repoName =
    activity.repo_metadata.full_name ?? activity.repo_metadata.name ?? "a GitHub repository";

  const response = await openai.chat.completions.create({
    model: env.OPENAI_SUMMARY_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "Rewrite GitHub activity as one concise professional career memory sentence. Use first person, past tense, no hype, no emojis, no markdown. Keep it under 26 words."
      },
      {
        role: "user",
        content: `Repo: ${repoName}\nActivity type: ${activity.activity_type}\nRaw activity: ${activity.activity_text}`
      }
    ]
  });

  return (
    response.choices[0]?.message.content?.trim().replace(/^"|"$/g, "") ??
    activity.activity_text
  );
}

export async function normalizeRawActivities(activities: GitHubActivityRow[]) {
  const rawActivities = activities.filter((activity) =>
    isRawActivityText(activity.activity_text)
  );

  if (rawActivities.length === 0) {
    return activities;
  }

  try {
    const supabase = getSupabaseAdmin();
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY
    });

    const rewritten = await Promise.all(
      rawActivities.map(async (activity) => ({
        id: activity.id,
        activityText: await createCareerMemorySentence(openai, activity)
      }))
    );

    const embeddings = await openai.embeddings.create({
      model: env.OPENAI_EMBEDDING_MODEL,
      input: rewritten.map((activity) => activity.activityText)
    });

    const updates = await Promise.all(
      rewritten.map(({ id, activityText }, index) =>
        supabase
          .from("github_activities")
          .update({
            activity_text: activityText,
            embedding: embeddings.data[index].embedding
          })
          .eq("id", id)
      )
    );

    const failedUpdate = updates.find((update) => update.error);
    if (failedUpdate?.error) {
      throw new Error(`Supabase update failed: ${failedUpdate.error.message}`);
    }

    const rewrittenById = new Map(
      rewritten.map((activity) => [activity.id, activity.activityText])
    );

    return activities.map((activity) => ({
      ...activity,
      activity_text: rewrittenById.get(activity.id) ?? activity.activity_text
    }));
  } catch {
    return activities;
  }
}

export async function getMemoryActivities(limit?: number) {
  const query = getSupabaseAdmin()
    .from("github_activities")
    .select(
      "id, github_user_id, github_username, activity_type, activity_text, repo_metadata, commit_metadata, occurred_at, created_at"
    )
    .order("occurred_at", { ascending: false });

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase read failed: ${error.message}`);
  }

  return normalizeRawActivities((data ?? []) as GitHubActivityRow[]);
}

export function getRepoName(activity: GitHubActivityRow) {
  return (
    activity.repo_metadata.full_name ??
    activity.repo_metadata.name ??
    "Unknown repository"
  );
}

export function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}
