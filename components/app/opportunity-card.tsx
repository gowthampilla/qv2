import { ArrowUpRight, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Opportunity } from "@/lib/v1";

export function OpportunityCard({
  opportunity,
  goalName
}: {
  opportunity: Opportunity;
  goalName?: string;
}) {
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card/80">
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{opportunity.type ?? "Opportunity"}</Badge>
              {goalName ? <Badge variant="outline">Matched to {goalName}</Badge> : null}
              <span className="text-xs text-muted-foreground">{opportunity.location}</span>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {opportunity.company}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal text-foreground">
              {opportunity.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {opportunity.description}
            </p>
            {goalName ? (
              <p className="mt-3 text-sm leading-6 text-foreground">
                This matches your goal because it asks for visible skills you can build and show.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.required_skills.map((skill) => (
                <span key={skill} className="rounded-full border border-border bg-[#101014] px-2.5 py-1 text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {opportunity.url ? (
            <Button asChild variant="outline">
              <a href={opportunity.url} target="_blank" rel="noreferrer">
                View
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
