import { NextRequest, NextResponse } from "next/server";
import { createActivityEmbeddings } from "@/lib/embeddings";
import {
  fetchAuthenticatedGitHubUser,
  fetchLatestPublicRepos,
  fetchPrimaryGitHubEmail,
  fetchRecentCommits,
  getGitHubAccessToken
} from "@/lib/github";
import { buildActivities } from "@/lib/activity";
import { storeActivities } from "@/lib/supabase";
import { env } from "@/lib/env";
import { getSelectedGoal, refreshStreak } from "@/lib/v1";
import { setSessionCookies, uuidFromStableValue } from "@/lib/session";

export const dynamic = "force-dynamic";

function redirectToResult(params: Record<string, string | number>) {
  const url = new URL("/github/success", env.NEXT_PUBLIC_APP_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  return NextResponse.redirect(url);
}

function redirectToDashboard() {
  return NextResponse.redirect(new URL("/dashboard", env.NEXT_PUBLIC_APP_URL));
}

function redirectToOnboarding() {
  return NextResponse.redirect(new URL("/onboarding", env.NEXT_PUBLIC_APP_URL));
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("github_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return redirectToResult({ error: "Invalid GitHub OAuth response." });
  }

  try {
    const accessToken = await getGitHubAccessToken(code);
    const user = await fetchAuthenticatedGitHubUser(accessToken);
    const email = user.email ?? (await fetchPrimaryGitHubEmail(accessToken));
    const repos = await fetchLatestPublicRepos(accessToken);
    const commits = await fetchRecentCommits(accessToken, repos, 20);
    const activities = buildActivities(user, repos, commits);
    const embeddedActivities = await createActivityEmbeddings(activities);
    await storeActivities(embeddedActivities);
    const appUserId = uuidFromStableValue(`github:${user.id}`);
    await refreshStreak(appUserId).catch(() => 0);
    const selectedGoal = await getSelectedGoal(appUserId).catch(() => undefined);

    const response = selectedGoal ? redirectToDashboard() : redirectToOnboarding();
    setSessionCookies(response, {
      userId: appUserId,
      email,
      githubUsername: user.login,
      githubUserId: String(user.id)
    });
    response.cookies.delete("github_oauth_state");
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to import GitHub data.";
    return redirectToResult({ error: message });
  }
}
