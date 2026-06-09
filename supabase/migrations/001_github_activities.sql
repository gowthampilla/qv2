create extension if not exists vector;

create table if not exists public.github_activities (
  id uuid primary key default gen_random_uuid(),
  github_user_id bigint not null,
  github_username text not null,
  activity_type text not null check (activity_type in ('repo', 'commit')),
  activity_text text not null,
  repo_metadata jsonb not null,
  commit_metadata jsonb,
  embedding vector(1536) not null,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists github_activities_github_user_id_idx
  on public.github_activities (github_user_id);

create index if not exists github_activities_occurred_at_idx
  on public.github_activities (occurred_at desc);

create index if not exists github_activities_embedding_idx
  on public.github_activities
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
