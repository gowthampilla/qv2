import { Layers3 } from "lucide-react";

export function StudentStageBadge({
  level,
  name
}: {
  level: number;
  name: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#D4D4D8]/25 bg-[#D4D4D8]/10 px-3 py-1.5 text-xs font-medium text-[#F5F5F5]">
      <Layers3 className="h-3.5 w-3.5 text-[#D4D4D8]" />
      Stage {level}: {name}
    </div>
  );
}
