import { ArrowRight, GitBranch, Play } from "lucide-react";
import { FeatureInfographic } from "@/components/app/feature-infographic";
import { QuadLogo } from "@/components/app/quad-logo";
import { Button } from "@/components/ui/button";
import { hasStoredSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const loggedIn = hasStoredSession();

  return (
    <main className="premium-surface min-h-screen px-5 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
        <nav className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
          <a href="/" className="block">
            <QuadLogo />
          </a>
          <Button asChild variant={loggedIn ? "default" : "outline"}>
            <a href={loggedIn ? "/dashboard" : "/api/github/login"}>
              {loggedIn ? "Go to Dashboard" : "Join Quad Beta"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </nav>

        <section className="grid min-h-[calc(100vh-220px)] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-[#C0C0C0]">
              For students, job seekers, and builders
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-[#F5F5F5] md:text-7xl">
              Your AI companion for becoming job-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#C0C0C0] md:text-lg">
              Quad turns your goals into daily actions, tracks your progress,
              remembers your work, and shows what to do next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={loggedIn ? "/dashboard" : "/api/github/login"}>
                  {loggedIn ? "Go to Dashboard" : "Join Quad Beta"}
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
          </div>

          <div className="glass-panel rounded-2xl p-4">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#050505] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#8A8A8A]">Your next move</p>
                  <p className="mt-2 text-xl font-semibold text-[#F5F5F5]">
                    {"Complete today's 3 actions"}
                  </p>
                </div>
                <div className="h-2 w-24 rounded-full bg-[#D4D4D8]" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  "Ship one visible proof point",
                  "Practice one core skill",
                  "Save a progress note"
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
                    <p className="text-sm font-medium text-[#F5F5F5]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 p-4">
                <p className="text-sm leading-6 text-[#BAE6FD]">
                  {"You're making progress. Today, focus on one project task and one application task."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <FeatureInfographic />
      </div>
    </main>
  );
}
