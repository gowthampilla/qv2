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
    <Card className="transition-all hover:-translate-y-0.5 hover:border-[#D4D4D8]/35 hover:bg-[#171717]/70">
      <CardContent className="p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{opportunity.type ?? "Opportunity"}</Badge>
              {goalName ? <Badge variant="outline">Matched to {goalName}</Badge> : null}
              <span className="text-xs text-[#8A8A8A]">{opportunity.location}</span>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm text-[#C0C0C0]">
              <Briefcase className="h-4 w-4" />
              {opportunity.company}
              {opportunity.source ? (
                <span className="text-xs text-[#71717A]">via {opportunity.source}</span>
              ) : null}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal text-[#F5F5F5]">
              {opportunity.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#8A8A8A]">
              {opportunity.description}
            </p>
            {goalName ? (
              <p className="mt-3 text-sm leading-6 text-[#C0C0C0]">
                Why it matches: the role values skills you can prove through your current goal,
                projects, and GitHub activity.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {opportunity.required_skills.map((skill) => (
                <span key={skill} className="rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-2.5 py-1 text-xs text-[#C0C0C0]">
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
