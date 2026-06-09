import { CheckCircle2, Circle } from "lucide-react";
import { completeTaskAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, type UserTask } from "@/lib/v1";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: UserTask }) {
  const complete = task.status === "complete";

  return (
    <Card className={cn("transition-all hover:-translate-y-0.5 hover:border-primary/30", complete && "border-[#22C55E]/35 bg-[#22C55E]/5")}>
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className={cn("mt-1 flex h-6 w-6 items-center justify-center rounded-full border", complete ? "border-[#22C55E] text-[#22C55E]" : "border-border text-muted-foreground")}>
            {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{task.points} pts</Badge>
              <Badge variant={complete ? "default" : "outline"}>
                {complete ? "Completed" : "Today"}
              </Badge>
            </div>
            <h2 className="mt-3 text-base font-semibold text-foreground">{task.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {task.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {complete ? "Saved to memory" : `Due ${formatDate(task.due_date)}`}
            </p>
          </div>
        </div>
        {!complete ? (
          <form action={completeTaskAction}>
            <input type="hidden" name="task_id" value={task.id} />
            <Button type="submit" size="sm">
              Complete
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
