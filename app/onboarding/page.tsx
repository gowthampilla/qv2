import { Target } from "lucide-react";
import { selectGoalAction } from "@/app/actions";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getGoalCatalog, getSelectedGoal } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  const selectedGoal = await getSelectedGoal(user.userId).catch(() => undefined);
  const goals = await getGoalCatalog();

  return (
    <AppShell maxWidth="max-w-4xl">
      <PageHeader
        eyebrow="Onboarding"
        title="Choose your goal"
        description="Quad uses this to personalize tasks, feed items, opportunities, and your career memory."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Career direction
          </CardTitle>
          <CardDescription>Select one goal for now. You can change it later.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={selectGoalAction} className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <label
                  key={goal.slug}
                  className="group flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-[#101014] p-4 transition-colors hover:border-primary/40 hover:bg-card"
                >
                  <input
                    className="mt-1 accent-primary"
                    type="radio"
                    name="goal"
                    value={goal.slug}
                    defaultChecked={selectedGoal?.slug === goal.slug}
                    required
                  />
                  <span>
                    <span className="block font-medium text-foreground">{goal.name}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {goal.description}
                    </span>
                    {selectedGoal?.slug === goal.slug ? (
                      <Badge className="mt-3" variant="secondary">
                        Current goal
                      </Badge>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
            <Button type="submit" className="w-fit">
              Save goal and generate tasks
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
