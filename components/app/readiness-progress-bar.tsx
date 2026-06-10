import { cn } from "@/lib/utils";

export function ReadinessProgressBar({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-[#050505]", className)}>
      <div
        className="h-full rounded-full bg-[#D4D4D8] transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
