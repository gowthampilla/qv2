import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="relative flex flex-col gap-5 border-b border-[#2A2A2A] pb-6 md:flex-row md:items-end md:justify-between">
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-px w-32 bg-gradient-to-r from-[#D4D4D8]/70 to-transparent"
      />
      <div>
        {eyebrow ? (
          <p className="text-sm font-medium text-[#C0C0C0]">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-normal text-[#F5F5F5] md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8A8A8A] md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
