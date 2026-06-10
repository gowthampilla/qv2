import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FeedCard({
  title,
  description,
  contentType,
  url
}: {
  title: string;
  description: string;
  contentType?: string | null;
  url?: string | null;
}) {
  return (
    <Card className="transition-all hover:-translate-y-0.5 hover:border-[#D4D4D8]/35 hover:bg-[#171717]/70">
      <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="secondary">{contentType ?? "roadmap tip"}</Badge>
          <h2 className="mt-3 text-lg font-semibold text-[#F5F5F5]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A8A8A]">
            {description}
          </p>
        </div>
        {url ? (
          <Button asChild variant="outline" size="sm">
            <a href={url} target="_blank" rel="noreferrer">
              Open
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
