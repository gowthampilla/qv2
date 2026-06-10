"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { fallbackGoals } from "@/lib/v1";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function active(formData: FormData) {
  return formData.get("is_active") === "on";
}

function skills(value: string) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export async function saveOpportunityAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const goalSlug = text(formData, "goal_slug");
  await ensureGoalExists(goalSlug);
  const row = {
    title: text(formData, "title"),
    company: text(formData, "company"),
    description: text(formData, "description"),
    location: text(formData, "location"),
    type: text(formData, "type"),
    goal_slug: goalSlug,
    required_skills: skills(text(formData, "required_skills")),
    url: text(formData, "url"),
    source: text(formData, "source"),
    is_active: active(formData)
  };

  const result = id
    ? await getSupabaseAdmin().from("opportunities").update(row).eq("id", id)
    : await getSupabaseAdmin().from("opportunities").insert(row);

  if (result.error) {
    throw new Error(`Could not save opportunity: ${result.error.message}`);
  }

  revalidatePath("/admin/opportunities");
  revalidatePath("/dashboard");
  revalidatePath("/opportunities");
}

export async function deleteOpportunityAction(formData: FormData) {
  await requireAdmin();
  await getSupabaseAdmin()
    .from("opportunities")
    .delete()
    .eq("id", text(formData, "id"));
  revalidatePath("/admin/opportunities");
  revalidatePath("/dashboard");
  revalidatePath("/opportunities");
}

export async function saveTaskTemplateAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const goalSlug = text(formData, "goal_slug");
  await ensureGoalExists(goalSlug);
  const row = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    goal_slug: goalSlug,
    difficulty: text(formData, "difficulty"),
    category: text(formData, "category"),
    points: Number(text(formData, "points") || 10),
    is_active: active(formData)
  };

  const result = id
    ? await getSupabaseAdmin().from("task_templates").update(row).eq("id", id)
    : await getSupabaseAdmin().from("task_templates").insert(row);

  if (result.error) {
    throw new Error(`Could not save task template: ${result.error.message}`);
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/tasks");
}

export async function deleteTaskTemplateAction(formData: FormData) {
  await requireAdmin();
  await getSupabaseAdmin()
    .from("task_templates")
    .delete()
    .eq("id", text(formData, "id"));
  revalidatePath("/admin/tasks");
}

export async function saveFeedPostAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const goalSlug = text(formData, "goal_slug");
  await ensureGoalExists(goalSlug);
  const row = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    goal_slug: goalSlug,
    content_type: text(formData, "content_type"),
    url: text(formData, "url"),
    is_active: active(formData)
  };

  const result = id
    ? await getSupabaseAdmin().from("feed_posts").update(row).eq("id", id)
    : await getSupabaseAdmin().from("feed_posts").insert(row);

  if (result.error) {
    throw new Error(`Could not save feed post: ${result.error.message}`);
  }

  revalidatePath("/admin/feed");
  revalidatePath("/dashboard");
  revalidatePath("/feed");
}

export async function deleteFeedPostAction(formData: FormData) {
  await requireAdmin();
  await getSupabaseAdmin()
    .from("feed_posts")
    .delete()
    .eq("id", text(formData, "id"));
  revalidatePath("/admin/feed");
}

async function ensureGoalExists(goalSlug: string) {
  if (!goalSlug) {
    return;
  }

  const fallback = fallbackGoals.find((goal) => goal.slug === goalSlug);
  const row = {
    name: fallback?.name ?? goalSlug,
    slug: goalSlug,
    description: fallback?.description ?? null
  };
  const { error } = await getSupabaseAdmin()
    .from("goals")
    .upsert(row, { onConflict: "slug" });

  if (error) {
    throw new Error(`Could not prepare goal ${goalSlug}: ${error.message}`);
  }
}
