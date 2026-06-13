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
    <div className={cn("group flex min-w-0 items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-[#D4D4D8]/35 bg-[linear-gradient(145deg,#111111_0%,#070708_68%)] text-[#F5F5F5] shadow-[0_0_36px_rgba(230,228,216,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]">
        <span
          aria-hidden="true"
          className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#F5F5F5]/70 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute -right-6 -top-6 h-16 w-16 rounded-full border border-[#D4D4D8]/[0.12] bg-[#D4D4D8]/[0.025]"
        />
        <svg
          aria-hidden="true"
          className="relative h-7 w-7 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M24 6.8 35.5 11.6 40.2 23.1 35.4 34.6 23.9 39.4 12.4 34.6 7.6 23.1 12.5 11.6 24 6.8Z"
            stroke="#D4D4D8"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
          <path
            d="M24 15.4c-5 0-8.8 3.8-8.8 8.6 0 4.9 3.8 8.7 8.8 8.7 2.4 0 4.6-.9 6.2-2.5"
            stroke="#F5F5F5"
            strokeLinecap="round"
            strokeWidth="2.8"
          />
          <path
            d="m30.4 30.4 7.1 7.1"
            stroke="#F5F5F5"
            strokeLinecap="round"
            strokeWidth="2.8"
          />
          <path
            d="M19.1 24h10.4"
            stroke="#38BDF8"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M33.1 16.1h.1M16 33h.1"
            stroke="#C0C0C0"
            strokeLinecap="round"
            strokeWidth="2.7"
          />
        </svg>
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-none tracking-normal text-[#F5F5F5]">
            Quad
          </p>
          <p className="mt-1.5 text-[11px] font-medium leading-none tracking-normal text-[#8A8A8A]">
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
