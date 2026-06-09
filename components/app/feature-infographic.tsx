import {
  Briefcase,
  Database,
  Flame,
  GitBranch,
  ListChecks,
  Newspaper,
  Sparkles,
  Target
} from "lucide-react";
import { StepCard } from "@/components/app/step-card";

const steps = [
  { title: "Choose your goal", icon: Target },
  { title: "Connect GitHub or start fresh", icon: GitBranch },
  { title: "Complete today's actions", icon: ListChecks },
  { title: "Build your career memory", icon: Database }
];

const features = [
  { title: "Daily Focus", icon: ListChecks },
  { title: "Streaks", icon: Flame },
  { title: "GitHub Activity", icon: GitBranch },
  { title: "Career Memory", icon: Database },
  { title: "Curated Opportunities", icon: Briefcase },
  { title: "Founder/Admin Curated Feed", icon: Newspaper }
];

export function FeatureInfographic() {
  return (
    <section id="how-it-works" className="grid gap-10">
      <div>
        <p className="text-sm font-medium text-primary">How Quad works</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
          A quieter path from goal to proof.
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            step={`0${index + 1}`}
            title={step.title}
            icon={step.icon}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-lg border border-border bg-[#101014]/70 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/25 bg-secondary/10 text-secondary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="font-medium text-foreground">{feature.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
