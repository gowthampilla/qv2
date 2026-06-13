import {
  ArrowUpRight,
  Check,
  CircleDot,
  GitCommitHorizontal,
  Radio,
  Sparkles,
  Target
} from "lucide-react";

const focusItems = [
  {
    title: "Finish one project feature",
    detail: "Useful for AI internship proof",
    done: true
  },
  {
    title: "Save today's progress",
    detail: "Turns work into career memory",
    done: false
  },
  {
    title: "Apply to one matched role",
    detail: "Recommended from your goal",
    done: false
  }
];

const memories = [
  "Fixed GitHub OAuth callback reliability",
  "Imported public repositories into Quad memory",
  "Practiced backend fundamentals for interviews"
];

export function LandingProductGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -left-8 top-12 hidden h-28 w-28 rounded-[2rem] border border-[#D4D4D8]/10 bg-[#171717]/60 rotate-12 md:block" />
      <div className="absolute -right-8 bottom-16 hidden h-36 w-36 rounded-[2rem] border border-[#38BDF8]/15 bg-[#38BDF8]/5 -rotate-12 md:block" />

      <div className="relative overflow-hidden rounded-[2rem] border border-[#D4D4D8]/20 bg-[#0A0A0A]/95 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#F5F5F5]/70 to-transparent" />
        <div className="rounded-[1.5rem] border border-[#2A2A2A] bg-[#050505]">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#71717A]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8]/80" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#111111] px-3 py-1 text-xs text-[#C0C0C0]">
              <Radio className="h-3.5 w-3.5 text-[#38BDF8]" />
              Live career memory
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#8A8A8A]">Today&apos;s Focus</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#F5F5F5]">
                    Complete these 3 actions.
                  </h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4D4D8]/20 bg-[#171717] text-[#D4D4D8]">
                  <Target className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {focusItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-3"
                  >
                    <div
                      className={
                        item.done
                          ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]"
                          : "mt-0.5 h-5 w-5 shrink-0 rounded-full border border-[#71717A] bg-[#111111]"
                      }
                    >
                      {item.done ? <Check className="h-3.5 w-3.5" /> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F5]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#8A8A8A]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-4">
              <section className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8A8A8A]">Quad Score</p>
                  <span className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-2.5 py-1 text-xs text-[#BAE6FD]">
                    AI signal
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-4xl font-semibold text-[#F5F5F5]">72</p>
                  <p className="pb-1 text-sm text-[#22C55E]">+18 this week</p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#2A2A2A]">
                  <div className="h-full w-[72%] rounded-full bg-[#D4D4D8]" />
                </div>
              </section>

              <section className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8A8A8A]">Opportunity radar</p>
                  <ArrowUpRight className="h-4 w-4 text-[#D4D4D8]" />
                </div>
                <p className="mt-3 text-base font-semibold text-[#F5F5F5]">
                  AI Internship
                </p>
                <p className="mt-1 text-sm text-[#8A8A8A]">
                  84% match from your goal and GitHub proof.
                </p>
              </section>
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#2A2A2A] p-4 md:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-2xl border border-[#2A2A2A] bg-[#111111] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#F5F5F5]">
                <GitCommitHorizontal className="h-4 w-4 text-[#D4D4D8]" />
                GitHub imported
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ["10", "repos"],
                  ["20", "commits"],
                  ["4", "days"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-3"
                  >
                    <p className="text-lg font-semibold text-[#F5F5F5]">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-[#8A8A8A]">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#38BDF8]/20 bg-[#38BDF8]/[0.06] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#BAE6FD]">
                <Sparkles className="h-4 w-4" />
                Career memory
              </div>
              <div className="mt-4 grid gap-3">
                {memories.map((memory) => (
                  <div key={memory} className="flex gap-3">
                    <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
                    <p className="text-sm leading-6 text-[#E0F2FE]">
                      {memory}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
