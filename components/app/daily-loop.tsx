import { ArrowRight, Brain, ListChecks, Sunrise } from "lucide-react";

const steps = [
  {
    label: "Today",
    detail: "Complete focus task",
    icon: ListChecks
  },
  {
    label: "Tonight",
    detail: "Progress saved to memory",
    icon: Brain
  },
  {
    label: "Tomorrow",
    detail: "Quad gives your next move",
    icon: Sunrise
  }
];

export function DailyLoop() {
  return (
    <section className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]/80 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.label} className="contents">
              <div className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#111111] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D4D4D8]/20 bg-[#171717] text-[#D4D4D8]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A]">{step.label}</p>
                  <p className="mt-1 text-sm font-medium text-[#F5F5F5]">{step.detail}</p>
                </div>
              </div>
              {index < steps.length - 1 ? (
                <ArrowRight className="mx-auto hidden h-4 w-4 text-[#71717A] md:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
