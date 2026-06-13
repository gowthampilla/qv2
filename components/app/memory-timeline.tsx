import { MemoryItem } from "@/components/app/memory-item";
import type { MemoryItem as MemoryItemType } from "@/lib/v1";

export function MemoryTimeline({ memories }: { memories: MemoryItemType[] }) {
  const grouped = memories.reduce<Record<string, MemoryItemType[]>>((groups, memory) => {
    const date = new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(memory.occurredAt));
    groups[date] = groups[date] ?? [];
    groups[date].push(memory);
    return groups;
  }, {});

  return (
    <section className="flex flex-col gap-8">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date} className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-4">
          <div>
            <p className="text-sm font-medium text-[#F5F5F5]">{date}</p>
            <p className="mt-1 text-xs text-[#8A8A8A]">{items.length} milestones</p>
          </div>
          <div className="relative grid gap-3 border-l border-[#2A2A2A] pl-5">
            {items.map((memory) => (
              <div key={`${memory.source}-${memory.id}`} className="relative">
                <span className="absolute -left-[27px] top-5 h-3 w-3 rounded-full border border-[#D4D4D8] bg-[#050505]" />
                <MemoryItem memory={memory} dateLabel={formatTime(memory.occurredAt)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
