import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuadInsightCard({ insight }: { insight: string }) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Quad Insight
        </div>
        <p className="mt-4 text-base leading-7 text-foreground">{insight}</p>
      </CardContent>
    </Card>
  );
}
