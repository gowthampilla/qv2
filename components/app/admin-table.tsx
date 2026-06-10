import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AdminTable({
  headers,
  rows
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#2A2A2A] bg-[#0A0A0A] text-xs uppercase tracking-[0.08em] text-[#8A8A8A]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[#2A2A2A] last:border-0 hover:bg-[#171717]/45">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
