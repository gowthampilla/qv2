create extension if not exists pgcrypto;

alter table public.user_goals
  add column if not exists goal_slug text,
  add column if not exists email text;

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  description text not null,
  location text,
  type text,
  goal_slug text references public.goals(slug),
  required_skills text[] not null default '{}',
  url text,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.task_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  goal_slug text references public.goals(slug),
  difficulty text,
  category text,
  points integer not null default 10,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  goal_slug text references public.goals(slug),
  content_type text,
  url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_template_id uuid references public.task_templates(id),
  title text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending', 'complete')),
  due_date date not null,
  points integer not null default 10,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists goals_slug_idx on public.goals(slug);
create index if not exists opportunities_goal_active_idx
  on public.opportunities(goal_slug, is_active, created_at desc);
create index if not exists task_templates_goal_active_idx
  on public.task_templates(goal_slug, is_active, created_at desc);
create index if not exists feed_posts_goal_active_idx
  on public.feed_posts(goal_slug, is_active, created_at desc);
create index if not exists user_tasks_user_due_idx
  on public.user_tasks(user_id, due_date, created_at);
create index if not exists user_tasks_user_status_idx
  on public.user_tasks(user_id, status);
