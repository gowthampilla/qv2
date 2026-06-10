import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuadInsightCard({ insight }: { insight: string }) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-[#7DD3FC]">
          <Sparkles className="h-4 w-4" />
          Quad Says
        </div>
        <p className="mt-4 text-base leading-7 text-[#F5F5F5]">{insight}</p>
      </CardContent>
    </Card>
  );
}
