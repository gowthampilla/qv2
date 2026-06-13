import { CalendarClock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TomorrowPreview({ focus }: { focus: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-[#D4D4D8]" />
          Tomorrow, Quad will focus on
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {focus.slice(0, 3).map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-[#C0C0C0]"
          >
            <ChevronRight className="h-3.5 w-3.5 text-[#71717A]" />
            {item}
          </div>
        ))}
        <p className="mt-2 text-xs leading-5 text-[#8A8A8A]">
          Come back tomorrow for a fresh focus based on today&apos;s progress.
        </p>
      </CardContent>
    </Card>
  );
}
