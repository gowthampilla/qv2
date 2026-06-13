import { AlertCircle } from "lucide-react";

export function GapCard({ gap }: { gap: string }) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#38BDF8]">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#8A8A8A]">
            Next move
          </p>
          <p className="mt-2 text-sm font-medium text-[#F5F5F5]">
            Biggest gap: {gap}
          </p>
        </div>
      </div>
    </div>
  );
}
