import { GitBranch, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateQuadScore, countScoringMemories } from "@/lib/readiness";
import { getCurrentUser, getProfileStats } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const fallbackStats = {
    goal: undefined,
    memories: [],
    completedTasks: 0,
    totalMemories: 0,
    githubActivities: 0,
    streak: 0,
    projects: [],
    skills: [],
    githubUsername: user.githubUsername ?? undefined
  };
  const stats = await withPageTimeout(getProfileStats(user), fallbackStats, 5000);
  const quadScore = calculateQuadScore({
    completedTasks: stats.completedTasks,
    scoringMemories: countScoringMemories(stats.memories),
    githubActivities: stats.githubActivities,
    streak: stats.streak
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Profile"
        title="Builder Profile"
        description={user.name}
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Goal" value={stats.goal?.name ?? "Not selected"} />
        <StatCard label="Quad Score" value={`${quadScore}/100`} detail="Based on tasks, independent memories, GitHub, and streak." />
        <StatCard label="Current streak" value={`${stats.streak} days`} />
        <StatCard label="Career memory" value={stats.totalMemories} detail="Saved milestones." />
        <StatCard
          icon={<GitBranch className="h-4 w-4 text-[#D4D4D8]" />}
          label="GitHub"
          value={stats.githubUsername ? "Connected" : "Not connected"}
          detail={stats.githubUsername ?? "Connect GitHub in settings."}
        />
        <StatCard label="Completed tasks" value={stats.completedTasks} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#D4D4D8]" />
              Skills detected
            </CardTitle>
            <CardDescription>Inferred from GitHub repository metadata.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {stats.skills.length > 0 ? (
              stats.skills.map((skill) => (
                <span key={skill} className="rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-1 text-sm text-[#C0C0C0]">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No skills detected yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects remembered</CardTitle>
            <CardDescription>Repositories saved into your career memory.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {stats.projects.length > 0 ? (
              stats.projects.map((project) => (
                <p key={project} className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2 text-sm text-[#F5F5F5]">
                  {project}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No GitHub projects found yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function withPageTimeout<T>(promise: Promise<T>, fallback: T, ms: number) {
  return Promise.race([
    promise.catch(() => fallback),
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    })
  ]);
}
