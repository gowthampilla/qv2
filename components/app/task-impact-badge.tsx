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
  const gainText =
    scoreGain <= 0 && readinessGain <= 0
      ? "Score capped"
      : `+${scoreGain} Quad Score / +${readinessGain}% ready`;

  return (
    <Badge variant={complete ? "default" : "secondary"}>
      {complete ? "Saved to memory" : gainText}
    </Badge>
  );
}
