alter table public.github_activities
  add column if not exists memory_sentence text;

create extension if not exists pgcrypto;

create table if not exists public.user_goals (
  user_id text primary key,
  github_username text,
  selected_goal text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.manual_activities (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  github_username text,
  activity_text text not null,
  memory_sentence text,
  activity_type text not null default 'manual',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  description text not null,
  status text not null default 'open' check (status in ('open', 'complete')),
  due_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.streaks (
  user_id text primary key,
  current_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

create index if not exists github_activities_memory_sentence_idx
  on public.github_activities (memory_sentence);

create index if not exists manual_activities_user_id_occurred_at_idx
  on public.manual_activities (user_id, occurred_at desc);

create index if not exists tasks_user_id_due_date_idx
  on public.tasks (user_id, due_date);

create index if not exists tasks_user_id_status_idx
  on public.tasks (user_id, status);
