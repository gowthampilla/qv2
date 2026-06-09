import type {
  Activity,
  GitHubCommit,
  GitHubRepo,
  GitHubUser
} from "@/lib/types";

function firstCommitLine(message: string) {
  return message.split("\n")[0]?.trim() || "No commit message";
}

function repoActivityText(repo: GitHubRepo) {
  const details = [
    repo.description,
    repo.language ? `Primary language: ${repo.language}` : null,
    `${repo.stargazers_count} stars`,
    `${repo.forks_count} forks`
  ].filter(Boolean);

  return `Created or maintained public GitHub repository ${repo.full_name}. ${details.join(
    ". "
  )}.`;
}

function commitActivityText(commit: GitHubCommit) {
  return `Committed to ${commit.repo.full_name}: ${firstCommitLine(
    commit.commit.message
  )}.`;
}

export function buildActivities(
  user: GitHubUser,
  repos: GitHubRepo[],
  commits: GitHubCommit[]
): Activity[] {
  const repoActivities = repos.map<Activity>((repo) => ({
    activityType: "repo",
    activityText: repoActivityText(repo),
    githubUserId: user.id,
    githubUsername: user.login,
    repoMetadata: {
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      default_branch: repo.default_branch,
      pushed_at: repo.pushed_at,
      created_at: repo.created_at,
      updated_at: repo.updated_at
    },
    commitMetadata: null,
    occurredAt: repo.pushed_at ?? repo.updated_at
  }));

  const commitActivities = commits.map<Activity>((commit) => ({
    activityType: "commit",
    activityText: commitActivityText(commit),
    githubUserId: user.id,
    githubUsername: user.login,
    repoMetadata: {
      id: commit.repo.id,
      name: commit.repo.name,
      full_name: commit.repo.full_name,
      url: commit.repo.html_url
    },
    commitMetadata: {
      sha: commit.sha,
      url: commit.html_url,
      message: commit.commit.message,
      author_name: commit.commit.author?.name ?? null,
      author_email: commit.commit.author?.email ?? null,
      author_date: commit.commit.author?.date ?? null,
      author_login: commit.author?.login ?? null
    },
    occurredAt: commit.commit.author?.date ?? commit.repo.pushed_at ?? commit.repo.updated_at
  }));

  return [...repoActivities, ...commitActivities];
}
