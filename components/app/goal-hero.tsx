import type { ReactNode } from "react";
import { ArrowDown, Flame, Target } from "lucide-react";
import { StudentStageBadge } from "@/components/app/student-stage-badge";
import { ReadinessProgressBar } from "@/components/app/readiness-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { StudentStage } from "@/lib/readiness";

export function GoalHero({
  userName,
  goalName,
  readiness,
  targetReadiness,
  pendingCount,
  biggestGap,
  quadScore,
  streak,
  stage
}: {
  userName: string;
  goalName: string;
  readiness: number;
  targetReadiness: number;
  pendingCount: number;
  biggestGap: string;
  quadScore: number;
  streak: number;
  stage: StudentStage;
}) {
  const actionCopy =
    pendingCount > 0
      ? `${pendingCount} ${pendingCount === 1 ? "action" : "actions"} away from ${targetReadiness}%`
      : "Today's focus is complete";

  return (
    <Card className="glass-panel overflow-hidden border-[#D4D4D8]/20">
      <CardContent className="grid gap-7 p-5 md:p-7 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StudentStageBadge level={stage.level} name={stage.name} />
            {stage.next ? (
              <span className="text-xs text-[#8A8A8A]">Next: {stage.next}</span>
            ) : null}
          </div>

          <p className="mt-6 text-sm font-medium text-[#C0C0C0]">Hi {userName}.</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-[#F5F5F5] md:text-5xl">
            You&apos;re preparing for {goalName}.
          </h1>

          <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
            <p className="text-5xl font-semibold leading-none text-[#F5F5F5] md:text-6xl">
              {readiness}%
            </p>
            <div className="pb-1">
              <p className="font-medium text-[#F5F5F5]">ready</p>
              <p className="mt-1 text-sm text-[#8A8A8A]">{actionCopy}</p>
            </div>
          </div>

          <ReadinessProgressBar value={readiness} className="mt-6 max-w-2xl" />

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href="#todays-focus">
                Complete today&apos;s focus
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <p className="text-sm text-[#C0C0C0]">
              Biggest gap: <span className="font-medium text-[#F5F5F5]">{biggestGap}</span>
            </p>
          </div>
        </div>

        <div className="grid content-start gap-3">
          <HeroMetric
            icon={<Target className="h-4 w-4" />}
            label="Quad Score"
            value={`${quadScore}/100`}
            detail="Your overall progress signal"
          />
          <HeroMetric
            icon={<Flame className="h-4 w-4" />}
            label="Builder streak"
            value={`${streak} ${streak === 1 ? "day" : "days"}`}
            detail="Consistency from real activity"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function HeroMetric({
  icon,
  label,
  value,
  detail
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-xl font-semibold text-[#F5F5F5]">{value}</p>
      <p className="mt-1 text-xs leading-5 text-[#8A8A8A]">{detail}</p>
    </div>
  );
}
