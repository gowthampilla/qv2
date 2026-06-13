import { Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const traits = [
  { label: "Engineer", value: 82 },
  { label: "Founder", value: 64 },
  { label: "Problem Solver", value: 76 }
];

export function BuilderDNA() {
  return (
    <Card className="glass-panel">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#C0C0C0]">Builder DNA</p>
            <p className="mt-1 text-xs text-[#8A8A8A]">Signals from your work.</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#38BDF8]">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          {traits.map((trait, index) => (
            <div key={trait.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm text-[#F5F5F5]">{trait.label}</span>
                <span className="text-xs text-[#8A8A8A]">{trait.value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#0A0A0A]">
                <div
                  className={index === 1 ? "h-full rounded-full bg-[#71717A]" : "h-full rounded-full bg-[#D4D4D8]"}
                  style={{ width: `${trait.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
