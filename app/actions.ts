"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addManualProgress,
  completeSuggestedTask,
  completeTask,
  getCurrentUser,
  goals,
  saveSelectedGoal
} from "@/lib/v1";

export async function selectGoalAction(formData: FormData) {
  const goal = String(formData.get("goal") ?? "");
  if (!goals.includes(goal as (typeof goals)[number])) {
    redirect("/onboarding");
  }

  const user = await getCurrentUser();
  await saveSelectedGoal(user, goal);
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/dashboard");
}

export async function completeTaskAction(formData: FormData) {
  const taskId = String(formData.get("task_id") ?? "");
  const user = await getCurrentUser();

  if (taskId) {
    await completeTask(taskId, user.userId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/memory");
  revalidatePath("/profile");
}

export async function completeSuggestedTaskAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const user = await getCurrentUser();

  if (title) {
    await completeSuggestedTask(
      user,
      title,
      description || "Completed a focused career readiness task."
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/tasks");
  revalidatePath("/memory");
  revalidatePath("/profile");
}

export async function addManualProgressAction(formData: FormData) {
  const progress = String(formData.get("progress") ?? "").trim();
  const user = await getCurrentUser();

  if (progress) {
    await addManualProgress(user, progress);
  }

  revalidatePath("/dashboard");
  revalidatePath("/memory");
  revalidatePath("/profile");
}

export async function resyncGithubAction() {
  redirect("/api/github/login");
}

export async function logoutAction() {
  const store = cookies();
  [
    "quad_user_id",
    "quad_user_email",
    "quad_github_username",
    "quad_github_user_id",
    "github_oauth_state"
  ].forEach((name) => store.delete(name));
  redirect("/");
}
