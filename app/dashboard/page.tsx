import { redirect } from "next/navigation";
import { AddWorkForm } from "@/components/app/add-work-form";
import { AppShell } from "@/components/app/app-shell";
import { CoachMessage } from "@/components/app/coach-message";
import { DailyLoop } from "@/components/app/daily-loop";
import { GoalHero } from "@/components/app/goal-hero";
import { MemoryItem } from "@/components/app/memory-item";
import { NextMilestoneCard } from "@/components/app/next-milestone-card";
import { OpportunityCard } from "@/components/app/opportunity-card";
import { ProofWall, type ProofItem } from "@/components/app/proof-wall";
import { ReadinessBreakdown } from "@/components/app/readiness-breakdown";
import { ShareProgressCard } from "@/components/app/share-progress-card";
import { TodayFocusCard } from "@/components/app/today-focus-card";
import { TomorrowPreview } from "@/components/app/tomorrow-preview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateQuadScore,
  calculateProjectedCompletionImpact,
  calculateReadinessScore,
  calculateTodayImpact,
  countScoringMemories,
  getBiggestGap,
  getReadinessBreakdown,
  getStudentStage
} from "@/lib/readiness";
import {
  ensureDailyTasks,
  fallbackTaskTemplates,
  getAllMemories,
  getAllUserTasks,
  getCurrentStreak,
  getCurrentUser,
  getGithubStatsForUser,
  getOpportunities,
  getSelectedGoal,
  todayKey,
  toDateKey,
  type MemoryItem as MemoryRecord,
  type UserTask
} from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [stats, goal, memories, streak] = await Promise.all([
    withPageTimeout(
      getGithubStatsForUser(user),
      {
        connected: false,
        githubUsername: undefined,
        totalRepos: 0,
        totalActivities: 0,
        lastSyncTime: undefined
      },
      5000
    ),
    withPageTimeout(getSelectedGoal(user.userId), undefined, 5000),
    withPageTimeout(getAllMemories(3, { normalize: false, user }), [], 5000),
    withPageTimeout(getCurrentStreak(user.userId, user), 0, 5000)
  ]);

  if (!goal) {
    redirect("/onboarding");
  }

  const [tasks, opportunities] = await Promise.all([
    withPageTimeout(ensureDailyTasks(user.userId, goal.slug), [], 5000),
    withPageTimeout(getOpportunities(goal.slug, 3), [], 5000)
  ]);
  const allTasks = await withPageTimeout(getAllUserTasks(user.userId, 100), tasks, 5000);
  const allMemories = await withPageTimeout(
    getAllMemories(undefined, { normalize: false, user }),
    memories,
    5000
  );
  const fallbackTasks = fallbackTaskTemplates(goal.slug);
  const completedTasks = allTasks.filter((task) => task.status === "complete").length;
  const scoringMemories = countScoringMemories(allMemories);
  const quadScore = calculateQuadScore({
    completedTasks,
    scoringMemories,
    githubActivities: stats.totalActivities,
    streak
  });
  const readinessScore = calculateReadinessScore(
    user,
    allTasks,
    scoringMemories,
    stats.totalActivities,
    opportunities,
    {
      goal,
      githubConnected: stats.connected,
      streak
    }
  );
  const todayImpact = calculateTodayImpact(
    tasks,
    tasks.length === 0 ? fallbackTasks.length : 0
  );
  const today = todayKey();
  const activeToday =
    allTasks.some(
      (task) =>
        task.status === "complete" &&
        task.completed_at &&
        toDateKey(task.completed_at) === today
    ) || allMemories.some((memory) => toDateKey(memory.occurredAt) === today);
  const projectedImpact = calculateProjectedCompletionImpact({
    pendingCount: todayImpact.pendingCount,
    readinessScore,
    quadScore,
    streak,
    activeToday
  });
  const biggestGap = getBiggestGap({
    memories: scoringMemories,
    githubActivities: stats.totalActivities,
    completedTasks
  });
  const breakdown = getReadinessBreakdown({
    goalSelected: true,
    scoringMemories,
    githubActivities: stats.totalActivities,
    completedTasks,
    streak,
    opportunities: opportunities.length
  });
  const stage = getStudentStage(readinessScore);
  const milestone = getNextMilestone(readinessScore);
  const proofItems = buildProofItems({
    totalRepos: stats.totalRepos,
    totalActivities: stats.totalActivities,
    completedTasks,
    memories: allMemories
  });
  const weeklyCompletedTasks = countRecentTasks(allTasks);
  const weeklyProofPoints = countRecentMemories(allMemories);
  const recommendedCompany = opportunities[0]?.company ?? null;
  const coachMessage = buildCoachMessage({
    readiness: readinessScore,
    targetReadiness: projectedImpact.targetReadiness,
    biggestGap,
    pendingCount: todayImpact.pendingCount
  });

  return (
    <AppShell>
      <GoalHero
        userName={user.name}
        goalName={goal.name}
        readiness={readinessScore}
        targetReadiness={projectedImpact.targetReadiness}
        pendingCount={todayImpact.pendingCount}
        biggestGap={biggestGap}
        quadScore={quadScore}
        streak={streak}
        stage={stage}
      />

      <NextMilestoneCard
        readiness={readinessScore}
        milestone={milestone}
        reward={getMilestoneReward(milestone, goal.name)}
        pendingCount={todayImpact.pendingCount}
      />

      <TodayFocusCard
        tasks={tasks}
        suggestions={fallbackTasks}
        goalName={goal.name}
        opportunityCompany={recommendedCompany}
        taskGains={projectedImpact.taskGains}
        readiness={readinessScore}
        targetReadiness={projectedImpact.targetReadiness}
        biggestGap={biggestGap}
      />

      <CoachMessage message={coachMessage} />

      <DailyLoop />

      <ReadinessBreakdown segments={breakdown} />

      <ProofWall items={proofItems} />

      <Card>
        <CardHeader>
          <CardTitle>Career memory preview</CardTitle>
          <CardDescription>
            Your latest proof, written as professional milestones.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {allMemories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#0A0A0A] p-4">
              <p className="text-sm font-medium text-[#F5F5F5]">No memory yet.</p>
              <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
                Add one short progress note and Quad will turn it into a career milestone.
              </p>
            </div>
          ) : (
            allMemories.slice(0, 3).map((memory) => (
              <MemoryItem key={`${memory.source}-${memory.id}`} memory={memory} />
            ))
          )}

          <div id="add-work" className="border-t border-[#2A2A2A] pt-5">
            <p className="text-sm font-medium text-[#F5F5F5]">Add today&apos;s progress</p>
            <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
              Save project, learning, interview, or problem-solving progress.
            </p>
            <div className="mt-4">
              <AddWorkForm />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended opportunity</CardTitle>
          <CardDescription>Curated around your current goal and proof.</CardDescription>
        </CardHeader>
        <CardContent>
          {opportunities.length > 0 ? (
            <OpportunityCard opportunity={opportunities[0]} goalName={goal.name} />
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#0A0A0A] p-4">
              <p className="text-sm font-medium text-[#F5F5F5]">
                We&apos;re preparing curated opportunities.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
                Today, focus on improving your readiness and adding one visible proof point.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-2">
        <TomorrowPreview focus={getTomorrowFocus(biggestGap, goal.name)} />
        <ShareProgressCard
          text={buildShareText({
            goalName: goal.name,
            readiness: readinessScore,
            completedTasks: weeklyCompletedTasks,
            proofPoints: weeklyProofPoints
          })}
        />
      </section>
    </AppShell>
  );
}

