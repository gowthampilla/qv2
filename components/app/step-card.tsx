import type { LucideIcon } from "lucide-react";

export function StepCard({
  step,
  title,
  icon: Icon
}: {
  step: string;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-border bg-[#101014]/80 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-muted-foreground">{step}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-5 text-base font-medium text-foreground">{title}</p>
    </div>
  );
}
