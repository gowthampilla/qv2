import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  detail,
  icon
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="glass-panel transition-colors hover:border-[#D4D4D8]/35">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-[#8A8A8A]">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="text-2xl font-semibold leading-tight text-[#F5F5F5]">{value}</p>
        {detail ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#8A8A8A]">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
