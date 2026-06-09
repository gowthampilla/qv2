import { ArrowRight, GitBranch, Play, Sparkles } from "lucide-react";
import { FeatureInfographic } from "@/components/app/feature-infographic";
import { Button } from "@/components/ui/button";
import { hasStoredSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const loggedIn = hasStoredSession();

  return (
    <main className="premium-surface min-h-screen px-5 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20">
        <nav className="flex items-center justify-between border-b border-border/80 pb-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/15 text-primary shadow-[0_0_28px_rgba(139,92,246,0.2)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-normal">Quad</p>
              <p className="text-xs text-muted-foreground">AI Builder Copilot</p>
            </div>
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
            <p className="text-sm font-medium text-primary">
              For students, job seekers, and builders
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-foreground md:text-7xl">
              Your AI companion for becoming job-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
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

          <div className="glass-panel rounded-lg p-4">
            <div className="rounded-lg border border-border bg-[#07070A] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your next move</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">
                    {"Complete today's 3 actions"}
                  </p>
                </div>
                <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8]" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  "Ship one visible proof point",
                  "Practice one core skill",
                  "Save a progress note"
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-[#101014] p-4">
                    <p className="text-sm font-medium text-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-primary/25 bg-primary/10 p-4">
                <p className="text-sm leading-6 text-foreground">
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
