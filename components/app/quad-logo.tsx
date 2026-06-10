import { cn } from "@/lib/utils";

export function QuadLogo({
  subtitle = "AI Builder Copilot",
  compact = false,
  className
}: {
  subtitle?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D4D4D8]/30 bg-[#111111] text-[#F5F5F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 4.25a7.75 7.75 0 1 0 0 15.5 7.75 7.75 0 0 0 0-15.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m15.7 15.6 3.15 3.15"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <path
            d="M8.1 12h7.8"
            stroke="#38BDF8"
            strokeLinecap="round"
            strokeWidth="1.4"
          />
        </svg>
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-none tracking-normal text-[#F5F5F5]">
            Quad
          </p>
          <p className="mt-1 text-xs leading-none text-[#8A8A8A]">{subtitle}</p>
        </div>
      ) : null}
    </div>
  );
}
