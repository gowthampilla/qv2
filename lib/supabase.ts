import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { EmbeddedActivity } from "@/lib/types";

export function getSupabaseAdmin() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });
}

export async function storeActivities(activities: EmbeddedActivity[]) {
  if (activities.length === 0) {
    return;
  }

  const supabase = getSupabaseAdmin();

  const rows = activities.map((activity) => ({
    github_user_id: activity.githubUserId,
    github_username: activity.githubUsername,
    activity_type: activity.activityType,
    activity_text: activity.activityText,
    repo_metadata: activity.repoMetadata,
    commit_metadata: activity.commitMetadata,
    occurred_at: activity.occurredAt,
    embedding: activity.embedding
  }));

  const { error } = await supabase.from("github_activities").insert(rows);

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}
