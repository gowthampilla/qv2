import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { deleteOpportunityAction, saveOpportunityAction } from "@/app/admin/actions";
import { AdminTable } from "@/components/app/admin-table";
import { AppShell } from "@/components/app/app-shell";
import { FormCard } from "@/components/app/form-card";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin, getAdminOpportunities } from "@/lib/admin";
import { getGoalCatalog, type GoalRecord, type Opportunity } from "@/lib/v1";

export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage() {
  await requireAdmin();
  const [items, goals] = await Promise.all([getAdminOpportunities(), getGoalCatalog()]);

  return (
    <AppShell admin maxWidth="max-w-7xl">
      <PageHeader
        eyebrow="Founder Console"
        title="Opportunities"
        description="Create, edit, and delete opportunities that appear on user dashboards by goal."
        actions={
          <Button asChild variant="outline">
            <a href="/admin">Admin overview</a>
          </Button>
        }
      />

      <FormCard title="Add opportunity" description="Use real opportunities only. Match each record to one goal.">
        <OpportunityForm goals={goals} />
      </FormCard>

      <AdminTable
        headers={["Title", "Company", "Goal", "Type", "Status", "Action"]}
        rows={items.map((item) => [
          <span key="title" className="font-medium text-foreground">{item.title}</span>,
          <span key="company" className="text-muted-foreground">{item.company}</span>,
          <span key="goal" className="text-muted-foreground">{item.goal_slug}</span>,
          <Badge key="type" variant="secondary">{item.type ?? "Opportunity"}</Badge>,
          <Badge key="status" variant={item.is_active ? "default" : "outline"}>
            {item.is_active ? "active" : "inactive"}
          </Badge>,
          <form key="delete" action={deleteOpportunityAction}>
            <input type="hidden" name="id" value={item.id} />
            <Button type="submit" variant="outline" size="sm">Delete</Button>
          </form>
        ])}
      />

      <section className="grid gap-6">
        {items.map((item) => (
          <FormCard key={item.id} title={`Edit ${item.title}`} description={item.company}>
            <OpportunityForm item={item} goals={goals} />
          </FormCard>
        ))}
      </section>
    </AppShell>
  );
}

function OpportunityForm({
  item,
  goals
}: {
  item?: Opportunity;
  goals: GoalRecord[];
}) {
  return (
    <form action={saveOpportunityAction} className="grid gap-4">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label="Title" defaultValue={item?.title} required />
        <Input name="company" label="Company" defaultValue={item?.company} required />
        <Input name="location" label="Location" defaultValue={item?.location ?? ""} />
        <Input name="type" label="Type" defaultValue={item?.type ?? ""} />
        <SelectGoal goals={goals} defaultValue={item?.goal_slug ?? ""} />
        <Input name="source" label="Source" defaultValue={item?.source ?? ""} />
        <Input name="url" label="URL" defaultValue={item?.url ?? ""} />
        <Input
          name="required_skills"
          label="Required skills"
          defaultValue={item?.required_skills?.join(", ") ?? ""}
        />
      </div>
      <Textarea name="description" label="Description" defaultValue={item?.description} required />
      <ActiveCheckbox defaultChecked={item?.is_active ?? true} />
      <Button type="submit" className="w-fit">
        {item ? "Save opportunity" : "Add opportunity"}
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
