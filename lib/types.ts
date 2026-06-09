export type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  html_url: string;
};

export type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  created_at: string;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
};

export type GitHubCommit = {
  repo: GitHubRepo;
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    } | null;
  };
  author: {
    login: string;
  } | null;
};

export type Activity = {
  activityType: "repo" | "commit";
  activityText: string;
  githubUserId: number;
  githubUsername: string;
  repoMetadata: Record<string, unknown>;
  commitMetadata: Record<string, unknown> | null;
  occurredAt: string;
};

export type EmbeddedActivity = Activity & {
  embedding: number[];
};

export type GitHubActivityRow = {
  id: string;
  github_user_id: number;
  github_username: string;
  activity_type: "repo" | "commit";
  activity_text: string;
  repo_metadata: {
    id?: number;
    name?: string;
    full_name?: string;
    url?: string;
    [key: string]: unknown;
  };
  commit_metadata: Record<string, unknown> | null;
  occurred_at: string;
  created_at: string;
};