function getNextMilestone(readiness: number) {
  return [20, 40, 60, 80, 100].find((value) => value > readiness) ?? 100;
}

function getMilestoneReward(milestone: number, goalName: string) {
  if (milestone <= 40) {
    return "A stronger daily foundation";
  }

  if (milestone <= 60) {
    return "A consistent builder profile";
  }

  if (milestone <= 80) {
    return `A stronger ${goalName} profile`;
  }

  return "An opportunity-ready career profile";
}

function buildCoachMessage({
  readiness,
  targetReadiness,
  biggestGap,
  pendingCount
}: {
  readiness: number;
  targetReadiness: number;
  biggestGap: string;
  pendingCount: number;
}) {
  if (pendingCount === 0) {
    return `Today's focus is complete. Your next improvement area is ${biggestGap.toLowerCase()}.`;
  }

  return `You're close to ${targetReadiness}%. Today's primary task improves ${biggestGap.toLowerCase()}, your clearest growth area.`;
}

function buildProofItems({
  totalRepos,
  totalActivities,
  completedTasks,
  memories
}: {
  totalRepos: number;
  totalActivities: number;
  completedTasks: number;
  memories: MemoryRecord[];
}): ProofItem[] {
  const items: ProofItem[] = [];

  if (totalRepos > 0) {
    items.push({
      label: `${totalRepos} GitHub ${totalRepos === 1 ? "repo" : "repos"} imported`,
      detail: "Your public project work is connected to Quad.",
      type: "repo"
    });
  }

  if (totalActivities > 0) {
    items.push({
      label: `${totalActivities} GitHub ${totalActivities === 1 ? "activity" : "activities"} remembered`,
      detail: "Commits and repository progress are part of your career memory.",
      type: "commit"
    });
  }

  if (completedTasks > 0) {
    items.push({
      label: `${completedTasks} ${completedTasks === 1 ? "task" : "tasks"} completed`,
      detail: "Focused actions are building your consistency signal.",
      type: "task"
    });
  }

  memories.slice(0, 3).forEach((memory) => {
    items.push({
      label: memory.repoName ? `${memory.repoName} milestone` : "Career memory added",
      detail: memory.memorySentence,
      type: memory.activityType === "task completion" ? "task" : "memory"
    });
  });

  return items;
}

function getTomorrowFocus(biggestGap: string, goalName: string) {
  const gapFocus: Record<string, string> = {
    "Proof of work": "Project depth",
    "GitHub activity": "GitHub activity",
    Consistency: "Consistency and follow-through",
    "Opportunity applications": "Opportunity preparation"
  };

  return [
    gapFocus[biggestGap] ?? biggestGap,
    goalName.includes("DSA") ? "Interview problem solving" : "Interview practice",
    "One visible proof point"
  ];
}

function countRecentTasks(tasks: UserTask[]) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return tasks.filter(
    (task) =>
      task.status === "complete" &&
      task.completed_at &&
      new Date(task.completed_at).getTime() >= cutoff
  ).length;
}

function countRecentMemories(memories: MemoryRecord[]) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return memories.filter((memory) => new Date(memory.occurredAt).getTime() >= cutoff).length;
}

function buildShareText({
  goalName,
  readiness,
  completedTasks,
  proofPoints
}: {
  goalName: string;
  readiness: number;
  completedTasks: number;
  proofPoints: number;
}) {
  return `This week I reached ${readiness}% readiness for ${goalName} by completing ${completedTasks} ${completedTasks === 1 ? "task" : "tasks"} and adding ${proofPoints} ${proofPoints === 1 ? "proof point" : "proof points"}.`;
}

function withPageTimeout<T>(promise: Promise<T>, fallback: T, ms: number) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    })
  ]);
}
