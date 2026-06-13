import { logoutAction } from "@/app/actions";
import { QuadLogo } from "@/components/app/quad-logo";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#2A2A2A] bg-[#0A0A0A]/82 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-xl">
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
