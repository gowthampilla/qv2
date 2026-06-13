import type {
  CurrentUser,
  GoalRecord,
  MemoryItem,
  Opportunity,
  UserTask
} from "@/lib/v1";
import { isCareerProgressText } from "@/lib/progress-validation";

export type ReadinessSegment = {
  label: string;
  value: number;
  description: string;
};

export type StudentStage = {
  name: string;
  next: string | null;
  level: number;
};

const READINESS_WEIGHTS = {
  base: 10,
  goal: 10,
  start: 10,
  completedTask: 2,
  memory: 2,
  githubActivity: 1,
  streakDay: 1
};

const READINESS_CAPS = {
  completedTasks: 20,
  memories: 20,
  githubActivities: 20,
  streak: 10
};

const QUAD_SCORE_WEIGHTS = {
  completedTask: 8,
  memory: 5,
  githubActivity: 2,
  streakDay: 3
};

const QUAD_SCORE_CAPS = {
  completedTasks: 40,
  memories: 25,
  githubActivities: 20,
  streak: 15
};

export function calculateReadinessScore(
  user: CurrentUser,
  tasks: UserTask[],
  scoringMemories: number,
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
    scoringMemories > 0 ||
    tasks.length > 0 ||
    options.githubConnected ||
    opportunities.length > 0;

  const score =
    READINESS_WEIGHTS.base +
    (options.goal ? READINESS_WEIGHTS.goal : 0) +
    (hasManualStart ? READINESS_WEIGHTS.start : 0) +
    Math.min(
      completedTasks * READINESS_WEIGHTS.completedTask,
      READINESS_CAPS.completedTasks
    ) +
    Math.min(scoringMemories * READINESS_WEIGHTS.memory, READINESS_CAPS.memories) +
    Math.min(
      githubActivities * READINESS_WEIGHTS.githubActivity,
      READINESS_CAPS.githubActivities
    ) +
    Math.min((options.streak ?? 0) * READINESS_WEIGHTS.streakDay, READINESS_CAPS.streak);

  return clamp(score);
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
  scoringMemories,
  githubActivities,
  streak
}: {
  completedTasks: number;
  scoringMemories: number;
  githubActivities: number;
  streak: number;
}) {
  const score =
    Math.min(
      completedTasks * QUAD_SCORE_WEIGHTS.completedTask,
      QUAD_SCORE_CAPS.completedTasks
    ) +
    Math.min(scoringMemories * QUAD_SCORE_WEIGHTS.memory, QUAD_SCORE_CAPS.memories) +
    Math.min(
      githubActivities * QUAD_SCORE_WEIGHTS.githubActivity,
      QUAD_SCORE_CAPS.githubActivities
    ) +
    Math.min(streak * QUAD_SCORE_WEIGHTS.streakDay, QUAD_SCORE_CAPS.streak);

  return clamp(score);
}

export function countScoringMemories(memories: MemoryItem[]) {
  return memories.filter((memory) => {
    if (memory.activityType === "task completion") {
      return false;
    }

    if (memory.source === "github") {
      return true;
    }

    return isCareerProgressText(memory.rawText);
  }).length;
}

export function calculateProjectedCompletionImpact({
  pendingCount,
  readinessScore,
  quadScore,
  streak,
  activeToday
}: {
  pendingCount: number;
  readinessScore: number;
  quadScore: number;
  streak: number;
  activeToday: boolean;
}) {
  const taskGains = calculateTaskImpactGains({
    pendingCount,
    readinessScore,
    quadScore,
    streak,
    activeToday
  });
  const readinessGain = taskGains.reduce((sum, gain) => sum + gain.readinessGain, 0);
  const quadScoreGain = taskGains.reduce((sum, gain) => sum + gain.scoreGain, 0);

  return {
    readinessGain,
    quadScoreGain,
    targetReadiness: clamp(readinessScore + readinessGain),
    targetQuadScore: clamp(quadScore + quadScoreGain),
    taskGains
  };
}

export function calculateTaskImpactGains({
  pendingCount,
  readinessScore,
  quadScore,
  streak,
  activeToday
}: {
  pendingCount: number;
  readinessScore: number;
  quadScore: number;
  streak: number;
  activeToday: boolean;
}) {
  const taskCount = Math.max(0, Math.min(3, pendingCount));
  const streakReadinessGain =
    !activeToday && taskCount > 0
      ? Math.max(
          0,
          Math.min((streak + 1) * READINESS_WEIGHTS.streakDay, READINESS_CAPS.streak) -
            Math.min(streak * READINESS_WEIGHTS.streakDay, READINESS_CAPS.streak)
        )
      : 0;
  const streakScoreGain =
    !activeToday && taskCount > 0
      ? Math.max(
          0,
          Math.min((streak + 1) * QUAD_SCORE_WEIGHTS.streakDay, QUAD_SCORE_CAPS.streak) -
            Math.min(streak * QUAD_SCORE_WEIGHTS.streakDay, QUAD_SCORE_CAPS.streak)
        )
      : 0;
  let remainingReadiness = Math.max(0, 100 - readinessScore);
  let remainingQuadScore = Math.max(0, 100 - quadScore);

  return Array.from({ length: taskCount }, (_, index) => {
    const rawReadinessGain =
      READINESS_WEIGHTS.completedTask + (index === 0 ? streakReadinessGain : 0);
    const rawScoreGain =
      QUAD_SCORE_WEIGHTS.completedTask + (index === 0 ? streakScoreGain : 0);
    const readinessGain = Math.min(rawReadinessGain, remainingReadiness);
    const scoreGain = Math.min(rawScoreGain, remainingQuadScore);

    remainingReadiness -= readinessGain;
    remainingQuadScore -= scoreGain;

    return { readinessGain, scoreGain };
  });
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

export function getStudentStage(readiness: number): StudentStage {
  const value = clamp(readiness);

  if (value <= 20) {
    return { name: "Starter", next: "Building Basics", level: 1 };
  }

  if (value <= 40) {
    return { name: "Building Basics", next: "Consistent Builder", level: 2 };
  }

  if (value <= 60) {
    return { name: "Consistent Builder", next: "Project Ready", level: 3 };
  }

  if (value <= 80) {
    return { name: "Project Ready", next: "Opportunity Ready", level: 4 };
  }

  return { name: "Opportunity Ready", next: null, level: 5 };
}

export function getReadinessLabel(value: number) {
  if (value >= 70) {
    return "Strong";
  }

  if (value >= 35) {
    return "Improving";
  }

  return "Weak";
}

export function getReadinessBreakdown({
  goalSelected,
  scoringMemories,
  githubActivities,
  completedTasks,
  streak,
  opportunities
}: {
  goalSelected: boolean;
  scoringMemories: number;
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
      value: clamp(scoringMemories * 12 + githubActivities * 3 + completedTasks * 4),
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
