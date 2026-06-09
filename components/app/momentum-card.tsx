import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MomentumCard({ streak }: { streak: number }) {
  return (
    <Card className="glass-panel">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Momentum</p>
            <p className="mt-2 text-3xl font-semibold leading-none text-foreground">
              {streak}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]">
            <Flame className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {streak === 1 ? "Keep your streak alive." : "Days of visible progress."}
        </p>
      </CardContent>
    </Card>
  );
}
