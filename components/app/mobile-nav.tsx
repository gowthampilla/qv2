import { Briefcase, Home, ListChecks, User, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNav = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Memory", href: "/memory", icon: WalletCards },
  { label: "Opportunity", href: "/opportunities", icon: Briefcase },
  { label: "Profile", href: "/profile", icon: User }
];

export function MobileNav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]/95 p-1 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur md:hidden",
        className
      )}
    >
      {mobileNav.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] leading-none text-[#8A8A8A] transition-colors hover:bg-[#171717] hover:text-[#F5F5F5]"
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
