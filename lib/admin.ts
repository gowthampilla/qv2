import { redirect } from "next/navigation";
import { getSession, isAdminEmail } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { FeedPost, Opportunity, TaskTemplate } from "@/lib/v1";

export async function requireAdmin() {
  const session = getSession();
  if (!isAdminEmail(session.email)) {
    redirect("/dashboard");
  }
  return session;
}

export async function getAdminOverview() {
  const supabase = getSupabaseAdmin();
  const [opportunities, tasks, feed] = await Promise.all([
    supabase.from("opportunities").select("id", { count: "exact", head: true }),
    supabase.from("task_templates").select("id", { count: "exact", head: true }),
    supabase.from("feed_posts").select("id", { count: "exact", head: true })
  ]);

  return {
    opportunities: opportunities.count ?? 0,
    taskTemplates: tasks.count ?? 0,
    feedPosts: feed.count ?? 0
  };
}

export async function getAdminOpportunities() {
  const { data, error } = await getSupabaseAdmin()
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as Opportunity[]);
}

export async function getAdminTaskTemplates() {
  const { data, error } = await getSupabaseAdmin()
    .from("task_templates")
    .select("*")
    .order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as TaskTemplate[]);
}

export async function getAdminFeedPosts() {
  const { data, error } = await getSupabaseAdmin()
    .from("feed_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return error ? [] : ((data ?? []) as FeedPost[]);
}
