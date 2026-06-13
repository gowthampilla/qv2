import { createMemorySentence } from "@/lib/ai";
import { isCareerProgressText } from "@/lib/progress-validation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export type GoalRecord = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
};

export const fallbackGoals: GoalRecord[] = [
  {
    name: "AI Internship",
    slug: "ai-internship",
    description: "Build applied AI projects and proof of product engineering."
  },
  {
    name: "Java Backend Job",
    slug: "java-backend-job",
    description: "Prepare for Java, Spring Boot, APIs, and backend interviews."
  },
  {
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    description: "Ship complete products across frontend, backend, and deployment."
  },
  {
    name: "Improve DSA",
    slug: "improve-dsa",
    description: "Build consistent algorithm practice and interview readiness."
  },
  {
    name: "Build Startup",
    slug: "build-startup",
    description: "Validate, build, and launch with a tight feedback loop."
  },
  {
    name: "Get Remote Developer Job",
    slug: "get-remote-developer-job",
    description: "Build proof, communication, and applications for remote roles."
  }
];

export const goals = fallbackGoals.map((goal) => goal.slug);

export type CurrentUser = {
  userId: string;
  email: string | null;
  githubUsername: string | null;
  githubUserId: string | null;
  name: string;
};

export type MemoryItem = {
  id: string;
  source: "github" | "manual";
  memorySentence: string;
  rawText: string;
  repoName: string | null;
  activityType: string;
  occurredAt: string;
};

export type UserTask = {
  id: string;
  user_id: string;
  task_template_id: string | null;
  title: string;
  description: string;
  status: "pending" | "complete";
  due_date: string;
  points: number;
  created_at: string;
  completed_at: string | null;
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  type: string | null;
  goal_slug: string | null;
  required_skills: string[];
  url: string | null;
  source: string | null;
  is_active: boolean;
  created_at: string;
};

export type FeedPost = {
  id: string;
  title: string;
  description: string;
  goal_slug: string | null;
  content_type: string | null;
  url: string | null;
  is_active: boolean;
  created_at: string;
};

export type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  goal_slug: string | null;
  difficulty: string | null;
  category: string | null;
  points: number;
  is_active: boolean;
  created_at: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = getSession();
  if (session.githubUserId || session.githubUsername || session.email) {
    return {
      userId: session.userId,
      email: session.email,
      githubUsername: session.githubUsername,
      githubUserId: session.githubUserId,
      name: session.githubUsername ?? session.email ?? "Quad user"
    };
  }

  return {
    userId: "00000000-0000-0000-0000-000000000001",
    email: null,
    githubUsername: null,
    githubUserId: null,
    name: "Quad user"
  };
}

export async function getGoalCatalog() {
  const { data, error } = await getSupabaseAdmin()
    .from("goals")
    .select("id, name, slug, description")
    .order("created_at", { ascending: true });

  return error || !data?.length ? fallbackGoals : (data as GoalRecord[]);
}

export async function getSelectedGoal(userId: string) {
  const { data } = await getSupabaseAdmin()
    .from("user_goals")
    .select("selected_goal, goal_slug")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.goal_slug && !data?.selected_goal) {
    return undefined;
  }

  const catalog = await getGoalCatalog();
  return (
    catalog.find((goal) => goal.slug === data.goal_slug) ??
    catalog.find((goal) => goal.name === data.selected_goal) ??
    undefined
  );
}

export async function saveSelectedGoal(user: CurrentUser, goalSlug: string) {
  const catalog = await getGoalCatalog();
  const goal =
    catalog.find((item) => item.slug === goalSlug) ??
    fallbackGoals.find((item) => item.slug === goalSlug);

  if (!goal) {
    return;
  }

  await getSupabaseAdmin().from("user_goals").upsert({
    user_id: user.userId,
    github_username: user.githubUsername,
    email: user.email,
    selected_goal: goal.name,
    goal_slug: goal.slug,
    updated_at: new Date().toISOString()
  });

  await ensureDailyTasks(user.userId, goal.slug);
}

export async function getGithubStats() {
  return getGithubStatsForUser();
}

