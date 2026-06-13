import {
  Briefcase,
  Home,
  ListChecks,
  Newspaper,
  Settings,
  User,
  WalletCards
} from "lucide-react";
import { QuadLogo } from "@/components/app/quad-logo";
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

export function Sidebar({ admin = false }: { admin?: boolean }) {
  const nav = admin ? adminNav : userNav;

  return (
    <aside className="sticky top-0 z-20 hidden border-[#2A2A2A] bg-[#050505]/90 shadow-[inset_-1px_0_0_rgba(255,255,255,0.035)] backdrop-blur-xl md:block md:h-screen md:w-64 md:border-r">
      <div className="flex h-full flex-col gap-8 px-5 py-6">
        <a href={admin ? "/admin" : "/"} className="block">
          <QuadLogo subtitle={admin ? "Founder Console" : "AI Builder Copilot"} />
        </a>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex min-w-fit items-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm text-[#8A8A8A] transition-all",
                  "hover:border-[#D4D4D8]/[0.18] hover:bg-[#111111]/85 hover:text-[#F5F5F5] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
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
