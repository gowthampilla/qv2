import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, type MemoryItem as MemoryItemType } from "@/lib/v1";

export function MemoryItem({
  memory,
  dateLabel
}: {
  memory: MemoryItemType;
  dateLabel?: string;
}) {
  return (
    <Card className="transition-colors hover:border-[#D4D4D8]/35 hover:bg-[#171717]/70">
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{memory.activityType}</Badge>
          {memory.repoName ? (
            <span className="text-sm text-[#C0C0C0]">{memory.repoName}</span>
          ) : null}
        </div>
        <p className="text-sm leading-7 text-[#F5F5F5] md:text-base">
          {toMilestone(memory.memorySentence)}
        </p>
        <p className="mt-3 text-sm text-[#8A8A8A]">
          {dateLabel ?? formatDate(memory.occurredAt)}
        </p>
      </CardContent>
    </Card>
  );
}

function toMilestone(sentence: string) {
  return sentence
    .replace(/^I\s+/i, "")
    .replace(/^Worked on\s+/i, "")
    .replace(/\.$/, "");
}
