import type {
  CurrentUser,
  GoalRecord,
  MemoryItem,
  Opportunity,
  UserTask
} from "@/lib/v1";

export type ReadinessSegment = {
  label: string;
  value: number;
  description: string;
};

export function calculateReadinessScore(
  user: CurrentUser,
  tasks: UserTask[],
  memories: MemoryItem[],
  githubActivities: number,
  opportunities: Opportunity[] = [],
  options: {
    goal?: GoalRecord;
    githubConnected?: boolean;
    streak?: number;
  } = {}
) {
  const completedTasks = tasks.filter((task) => task.status === "complete").length;
  const hasManualStart =
    memories.some((memory) => memory.source === "manual") ||
    tasks.length > 0 ||
    Boolean(user.userId);

  const score =
    10 +
    (options.goal ? 10 : 0) +
    (options.githubConnected || hasManualStart ? 10 : 0) +
    Math.min(completedTasks * 2, 20) +
    Math.min(memories.length * 2, 20) +
    Math.min(githubActivities, 20) +
    Math.min(options.streak ?? 0, 10);

  return Math.min(100, score);
}

export function calculateTodayImpact(tasks: UserTask[], fallbackCount = 0) {
  const pendingTasks = tasks.filter((task) => task.status !== "complete").slice(0, 3);
  const taskCount = pendingTasks.length > 0 ? pendingTasks.length : fallbackCount;

  return {
    pendingCount: Math.min(3, taskCount),
    potentialGain: Math.min(3, taskCount) * 2
  };
}

export function calculateQuadScore({
  completedTasks,
  memories,
  githubActivities,
  streak
}: {
  completedTasks: number;
  memories: number;
  githubActivities: number;
  streak: number;
}) {
  const score =
    Math.min(completedTasks * 8, 40) +
    Math.min(memories * 5, 25) +
    Math.min(githubActivities * 2, 20) +
    Math.min(streak * 3, 15);

  return Math.min(100, score);
}

export function getBiggestGap({
  memories,
  githubActivities,
  completedTasks
}: {
  memories: number;
  githubActivities: number;
  completedTasks: number;
}) {
  if (memories < 3) {
    return "Proof of work";
  }

  if (githubActivities < 5) {
    return "GitHub activity";
  }

  if (completedTasks < 5) {
    return "Consistency";
  }

  return "Opportunity applications";
}

export function getReadinessBreakdown({
  goalSelected,
  memories,
  githubActivities,
  completedTasks,
  streak,
  opportunities
}: {
  goalSelected: boolean;
  memories: number;
  githubActivities: number;
  completedTasks: number;
  streak: number;
  opportunities: number;
}): ReadinessSegment[] {
  return [
    {
      label: "Goal clarity",
      value: goalSelected ? 100 : 0,
      description: "A clear target for daily work."
    },
    {
      label: "Proof of work",
      value: clamp(memories * 12 + githubActivities * 3),
      description: "Projects, commits, and saved progress."
    },
    {
      label: "Consistency",
      value: clamp(completedTasks * 10 + streak * 8),
      description: "Repeated action over time."
    },
    {
      label: "GitHub activity",
      value: clamp(githubActivities * 10),
      description: "Public builder signal."
    },
    {
      label: "Opportunities",
      value: clamp(opportunities * 18),
      description: "Relevant next places to apply or explore."
    }
  ];
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
