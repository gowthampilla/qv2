import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";

export function CompanionShell({
  children,
  maxWidth
}: {
  children: ReactNode;
  maxWidth?: string;
}) {
  return <AppShell maxWidth={maxWidth}>{children}</AppShell>;
}
