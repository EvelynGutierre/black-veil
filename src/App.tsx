import { useEffect, useMemo, useRef, useState } from "react";
import type { DailyRecord, Directive, TrainingLog } from "./types/app";
import { initialDirectives, initialTrainingLog } from "./utils/initialData";
import AppHeader from "./components/AppHeader";
import AppNav from "./components/AppNav";
import DirectivesTab from "./components/DirectivesTab";
import IntelTab from "./components/IntelTab";
import OverviewTab from "./components/OverviewTab";
import RankAlertModal from "./components/RankAlertModal";
import StatusTab from "./components/StatusTab";
import TrainingTab from "./components/TrainingTab";
import { useAudio } from "./hooks/useAudio";
import { getJobTitle, getRank, getStatusTitle, getStreakBonus, rankOrder, } from "./utils/rankings";
import { tabs } from "./utils/tabs";
import { getTodayWorkout } from "./utils/workouts";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./lib/supabase";

function getStreakMultiplier(streak: number) {
  if (streak >= 7) return 1.5;
  if (streak >=5) return 1.25;
  if (streak >= 3) return 1.1;
  return 1;
}
export default function App() {
  const SYSTEM_START_DATE = "2026-05-01";
  const today = new Date().toISOString().slice(0, 10);
  const isBeforeStart = today < SYSTEM_START_DATE;
  
  useEffect(() => {
    const resetDone = localStorage.getItem("black-veil-launch-reset-done");

    if (today >= SYSTEM_START_DATE && resetDone !== "true") {
      localStorage.removeItem("black-veil-xp");
      localStorage.removeItem("black-veil-directives");
      localStorage.removeItem("black-veil-training-log");
      localStorage.removeItem("black-veil-daily-history");
      localStorage.removeItem("black-veil-dungeon-bonus-date");

      localStorage.setItem("black-veil-launch-reset-done", "true");
      window.location.reload();
    }
  }, [today]);

  const [xp, setXp] = useState<number>(() => {
    if (isBeforeStart) return 0;

    const saved = localStorage.getItem("black-veil-xp");
    const parsed = saved ? JSON.parse(saved) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });

  useEffect(() => {
    localStorage.setItem("black-veil-xp", JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    const loadXP = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, xp")
        .limit(1)
        .single();

      if (error) {
        console.error("Error loading XP:", error);
        return;
      }

      if (data?.xp != null) {
        setXp(data.xp);
      }
    };

    loadXP();
  }, []);

  useEffect(() => {
    const saveXP = async () => {
      const { data: existing, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1)
        .single();

      if (fetchError) {
        console.error("Error finding profile row:", fetchError);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ xp, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error saving XP:", updateError);
      }
    };

    saveXP();
  }, [xp]);

  const [dungeonLocked, setDungeonLocked] = useState(false);
  const [xpPop, setXpPop] = useState<number | null>(null);
  const { playSound } = useAudio();
  const [tab, setTab] = useState("overview");

  const [directives, setDirectives] = useState<Directive[]>(() => {
    const saved = localStorage.getItem("black-veil-directives");
    return saved ? JSON.parse(saved) : initialDirectives;
  });

  const [trainingLog, setTrainingLog] = useState<TrainingLog>(() => {
    const saved = localStorage.getItem("black-veil-training-log");
    return saved ? JSON.parse(saved) : initialTrainingLog;
  });

  const [dailyHistory, setDailyHistory] = useState<DailyRecord[]>(() => {
    const saved = localStorage.getItem("black-veil-daily-history");
    return saved ? JSON.parse(saved) : [];
  });

  const [finalizeMessage, setFinalizeMessage] = useState<string | null>(null);
  const [rankUpAlert, setRankUpAlert] = useState<null | { from: string; to: string }>(null);

  useEffect(() => {
    localStorage.setItem("black-veil-directives", JSON.stringify(directives));
  }, [directives]);

  useEffect(() => {
    localStorage.setItem("black-veil-training-log", JSON.stringify(trainingLog));
  }, [trainingLog]);

  const todayWorkout = getTodayWorkout();

  const completedCount = useMemo(
    () => directives.filter((d) => d.completed).length,
    [directives]
  );

  const completionRate = useMemo(() => {
    if (directives.length === 0) return 0;
    return Math.round((completedCount / directives.length) * 100);
  }, [completedCount, directives.length]);

  const completedIds = useMemo(
    () => directives.filter((d) => d.completed).map((d) => d.id),
    [directives]
  );

  const baseVeil = useMemo(
    () =>
      directives
        .filter((d) => d.completed)
        .reduce((sum, d) => sum + d.reward, 0),
    [directives]
  );

  const currentStreak = useMemo(() => {
    const uniqueDates = [
      today,
      ...new Set(
        dailyHistory
          .map((entry) => entry.date)
          .filter((date) => date !== today)
      ),
    ].sort((a, b) => (a < b ? 1 : -1));

    if (uniqueDates.length === 0) return 0;

    let streak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i += 1) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);

      const diffMs = current.getTime() - next.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  }, [dailyHistory, today]);

  const streakMultiplier = useMemo(() => {
    return getStreakMultiplier(currentStreak);
  }, [currentStreak]);

  const streakBonus = getStreakBonus(currentStreak);
  const totalVeil = baseVeil + streakBonus;

  const rank = useMemo(() => getRank(totalVeil), [totalVeil]);
  const statusTitle = useMemo(() => getStatusTitle(rank), [rank]);
  const jobTitle = useMemo(() => getJobTitle(rank), [rank]);

  const strength = useMemo(() => {
    let score = 5;
    if (completedIds.includes("workout")) score += 4;
    if (completedIds.includes("pushups")) score += 3;
    return Math.min(score, 20);
  }, [completedIds]);

  const grip = useMemo(() => {
    let score = 5;
    if (completedIds.includes("dead_hang")) score += 5;
    return Math.min(score, 20);
  }, [completedIds]);

  const cardio = useMemo(() => {
    let score = 5;
    if (completedIds.includes("run")) score += 4;
    if (completedIds.includes("steps")) score += 3;

    const rounds = Number(trainingLog.boxingRounds || 0);
    if (!Number.isNaN(rounds)) {
      score += Math.min(rounds, 8);
    }

    return Math.min(score, 20);
  }, [completedIds, trainingLog.boxingRounds]);

  const recovery = useMemo(() => {
    let score = 5;

    const sleep = Number(trainingLog.sleep || 0);
    const water = Number(trainingLog.water || 0);

    if (!Number.isNaN(sleep)) {
      if (sleep >= 8) score += 5;
      else if (sleep >= 7) score += 4;
      else if (sleep >= 6) score += 2;
    }

    if (!Number.isNaN(water)) {
      if (water >= 100) score += 4;
      else if (water >= 80) score += 2;
    }

    return Math.min(score, 20);
  }, [trainingLog.sleep, trainingLog.water]);

  const discipline = useMemo(() => {
    let score = 5;
    score += completedCount;
    if (completedIds.includes("wake")) score += 2;
    if (completedIds.includes("no_ordering_out")) score += 1;
    if (completedIds.includes("no_junk")) score += 1;
    return Math.min(score, 20);
  }, [completedCount, completedIds]);

  const endurance = useMemo(() => {
    const score = Math.round((cardio + recovery) / 2);
    return Math.min(score, 20);
  }, [cardio, recovery]);

  const fatigue = useMemo(() => {
    const sleep = Number(trainingLog.sleep || 0);
    const water = Number(trainingLog.water || 0);

    let value = 50;

    if (!Number.isNaN(sleep)) {
      if (sleep >= 8) value -= 20;
      else if (sleep >= 7) value -= 12;
      else if (sleep >= 6) value -= 6;
      else if (sleep > 0) value += 10;
    }

    if (!Number.isNaN(water)) {
      if (water >= 100) value -= 15;
      else if (water >= 80) value -= 8;
      else if (water > 0 && water < 50) value += 8;
    }

    if (completedIds.includes("run")) value += 6;
    if (completedIds.includes("workout")) value += 6;

    return Math.max(0, Math.min(100, value));
  }, [trainingLog.sleep, trainingLog.water, completedIds]);

  const agility = useMemo(() => Math.min(20, cardio), [cardio]);
  const perception = useMemo(() => Math.min(20, discipline), [discipline]);
  const vitality = useMemo(() => Math.min(20, endurance), [endurance]);
  const intelligence = useMemo(() => Math.min(20, recovery), [recovery]);

  const level = useMemo(() => {
    return Math.max(1, Math.floor(totalVeil / 25) + 1);
  }, [totalVeil]);

  const hp = useMemo(() => Math.min(100, 40 + endurance * 3), [endurance]);
  const mp = useMemo(() => Math.min(100, 30 + recovery * 3), [recovery]);
  const statPoints = useMemo(() => totalVeil, [totalVeil]);

  const readinessScore = useMemo(() => {
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          recovery * 4 +
            completionRate * 0.35 +
            (100 - fatigue) * 0.25
        )
      )
    );
  }, [recovery, completionRate, fatigue]);

  const dailyStatus = useMemo(() => {
    if (completedCount === directives.length) return "Round Complete";
    if (completionRate >= 70) return "Holding the Line";
    if (completionRate >= 40) return "Pressure Rising";
    return "Behind Schedule";
  }, [completedCount, directives.length, completionRate]);

  const remainingDirectives = useMemo(
    () => directives.filter((d) => !d.completed),
    [directives]
  );

  const currentDailyRecord = useMemo<DailyRecord>(() => {
    return {
      date: today,
      totalVeil,
      rank,
      jobTitle,
      statusTitle,
      completedCount,
      directivesTotal: directives.length,
      completionRate,
      readinessScore,
      fatigue,
      recovery,
      weight: trainingLog.weight,
      sleep: trainingLog.sleep,
      water: trainingLog.water,
      steps: trainingLog.steps,
      boxingRounds: trainingLog.boxingRounds,
      workoutNotes: trainingLog.workoutNotes,
    };
  }, [
    today,
    totalVeil,
    rank,
    jobTitle,
    statusTitle,
    completedCount,
    directives.length,
    completionRate,
    readinessScore,
    fatigue,
    recovery,
    trainingLog.weight,
    trainingLog.sleep,
    trainingLog.water,
    trainingLog.steps,
    trainingLog.boxingRounds,
    trainingLog.workoutNotes,
  ]);

  const dailyHistoryWithToday = useMemo(() => {
    const withoutToday = dailyHistory.filter((entry) => entry.date !== today);
    return [currentDailyRecord, ...withoutToday];
  }, [dailyHistory, currentDailyRecord, today]);

  const latestSavedRecord = dailyHistoryWithToday[0] ?? null;

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

    const rawDungeonCleared =
      todayWorkout.blocks.length > 0 &&
      completedDungeonBlocks >= Math.ceil(todayWorkout.blocks.length * 0.8);

    const dungeonCleared = rawDungeonCleared || dungeonLocked;
    
    useEffect(() => {
      if (!dungeonCleared) return;

      const currentDate = new Date().toISOString().slice(0, 10);
      const lastBonusDate = localStorage.getItem("black-veil-dungeon-bonus-date");

      if (lastBonusDate === currentDate) return;

      const timer = setTimeout(() => {
        const adjustedDungeonBonus = Math.round(50 * streakMultiplier);

        setXp((current) => current + adjustedDungeonBonus);
        setXpPop(adjustedDungeonBonus);

        localStorage.setItem("black-veil-dungeon-bonus-date", currentDate);
      }, 0);

      return () => clearTimeout(timer);
    }, [dungeonCleared, streakMultiplier]);

  const prevRankRef = useRef(rank);

  useEffect(() => {
    if (prevRankRef.current !== rank) {
      setRankUpAlert({
        from: prevRankRef.current,
        to: rank,
      });

      playSound("/sounds/rank-up.mp3", 1, true);

      prevRankRef.current = rank;
    }
  }, [rank, playSound]);

  useEffect(() => {
    if (!rankUpAlert) return;

    const timer = setTimeout(() => {
      setRankUpAlert(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [rankUpAlert]);

  useEffect(() => {
    localStorage.setItem(
      "black-veil-daily-history",
      JSON.stringify(dailyHistoryWithToday)
    );
  }, [dailyHistoryWithToday]);

  useEffect(() => {
    if (!finalizeMessage) return;

    const timer = setTimeout(() => {
      setFinalizeMessage(null);
    }, 2200);

    return () => clearTimeout(timer);
  }, [finalizeMessage]);

  useEffect(() => {
    const workoutDirective = directives.find((d) => d.id === "workout");
    if (!workoutDirective) return;

    if (!dungeonCleared || workoutDirective.completed) return;

    const timer = setTimeout(() => {
      setDirectives((prev) =>
        prev.map((d) =>
          d.id === "workout" ? { ...d, completed: true } : d
        )
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [directives, dungeonCleared]);

  const rankChangeDirection =
    rankUpAlert && rankOrder[rankUpAlert.to] > rankOrder[rankUpAlert.from]
      ? "up"
      : rankUpAlert && rankOrder[rankUpAlert.to] < rankOrder[rankUpAlert.from]
        ? "down"
        : "same";

  function toggleDirective(id: string) {
    setDirectives((prev) => {
      let xpChange = 0;
      let completedNow = false;

      const updated = prev.map((directive) => {
        if (directive.id !== id) return directive;

        const nextCompleted = !directive.completed;
        completedNow = nextCompleted;

        const adjustedReward = Math.round(directive.reward * streakMultiplier);

        if (nextCompleted) {
          xpChange += adjustedReward;
        } else {
          xpChange -= adjustedReward;
        }

        return {
          ...directive,
          completed: nextCompleted,
        };
      });

      if (xpChange !== 0) {
        setXp((current) => Math.max(0, current + xpChange));
        setXpPop(xpChange);
      }

      setTimeout(() => {
        playSound(
          completedNow ? "/sounds/check-on.mp3" : "/sounds/check-off.mp3",
          0.45,
          false
        );
      }, 0);

      return updated;
    });
  }

  useEffect(() => {
    if (xpPop === null) return;

    const timer = setTimeout(() => {
      setXpPop(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [xpPop]);

  function updateTraining<K extends keyof TrainingLog>(
    key: K,
    value: TrainingLog[K]
  ) {
    setTrainingLog((prev) => ({ ...prev, [key]: value }));
  }

  function finalizeDay() {
    setDailyHistory((prev) => {
      const withoutToday = prev.filter((entry) => entry.date !== today);
      return [currentDailyRecord, ...withoutToday];
    });

    setDungeonLocked(false);

    setFinalizeMessage(
      completedCount === directives.length
        ? "Protocol complete. Day archived."
        : "Protocol updated. Progress locked in."
    );

    playSound("/sounds/rank-up.mp3", 0.45, false);
  }

  const xpPerRank = 100;
  const safeXp = Number.isFinite(xp) ? xp : 0;
  const xpIntoCurrentRank = safeXp % xpPerRank;
  const xpProgressPercent = Math.round((xpIntoCurrentRank / xpPerRank) * 100);

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-3 sm:px-4 md:px-6">
      <div className="mx-auto w-full max-w-screen-xl px-3 py-4 sm:px-4 md:px-6 md:py-8">
        <div className="relative overflow-hidden rounded-[34px] border border-cyan-400/15 bg-[linear-gradient(180deg,rgba(0,8,26,0.96)_0%,rgba(1,10,28,0.98)_100%)] shadow-[0_0_0_1px_rgba(56,189,248,0.05),0_20px_80px_rgba(2,12,40,0.8)]">
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
          <div className="pointer-events-none absolute left-10 top-14 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <AppHeader
            rank={rank}
            totalVeil={totalVeil}
            completedCount={completedCount}
            directivesLength={directives.length}
          />

          <div className="px-5 pt-4 md:px-8">
            <div className="relative flex gap-3">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-xl" />
              
              <AppNav
                tabs={tabs}
                currentTab={tab}
                setTab={setTab}
              />
            </div>
          </div>

          <div className="relative min-h-[78vh] px-5 pb-5 pt-4 md:px-8 md:pb-7 md:pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "overview" && (
                  <OverviewTab
                    totalVeil={totalVeil}
                    completionRate={completionRate}
                    rank={rank}
                    completedCount={completedCount}
                    directives={directives}
                    dailyStatus={dailyStatus}
                    remainingDirectives={remainingDirectives}
                    readinessScore={readinessScore}
                    finalizeDay={finalizeDay}
                    latestSavedRecord={latestSavedRecord}
                    dailyHistory={dailyHistoryWithToday}
                    finalizeMessage={finalizeMessage}
                    currentStreak={currentStreak}
                    todayWorkout={todayWorkout}
                    toggleDirective={toggleDirective}
                    xp={xp}
                    xpIntoCurrentRank={xpIntoCurrentRank}
                    xpPerRank={xpPerRank}
                    xpProgressPercent={xpProgressPercent}
                    xpPop={xpPop}
                    streakMultiplier={streakMultiplier}
                  />
                )}

                {tab === "directives" && (
                  <DirectivesTab
                    directives={directives}
                    toggleDirective={toggleDirective}
                  />
                )}

                {tab === "training" && (
                  <TrainingTab
                    trainingLog={trainingLog}
                    updateTraining={updateTraining}
                  />
                )}

                {tab === "intel" && (
                  <IntelTab
                    strength={strength}
                    endurance={endurance}
                    discipline={discipline}
                    recovery={recovery}
                    grip={grip}
                    cardio={cardio}
                    totalVeil={totalVeil}
                    completedCount={completedCount}
                    directivesLength={directives.length}
                    trainingLog={trainingLog}
                  />
                )}

                {tab === "status" && (
                  <StatusTab
                    level={level}
                    hp={hp}
                    mp={mp}
                    fatigue={fatigue}
                    rank={rank}
                    jobTitle={jobTitle}
                    statusTitle={statusTitle}
                    strength={strength}
                    agility={agility}
                    perception={perception}
                    vitality={vitality}
                    intelligence={intelligence}
                    statPoints={statPoints}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <RankAlertModal
        rankUpAlert={rankUpAlert}
        rankChangeDirection={rankChangeDirection}
        jobTitle={jobTitle}
        statusTitle={statusTitle}
        onClose={() => setRankUpAlert(null)}
      />
    </div>
  );
}