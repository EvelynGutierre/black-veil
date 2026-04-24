import type { Directive } from "../types/app";
import HoloPanel from "./HoloPanel";
import SectionHeader from "./SectionHeader";

type Props = {
  directives: Directive[];
  toggleDirective: (id: string) => void;
  toggleAllBlocks: () => void;
};

export default function DirectivesTab({
  directives,
  toggleDirective,
  toggleAllBlocks,
}: Props) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Quest Info"
        title="Active Directives"
        description="Failure to complete active directives may trigger enforcement."
      />

      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <HoloPanel
          title="Daily Quest"
          subtitle="Mandatory completion protocol"
          glow="blue"
        >
          <div className="mx-auto max-w-[420px] rounded-[30px] border border-cyan-400/12 bg-[linear-gradient(180deg,rgba(4,16,38,0.82)_0%,rgba(2,10,24,0.95)_100%)] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="mb-4 border border-cyan-400/15 bg-cyan-400/5 px-4 py-2 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">
                Quest Info
              </p>
            </div>

            <p className="text-center text-sm text-slate-300">
              [Daily Quest: Black Veil operational sequence has arrived.]
            </p>

            <p className="mt-6 text-center text-lg font-semibold text-cyan-200">
              Goal
            </p>

            <div className="mt-5 space-y-3">
              {directives.map((directive) => (
                <div
                  key={`${directive.id}-questcard`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-slate-200">{directive.title}</span>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      [{directive.completed ? "1/1" : "0/1"}]
                    </span>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-sm border text-[10px] ${
                        directive.completed
                          ? "border-cyan-300 bg-cyan-400/10 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                          : "border-slate-600 text-slate-600"
                      }`}
                    >
                      {directive.completed ? "✓" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-2 text-center text-sm leading-7 text-slate-300">
              <p>WARNING: Failure to complete</p>
              <p>the daily quest will result in</p>
              <p>
                an appropriate <span className="text-pink-400">penalty</span>.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyan-300 bg-cyan-400/10 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.22)]">
                ✓
              </div>
            </div>
          </div>
        </HoloPanel>

        <HoloPanel
          title="Directive Board"
          subtitle="Mark completions to update the quest panel"
          glow="cyan"
        >
          <div className="space-y-3">
            {directives.map((directive, index) => (
              <button
                key={directive.id}
                onClick={() => {
                  if (directive.id === "workout") {
                    toggleAllBlocks();
                  }
                  toggleDirective(directive.id);
                }}
                className={`group relative w-full overflow-hidden rounded-[22px] border px-5 py-5 text-left transition ${
                  directive.completed
                    ? "border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_18px_rgba(34,211,238,0.08)]"
                    : "border-cyan-400/10 bg-slate-950/35 hover:border-cyan-300/25 hover:bg-cyan-400/5"
                }`}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cyan-300/0 via-cyan-300/70 to-cyan-300/0 opacity-70" />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                      Directive {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 text-lg font-medium text-slate-100">
                      {directive.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Reward: +{directive.reward} Veil
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm ${
                      directive.completed
                        ? "border-cyan-300 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.18)]"
                        : "border-slate-600 text-slate-500"
                    }`}
                  >
                    {directive.completed ? "✓" : ""}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}