import { Plus } from "lucide-react";
import { addManualProgressAction } from "@/app/actions";
import { AppShell } from "@/components/app/app-shell";
import { EmptyState } from "@/components/app/empty-state";
import { FeedCard } from "@/components/app/feed-card";
import { FocusCard } from "@/components/app/focus-card";
import { MemoryItem } from "@/components/app/memory-item";
import { MomentumCard } from "@/components/app/momentum-card";
import { OpportunityCard } from "@/components/app/opportunity-card";
import { PageHeader } from "@/components/app/page-header";
import { QuadInsightCard } from "@/components/app/quad-insight-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fallbackTaskTemplates,
  formatDateTime,
  getAllMemories,
  getCurrentStreak,
  getCurrentUser,
  getFeedPosts,
  getGithubStats,
  getOpportunities,
  getSelectedGoal,
  getTasksForToday
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

  const [tasks, opportunities, feedPosts] = await Promise.all([
    withPageTimeout(getTasksForToday(user.userId), [], 5000),
    withPageTimeout(goal ? getOpportunities(goal.slug, 1) : Promise.resolve([]), [], 5000),
    withPageTimeout(goal ? getFeedPosts(goal.slug, 2) : Promise.resolve([]), [], 5000)
  ]);
  const fallbackTasks = fallbackTaskTemplates(goal?.slug);
  const insight = buildInsight({
    goalName: goal?.name,
    githubConnected: stats.connected,
    lastSyncTime: stats.lastSyncTime
  });

  return (
    <AppShell>
          <PageHeader
            eyebrow="Home"
            title={`Hi ${user.name}.`}
            description={goal ? `Current goal: ${goal.name}` : "Choose one goal so Quad can guide your next move."}
            actions={
              !goal ? (
                <Button asChild>
                  <a href="/onboarding">Choose goal</a>
                </Button>
              ) : undefined
            }
          />

          <section className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <FocusCard tasks={tasks} suggestions={fallbackTasks} />
            <MomentumCard streak={streak} />
          </section>

          {!stats.connected ? (
            <EmptyState
              title="Connect GitHub when you are ready."
              description="Quad can import public work into career memory. You can still start fresh today."
              action={
                <Button asChild variant="outline">
                  <a href="/api/github/login">Connect GitHub</a>
                </Button>
              }
            />
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-5">
              <QuadInsightCard insight={insight} />

              <Card>
                <CardHeader>
                  <CardTitle>Career memory preview</CardTitle>
                  <CardDescription>Your latest remembered work.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {memories.length === 0 ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      No memory yet. Add one short progress note today.
                    </p>
                  ) : (
                    memories.map((memory) => (
                      <MemoryItem key={`${memory.source}-${memory.id}`} memory={memory} />
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add progress</CardTitle>
                  <CardDescription>Save a small proof point to memory.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={addManualProgressAction} className="grid gap-3">
                    <textarea
                      className="form-textarea"
                      name="progress"
                      placeholder="I shipped a small feature and wrote down what changed."
                      required
                    />
                    <Button type="submit" className="w-fit">
                      <Plus className="mr-2 h-4 w-4" />
                      Save to memory
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
                    opportunities.map((item) => (
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
                          description: "A small shipped artifact is more useful than a long private plan.",
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

              <p className="text-xs leading-5 text-muted-foreground">
                GitHub sync: {formatDateTime(stats.lastSyncTime)}
              </p>
            </div>
          </section>
    </AppShell>
  );
}

function buildInsight({
  goalName,
  githubConnected,
  lastSyncTime
}: {
  goalName?: string;
  githubConnected: boolean;
  lastSyncTime?: string;
}) {
  if (!goalName) {
    return "Choose a goal first. Then Quad will turn it into a small set of actions for today.";
  }

  if (!githubConnected) {
    return `You're starting toward ${goalName}. Today, focus on one project task and one progress note.`;
  }

  if (!lastSyncTime) {
    return `You're making progress toward ${goalName}. A small GitHub update today will strengthen your builder profile.`;
  }

  const daysSinceSync = Math.floor(
    (Date.now() - new Date(lastSyncTime).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceSync >= 3) {
    return `You have not pushed code recently. A small GitHub update today will strengthen your builder profile.`;
  }

  return `You're making progress toward ${goalName}. Today, focus on one project task and one application task.`;
}

function withPageTimeout<T>(promise: Promise<T>, fallback: T, ms: number) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    })
  ]);
}
