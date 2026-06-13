import type { ReactNode } from "react";
import { AppHeader } from "@/components/app/app-header";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";

export function AppShell({
  children,
  admin = false,
  maxWidth = "max-w-6xl"
}: {
  children: ReactNode;
  admin?: boolean;
  maxWidth?: string;
}) {
  return (
    <main className="premium-surface min-h-screen pb-28 md:flex md:pb-0">
      <Sidebar admin={admin} />
      <section className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className={`mx-auto flex w-full ${maxWidth} flex-col gap-6`}>
          <AppHeader />
          {children}
        </div>
      </section>
      {!admin ? <MobileNav /> : null}
    </main>
  );
}
