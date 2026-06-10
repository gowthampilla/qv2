"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function TaskCompleteButton({
  complete = false,
  size = "sm"
}: {
  complete?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  const { pending } = useFormStatus();

  if (complete) {
    return (
      <Button type="button" size={size} disabled>
        Completed
      </Button>
    );
  }

  return (
    <Button type="submit" size={size} disabled={pending}>
      {pending ? "Completing..." : "Complete"}
    </Button>
  );
}
