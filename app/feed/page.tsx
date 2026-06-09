import { AppShell } from "@/components/app/app-shell";
import { FeedCard } from "@/components/app/feed-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getFeedPosts, getSelectedGoal } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const user = await getCurrentUser();
  const goal = await getSelectedGoal(user.userId).catch(() => undefined);
  const posts = goal ? await getFeedPosts(goal.slug).catch(() => []) : [];

  return (
    <AppShell maxWidth="max-w-5xl">
      <PageHeader
        eyebrow="Feed"
        title="Recommended for you"
        description="Curated learning resources, project ideas, challenges, hiring updates, and roadmap tips."
        actions={
          <Button asChild variant="outline">
            <a href="/dashboard">Back to dashboard</a>
          </Button>
        }
      />

      <section className="grid gap-6">
        {(posts.length > 0 ? posts : fallbackFeed(goal?.name)).map((post) => (
          <FeedCard
            key={post.id}
            title={post.title}
            description={post.description}
            contentType={post.content_type}
            url={post.url}
          />
        ))}
      </section>
    </AppShell>
  );
}

function fallbackFeed(goalName?: string) {
  return [
    {
      id: "fallback-1",
      title: "Build one visible proof point today",
      description: `For ${goalName ?? "your goal"}, a small shipped artifact beats a long private plan.`,
      content_type: "roadmap tip",
      url: ""
    },
    {
      id: "fallback-2",
      title: "Write down what changed",
      description: "A strong builder profile is a trail of decisions, improvements, and shipped work.",
      content_type: "challenge",
      url: ""
    }
  ];
}
