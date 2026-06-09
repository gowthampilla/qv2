import { AppShell } from "@/components/app/app-shell";
import { OpportunityCard } from "@/components/app/opportunity-card";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fallbackTaskTemplates,
  getCurrentUser,
  getOpportunities,
  getSelectedGoal
} from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const user = await getCurrentUser();
  const goal = await getSelectedGoal(user.userId).catch(() => undefined);
  const opportunities = goal
    ? await getOpportunities(goal.slug).catch(() => [])
    : [];
  const fallback = fallbackTaskTemplates(goal?.slug);

  return (
    <AppShell maxWidth="max-w-5xl">
      <PageHeader
        eyebrow="Opportunities"
        title="Curated opportunities"
        description={goal ? `Matched to ${goal.name}.` : "Choose a goal to see matched opportunities."}
      />

      {opportunities.length > 0 ? (
        <section className="grid gap-4">
          {opportunities.map((item) => (
            <OpportunityCard key={item.id} opportunity={item} goalName={goal?.name} />
          ))}
        </section>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{"We're preparing matched opportunities for your goal."}</CardTitle>
            <CardDescription>
              For today, build momentum with these actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {fallback.slice(0, 3).map((task) => (
              <div key={task.title} className="rounded-lg border border-border bg-[#101014] p-4">
                <p className="font-medium text-foreground">{task.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {task.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
