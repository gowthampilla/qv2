import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { completeTaskAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TaskTemplate, UserTask } from "@/lib/v1";

type FocusTask = Pick<UserTask, "id" | "title" | "description" | "points" | "status">;

export function FocusCard({
  tasks,
  suggestions
}: {
  tasks: FocusTask[];
  suggestions: TaskTemplate[];
}) {
  const visibleTasks = tasks.slice(0, 3);
  const fallbackTasks = suggestions.slice(0, 3);

  return (
    <Card className="glass-panel overflow-hidden">
      <div className="h-1 w-full accent-line" />
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#C0C0C0]">
              <ListChecks className="h-4 w-4" />
              {"Today's Focus"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#F5F5F5] md:text-3xl">
              {"Complete these 3 actions today."}
            </h2>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href="/tasks">Open tasks</a>
          </Button>
        </div>

        <div className="mt-6 grid gap-3">
          {visibleTasks.length > 0
            ? visibleTasks.map((task) => <FocusTaskRow key={task.id} task={task} />)
            : fallbackTasks.map((task) => (
                <div key={task.title} className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                  <div className="flex items-start gap-3">
                    <Circle className="mt-1 h-4 w-4 text-[#8A8A8A]" />
                    <div>
                      <p className="font-medium text-[#F5F5F5]">{task.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#8A8A8A]">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FocusTaskRow({ task }: { task: FocusTask }) {
  const complete = task.status === "complete";

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
              {task.description}
            </p>
            <p className="mt-2 text-xs text-[#8A8A8A]">{task.points} pts</p>
          </div>
        </div>
        {!complete ? (
          <form action={completeTaskAction}>
            <input type="hidden" name="task_id" value={task.id} />
            <Button type="submit" size="sm">Complete</Button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
