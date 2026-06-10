import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StreakCard({ streak }: { streak: number }) {
  const progress = Math.max(12, Math.min(100, streak * 14));

  return (
    <Card className="glass-panel overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#C0C0C0]">Builder Streak</p>
            <p className="mt-3 text-3xl font-semibold leading-none text-[#F5F5F5]">
              {streak} {streak === 1 ? "day" : "days"}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]">
            <Flame className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#0A0A0A]">
          <div
            className="h-full rounded-full bg-[#D4D4D8]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-[#8A8A8A]">
          Your progress is building.
        </p>
      </CardContent>
    </Card>
  );
}
