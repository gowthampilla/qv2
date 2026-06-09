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
    <Card className="glass-panel transition-colors hover:border-primary/30">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="text-2xl font-semibold leading-tight text-foreground">{value}</p>
        {detail ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
