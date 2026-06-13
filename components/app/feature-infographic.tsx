import {
  Briefcase,
  Database,
  Flame,
  GitBranch,
  ListChecks,
  Newspaper,
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
  { title: "Daily Focus", detail: "Know exactly what to do next.", icon: ListChecks },
  { title: "Builder Streak", detail: "Momentum from real progress only.", icon: Flame },
  { title: "GitHub Activity", detail: "Repos and commits become proof.", icon: GitBranch },
  { title: "Career Memory", detail: "Short professional milestones.", icon: Database },
  { title: "Opportunities", detail: "Roles aligned with your goal.", icon: Briefcase },
  { title: "Curated Feed", detail: "Focused updates for builders.", icon: Newspaper }
];

export function FeatureInfographic() {
  return (
    <section id="how-it-works" className="grid gap-10">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-sm font-medium text-[#C0C0C0]">How Quad works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#F5F5F5]">
            A focused system for becoming job-ready.
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[#A1A1AA] lg:justify-self-end">
          Quad connects goals, GitHub, tasks, memories, and opportunities into
          one calm operating system for your career.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[#2A2A2A] bg-[#0A0A0A]/75 p-4">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group rounded-[2rem] border border-[#2A2A2A] bg-[#111111] p-5 transition-colors hover:border-[#D4D4D8]/35"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4D4D8]/20 bg-[#0A0A0A] text-[#D4D4D8]">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="h-px flex-1 bg-gradient-to-r from-[#2A2A2A] to-transparent" />
              </div>
              <p className="mt-6 font-semibold text-[#F5F5F5]">
                {feature.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
                {feature.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-[#38BDF8]/20 bg-[#38BDF8]/[0.055] p-5 md:p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-medium text-[#BAE6FD]">Quad remembers</p>
            <h3 className="mt-3 text-2xl font-semibold text-[#F5F5F5]">
              Your work becomes language you can use in interviews.
            </h3>
          </div>
          <div className="grid gap-3">
            {[
              "Built authentication flow and improved login reliability.",
              "Created a backend project and documented implementation progress.",
              "Solved DSA practice and strengthened interview readiness."
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#38BDF8]/20 bg-[#050505]/70 p-4 text-sm leading-6 text-[#E0F2FE]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
