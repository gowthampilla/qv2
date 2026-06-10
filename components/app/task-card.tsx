import { CheckCircle2, Circle } from "lucide-react";
import { completeTaskAction } from "@/app/actions";
import { TaskCompleteButton } from "@/components/app/task-complete-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, type UserTask } from "@/lib/v1";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: UserTask }) {
  const complete = task.status === "complete";

  return (
    <Card className={cn("transition-all hover:-translate-y-0.5 hover:border-[#D4D4D8]/35 hover:bg-[#171717]/70", complete && "border-[#22C55E]/35 bg-[#22C55E]/5")}>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className={cn("mt-1 flex h-6 w-6 items-center justify-center rounded-full border", complete ? "border-[#22C55E] text-[#22C55E]" : "border-[#71717A] text-[#8A8A8A]")}>
            {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{task.points} pts</Badge>
              <Badge variant={complete ? "default" : "outline"}>
                {complete ? "Completed" : "Today"}
              </Badge>
            </div>
            <h2 className="mt-3 text-base font-semibold text-[#F5F5F5]">{task.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A8A8A]">
              {task.description}
            </p>
            <p className="mt-3 text-xs text-[#8A8A8A]">
              {complete ? "Saved to memory" : `Due ${formatDate(task.due_date)}`}
            </p>
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
      </CardContent>
    </Card>
  );
}
