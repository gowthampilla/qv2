import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { deleteTaskTemplateAction, saveTaskTemplateAction } from "@/app/admin/actions";
import { AdminTable } from "@/components/app/admin-table";
import { AppShell } from "@/components/app/app-shell";
import { FormCard } from "@/components/app/form-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin, getAdminTaskTemplates } from "@/lib/admin";
import { getGoalCatalog, type GoalRecord, type TaskTemplate } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function AdminTasksPage() {
  await requireAdmin();
  const [items, goals] = await Promise.all([getAdminTaskTemplates(), getGoalCatalog()]);

  return (
    <AppShell admin maxWidth="max-w-7xl">
      <PageHeader
        eyebrow="Founder Console"
        title="Task templates"
        description="Create reusable goal-based tasks that generate daily user work."
        actions={
          <Button asChild variant="outline">
            <a href="/admin">Admin overview</a>
          </Button>
        }
      />

      <FormCard title="Add task template" description="Templates become user tasks when someone chooses the matching goal.">
        <TaskTemplateForm goals={goals} />
      </FormCard>

      <AdminTable
        headers={["Title", "Goal", "Category", "Points", "Status", "Action"]}
        rows={items.map((item) => [
          <span key="title" className="font-medium text-foreground">{item.title}</span>,
          <span key="goal" className="text-muted-foreground">{item.goal_slug}</span>,
          <span key="category" className="text-muted-foreground">{item.category}</span>,
          <span key="points" className="text-muted-foreground">{item.points}</span>,
          <Badge key="status" variant={item.is_active ? "default" : "outline"}>
            {item.is_active ? "active" : "inactive"}
          </Badge>,
          <form key="delete" action={deleteTaskTemplateAction}>
            <input type="hidden" name="id" value={item.id} />
            <Button type="submit" variant="outline" size="sm">Delete</Button>
          </form>
        ])}
      />

      <section className="grid gap-6">
        {items.map((item) => (
          <FormCard key={item.id} title={`Edit ${item.title}`} description={`${item.category ?? "task"} / ${item.difficulty ?? "standard"}`}>
            <TaskTemplateForm item={item} goals={goals} />
          </FormCard>
        ))}
      </section>
    </AppShell>
  );
}

function TaskTemplateForm({
  item,
  goals
}: {
  item?: TaskTemplate;
  goals: GoalRecord[];
}) {
  return (
    <form action={saveTaskTemplateAction} className="grid gap-4">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label="Title" defaultValue={item?.title} required />
        <SelectGoal goals={goals} defaultValue={item?.goal_slug ?? ""} />
        <Input name="difficulty" label="Difficulty" defaultValue={item?.difficulty ?? ""} />
        <Input name="category" label="Category" defaultValue={item?.category ?? ""} />
        <Input name="points" label="Points" type="number" defaultValue={item?.points ?? 10} />
      </div>
      <Textarea name="description" label="Description" defaultValue={item?.description} required />
      <ActiveCheckbox defaultChecked={item?.is_active ?? true} />
      <Button type="submit" className="w-fit">
        {item ? "Save task template" : "Add task template"}
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
      <input type="checkbox" name="is_active" defaultChecked={defaultChecked} className="accent-[#D4D4D8]" />
      Active
    </label>
  );
}
