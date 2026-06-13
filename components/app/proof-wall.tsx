import {
  CheckCircle2,
  FileCheck2,
  GitCommitHorizontal,
  GitFork,
  Trophy
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type ProofItem = {
  label: string;
  detail: string;
  type: "repo" | "commit" | "task" | "memory";
};

const proofIcons = {
  repo: GitFork,
  commit: GitCommitHorizontal,
  task: CheckCircle2,
  memory: FileCheck2
};

export function ProofWall({ items }: { items: ProofItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#D4D4D8]" />
          Proof you&apos;re building
        </CardTitle>
        <CardDescription>
          Small proof points become a stronger career story over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.slice(0, 6).map((item, index) => {
              const Icon = proofIcons[item.type];

              return (
                <div
                  key={`${item.type}-${item.label}-${index}`}
                  className="flex gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D4D4D8]/20 bg-[#171717] text-[#D4D4D8]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#F5F5F5]">{item.label}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8A8A8A]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#8A8A8A]">
            Complete one task or save one progress note to create your first proof point.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
