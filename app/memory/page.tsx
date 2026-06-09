import { AppShell } from "@/components/app/app-shell";
import { EmptyState } from "@/components/app/empty-state";
import { MemoryTimeline } from "@/components/app/memory-timeline";
import { PageHeader } from "@/components/app/page-header";
import { getAllMemories, type MemoryItem as MemoryItemType } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function MemoryPage() {
  const memories = await getAllMemories().catch(() => [] as MemoryItemType[]);

  return (
    <AppShell maxWidth="max-w-5xl">
      <PageHeader
        eyebrow="Memory"
        title="Career memory"
        description="A story timeline of the work you are building into proof."
      />

      {memories.length === 0 ? (
        <EmptyState
          title="No memory yet."
          description="Add progress manually or connect GitHub to start your timeline."
        />
      ) : (
        <MemoryTimeline memories={memories} />
      )}
    </AppShell>
  );
}
