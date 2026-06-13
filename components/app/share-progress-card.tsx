"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareProgressCard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyProgress() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-[#D4D4D8]" />
          Share Progress
        </CardTitle>
        <CardDescription>A concise update you can share when it feels useful.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
          <p className="text-sm leading-7 text-[#F5F5F5]">{text}</p>
        </div>
        <Button type="button" variant="outline" className="mt-4" onClick={copyProgress}>
          {copied ? <Check className="mr-2 h-4 w-4 text-[#22C55E]" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy progress update"}
        </Button>
      </CardContent>
    </Card>
  );
}
