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
    difficulty?: string;
  }
  xp: number;
  xpIntoCurrentRank: number;
  xpPerRank: number;
  xpProgressPercent: number;
  xpPop: number | null;
  streakMultiplier: number;
  playSound: (src: string, volume?: number, interrupt?: boolean) => void;
  completedBlocks: number[];
  toggleBlock: (index: number) => void;
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
  todayWorkout,
  xp,
  xpIntoCurrentRank,
  xpPerRank,
  xpProgressPercent,
  xpPop,
  streakMultiplier,
  completedBlocks,
  toggleBlock,
}: Props) {

  const completedDungeonBlocks = completedBlocks.length;

  const dungeonTotalBlocks = todayWorkout.blocks.length;
  const dungeonCompletionRate =
    dungeonTotalBlocks === 0 ? 0 : Math.round((completedDungeonBlocks / dungeonTotalBlocks) * 100);

  const dungeonCleared = completedDungeonBlocks === dungeonTotalBlocks;

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
        eyebrow="System Notice"
        title="Daily Quest"
        description="Complete assigned objectives to increase power and rank."
      />

      <div className="grid gap-3 sm:gap-5 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] max-w-full">
        <HoloPanel title="System Status" subtitle="Current operative metrics" glow="cyan">
          <div className="relative mt-5">
            {xpPop !== null && (
              <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
                <div className="animate-[fadeUp_1s_ease-out_forwards] text-base font-bold tracking-[0.2em] text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)]">
                  {xpPop > 0 ? `+${xpPop} XP` : `${xpPop} XP`}
                </div>
              </div>
            )}

            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>Experience Sync</span>
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-3 sm:p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Power
              </p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-cyan-300">
                <AnimatedNumber value={totalVeil} />
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-3 sm:p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Completion</p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-cyan-200">
                {completionRate}%
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-3 sm:p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Rank</p>
              <p className="mt-3 text-3xl sm:text-4xl font-bold text-cyan-200">{rank}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-400">
              <span>Quest progress</span>
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
              Complete Daily Quest
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
          <HoloPanel title="System Notice" subtitle="System Notice" glow="blue">
            <p className="text-base sm:text-lg font-medium text-slate-100">
              {dailyStatus === "Round Complete"
                ? "Quest cleared. System growth confirmed."
                : dailyStatus === "Holding the Line"
                ? "Minimum compliance achieved. Continue progression"
                : dailyStatus === "Pressure Rising"
                ? "User condition unstable. Compliance required."
                : "Penalty risk detected. Resume training immediately."}
            </p>

            <p className="mt-3 text-sm text-slate-400">
              {dailyStatus === "Round Complete"
                ? "All assigned quests are cleared."
                : `${remainingDirectives.length} quests remain under observation.`}
            </p>
          </HoloPanel>

          <div
            className={`relative mb-6 rounded-2xl border px-3 pb-3 pt-16 sm:px-4 sm:pb-4 sm:pt-20 transition-all duration-500 ${
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
            {todayWorkout.difficulty && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-purple-300/70">
                {todayWorkout.difficulty}
              </p>
            )}

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
                const completed = completedBlocks.includes(i);
                  
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggleBlock(i)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-left transition ${
                        completed
                          ? "text-emerald-300 line-through"
                          : "text-slate-200 hover:bg-white/5"
                      }`}
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
        title="Remaining Quests"
        subtitle="Incomplete objectives remain active"
        glow="violet"
      >
        <div className="space-y-3 text-sm">
          {remainingDirectives.length === 0 ? (
            <p className="text-cyan-200">No remaining quests. Daily quest complete.</p>
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
          title="Latest Archive Record"
          subtitle="Most recent system archive"
          glow="blue"
        >
    {latestSavedRecord ? (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Date</p>
          <p className="mt-1 text-cyan-200">{latestSavedRecord.date}</p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/30 px-4 py-3">
          <p className="text-slate-500">Power</p>
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
    title="Recent Archives"
    subtitle="Archived system records"
    glow="blue"
  >
    {dailyHistory.length === 0 ? (
      <p className="text-sm text-slate-500">No records yet.</p>
    ) : (
      <div className="space-y-2">
        {dailyHistory.slice(0, 5).map((entry) => (
          <div
            key={entry.date}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 items-center rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-3 py-3 text-sm"
          >
            <span className="text-slate-300">{entry.date}</span>
            <span
              className={`inline-flex w-10 items-center justify-center rounded-lg border px-2 py-1 text-sm font-semibold ${getRankBadge(entry.rank)}`}
            >
              {entry.rank}
            </span>
            <span className="text-slate-400">{entry.totalVeil} Power</span>
            <span className="text-slate-400">{entry.readinessScore}%</span>
          </div>
        ))}
      </div>
    )}
  </HoloPanel>
  </div>
  
);  
}