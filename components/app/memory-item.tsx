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
    <Card className="transition-colors hover:border-primary/30">
      <CardContent className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{memory.activityType}</Badge>
          {memory.repoName ? (
            <span className="text-sm text-muted-foreground">{memory.repoName}</span>
          ) : null}
        </div>
        <p className="text-sm leading-7 text-foreground md:text-base">
          {memory.memorySentence}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {dateLabel ?? formatDate(memory.occurredAt)}
        </p>
      </CardContent>
    </Card>
  );
}
