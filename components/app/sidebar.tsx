import {
  Briefcase,
  Home,
  ListChecks,
  Newspaper,
  Settings,
  Sparkles,
  User,
  WalletCards
} from "lucide-react";
import { cn } from "@/lib/utils";

const userNav = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Memory", href: "/memory", icon: WalletCards },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase },
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings }
];

const adminNav = [
  { label: "Admin", href: "/admin", icon: Home },
  { label: "Opportunities", href: "/admin/opportunities", icon: Briefcase },
  { label: "Tasks", href: "/admin/tasks", icon: ListChecks },
  { label: "Feed", href: "/admin/feed", icon: Newspaper }
];

const mobileNav = userNav.filter((item) =>
  ["Home", "Tasks", "Memory", "Profile"].includes(item.label)
);

export function Sidebar({ admin = false }: { admin?: boolean }) {
  const nav = admin ? adminNav : userNav;

  return (
    <aside className="sticky top-0 z-20 hidden border-border bg-background/80 backdrop-blur-xl md:block md:h-screen md:w-64 md:border-r">
      <div className="flex h-full flex-col gap-8 px-5 py-6">
        <a href={admin ? "/admin" : "/"} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/15 text-primary shadow-[0_0_28px_rgba(139,92,246,0.2)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-normal">Quad</p>
            <p className="text-xs text-muted-foreground">
              {admin ? "Founder Console" : "AI Builder Copilot"}
            </p>
          </div>
        </a>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex min-w-fit items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors",
                  "hover:border-border hover:bg-card hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 gap-1 rounded-lg border border-border bg-[#101014]/95 p-1 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
      {mobileNav.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
