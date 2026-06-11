import { logoutAction, resyncGithubAction, selectGoalAction } from "@/app/actions";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCurrentUser,
  getGithubStatsForUser,
  getGoalCatalog,
  getSelectedGoal
} from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const [stats, goals, selectedGoal] = await Promise.all([
    getGithubStatsForUser(user).catch(() => ({
      connected: false,
      githubUsername: undefined,
      totalRepos: 0,
      totalActivities: 0,
      lastSyncTime: undefined
    })),
    getGoalCatalog(),
    getSelectedGoal(user.userId).catch(() => undefined)
  ]);

  return (
    <AppShell maxWidth="max-w-4xl">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Keep Quad connected to the goal and account you want to build from."
      />

      <Card>
        <CardHeader>
          <CardTitle>GitHub connection</CardTitle>
          <CardDescription>Public repositories and commits feed your career memory.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <SettingRow label="Status">
            <Badge variant={stats.connected ? "default" : "outline"}>
              {stats.connected ? "Connected" : "Not connected"}
            </Badge>
          </SettingRow>
          <SettingRow label="Username">
            <strong className="text-sm">{stats.githubUsername ?? user.githubUsername ?? "Unknown"}</strong>
          </SettingRow>
          <form action={resyncGithubAction}>
            <Button type="submit" variant={stats.connected ? "outline" : "default"}>
              {stats.connected ? "Resync GitHub" : "Connect GitHub"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected goal</CardTitle>
          <CardDescription>Change what Quad personalizes around.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={selectGoalAction} className="flex flex-col gap-3 md:flex-row">
            <select
              name="goal"
              defaultValue={selectedGoal?.slug ?? ""}
              className="form-field flex-1"
              required
            >
              <option value="" disabled>
                Select a goal
              </option>
              {goals.map((goal) => (
                <option key={goal.slug} value={goal.slug}>
                  {goal.name}
                </option>
              ))}
            </select>
            <Button type="submit">Save goal</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>{user.email ?? user.githubUsername ?? "Local Quad session"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">Logout</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function SettingRow({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
