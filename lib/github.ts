import { env } from "@/lib/env";
import type {
  GitHubCommit,
  GitHubEmail,
  GitHubRepo,
  GitHubUser
} from "@/lib/types";

const githubHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
});

async function githubFetch<T>(accessToken: string, path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(accessToken),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGitHubAccessToken(code: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/github/callback`
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`);
  }

  const tokenResponse = (await response.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!tokenResponse.access_token) {
    throw new Error(
      tokenResponse.error_description ?? "GitHub did not return an access token."
    );
  }

  return tokenResponse.access_token;
}

export function fetchAuthenticatedGitHubUser(accessToken: string) {
  return githubFetch<GitHubUser>(accessToken, "/user");
}

export async function fetchPrimaryGitHubEmail(accessToken: string) {
  const emails = await githubFetch<GitHubEmail[]>(accessToken, "/user/emails");
  return (
    emails.find((email) => email.primary && email.verified)?.email ??
    emails.find((email) => email.verified)?.email ??
    emails[0]?.email ??
    null
  );
}

export function fetchLatestPublicRepos(accessToken: string) {
  return githubFetch<GitHubRepo[]>(
    accessToken,
    "/user/repos?visibility=public&affiliation=owner&sort=pushed&direction=desc&per_page=10"
  );
}

export async function fetchRecentCommits(
  accessToken: string,
  repos: GitHubRepo[],
  limit: number
) {
  const commitsByRepo = await Promise.all(
    repos.map(async (repo) => {
      try {
        const commits = await githubFetch<GitHubCommit[]>(
          accessToken,
          `/repos/${repo.full_name}/commits?author=${repo.owner.login}&per_page=5`
        );
        return commits.map((commit) => ({ ...commit, repo }));
      } catch {
        return [];
      }
    })
  );

  return commitsByRepo
    .flat()
    .sort((a, b) => {
      const aDate = a.commit.author?.date ?? "";
      const bDate = b.commit.author?.date ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit);
}
