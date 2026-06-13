import { ReadinessProgressBar } from "@/components/app/readiness-progress-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getReadinessLabel, type ReadinessSegment } from "@/lib/readiness";

export function ReadinessBreakdown({
  segments
}: {
  segments: ReadinessSegment[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Readiness Breakdown</CardTitle>
        <CardDescription>
          Readiness is an estimate based on your activity. Use it to understand your progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {segments.map((segment) => (
          <div key={segment.label} className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-[#F5F5F5]">{segment.label}</p>
                  <ReadinessLabel value={segment.value} />
                </div>
                <p className="mt-1 text-xs text-[#8A8A8A]">{segment.description}</p>
              </div>
              <span className="text-sm font-medium text-[#C0C0C0]">{segment.value}%</span>
            </div>
            <ReadinessProgressBar value={segment.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReadinessLabel({ value }: { value: number }) {
  const label = getReadinessLabel(value);
  const className =
    label === "Strong"
      ? "border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]"
      : label === "Improving"
        ? "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]"
        : "border-[#71717A]/30 bg-[#71717A]/10 text-[#A1A1AA]";

  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${className}`}>
      {label}
    </span>
  );
}
