import { CheckCircle2, Circle } from "lucide-react";
import { completeTaskAction } from "@/app/actions";
import { TaskCompleteButton } from "@/components/app/task-complete-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, type UserTask } from "@/lib/v1";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: UserTask }) {
  const complete = task.status === "complete";
  const title = polishTaskTitle(task.title);
  const description = polishTaskDescription(task.description, task.title);

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
                {complete ? "Completed" : "Action"}
              </Badge>
            </div>
            <h2 className="mt-3 text-base font-semibold text-[#F5F5F5]">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A8A8A]">
              {description}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C0C0C0]">
              Why this matters: {getTaskValue(title)}
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

function getTaskValue(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("explain") || lower.includes("record") || lower.includes("interview")) {
    return "This improves interview confidence and helps you communicate clearly.";
  }

  if (lower.includes("github") || lower.includes("commit") || lower.includes("ship")) {
    return "This creates visible proof that engineering teams can review.";
  }

  if (lower.includes("dsa") || lower.includes("problem") || lower.includes("leetcode")) {
    return "This strengthens interview pattern recognition and problem-solving speed.";
  }

  return "This creates practical evidence for your next application or interview.";
}

function polishTaskTitle(title: string) {
  const value = title.trim();
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
