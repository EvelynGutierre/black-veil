import HoloPanel from "./HoloPanel";
import SectionHeader from "./SectionHeader";
import AnimatedNumber from "./AnimatedNumber";
import type { DailyRecord, Directive } from "../types/app";
import { getRankBadge } from "../utils/rankings";
import { getStreakStyle } from "../utils/rankings";
import { useEffect, useRef, useState } from "react";

type Props = {
  totalVeil: number;
  completionRate: number;
  rank: string;
  completedCount: number;
  directives: Directive[];
  dailyStatus: string;
  remainingDirectives: Directive[];
  readinessScore: number;
  finalizeDay: () => void;
  finalizeMessage: string | null;
  latestSavedRecord: DailyRecord | null;
  dailyHistory: DailyRecord[];
  currentStreak: number;
  toggleDirective: (id: string) => void;
  todayWorkout: {
    title: string;
    focus: string;
    blocks: string[];
  }
  xp: number;
  xpIntoCurrentRank: number;
  xpPerRank: number;
  xpProgressPercent: number;
  xpPop: number | null;
  streakMultiplier: number;
};

export default function OverviewTab({
  totalVeil,
  completionRate,
  rank,
  completedCount,
  directives,
  dailyStatus,
  remainingDirectives,
  readinessScore,
  finalizeDay,
  finalizeMessage,
  latestSavedRecord,
  dailyHistory,
  currentStreak,
  toggleDirective,
  todayWorkout,
  xp,
  xpIntoCurrentRank,
  xpPerRank,
  xpProgressPercent,
  xpPop,
  streakMultiplier,
}: Props) {
  const completedDungeonBlocks = todayWorkout.blocks.filter((block) => {
  const lower = block.toLowerCase();

    return (
      (lower.includes("run") &&
        directives.some((d) => d.id === "run" && d.completed)) ||

      (lower.includes("push") &&
        directives.some((d) => d.id === "pushups" && d.completed)) ||

      (lower.includes("hang") &&
        directives.some((d) => d.id === "dead_hang" && d.completed)) ||

      (lower.includes("boxing") &&
        directives.some((d) => d.id === "boxing" && d.completed)) ||

      (lower.includes("steps") &&
        directives.some((d) => d.id === "steps" && d.completed)) ||

      ((lower.includes("plank") ||
        lower.includes("glute") ||
        lower.includes("mountain")) &&
        directives.some((d) => d.id === "workout" && d.completed))
    );
  }).length;

  const dungeonTotalBlocks = todayWorkout.blocks.length;
  const dungeonCompletionRate =
    dungeonTotalBlocks === 0
      ? 0
      : Math.round((completedDungeonBlocks / dungeonTotalBlocks) * 100);

  const dungeonCleared = completedDungeonBlocks === dungeonTotalBlocks;

  function getDirectiveIdForBlock(block: string) {
    const lower = block.toLowerCase();

    if (lower.includes("run")) return "run";
    if (lower.includes("push")) return "pushups";
    if (lower.includes("hang")) return "dead_hang";
    if (lower.includes("boxing")) return "boxing";
    if (lower.includes("steps")) return "steps";

    if (
      lower.includes("plank") ||
      lower.includes("glute") ||
      lower.includes("mountain")
    ) {
      return "workout";
    }

    return null;
  }

  const [showDungeonClearBanner, setShowDungeonClearBanner] = useState(false);
    const prevDungeonClearedRef = useRef(dungeonCleared);

    useEffect(() => {
      if (!prevDungeonClearedRef.current && dungeonCleared) {
        setShowDungeonClearBanner(true);

        const timer = setTimeout(() => {
          setShowDungeonClearBanner(false);
        }, 3800);

        prevDungeonClearedRef.current = dungeonCleared;
        return () => clearTimeout(timer);
      }

      prevDungeonClearedRef.current = dungeonCleared;
    }, [dungeonCleared]);


  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Notification"
        title="Mission Overview"
        description="Prepare for today’s protocol and monitor active system output."
      />

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <HoloPanel title="Status" subtitle="Current pursuit metrics" glow="cyan">
          <div className="relative mt-5">
            {xpPop !== null && (
              <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
                <div className="animate-[fadeUp_1s_ease-out_forwards] text-base font-bold tracking-[0.2em] text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)]">
                  {xpPop > 0 ? `+${xpPop} XP` : `${xpPop} XP`}
                </div>
              </div>
            )}

            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>XP Progress</span>
              <span>
                {xpIntoCurrentRank}/{xpPerRank}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-emerald-400/15 bg-slate-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.45)] transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-emerald-300">
              Total XP: {xp}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-300/80">
              Streak Bonus: {streakMultiplier.toFixed(2)}x
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Veil
              </p>
              <p className="mt-3 text-4xl font-bold text-cyan-300">
                <AnimatedNumber value={totalVeil} />
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Completion</p>
              <p className="mt-3 text-4xl font-bold text-cyan-200">
                {completionRate}%
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Rank</p>
              <p className="mt-3 text-4xl font-bold text-cyan-200">{rank}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>Directive Progress</span>
              <span>{completedCount}/{directives.length}</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-cyan-400/15 bg-slate-950/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={finalizeDay}
              className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
            >
              Finalize Protocol
            </button>
          </div>
          <div className="mt-3 text-right">
            {finalizeMessage ? (
              <p className="text-xs text-cyan-300">{finalizeMessage}</p>
            ) : latestSavedRecord ? (
              <p className="text-xs text-emerald-300">
                Auto-synced: {latestSavedRecord.date}
              </p>
            ) : null}
          </div>
        </HoloPanel>

        <div className="space-y-5">
          <HoloPanel title="Notification" subtitle="System broadcast" glow="blue">
            <p className="text-lg font-medium text-slate-100">
              {dailyStatus === "Round Complete"
                ? "Round complete. Maintain your edge."
                : dailyStatus === "Holding the Line"
                ? "Holding the line. Continue pursuit."
                : dailyStatus === "Pressure Rising"
                ? "Pressure rising. Lock back in."
                : "You are behind. Regain control now."}
            </p>

            <p className="mt-3 text-sm text-slate-400">
              {dailyStatus === "Round Complete"
                ? "All directives are cleared."
                : `${remainingDirectives.length} directives remain under observation.`}
            </p>
          </HoloPanel>

          <div
            className={`relative mb-6 rounded-2xl border px-4 pb-4 pt-20 transition-all duration-500 ${
              dungeonCleared
                ? "border-emerald-400/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(52,211,153,0.18)]"
                : "border-purple-400/20 bg-purple-500/5"
            }`}
          >
            {showDungeonClearBanner && (
              <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-[90%] -translate-x-1/2">
                <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-2 text-center backdrop-blur-sm shadow-[0_0_20px_rgba(52,211,153,0.25)] animate-[fadeIn_0.4s_ease-out,glowPulse_1.5s_ease-in-out_infinite]">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-200/70">
                    Mission Update
                  </p>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-300">
                    Dungeon Cleared
                  </p>
                </div>
              </div>
            )}

            <p
              className={`mb-1 text-xs ${
                dungeonCleared ? "text-emerald-300/80" : "text-purple-300/70"
              }`}
            >
              {dungeonCleared ? "DUNGEON CLEARED" : "TODAY'S DUNGEON"}
            </p>

            <h3 className="text-lg font-semibold text-purple-200">
              {todayWorkout.title}
            </h3>

            <p className="mb-3 text-sm text-slate-300">
              {todayWorkout.focus}
            </p>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-purple-200/70">
                <span>{dungeonCleared ? "Dungeon Clear" : "Dungeon Progress"}</span>
                <span>
                  {completedDungeonBlocks}/{dungeonTotalBlocks}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full border border-purple-400/20 bg-slate-950/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    dungeonCleared
                      ? "bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300 animate-pulse"
                      : "bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300"
                  }`}
                  style={{ width: `${dungeonCompletionRate}%` }}
                />
              </div>

              {dungeonCleared && (
                <>
                  <p className="mt-4 text-base font-bold uppercase tracking-[0.28em] text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)]">
                    Dungeon Clear
                  </p>
                  <div className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
                </>
              )}
            </div>

            <ul className="space-y-1 text-sm text-slate-200">
              {todayWorkout.blocks.map((block, i) => {
                const lower = block.toLowerCase();
                const completed =
                  (lower.includes("run") &&
                    directives.some((d) => d.id === "run" && d.completed)) ||

                  (lower.includes("push") &&
                    directives.some((d) => d.id === "pushups" && d.completed)) ||

                  (lower.includes("hang") &&
                    directives.some((d) => d.id === "dead_hang" && d.completed)) ||

                  (lower.includes("boxing") &&
                    directives.some((d) => d.id === "boxing" && d.completed)) ||

                  (lower.includes("steps") &&
                    directives.some((d) => d.id === "steps" && d.completed)) ||

                  ((lower.includes("plank") ||
                    lower.includes("glute") ||
                    lower.includes("mountain")) &&
                    directives.some((d) => d.id === "workout" && d.completed));
                const directiveId = getDirectiveIdForBlock(block);
                  
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        if (directiveId) toggleDirective(directiveId);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition ${
                        completed
                          ? "text-emerald-300 line-through"
                          : "text-slate-200 hover:bg-white/5"
                      } ${directiveId ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span>{completed ? "✓" : "•"}</span>
                      <span>{block}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <HoloPanel title="Tracking Control" subtitle="Operational status" glow="violet">
            <div className="space-y-3 text-sm text-slate-300">
              <p>Protocol State: <span className="text-cyan-300">Active</span></p>
              <p>Hound Unit: <span className="text-cyan-300">Deployed</span></p>
              <p>
                Penalty Watch:{" "}
                <span className="text-pink-300">
                  {remainingDirectives.length === 0 ? "Cleared" : "Enabled"}
                </span>
              </p>
              <p>
                Readiness Score:{" "}
                <span className="text-cyan-300">
                  <AnimatedNumber value={readinessScore} /> / 100
                </span>
              </p>
              <p>
                Streak:{" "} 
                <span className={getStreakStyle(currentStreak)}>
                  {currentStreak} day{currentStreak === 1 ? "" : "s"}
                </span>
              </p>
            </div>
          </HoloPanel>
        </div>
      </div>

      <HoloPanel
        title="Remaining Directives"
        subtitle="Unfinished tasks still active"
        glow="violet"
      >
        <div className="space-y-3 text-sm">
          {remainingDirectives.length === 0 ? (
            <p className="text-cyan-200">No remaining directives. Round complete.</p>
          ) : (
            remainingDirectives.slice(0, 5).map((directive) => (
              <div
                key={directive.id}
                className="flex items-center justify-between rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3"
              >
                <span className="text-slate-200">{directive.title}</span>
                <span className="text-cyan-300">+{directive.reward}</span>
              </div>
            ))
          )}
        </div>
      </HoloPanel>
      <HoloPanel
          title="Latest Saved Record"
          subtitle="Most recent archived day"
          glow="blue"
        >
    {latestSavedRecord ? (
      <div className="grid gap-3 md:grid-cols-2 text-sm">
        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Date</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.date}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Veil</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.totalVeil}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Rank</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.rank}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Readiness</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.readinessScore}/100</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Fatigue</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.fatigue}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Completion</p>
          <p className="mt-1 text-cyan-200">
            {latestSavedRecord.completedCount}/{latestSavedRecord.directivesTotal}
          </p>
        </div>
      </div>
    ) : (
      <p className="text-sm text-slate-400">
        No daily record saved yet.
      </p>
    )}
  </HoloPanel>
  <HoloPanel
    title="Recent Logs"
    subtitle="Archived pursuit records"
    glow="blue"
  >
    {dailyHistory.length === 0 ? (
      <p className="text-sm text-slate-500">No records yet.</p>
    ) : (
      <div className="space-y-2">
        {dailyHistory.slice(0, 5).map((entry) => (
          <div
            key={entry.date}
            className="grid grid-cols-4 items-center rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 text-sm"
          >
            <span className="text-slate-300">{entry.date}</span>
            <span
              className={`inline-flex w-10 items-center justify-center rounded-lg border px-2 py-1 text-sm font-semibold ${getRankBadge(entry.rank)}`}
            >
              {entry.rank}
            </span>
            <span className="text-slate-400">{entry.totalVeil} Veil</span>
            <span className="text-slate-400">{entry.readinessScore}%</span>
          </div>
        ))}
      </div>
    )}
  </HoloPanel>
  </div>
  
);  
}