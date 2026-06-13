import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CoachMessage({ message }: { message: string }) {
  return (
    <Card className="border-[#38BDF8]/20 bg-[#38BDF8]/[0.055]">
      <CardContent className="flex gap-3 p-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-[#7DD3FC]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#BAE6FD]">Quad Coach</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#F5F5F5] md:text-base">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
