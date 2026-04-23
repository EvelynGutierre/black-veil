import type { TrainingLog } from "../types/app";
import HoloPanel from "./HoloPanel";
import SectionHeader from "./SectionHeader";

type Props = {
  trainingLog: TrainingLog;
  updateTraining: <K extends keyof TrainingLog>(key: K, value: TrainingLog[K]) => void;
};

export default function TrainingTab({
  trainingLog,
  updateTraining,
}: Props) {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Training Archive"
        title="Training Log"
        description="Record boxing, conditioning, recovery, and strength output."
      />

      <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <HoloPanel
          title="System Input"
          subtitle="Daily record synchronization"
          glow="blue"
        >
          <div className="mx-auto max-w-[430px] rounded-[30px] border border-cyan-400/12 bg-[linear-gradient(180deg,rgba(4,16,38,0.82)_0%,rgba(2,10,24,0.95)_100%)] p-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="mb-4 border border-cyan-400/15 bg-cyan-400/5 px-4 py-2 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">
                Status Input
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-slate-200">Morning Weight</span>
                <span className="text-slate-400">[{trainingLog.weight || "--"}]</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-slate-200">Sleep Hours</span>
                <span className="text-slate-400">[{trainingLog.sleep || "--"}]</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-slate-200">Water Intake</span>
                <span className="text-slate-400">[{trainingLog.water || "--"}]</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-slate-200">Steps</span>
                <span className="text-slate-400">[{trainingLog.steps || "--"}]</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                <span className="text-slate-200">Boxing Rounds</span>
                <span className="text-slate-400">[{trainingLog.boxingRounds || "--"}]</span>
              </div>
            </div>

            <div className="mt-8 space-y-2 text-center text-sm leading-7 text-slate-300">
              <p>NOTICE: Incomplete archive data</p>
              <p>may reduce system accuracy</p>
              <p>
                during <span className="text-cyan-300">tracking analysis</span>.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyan-300 bg-cyan-400/10 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.22)]">
                ⬡
              </div>
            </div>
          </div>
        </HoloPanel>

        <HoloPanel
          title="Training Input Board"
          subtitle="Update values to synchronize the archive"
          glow="cyan"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Morning Weight
              </span>
              <input
                value={trainingLog.weight}
                onChange={(e) => updateTraining("weight", e.target.value)}
                placeholder="197.8"
                className="w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Sleep Hours
              </span>
              <input
                value={trainingLog.sleep}
                onChange={(e) => updateTraining("sleep", e.target.value)}
                placeholder="7.5"
                className="w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Water (oz)
              </span>
              <input
                value={trainingLog.water}
                onChange={(e) => updateTraining("water", e.target.value)}
                placeholder="100"
                className="w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Steps
              </span>
              <input
                value={trainingLog.steps}
                onChange={(e) => updateTraining("steps", e.target.value)}
                placeholder="10000"
                className="w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Boxing Rounds
              </span>
              <input
                value={trainingLog.boxingRounds}
                onChange={(e) => updateTraining("boxingRounds", e.target.value)}
                placeholder="6"
                className="w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                Workout Notes
              </span>
              <textarea
                value={trainingLog.workoutNotes}
                onChange={(e) => updateTraining("workoutNotes", e.target.value)}
                placeholder="Stairs, boxing, strength, run, grip work, recovery..."
                className="min-h-[150px] w-full rounded-2xl border border-cyan-400/12 bg-slate-950/50 px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 focus:bg-cyan-400/5"
              />
            </label>
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}