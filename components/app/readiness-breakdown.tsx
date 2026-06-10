import { ReadinessProgressBar } from "@/components/app/readiness-progress-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReadinessSegment } from "@/lib/readiness";

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
                <p className="text-sm font-medium text-[#F5F5F5]">{segment.label}</p>
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
