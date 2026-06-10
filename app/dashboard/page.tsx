import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { addManualProgressAction } from "@/app/actions";
import { AppShell } from "@/components/app/app-shell";
import { FeedCard } from "@/components/app/feed-card";
import { MemoryItem } from "@/components/app/memory-item";
import { OpportunityCard } from "@/components/app/opportunity-card";
import { QuadInsightCard } from "@/components/app/quad-insight-card";
import { ReadinessBreakdown } from "@/components/app/readiness-breakdown";
import { ReadinessHero } from "@/components/app/readiness-hero";
import { TodayFocusCard } from "@/components/app/today-focus-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateQuadScore,
  calculateReadinessScore,
  calculateTodayImpact,
  getBiggestGap,
  getReadinessBreakdown
} from "@/lib/readiness";
import {
  ensureDailyTasks,
  fallbackTaskTemplates,
  getAllMemories,
  getAllUserTasks,
  getCurrentStreak,
  getCurrentUser,
  getFeedPosts,
  getGithubStats,
  getOpportunities,
  getSelectedGoal
} from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [stats, goal, memories, streak] = await Promise.all([
    withPageTimeout(
      getGithubStats(),
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
    withPageTimeout(getAllMemories(3, { normalize: false }), [], 5000),
    withPageTimeout(getCurrentStreak(user.userId), 0, 5000)
  ]);

  if (!goal) {
    redirect("/onboarding");
  }

  const [tasks, opportunities, feedPosts] = await Promise.all([
    withPageTimeout(ensureDailyTasks(user.userId, goal.slug), [], 5000),
    withPageTimeout(getOpportunities(goal.slug, 3), [], 5000),
    withPageTimeout(getFeedPosts(goal.slug, 2), [], 5000)
  ]);
  const allTasks = await withPageTimeout(getAllUserTasks(user.userId, 100), tasks, 5000);
  const allMemories = await withPageTimeout(
    getAllMemories(undefined, { normalize: false }),
    memories,
    5000
  );
  const fallbackTasks = fallbackTaskTemplates(goal?.slug);
  const completedTasks = allTasks.filter((task) => task.status === "complete").length;
  const quadScore = calculateQuadScore({
    completedTasks,
    memories: allMemories.length,
    githubActivities: stats.totalActivities,
    streak
  });
  const readinessScore = calculateReadinessScore(
    user,
    allTasks,
    allMemories,
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
  const targetReadiness = Math.min(100, readinessScore + todayImpact.potentialGain);
  const biggestGap = getBiggestGap({
    memories: allMemories.length,
    githubActivities: stats.totalActivities,
    completedTasks
  });
  const breakdown = getReadinessBreakdown({
    goalSelected: Boolean(goal),
    memories: allMemories.length,
    githubActivities: stats.totalActivities,
    completedTasks,
    streak,
    opportunities: opportunities.length
  });
  const insight = buildInsight({
    goalName: goal?.name,
    readinessScore,
    biggestGap,
    pendingCount: todayImpact.pendingCount
  });

  return (
    <AppShell>
      <ReadinessHero
        userName={user.name}
        goalName={goal.name}
        readiness={readinessScore}
        quadScore={quadScore}
        targetReadiness={targetReadiness}
        pendingCount={todayImpact.pendingCount}
        biggestGap={biggestGap}
      />

      <TodayFocusCard tasks={tasks} suggestions={fallbackTasks} goalName={goal.name} />

      <QuadInsightCard insight={insight} />

      <ReadinessBreakdown segments={breakdown} />

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Career memory preview</CardTitle>
              <CardDescription>Latest milestones Quad has remembered.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {allMemories.length === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  No memory yet. Add one short progress note today.
                </p>
              ) : (
                allMemories.slice(0, 3).map((memory) => (
                  <MemoryItem key={`${memory.source}-${memory.id}`} memory={memory} />
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Today&apos;s Progress</CardTitle>
              <CardDescription>Save one proof point to your career memory.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={addManualProgressAction} className="grid gap-3">
                <textarea
                  className="form-textarea"
                  name="progress"
                  placeholder="I solved 2 LeetCode problems and studied Spring Boot."
                  required
                />
                <Button type="submit" className="w-fit">
                  <Plus className="mr-2 h-4 w-4" />
                  Save progress
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Recommended opportunity</CardTitle>
              <CardDescription>Curated for your goal.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {opportunities.length > 0 ? (
                opportunities.slice(0, 1).map((item) => (
                  <OpportunityCard key={item.id} opportunity={item} goalName={goal?.name} />
                ))
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  {"We're preparing matched opportunities for your goal."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feed preview</CardTitle>
              <CardDescription>Founder-curated guidance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {(feedPosts.length > 0
                ? feedPosts
                : [
                    {
                      id: "fallback-feed-1",
                      title: "Build one visible proof point today",
                      description:
                        "A small shipped artifact is more useful than a long private plan.",
                      content_type: "roadmap tip",
                      url: ""
                    }
                  ]
              ).map((post) => (
                <FeedCard
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  contentType={post.content_type}
                  url={post.url}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

function buildInsight({
  goalName,
  readinessScore,
  biggestGap,
  pendingCount
}: {
  goalName?: string;
  readinessScore: number;
  biggestGap: string;
  pendingCount: number;
}) {
  if (!goalName) {
    return "Choose a goal first. Then Quad will turn it into a small set of actions for today.";
  }

  return `You're ${readinessScore}% ready for ${goalName}. Your biggest gap is ${biggestGap.toLowerCase()}. Complete ${pendingCount} focused actions today to improve the signal.`;
}

function withPageTimeout<T>(promise: Promise<T>, fallback: T, ms: number) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    })
  ]);
}
