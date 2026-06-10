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
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111]/80 p-4 transition-all hover:-translate-y-0.5 hover:border-[#D4D4D8]/40">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-[#8A8A8A]">{step}</span>
        <Icon className="h-4 w-4 text-[#D4D4D8]" />
      </div>
      <p className="mt-5 text-base font-medium text-[#F5F5F5]">{title}</p>
    </div>
  );
}
