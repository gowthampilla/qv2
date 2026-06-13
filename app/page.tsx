import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  GitBranch,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { FeatureInfographic } from "@/components/app/feature-infographic";
import { LandingProductGraphic } from "@/components/app/landing-product-graphic";
import { QuadLogo } from "@/components/app/quad-logo";
import { Button } from "@/components/ui/button";
import { hasStoredSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const proofStats = [
  { value: "10", label: "latest repos imported" },
  { value: "20", label: "recent commits remembered" },
  { value: "4", label: "daily actions generated" }
];

const outcomes = [
  {
    title: "Daily execution",
    description:
      "Quad turns a big career goal into a small set of focused actions for today.",
    icon: Target
  },
  {
    title: "Career memory",
    description:
      "GitHub commits and progress notes become clean proof of what you built.",
    icon: Brain
  },
  {
    title: "Opportunity signal",
    description:
      "Recommended roles stay connected to your goal, skills, and visible work.",
    icon: Briefcase
  }
];

export default function HomePage() {
  const loggedIn = hasStoredSession();
  const ctaHref = loggedIn ? "/dashboard" : "/api/github/login";
  const ctaLabel = loggedIn ? "Go to Dashboard" : "Join Quad Beta";

  return (
    <main className="premium-surface min-h-screen px-4 py-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 pb-16">
        <nav className="sticky top-4 z-30 flex items-center justify-between rounded-2xl border border-[#2A2A2A] bg-[#050505]/85 px-4 py-3 backdrop-blur-xl">
          <a href="/" className="block">
            <QuadLogo compact className="sm:hidden" />
            <QuadLogo className="hidden sm:flex" />
          </a>

          <div className="hidden items-center gap-6 text-sm text-[#8A8A8A] md:flex">
            <a className="transition-colors hover:text-[#F5F5F5]" href="#product">
              Product
            </a>
            <a className="transition-colors hover:text-[#F5F5F5]" href="#how-it-works">
              Workflow
            </a>
            <a className="transition-colors hover:text-[#F5F5F5]" href="#outcomes">
              Outcomes
            </a>
          </div>

          <Button asChild variant={loggedIn ? "default" : "outline"}>
            <a href={ctaHref}>
              <span className="hidden sm:inline">{ctaLabel}</span>
              <span className="sm:hidden">
                {loggedIn ? "Dashboard" : "Join Beta"}
              </span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </nav>

        <section id="product" className="grid min-h-[calc(100vh-120px)] gap-12 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4D4D8]/20 bg-[#111111]/80 px-3 py-1.5 text-sm text-[#C0C0C0]">
              <Sparkles className="h-4 w-4 text-[#38BDF8]" />
              AI Builder Copilot for serious career momentum
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-[#F5F5F5] md:text-7xl">
              Your AI companion for becoming job-ready.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#C0C0C0] md:text-lg">
              Quad turns your goals into daily actions, tracks your progress,
              remembers your work, and shows your next move.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={ctaHref}>
                  {ctaLabel}
                  {loggedIn ? (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  ) : (
                    <GitBranch className="ml-2 h-4 w-4" />
                  )}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  See how it works
                </a>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {proofStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]/75 p-4"
                >
                  <p className="text-2xl font-semibold text-[#F5F5F5]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#8A8A8A]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <LandingProductGraphic />
        </section>

        <section className="grid gap-4 rounded-[2rem] border border-[#2A2A2A] bg-[#0A0A0A]/75 p-4 md:grid-cols-3 md:p-5">
          {[
            {
              icon: ShieldCheck,
              title: "GitHub-first proof",
              text: "Public repos and commits become professional memory."
            },
            {
              icon: Zap,
              title: "Daily momentum",
              text: "Tasks, streaks, and score move only from useful work."
            },
            {
              icon: CheckCircle2,
              title: "Built for beta users",
              text: "A focused product, not a noisy student dashboard."
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-5"
              >
                <Icon className="h-5 w-5 text-[#D4D4D8]" />
                <h2 className="mt-5 text-base font-semibold text-[#F5F5F5]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </section>

        <FeatureInfographic />

        <section id="outcomes" className="grid gap-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#C0C0C0]">
              What Quad improves
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal text-[#F5F5F5]">
              From scattered effort to visible progress.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;

              return (
                <article
                  key={outcome.title}
                  className="group min-h-[260px] rounded-[2rem] border border-[#2A2A2A] bg-[#111111] p-6 transition-colors hover:border-[#D4D4D8]/35"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4D4D8]/20 bg-[#0A0A0A] text-[#D4D4D8]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-12 text-xl font-semibold text-[#F5F5F5]">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
                    {outcome.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-[#D4D4D8]/20 bg-[#111111] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium text-[#C0C0C0]">
                Start with your real work
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-[#F5F5F5] md:text-5xl">
                Connect GitHub, choose a goal, and let Quad remember what you
                build.
              </h2>
            </div>
            <Button asChild size="lg">
              <a href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
