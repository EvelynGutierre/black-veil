import AnimatedNumber from "./AnimatedNumber";
import HoloPanel from "./HoloPanel";
import SectionHeader from "./SectionHeader";
import type { TrainingLog } from "../types/app";

type Props = {
  strength: number;
  endurance: number;
  discipline: number;
  recovery: number;
  grip: number;
  cardio: number;
  totalVeil: number;
  completedCount: number;
  directivesLength: number;
  trainingLog: TrainingLog;
};

export default function IntelTab({
  strength,
  endurance,
  discipline,
  recovery,
  grip,
  cardio,
  totalVeil,
  completedCount,
  directivesLength,
  trainingLog,
}: Props) {
  const completionRate =
    directivesLength === 0
      ? 0
      : Math.round((completedCount / directivesLength) * 100);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="System Analysis"
        title="Intel Dashboard"
        description="Performance metrics and combat readiness evaluation."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <HoloPanel
          title="Core Attributes"
          subtitle="Derived from training and directive completion"
          glow="blue"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Strength", value: strength },
              { label: "Endurance", value: endurance },
              { label: "Discipline", value: discipline },
              { label: "Recovery", value: recovery },
              { label: "Grip", value: grip },
              { label: "Cardio", value: cardio },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-cyan-400/12 bg-slate-950/40 p-4"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  <AnimatedNumber value={stat.value} />
                </p>

                <div className="mt-3 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    style={{ width: `${stat.value * 6}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </HoloPanel>

        <HoloPanel
          title="Operational Status"
          subtitle="Live system evaluation"
          glow="cyan"
        >
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Veil</span>
              <span className="font-medium text-cyan-300">
                <AnimatedNumber value={totalVeil} />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Completion Rate</span>
              <span className="font-medium text-cyan-300">
                {completionRate}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Penalty Risk</span>
              <span className="font-medium text-pink-400">Moderate</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">System Status</span>
              <span className="font-medium text-cyan-300">
                Tracking Active
              </span>
            </div>
          </div>
        </HoloPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <HoloPanel
          title="Body Metrics"
          subtitle="Physical trend tracking"
          glow="blue"
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Weight</span>
              <span className="text-cyan-300">
                {trainingLog.weight || "--"} lbs
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Sleep</span>
              <span className="text-cyan-300">
                {trainingLog.sleep || "--"} hrs
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Hydration</span>
              <span className="text-cyan-300">
                {trainingLog.water || "--"} oz
              </span>
            </div>
          </div>
        </HoloPanel>

        <HoloPanel
          title="Combat Readiness"
          subtitle="Conditioning and field performance"
          glow="cyan"
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Steps</span>
              <span className="text-cyan-300">
                {trainingLog.steps || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Boxing Rounds</span>
              <span className="text-cyan-300">
                {trainingLog.boxingRounds || "--"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Training Status</span>
              <span className="text-cyan-300">Active</span>
            </div>
          </div>
        </HoloPanel>
      </div>
    </div>
  );
}