import { Award, LockKeyhole, TrendingUp } from "lucide-react";
import { ReadinessProgressBar } from "@/components/app/readiness-progress-bar";
import { Card, CardContent } from "@/components/ui/card";

export function NextMilestoneCard({
  readiness,
  milestone,
  reward,
  pendingCount
}: {
  readiness: number;
  milestone: number;
  reward: string;
  pendingCount: number;
}) {
  const remaining = Math.max(0, milestone - readiness);

  return (
    <Card>
      <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#C0C0C0]">
            <TrendingUp className="h-4 w-4 text-[#D4D4D8]" />
            Next Milestone
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-[#F5F5F5]">
            Reach {milestone}% readiness
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
            {remaining > 0
              ? `${remaining} readiness points remain.`
              : "This milestone is ready to unlock."}
          </p>
          <ReadinessProgressBar
            value={milestone === 0 ? 100 : Math.min(100, (readiness / milestone) * 100)}
            className="mt-5"
          />
        </div>

        <div className="grid gap-3 md:min-w-[280px]">
          <div className="flex gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[#D4D4D8]" />
            <div>
              <p className="text-xs text-[#8A8A8A]">To unlock</p>
              <p className="mt-1 text-sm font-medium text-[#F5F5F5]">
                {pendingCount > 0 ? "Complete today's focus" : "Add one proof point"}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
            <div>
              <p className="text-xs text-[#8A8A8A]">Reward</p>
              <p className="mt-1 text-sm font-medium text-[#F5F5F5]">{reward}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
