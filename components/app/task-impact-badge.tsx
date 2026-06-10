import { Badge } from "@/components/ui/badge";

export function TaskImpactBadge({
  complete = false,
  readinessGain = 2,
  scoreGain = 8
}: {
  complete?: boolean;
  readinessGain?: number;
  scoreGain?: number;
}) {
  return (
    <Badge variant={complete ? "default" : "secondary"}>
      {complete ? "Saved to memory" : `+${scoreGain} Quad Score / +${readinessGain}% ready`}
    </Badge>
  );
}
