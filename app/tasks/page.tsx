import { ListChecks } from "lucide-react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { TaskCard } from "@/components/app/task-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ensureDailyTasks,
  fallbackTaskTemplates,
  getAllUserTasks,
  getCurrentUser,
  getSelectedGoal,
  todayKey
} from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();
  const goal = await withPageTimeout(getSelectedGoal(user.userId), undefined, 5000);
  const seededTasks = goal
    ? await withPageTimeout(ensureDailyTasks(user.userId, goal.slug), [], 5000)
    : [];
  const allTasks = await withPageTimeout(getAllUserTasks(user.userId, 30), [], 5000);
  const tasks = allTasks.length > 0 ? allTasks : seededTasks;
  const today = todayKey();
  const todayTasks = tasks.filter((task) => task.due_date === today && task.status !== "complete");
  const weekTasks = tasks.filter((task) => task.due_date !== today && task.status !== "complete").slice(0, 6);
  const completedTasks = tasks.filter((task) => task.status === "complete").slice(0, 6);
  const suggestions = goal ? fallbackTaskTemplates(goal.slug) : [];

  return (
    <AppShell maxWidth="max-w-5xl">
      <PageHeader
        eyebrow="Tasks"
        title="Your next move"
        description={goal ? `Focused actions for ${goal.name}.` : "Choose a goal to unlock daily actions."}
      />

      {!goal ? (
        <EmptyState
          title="Choose a goal to unlock personalized tasks."
          description="Quad uses your goal to decide what you should do today."
          action={
            <Button asChild>
              <a href="/onboarding">Choose goal</a>
            </Button>
          }
        />
      ) : null}

      <TaskSection title="Today" empty="No active tasks for today.">
        {todayTasks.length > 0
          ? todayTasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />)
          : suggestions.map((task) => (
              <Card key={task.title}>
                <CardContent className="flex gap-3 p-5">
                  <ListChecks className="mt-1 h-4 w-4 text-[#D4D4D8]" />
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {task.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{task.points} pts</p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </TaskSection>

      <TaskSection title="This Week" empty="This week's queue is clear.">
        {weekTasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </TaskSection>

      <TaskSection title="Completed" empty="Completed actions will appear here.">
        {completedTasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </TaskSection>
    </AppShell>
  );
}

function withPageTimeout<T>(promise: Promise<T>, fallback: T, ms: number) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    })
  ]);
}

function TaskSection({
  title,
  empty,
  children
}: {
  title: string;
  empty: string;
  children: ReactNode;
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(items) ? items.length === 0 : !items;

  return (
    <section className="grid gap-4">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {isEmpty ? (
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground">{empty}</CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">{items}</div>
      )}
    </section>
  );
}