export async function getGithubStatsForUser(user?: CurrentUser) {
  const query = getSupabaseAdmin()
    .from("github_activities")
    .select("id, github_username, repo_metadata, occurred_at, created_at")
    .order("created_at", { ascending: false });

  if (user && !user.githubUsername && !user.githubUserId) {
    return {
      connected: false,
      githubUsername: undefined,
      totalRepos: 0,
      totalActivities: 0,
      lastSyncTime: undefined
    };
  }

  if (user?.githubUserId) {
    query.eq("github_user_id", Number(user.githubUserId));
  } else if (user?.githubUsername) {
    query.eq("github_username", user.githubUsername);
  }

  const { data } = await query;
  const rows = data ?? [];
  const repos = new Set(
    rows
      .map((row) => getRepoName(row.repo_metadata as Record<string, unknown>))
      .filter((repoName) => repoName !== "Unknown repository")
  );

  return {
    connected: rows.length > 0,
    githubUsername: rows[0]?.github_username as string | undefined,
    totalRepos: repos.size,
    totalActivities: rows.length,
    lastSyncTime: rows[0]?.created_at as string | undefined
  };
}

export async function getAllMemories(
  limit?: number,
  options: { normalize?: boolean; user?: CurrentUser } = { normalize: true }
): Promise<MemoryItem[]> {
  const [github, manual] = await Promise.all([
    getGithubMemories(limit, options.normalize ?? true, options.user),
    getManualMemories(limit, options.normalize ?? true, options.user)
  ]);

  const memories = [...github, ...manual].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return typeof limit === "number" ? memories.slice(0, limit) : memories;
}

export async function getOpportunities(goalSlug?: string, limit?: number) {
  const query = getSupabaseAdmin()
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (goalSlug) {
    query.eq("goal_slug", goalSlug);
  }
  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;
  return error
    ? []
    : ((data ?? []) as Opportunity[]).map((opportunity) =>
        normalizeOpportunity(opportunity, goalSlug)
      );
}

export async function getFeedPosts(goalSlug?: string, limit?: number) {
  const query = getSupabaseAdmin()
    .from("feed_posts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (goalSlug) {
    query.eq("goal_slug", goalSlug);
  }
  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;
  return error ? [] : ((data ?? []) as FeedPost[]);
}

