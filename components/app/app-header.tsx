import { logoutAction } from "@/app/actions";
import { QuadLogo } from "@/components/app/quad-logo";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A]/85 p-3 backdrop-blur">
      <a href="/dashboard" className="block">
        <QuadLogo />
      </a>
      <form action={logoutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </header>
  );
}
