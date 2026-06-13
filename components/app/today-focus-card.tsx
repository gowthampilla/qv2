import { CheckCircle2, ChevronDown, Circle, ListChecks, Sparkles } from "lucide-react";
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

type FocusTask = {
  id?: string;
  title: string;
  description: string;
  points: number;
  complete: boolean;
  suggested: boolean;
  scoreGain: number;
  readinessGain: number;
};

export function TodayFocusCard({
  tasks,
  suggestions,
  goalName,
  opportunityCompany,
  taskGains = [],
  readiness,
  targetReadiness,
  biggestGap
}: {
  tasks: DashboardTask[];
  suggestions: TaskTemplate[];
  goalName: string;
  opportunityCompany?: string | null;
  taskGains?: { scoreGain: number; readinessGain: number }[];
  readiness: number;
  targetReadiness: number;
  biggestGap: string;
}) {
  const focusTasks = buildFocusTasks(tasks, suggestions, taskGains);
  const primary = focusTasks.find((task) => !task.complete) ?? focusTasks[0];
  const optional = focusTasks.filter((task) => task !== primary).slice(0, 2);

  return (
    <Card id="todays-focus" className="glass-panel border-[#D4D4D8]/25">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#C0C0C0]">
              <ListChecks className="h-4 w-4" />
              Today&apos;s Focus
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#F5F5F5]">
              One important move. Two optional wins.
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
              Start with the primary task. It has the strongest impact on your current gap.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/tasks">View all tasks</a>
          </Button>
        </div>

        {primary ? (
          <PrimaryTask
            task={primary}
            goalName={goalName}
            opportunityCompany={opportunityCompany}
          />
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#2A2A2A] bg-[#0A0A0A] p-5">
            <p className="text-sm font-medium text-[#F5F5F5]">No focus task yet.</p>
            <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
              Add one progress note to give Quad a fresh signal for tomorrow.
            </p>
          </div>
        )}

        {optional.length > 0 ? (
          <details className="group mt-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-[#C0C0C0]">
              {optional.length} optional {optional.length === 1 ? "task" : "tasks"}
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="grid gap-2 border-t border-[#2A2A2A] p-3">
              {optional.map((task) => (
                <OptionalTask
                  key={task.id ?? task.title}
                  task={task}
                  goalName={goalName}
                  opportunityCompany={opportunityCompany}
                />
              ))}
            </div>
          </details>
        ) : null}

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/[0.06] p-4">
            <p className="text-xs font-medium text-[#22C55E]">Complete today</p>
            <p className="mt-2 text-sm leading-6 text-[#F5F5F5]">
              Move from {readiness}% to as high as {targetReadiness}% ready.
            </p>
          </div>
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
            <p className="text-xs font-medium text-[#8A8A8A]">If today stays quiet</p>
            <p className="mt-2 text-sm leading-6 text-[#C0C0C0]">
              {biggestGap} remains your clearest area to improve tomorrow.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrimaryTask({
  task,
  goalName,
  opportunityCompany
}: {
  task: FocusTask;
  goalName: string;
  opportunityCompany?: string | null;
}) {
  const importance = getTaskImportance(task.title, goalName, opportunityCompany);

  return (
    <div className="mt-6 rounded-2xl border border-[#D4D4D8]/25 bg-[#111111] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          {task.complete ? (
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#22C55E]" />
          ) : (
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D4D4D8]/30 bg-[#171717] text-[#D4D4D8]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-[#8A8A8A]">Primary task</p>
            <h3 className="mt-2 text-lg font-semibold text-[#F5F5F5]">{task.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">{task.description}</p>
            <div className="mt-4 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-3">
              <p className="text-xs font-medium text-[#C0C0C0]">Why this matters</p>
              <p className="mt-1 text-sm leading-6 text-[#F5F5F5]">{importance}</p>
            </div>
            <div className="mt-4">
              <TaskImpactBadge
                complete={task.complete}
                scoreGain={task.scoreGain}
                readinessGain={task.readinessGain}
              />
            </div>
          </div>
        </div>
        <TaskAction task={task} />
      </div>
    </div>
  );
}

function OptionalTask({
  task,
  goalName,
  opportunityCompany
}: {
  task: FocusTask;
  goalName: string;
  opportunityCompany?: string | null;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        {task.complete ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />
        ) : (
          <Circle className="mt-0.5 h-4 w-4 shrink-0 text-[#71717A]" />
        )}
        <div>
          <p className="text-sm font-medium text-[#F5F5F5]">{task.title}</p>
          <p className="mt-1 text-xs leading-5 text-[#8A8A8A]">
            {getTaskImportance(task.title, goalName, opportunityCompany)}
          </p>
        </div>
      </div>
      <TaskAction task={task} />
    </div>
  );
}

function TaskAction({ task }: { task: FocusTask }) {
  if (task.complete) {
    return <TaskCompleteButton complete />;
  }

  if (task.suggested) {
    return (
      <form action={completeSuggestedTaskAction}>
        <input type="hidden" name="title" value={task.title} />
        <input type="hidden" name="description" value={task.description} />
        <TaskCompleteButton />
      </form>
    );
  }

  return (
    <form action={completeTaskAction}>
      <input type="hidden" name="task_id" value={task.id} />
      <TaskCompleteButton />
    </form>
  );
}

function buildFocusTasks(
  tasks: DashboardTask[],
  suggestions: TaskTemplate[],
  taskGains: { scoreGain: number; readinessGain: number }[]
) {
  if (tasks.length > 0) {
    const pending = tasks.filter((task) => task.status !== "complete");
    const complete = tasks.filter((task) => task.status === "complete");
    const ordered = [...pending, ...complete].slice(0, 3);

    return ordered.map<FocusTask>((task, index) => ({
      id: task.id,
      title: polishTaskTitle(task.title),
      description: polishTaskDescription(task.description, task.title),
      points: task.points,
      complete: task.status === "complete",
      suggested: false,
      scoreGain: taskGains[index]?.scoreGain ?? (task.status === "complete" ? 0 : 8),
      readinessGain:
        taskGains[index]?.readinessGain ?? (task.status === "complete" ? 0 : 2)
    }));
  }

  return suggestions.slice(0, 3).map<FocusTask>((task, index) => ({
    title: polishTaskTitle(task.title),
    description: polishTaskDescription(task.description, task.title),
    points: task.points,
    complete: false,
    suggested: true,
    scoreGain: taskGains[index]?.scoreGain ?? 8,
    readinessGain: taskGains[index]?.readinessGain ?? 2
  }));
}

function getTaskImportance(
  title: string,
  goalName: string,
  opportunityCompany?: string | null
) {
  const lower = title.toLowerCase();

  if (lower.includes("explain") || lower.includes("record") || lower.includes("interview")) {
    return "This improves interview confidence and helps you explain your work clearly.";
  }

  if (lower.includes("github") || lower.includes("commit") || lower.includes("ship")) {
    return "This creates visible proof that recruiters and engineering teams can review.";
  }

  if (lower.includes("leetcode") || lower.includes("dsa") || lower.includes("problem")) {
    return "This strengthens problem-solving speed and interview pattern recognition.";
  }

  if (lower.includes("document") || lower.includes("readme") || lower.includes("note")) {
    return "This turns technical work into evidence you can use in applications and interviews.";
  }

  if (opportunityCompany) {
    return `This builds relevant proof for ${goalName} opportunities at ${opportunityCompany} and similar teams.`;
  }

  return `This creates practical evidence for your ${goalName} goal and improves your next application.`;
}

function polishTaskTitle(title: string) {
  const value = title.trim();

  if (value.length < 5 || /^(test|task|work|demo)$/i.test(value)) {
    return "Complete one focused career-building task";
  }

  return value.replace(/^record your video.*interview.*$/i, "Record a 60-second project explanation");
}

function polishTaskDescription(description: string, title: string) {
  const value = description.trim();

  if (value.length >= 18 && !/send like interview|attend interview/i.test(value)) {
    return value;
  }

  if (/record|explain|video/i.test(title)) {
    return "Explain the problem, your approach, and the result in 60 seconds.";
  }

  return "Complete this focused action and save a short note about what you learned or built.";
}
