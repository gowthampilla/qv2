import { ArrowDown, Plus, Target } from "lucide-react";
import { GapCard } from "@/components/app/gap-card";
import { ReadinessProgressBar } from "@/components/app/readiness-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ReadinessHero({
  userName,
  goalName,
  readiness,
  quadScore,
  targetReadiness,
  targetQuadScore,
  quadScoreGain,
  pendingCount,
  biggestGap
}: {
  userName: string;
  goalName: string;
  readiness: number;
  quadScore: number;
  targetReadiness: number;
  targetQuadScore: number;
  quadScoreGain: number;
  pendingCount: number;
  biggestGap: string;
}) {
  const impactCopy =
    pendingCount > 0
      ? `Complete today's ${pendingCount} actions to reach ${targetReadiness}% readiness and ${targetQuadScore} Quad Score.`
      : "Today's focus is complete. Keep your signal warm.";

  return (
    <Card className="glass-panel overflow-hidden">
      <CardContent className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-medium text-[#C0C0C0]">Hi {userName}.</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-[#F5F5F5] md:text-5xl">
            You&apos;re preparing for {goalName}.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#C0C0C0] md:text-base">
            {impactCopy}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Metric label="Quad Score" value={`${quadScore}/100`} />
            <Metric label="Readiness" value={`${readiness}% ready`} />
            <Metric
              label="Today's impact"
              value={quadScoreGain > 0 ? `+${quadScoreGain} Quad Score` : "No gain left"}
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href="#todays-focus">
                Complete today&apos;s focus
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#add-work">
                <Plus className="mr-2 h-4 w-4" />
                Add work
              </a>
            </Button>
            <p className="text-xs leading-5 text-[#8A8A8A]">
              Readiness is a progress signal, not a job guarantee.
            </p>
          </div>
        </div>

        <div className="grid content-start gap-4 rounded-2xl border border-[#2A2A2A] bg-[#111111] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A8A8A]">
                Quad Score
              </p>
              <p className="mt-3 text-5xl font-semibold leading-none text-[#F5F5F5]">
                {quadScore}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4D4D8]/25 bg-[#0A0A0A] text-[#D4D4D8]">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <ReadinessProgressBar value={quadScore} className="mt-2" />
          <p className="text-sm leading-6 text-[#C0C0C0]">
            Starts at 0. It grows when you complete tasks, add memories, keep streaks, and push code.
          </p>
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#F5F5F5]">Readiness Score</p>
              <span className="text-sm text-[#C0C0C0]">{readiness}%</span>
            </div>
            <ReadinessProgressBar value={readiness} />
          </div>
          <p className="text-sm leading-6 text-[#8A8A8A]">
            {impactCopy}
          </p>
          <GapCard gap={biggestGap} />
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <p className="text-xs text-[#8A8A8A]">{label}</p>
      <p className="mt-2 text-base font-semibold text-[#F5F5F5]">{value}</p>
    </div>
  );
}
