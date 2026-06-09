import { MemoryItem } from "@/components/app/memory-item";
import { formatDate, type MemoryItem as MemoryItemType } from "@/lib/v1";

export function MemoryTimeline({ memories }: { memories: MemoryItemType[] }) {
  const grouped = memories.reduce<Record<string, MemoryItemType[]>>((groups, memory) => {
    const month = new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric"
    }).format(new Date(memory.occurredAt));
    groups[month] = groups[month] ?? [];
    groups[month].push(memory);
    return groups;
  }, {});

  return (
    <section className="flex flex-col gap-8">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="grid gap-4 md:grid-cols-[180px_1fr]">
          <div>
            <p className="text-sm font-medium text-foreground">{month}</p>
            <p className="mt-1 text-xs text-muted-foreground">{items.length} milestones</p>
          </div>
          <div className="relative grid gap-4 border-l border-border pl-5">
            {items.map((memory) => (
              <div key={`${memory.source}-${memory.id}`} className="relative">
                <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border border-primary bg-background" />
                <MemoryItem memory={memory} dateLabel={formatDate(memory.occurredAt)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
