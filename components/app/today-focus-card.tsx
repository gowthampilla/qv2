import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { completeSuggestedTaskAction, completeTaskAction } from "@/app/actions";
import { TaskCompleteButton } from "@/components/app/task-complete-button";
import { TaskImpactBadge } from "@/components/app/task-impact-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskTemplate, UserTask } from "@/lib/v1";

type DashboardTask = Pick<
  UserTask,
  "id" | "title" | "description" | "points" | "status" | "completed_at"
>;

export function TodayFocusCard({
  tasks,
  suggestions,
  goalName,
  opportunityCompany,
  taskGains = []
}: {
  tasks: DashboardTask[];
  suggestions: TaskTemplate[];
  goalName: string;
  opportunityCompany?: string | null;
  taskGains?: { scoreGain: number; readinessGain: number }[];
}) {
  const visibleTasks = prioritizeTasks(tasks);
  const fallbackTasks = suggestions.slice(0, 3);
  const hasRealTasks = visibleTasks.length > 0;
  const pendingTaskIds = visibleTasks
    .filter((task) => task.status !== "complete")
    .map((task) => task.id);

  return (
    <Card id="todays-focus" className="glass-panel">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#C0C0C0]">
              <ListChecks className="h-4 w-4" />
              Today&apos;s Focus
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#F5F5F5]">
              This is what moves you forward today.
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/tasks">View tasks</a>
          </Button>
        </div>

        <div className="mt-6 grid gap-3">
          {hasRealTasks
            ? visibleTasks.map((task) => (
                <TodayTaskRow
                  key={task.id}
                  task={task}
                  goalName={goalName}
                  opportunityCompany={opportunityCompany}
                  impact={taskGains[pendingTaskIds.indexOf(task.id)]}
                />
              ))
            : fallbackTasks.map((task, index) => (
                <SuggestedTaskRow
                  key={task.title}
                  title={task.title}
                  description={task.description}
                  goalName={goalName}
                  opportunityCompany={opportunityCompany}
                  scoreGain={taskGains[index]?.scoreGain ?? 8}
                  readinessGain={taskGains[index]?.readinessGain ?? 2}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SuggestedTaskRow({
  title,
  description,
  goalName,
  opportunityCompany,
  scoreGain,
  readinessGain
}: {
  title: string;
  description: string;
  goalName: string;
  opportunityCompany?: string | null;
  scoreGain: number;
  readinessGain: number;
}) {
  const taskDescription = description || `Adds visible proof for your ${goalName} goal.`;
  const importance = getTaskImportance(goalName, opportunityCompany);

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Circle className="mt-1 h-4 w-4 text-[#8A8A8A]" />
          <div>
            <p className="font-medium text-[#F5F5F5]">{title}</p>
            <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
              {taskDescription}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#C0C0C0]">
              Why it matters: {importance}
            </p>
            <div className="mt-3">
              <TaskImpactBadge scoreGain={scoreGain} readinessGain={readinessGain} />
            </div>
          </div>
        </div>
        <form action={completeSuggestedTaskAction}>
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="description" value={taskDescription} />
          <TaskCompleteButton />
        </form>
      </div>
    </div>
  );
}

function TodayTaskRow({
  task,
  goalName,
  opportunityCompany,
  impact
}: {
  task: DashboardTask;
  goalName: string;
  opportunityCompany?: string | null;
  impact?: { scoreGain: number; readinessGain: number };
}) {
  const complete = task.status === "complete";
  const importance = getTaskImportance(goalName, opportunityCompany);
  const scoreGain = impact?.scoreGain ?? 8;
  const readinessGain = impact?.readinessGain ?? 2;

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4 transition-colors hover:border-[#D4D4D8]/45">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {complete ? (
            <CheckCircle2 className="mt-1 h-4 w-4 text-[#22C55E]" />
          ) : (
            <Circle className="mt-1 h-4 w-4 text-[#8A8A8A]" />
          )}
          <div>
            <p className="font-medium text-[#F5F5F5]">{task.title}</p>
            <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
              {task.description || `Adds visible proof for your ${goalName} goal.`}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#C0C0C0]">
              Why it matters: {importance}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TaskImpactBadge
                complete={complete}
                scoreGain={scoreGain}
                readinessGain={readinessGain}
              />
              {!complete ? (
                <span className="text-xs text-[#8A8A8A]">{task.points} pts</span>
              ) : null}
            </div>
          </div>
        </div>
        {!complete ? (
          <form action={completeTaskAction}>
            <input type="hidden" name="task_id" value={task.id} />
            <TaskCompleteButton />
          </form>
        ) : (
          <TaskCompleteButton complete />
        )}
      </div>
    </div>
  );
}

function prioritizeTasks(tasks: DashboardTask[]) {
  const completed = tasks.filter((task) => task.status === "complete");
  const pending = tasks.filter((task) => task.status !== "complete");

  if (completed.length === 0) {
    return pending.slice(0, 3);
  }

  return [...completed.slice(-1), ...pending].slice(0, 3);
}

function getTaskImportance(goalName: string, opportunityCompany?: string | null) {
  if (opportunityCompany) {
    return `This creates proof for ${goalName} opportunities at ${opportunityCompany} and similar teams.`;
  }

  return `This creates proof for ${goalName} roles at companies like Microsoft, Cognizant, and similar teams.`;
}