export async function ensureDailyTasks(userId: string, goalSlug?: string) {
  if (!goalSlug) {
    return [];
  }

  const today = todayKey();
  const existing = await getTasksForToday(userId);
  if (existing.length >= 4) {
    return existing;
  }

  const templates = await getTaskTemplates(goalSlug, 4);
  const source = templates.length > 0 ? templates : fallbackTaskTemplates(goalSlug);
  const existingTitles = new Set(existing.map((task) => task.title.toLowerCase()));
  const tasksToCreate = source
    .filter((task) => !existingTitles.has(task.title.toLowerCase()))
    .slice(0, 4 - existing.length);

  if (tasksToCreate.length === 0) {
    return existing;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("user_tasks")
    .insert(
      tasksToCreate.map((task) => ({
        user_id: userId,
        task_template_id: task.id ?? null,
        title: task.title,
        description: task.description,
        status: "pending",
        due_date: today,
        points: task.points ?? 10
      }))
    )
    .select("*");

  return error ? existing : [...existing, ...((data ?? []) as UserTask[])];
}

export async function getTasksForToday(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("user_tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("due_date", todayKey())
    .order("created_at", { ascending: true });

  return error ? [] : ((data ?? []) as UserTask[]);
}

export async function getAllUserTasks(userId: string, limit?: number) {
  const query = getSupabaseAdmin()
    .from("user_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: false });

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;
  return error ? [] : ((data ?? []) as UserTask[]);
}

export async function completeTask(taskId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  const { data: task } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!task || task.status === "complete") {
    return;
  }

  const completedAt = new Date().toISOString();

  await supabase
    .from("user_tasks")
    .update({ status: "complete", completed_at: completedAt })
    .eq("id", taskId)
    .eq("user_id", userId);

  await saveTaskCompletionMemory({
    userId,
    title: task.title,
    description: task.description,
    occurredAt: completedAt
  });

  await refreshStreak(userId);
}

export async function completeSuggestedTask(
  user: CurrentUser,
  title: string,
  description: string
) {
  const existingTasks = await getTasksForToday(user.userId);
  const matchingTask = existingTasks.find(
    (task) => task.title.toLowerCase() === title.toLowerCase()
  );

  if (matchingTask?.status === "complete") {
    return;
  }

  if (matchingTask) {
    await completeTask(matchingTask.id, user.userId);
    return;
  }

  const occurredAt = new Date().toISOString();
  await getSupabaseAdmin().from("user_tasks").insert({
    user_id: user.userId,
    task_template_id: null,
    title,
    description,
    status: "complete",
    due_date: todayKey(),
    points: 10,
    completed_at: occurredAt
  });

  await saveTaskCompletionMemory({
    userId: user.userId,
    githubUsername: user.githubUsername,
    title,
    description,
    occurredAt
  });
  await refreshStreak(user.userId);
}

export async function addManualProgress(user: CurrentUser, text: string) {
  if (!isCareerProgressText(text)) {
    return false;
  }

  const memorySentence = await createMemorySentence({
    rawText: text,
    activityType: "manual progress"
  });

  await getSupabaseAdmin().from("manual_activities").insert({
    user_id: user.userId,
    github_username: user.githubUsername,
    activity_text: text,
    memory_sentence: memorySentence,
    activity_type: "manual",
    occurred_at: new Date().toISOString()
  });

  await refreshStreak(user.userId);
  return true;
}

async function saveTaskCompletionMemory({
  userId,
  githubUsername,
  title,
  description,
  occurredAt
}: {
  userId: string;
  githubUsername?: string | null;
  title: string;
  description: string;
  occurredAt: string;
}) {
  const activityText = `Completed task: ${title}. ${description}`;
  const memorySentence = await createMemorySentence({
    rawText: activityText,
    activityType: "task completion"
  });

  await getSupabaseAdmin().from("manual_activities").insert({
    user_id: userId,
    github_username: githubUsername ?? null,
    activity_text: activityText,
    memory_sentence: memorySentence,
    activity_type: "task completion",
    occurred_at: occurredAt
  });
}

export async function refreshStreak(userId: string) {
  const activeDays = await getActiveDays(userId);
  const currentStreak = calculateCurrentStreak(activeDays);
  const lastActiveDate = activeDays[0] ?? null;

  await getSupabaseAdmin().from("streaks").upsert({
    user_id: userId,
    current_streak: currentStreak,
    last_active_date: lastActiveDate,
    updated_at: new Date().toISOString()
  });

  return currentStreak;
}

export async function refreshStreakForUser(user: CurrentUser) {
  const activeDays = await getActiveDays(user.userId, user);
  const currentStreak = calculateCurrentStreak(activeDays);
  const lastActiveDate = activeDays[0] ?? null;

  await getSupabaseAdmin().from("streaks").upsert({
    user_id: user.userId,
    current_streak: currentStreak,
    last_active_date: lastActiveDate,
    updated_at: new Date().toISOString()
  });

  return currentStreak;
}

export async function getCurrentStreak(userId: string, user?: CurrentUser) {
  return user ? refreshStreakForUser(user) : refreshStreak(userId);
}

export async function getProfileStats(user: CurrentUser) {
  const [goal, memories, tasks, stats, streak] = await Promise.all([
    getSelectedGoal(user.userId),
    getAllMemories(undefined, { normalize: false, user }),
    getAllUserTasks(user.userId),
    getGithubStatsForUser(user),
    getCurrentStreak(user.userId, user)
  ]);

  return {
    goal,
    memories,
    completedTasks: tasks.filter((task) => task.status === "complete").length,
    totalMemories: memories.length,
    githubActivities: stats.totalActivities,
    streak,
    projects: getProjects(memories),
    skills: await getDetectedSkills(user),
    githubUsername: stats.githubUsername
  };
}

export async function getTaskTemplates(goalSlug?: string, limit?: number) {
  const query = getSupabaseAdmin()
    .from("task_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (goalSlug) {
    query.eq("goal_slug", goalSlug);
  }
  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;
  return error ? [] : ((data ?? []) as TaskTemplate[]);
}

export function fallbackTaskTemplates(goalSlug?: string): TaskTemplate[] {
  const tasksByGoal: Record<
    string,
    Array<{ title: string; description: string; category: string; points: number }>
  > = {
    "ai-internship": [
      {
        title: "Build one AI workflow improvement",
        description: "Improve one practical AI feature and save a note about the implementation decision.",
        category: "build",
        points: 15
      },
      {
        title: "Record a 60-second project explanation",
        description: "Explain the problem, your approach, the AI workflow, and the result clearly.",
        category: "interview",
        points: 10
      },
      {
        title: "Document one model decision",
        description: "Write why you chose the model, prompt structure, data shape, or evaluation method.",
        category: "portfolio",
        points: 10
      }
    ],
    "java-backend-job": [
      {
        title: "Implement one Spring Boot endpoint",
        description: "Add validation, useful errors, and a clean response shape to one API path.",
        category: "build",
        points: 15
      },
      {
        title: "Add one backend test",
        description: "Cover a service, controller, or repository path with a focused test.",
        category: "quality",
        points: 10
      },
      {
        title: "Explain one backend decision",
        description: "Practice explaining an API, database, caching, or error-handling decision.",
        category: "interview",
        points: 10
      }
    ],
    "full-stack-developer": [
      {
        title: "Ship one complete product slice",
        description: "Complete one small feature across data, backend, UI, and final verification.",
        category: "build",
        points: 15
      },
      {
        title: "Improve one production UI state",
        description: "Add a useful loading, empty, error, or success state to an existing workflow.",
        category: "frontend",
        points: 10
      },
      {
        title: "Write one API contract",
        description: "Document the request, response, validation, and failure behavior for one endpoint.",
        category: "backend",
        points: 10
      }
    ],
    "improve-dsa": [
      {
        title: "Solve two focused DSA problems",
        description: "Solve two related problems and record the pattern, complexity, and edge cases.",
        category: "practice",
        points: 15
      },
      {
        title: "Redo one missed problem",
        description: "Re-solve a problem you previously missed without checking the solution first.",
        category: "review",
        points: 10
      },
      {
        title: "Explain one solution aloud",
        description: "Walk through the approach, tradeoffs, and complexity as if you were in an interview.",
        category: "interview",
        points: 10
      }
    ],
    "build-startup": [
      {
        title: "Talk to one potential user",
        description: "Ask about the current workflow, pain, workaround, and desired outcome.",
        category: "discovery",
        points: 15
      },
      {
        title: "Ship one product improvement",
        description: "Make one focused change that improves activation, retention, clarity, or trust.",
        category: "build",
        points: 10
      },
      {
        title: "Write one learning note",
        description: "Capture what changed in your product thinking and what you will test next.",
        category: "strategy",
        points: 10
      }
    ],
    "get-remote-developer-job": [
      {
        title: "Apply to one high-signal remote role",
        description: "Send one tailored application with a concise proof-of-work note.",
        category: "applications",
        points: 15
      },
      {
        title: "Publish one remote-ready work update",
        description: "Write a clear update with context, decision, tradeoff, result, and next step.",
        category: "communication",
        points: 10
      },
      {
        title: "Improve one public project artifact",
        description: "Polish a README, demo, case study, or project explanation for async review.",
        category: "portfolio",
        points: 10
      }
    ]
  };
  const source = tasksByGoal[goalSlug ?? ""] ?? tasksByGoal["ai-internship"];
  const createdAt = new Date().toISOString();

  return source.map((task) => ({
    id: "",
    title: task.title,
    description: task.description,
    goal_slug: goalSlug ?? null,
    difficulty: task.points >= 15 ? "medium" : "easy",
    category: task.category,
    points: task.points,
    is_active: true,
    created_at: createdAt
  }));
}

function normalizeOpportunity(opportunity: Opportunity, goalSlug?: string): Opportunity {
  const slug = opportunity.goal_slug ?? goalSlug ?? "ai-internship";
  const fallback = getOpportunityFallback(slug);
  const weakTitle = isWeakDisplayText(opportunity.title, 6);
  const weakCompany =
    isWeakDisplayText(opportunity.company, 4) ||
    /quad sample|test company|demo company/i.test(opportunity.company);
  const weakDescription =
    isWeakDisplayText(opportunity.description, 28) ||
    /sample admin|sample opportunity|test opportunity/i.test(opportunity.description);
  const skills = (opportunity.required_skills ?? []).filter(
    (skill) => !isWeakDisplayText(skill, 2)
  );

  return {
    ...opportunity,
    title: weakTitle ? fallback.title : opportunity.title.trim(),
    company: weakCompany ? fallback.company : opportunity.company.trim(),
    description: weakDescription
      ? fallback.description
      : opportunity.description.trim(),
    location: isWeakDisplayText(opportunity.location ?? "", 2)
      ? "Remote"
      : opportunity.location,
    type: isWeakDisplayText(opportunity.type ?? "", 3)
      ? fallback.type
      : opportunity.type,
    source: isWeakDisplayText(opportunity.source ?? "", 3)
      ? "Quad curated"
      : opportunity.source,
    required_skills: skills.length > 0 ? skills.slice(0, 5) : fallback.skills
  };
}

function getOpportunityFallback(goalSlug: string) {
  const fallbacks: Record<
    string,
    { title: string; company: string; description: string; type: string; skills: string[] }
  > = {
    "ai-internship": {
      title: "AI Product Intern",
      company: "Early AI Startup",
      description: "Help build, test, and document practical AI product workflows.",
      type: "Internship",
      skills: ["Next.js", "OpenAI", "GitHub"]
    },
    "java-backend-job": {
      title: "Backend Engineering Intern",
      company: "Product Engineering Team",
      description: "Build reliable APIs and improve backend services using Java and Spring Boot.",
      type: "Internship",
      skills: ["Java", "Spring Boot", "SQL"]
    },
    "full-stack-developer": {
      title: "Full Stack Developer Intern",
      company: "SaaS Product Studio",
      description: "Ship production-ready features across frontend, backend, and data workflows.",
      type: "Internship",
      skills: ["React", "Next.js", "Supabase"]
    },
    "improve-dsa": {
      title: "Software Engineering Interview Program",
      company: "Engineering Talent Network",
      description: "Practice structured problem solving and strengthen technical interview readiness.",
      type: "Program",
      skills: ["DSA", "Problem Solving", "Algorithms"]
    },
    "build-startup": {
      title: "Founder Fellowship",
      company: "Early Builder Community",
      description: "Validate a problem, ship an MVP, and learn through direct user feedback.",
      type: "Fellowship",
      skills: ["Product", "Customer Discovery", "MVP"]
    },
    "get-remote-developer-job": {
      title: "Remote Software Developer",
      company: "Distributed Product Team",
      description: "Contribute to product features with strong ownership and written communication.",
      type: "Remote role",
      skills: ["GitHub", "Communication", "Web Development"]
    }
  };

  return fallbacks[goalSlug] ?? fallbacks["ai-internship"];
}

function isWeakDisplayText(value: string, minimumLength: number) {
  const normalized = value.trim();
  const letters = normalized.toLowerCase().replace(/[^a-z]/g, "");
  const uniqueLetters = new Set(letters).size;

  return (
    normalized.length < minimumLength ||
    /^(test|demo|sample|asdf|qwer|we+w+e?|ww+w*e?)$/i.test(normalized) ||
    (letters.length >= 4 && uniqueLetters < 3)
  );
}

async function getGithubMemories(
  limit?: number,
  normalize = true,
  user?: CurrentUser
): Promise<MemoryItem[]> {
  const supabase = getSupabaseAdmin();
  const query = supabase
    .from("github_activities")
    .select("id, activity_text, memory_sentence, repo_metadata, activity_type, occurred_at")
    .order("occurred_at", { ascending: false });

  if (user && !user.githubUsername && !user.githubUserId) {
    return [];
  }

  if (user?.githubUserId) {
    query.eq("github_user_id", Number(user.githubUserId));
  } else if (user?.githubUsername) {
    query.eq("github_username", user.githubUsername);
  }

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    const fallbackQuery = supabase
      .from("github_activities")
      .select("id, activity_text, repo_metadata, activity_type, occurred_at")
      .order("occurred_at", { ascending: false });

    if (user?.githubUserId) {
      fallbackQuery.eq("github_user_id", Number(user.githubUserId));
    } else if (user?.githubUsername) {
      fallbackQuery.eq("github_username", user.githubUsername);
    }

    if (limit) {
      fallbackQuery.limit(limit);
    }

    const fallback = await fallbackQuery;
    if (fallback.error) {
      return [];
    }

    return (fallback.data ?? []).map((row) => ({
      id: row.id,
      source: "github",
      memorySentence: row.activity_text,
      rawText: row.activity_text,
      repoName: getRepoName(row.repo_metadata as Record<string, unknown>),
      activityType: row.activity_type,
      occurredAt: row.occurred_at
    }));
  }

  const rows = (data ?? []).filter(
    (row) =>
      row.activity_type !== "non-career" && isCareerProgressText(row.activity_text)
  );
  const missing = normalize ? rows.filter((row) => !row.memory_sentence) : [];
  const generated = await Promise.all(
    missing.map(async (row) => {
      const repoName = getRepoName(row.repo_metadata as Record<string, unknown>);
      const sentence = await createMemorySentence({
        rawText: row.activity_text,
        repoName,
        activityType: row.activity_type
      });
      await supabase
        .from("github_activities")
        .update({ memory_sentence: sentence })
        .eq("id", row.id);
      return [row.id, sentence] as const;
    })
  );
  const generatedById = new Map(generated);

  return rows.map((row) => ({
    id: row.id,
    source: "github",
    memorySentence:
      row.memory_sentence ?? generatedById.get(row.id) ?? row.activity_text,
    rawText: row.activity_text,
    repoName: getRepoName(row.repo_metadata as Record<string, unknown>),
    activityType: row.activity_type,
    occurredAt: row.occurred_at
  }));
}

async function getManualMemories(
  limit?: number,
  normalize = true,
  user?: CurrentUser
): Promise<MemoryItem[]> {
  const supabase = getSupabaseAdmin();
  const query = supabase
    .from("manual_activities")
    .select("id, activity_text, memory_sentence, activity_type, occurred_at")
    .order("occurred_at", { ascending: false });

  if (user) {
    query.eq("user_id", user.userId);
  }

  if (limit) {
    query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  const rows = data ?? [];
  const missing = normalize ? rows.filter((row) => !row.memory_sentence) : [];
  const generated = await Promise.all(
    missing.map(async (row) => {
      const sentence = await createMemorySentence({
        rawText: row.activity_text,
        activityType: row.activity_type ?? "manual"
      });
      await supabase
        .from("manual_activities")
        .update({ memory_sentence: sentence })
        .eq("id", row.id);
      return [row.id, sentence] as const;
    })
  );
  const generatedById = new Map(generated);

  return rows.map((row) => ({
    id: row.id,
    source: "manual",
    memorySentence:
      row.memory_sentence ?? generatedById.get(row.id) ?? row.activity_text,
    rawText: row.activity_text,
    repoName: null,
    activityType: row.activity_type ?? "manual",
    occurredAt: row.occurred_at
  }));
}

async function getActiveDays(userId: string, user?: CurrentUser) {
  const supabase = getSupabaseAdmin();
  const githubQuery = supabase.from("github_activities").select("occurred_at");

  if (user?.githubUserId) {
    githubQuery.eq("github_user_id", Number(user.githubUserId));
  } else if (user?.githubUsername) {
    githubQuery.eq("github_username", user.githubUsername);
  } else {
    githubQuery.eq("github_username", "__no_github_user__");
  }

  const [tasks, github, manual] = await Promise.all([
    supabase
      .from("user_tasks")
      .select("completed_at")
      .eq("user_id", userId)
      .eq("status", "complete"),
    githubQuery,
    supabase
      .from("manual_activities")
      .select("occurred_at, activity_text, activity_type")
      .eq("user_id", userId)
  ]);

  const dates = new Set<string>();
  (tasks.data ?? []).forEach((row) => {
    if (row.completed_at) dates.add(toDateKey(row.completed_at));
  });
  (github.data ?? []).forEach((row) => dates.add(toDateKey(row.occurred_at)));
  (manual.data ?? []).forEach((row) => {
    if (
      row.activity_type !== "non-career" &&
      isCareerProgressText(row.activity_text)
    ) {
      dates.add(toDateKey(row.occurred_at));
    }
  });

  return Array.from(dates).sort((a, b) => b.localeCompare(a));
}

async function getDetectedSkills(user?: CurrentUser) {
  const query = getSupabaseAdmin()
    .from("github_activities")
    .select("repo_metadata");

  if (user?.githubUserId) {
    query.eq("github_user_id", Number(user.githubUserId));
  } else if (user?.githubUsername) {
    query.eq("github_username", user.githubUsername);
  } else if (user) {
    return [];
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return Array.from(
    new Set(
      (data ?? [])
        .map((row) => (row.repo_metadata as { language?: string | null })?.language)
        .filter(Boolean) as string[]
    )
  ).slice(0, 8);
}

function getProjects(memories: MemoryItem[]) {
  return Array.from(
    new Set(memories.map((memory) => memory.repoName).filter(Boolean) as string[])
  ).slice(0, 10);
}

function calculateCurrentStreak(activeDays: string[]) {
  const active = new Set(activeDays);
  const today = todayKey();
  const yesterday = addDaysToDateKey(today, -1);
  let cursor = active.has(today)
    ? today
    : active.has(yesterday)
      ? yesterday
      : "";
  let streak = 0;

  while (cursor && active.has(cursor)) {
    streak += 1;
    cursor = addDaysToDateKey(cursor, -1);
  }

  return streak;
}

export function todayKey() {
  return toDateKey(new Date().toISOString());
}

export function toDateKey(value: string) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: process.env.QUAD_TIME_ZONE ?? "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(value));
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function getRepoName(metadata: Record<string, unknown> | null | undefined) {
  return (
    (metadata?.full_name as string | undefined) ??
    (metadata?.name as string | undefined) ??
    "Unknown repository"
  );
}
