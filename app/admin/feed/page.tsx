import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { deleteFeedPostAction, saveFeedPostAction } from "@/app/admin/actions";
import { AdminTable } from "@/components/app/admin-table";
import { AppShell } from "@/components/app/app-shell";
import { FormCard } from "@/components/app/form-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin, getAdminFeedPosts } from "@/lib/admin";
import { getGoalCatalog, type FeedPost, type GoalRecord } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function AdminFeedPage() {
  await requireAdmin();
  const [items, goals] = await Promise.all([getAdminFeedPosts(), getGoalCatalog()]);

  return (
    <AppShell admin maxWidth="max-w-7xl">
      <PageHeader
        eyebrow="Founder Console"
        title="Feed posts"
        description="Create curated resources, project ideas, hiring updates, challenges, and roadmap tips."
        actions={
          <Button asChild variant="outline">
            <a href="/admin">Admin overview</a>
          </Button>
        }
      />

      <FormCard title="Add feed post" description="Feed posts appear for users with the matching goal.">
        <FeedPostForm goals={goals} />
      </FormCard>

      <AdminTable
        headers={["Title", "Goal", "Type", "Status", "Action"]}
        rows={items.map((item) => [
          <span key="title" className="font-medium text-foreground">{item.title}</span>,
          <span key="goal" className="text-muted-foreground">{item.goal_slug}</span>,
          <Badge key="type" variant="secondary">{item.content_type ?? "feed"}</Badge>,
          <Badge key="status" variant={item.is_active ? "default" : "outline"}>
            {item.is_active ? "active" : "inactive"}
          </Badge>,
          <form key="delete" action={deleteFeedPostAction}>
            <input type="hidden" name="id" value={item.id} />
            <Button type="submit" variant="outline" size="sm">Delete</Button>
          </form>
        ])}
      />

      <section className="grid gap-6">
        {items.map((item) => (
          <FormCard key={item.id} title={`Edit ${item.title}`} description={item.content_type ?? "feed post"}>
            <FeedPostForm item={item} goals={goals} />
          </FormCard>
        ))}
      </section>
    </AppShell>
  );
}

function FeedPostForm({
  item,
  goals
}: {
  item?: FeedPost;
  goals: GoalRecord[];
}) {
  return (
    <form action={saveFeedPostAction} className="grid gap-4">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label="Title" defaultValue={item?.title} required />
        <SelectGoal goals={goals} defaultValue={item?.goal_slug ?? ""} />
        <Input name="content_type" label="Content type" defaultValue={item?.content_type ?? ""} />
        <Input name="url" label="URL" defaultValue={item?.url ?? ""} />
      </div>
      <Textarea name="description" label="Description" defaultValue={item?.description} required />
      <ActiveCheckbox defaultChecked={item?.is_active ?? true} />
      <Button type="submit" className="w-fit">
        {item ? "Save feed post" : "Add feed post"}
      </Button>
    </form>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input className="form-field" {...inputProps} />
    </label>
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...textareaProps } = props;
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <textarea className="form-textarea" {...textareaProps} />
    </label>
  );
}

function SelectGoal({ goals, defaultValue }: { goals: GoalRecord[]; defaultValue: string }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-muted-foreground">Goal</span>
      <select name="goal_slug" defaultValue={defaultValue} className="form-field">
        {goals.map((goal) => (
          <option key={goal.slug} value={goal.slug}>
            {goal.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActiveCheckbox({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <input type="checkbox" name="is_active" defaultChecked={defaultChecked} className="accent-primary" />
      Active
    </label>
  );
}
