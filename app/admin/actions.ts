"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

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
  const row = {
    title: text(formData, "title"),
    company: text(formData, "company"),
    description: text(formData, "description"),
    location: text(formData, "location"),
    type: text(formData, "type"),
    goal_slug: text(formData, "goal_slug"),
    required_skills: skills(text(formData, "required_skills")),
    url: text(formData, "url"),
    source: text(formData, "source"),
    is_active: active(formData)
  };

  if (id) {
    await getSupabaseAdmin().from("opportunities").update(row).eq("id", id);
  } else {
    await getSupabaseAdmin().from("opportunities").insert(row);
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
}

export async function saveTaskTemplateAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const row = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    goal_slug: text(formData, "goal_slug"),
    difficulty: text(formData, "difficulty"),
    category: text(formData, "category"),
    points: Number(text(formData, "points") || 10),
    is_active: active(formData)
  };

  if (id) {
    await getSupabaseAdmin().from("task_templates").update(row).eq("id", id);
  } else {
    await getSupabaseAdmin().from("task_templates").insert(row);
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
  const row = {
    title: text(formData, "title"),
    description: text(formData, "description"),
    goal_slug: text(formData, "goal_slug"),
    content_type: text(formData, "content_type"),
    url: text(formData, "url"),
    is_active: active(formData)
  };

  if (id) {
    await getSupabaseAdmin().from("feed_posts").update(row).eq("id", id);
  } else {
    await getSupabaseAdmin().from("feed_posts").insert(row);
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
