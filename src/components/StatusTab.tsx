import AnimatedNumber from "./AnimatedNumber";
import HoloPanel from "./HoloPanel";
import SectionHeader from "./SectionHeader";

type StatusTabProps = {
  level: number;
  hp: number;
  mp: number;
  fatigue: number;
  rank: string;
  jobTitle: string;
  statusTitle: string;
  strength: number;
  agility: number;
  perception: number;
  vitality: number;
  intelligence: number;
  statPoints: number;
};

export default function StatusTab({
  level,
  hp,
  mp,
  fatigue,
  rank,
  jobTitle,
  statusTitle,
  strength,
  agility,
  perception,
  vitality,
  intelligence,
  statPoints,
}: StatusTabProps) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Status Window"
        title="Operative Status"
        description="Live classification and attribute display."
      />

      <HoloPanel title="Status" subtitle="Black Veil operative sheet" glow="violet">
        <div className="mx-auto max-w-[980px] rounded-[34px] border border-fuchsia-400/20 bg-[linear-gradient(180deg,rgba(18,8,40,0.82)_0%,rgba(5,10,28,0.95)_100%)] p-6 shadow-[0_0_40px_rgba(217,70,239,0.12)]">
          <div className="mx-auto max-w-[700px] rounded-[24px] border border-cyan-200/30 bg-[linear-gradient(180deg,rgba(7,15,33,0.9)_0%,rgba(3,8,20,0.95)_100%)] p-6 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
            <div className="mb-6 flex justify-center">
              <div className="border border-cyan-200/30 px-8 py-2">
                <p className="text-xl font-semibold tracking-[0.2em] text-slate-100">
                  STATUS
                </p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div>
                <p className="text-5xl font-bold text-cyan-100">
                  <AnimatedNumber value={level} />
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-400">
                  Level
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-slate-500">Job:</span>
                  <span className="text-cyan-200">{jobTitle}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Title:</span>
                  <span className="text-cyan-200">{statusTitle}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-500">Rank:</span>
                  <span className="text-cyan-200">{rank}</span>
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-cyan-300/15 bg-cyan-400/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">HP</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">
                  <AnimatedNumber value={hp} /> / 100
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/15 bg-cyan-400/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">MP</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">
                  <AnimatedNumber value={mp} /> / 100
                </p>
              </div>
              <div className="rounded-xl border border-cyan-300/15 bg-cyan-400/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fatigue</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">
                  <AnimatedNumber value={fatigue} />
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">STR</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={strength} />
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-400">AGI</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={agility} />
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-400">PER</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={perception} />
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-300/15 bg-slate-950/40 p-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">VIT</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={vitality} />
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-400">INT</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={intelligence} />
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-400">Points</span>
                  <span className="text-cyan-200">
                    <AnimatedNumber value={statPoints} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HoloPanel>
    </div>
  );
}