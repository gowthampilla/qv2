import { Briefcase, ListChecks, Newspaper, Shield } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { requireAdmin, getAdminOverview } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdmin();
  const overview = await getAdminOverview();

  return (
    <AppShell admin>
      <PageHeader
        eyebrow="Founder Console"
        title="Admin Dashboard"
        description={`Signed in as ${session.email}. Manage the content that powers Quad's user dashboards.`}
        actions={
          <Button asChild variant="outline">
            <a href="/dashboard">User dashboard</a>
          </Button>
        }
      />

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<Briefcase className="h-4 w-4 text-[#D4D4D8]" />}
          label="Opportunities"
          value={overview.opportunities}
          detail="Founder-created records"
        />
        <StatCard
          icon={<ListChecks className="h-4 w-4 text-[#D4D4D8]" />}
          label="Task templates"
          value={overview.taskTemplates}
          detail="Goal-based daily work"
        />
        <StatCard
          icon={<Newspaper className="h-4 w-4 text-[#D4D4D8]" />}
          label="Feed posts"
          value={overview.feedPosts}
          detail="Curated guidance"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <AdminLink title="Manage opportunities" href="/admin/opportunities" />
        <AdminLink title="Manage task templates" href="/admin/tasks" />
        <AdminLink title="Manage feed posts" href="/admin/feed" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#D4D4D8]" />
            V1 admin model
          </CardTitle>
          <CardDescription>
            Access is controlled by `ADMIN_EMAILS`. Connect GitHub with an
            authorized email to enter these pages.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppShell>
  );
}

function AdminLink({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-5 text-sm font-medium text-[#F5F5F5] transition-colors hover:border-[#D4D4D8]/40 hover:bg-[#171717]"
    >
      {title}
    </a>
  );
}
