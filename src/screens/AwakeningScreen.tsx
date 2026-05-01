import { useEffect, useState } from "react";
import LevelUpPopup from "../components/LevelUpPopup";

type ScreenState =
  | "profileSelect"
  | "baseline"
  | "monthlyCheck"
  | "notification"
  | "welcome"
  | "quest"
  | "rewards"
  | "status"
  | "dashboard"
  | "workout"
  | "onboarding";

type Quest = {
  name: string;
  current: number;
  goal: number;
  category: string;
  xp: number;
};

type Stats = {
  STR: number;
  AGI: number;
  PER: number;
  VIT: number;
  INT: number;
};

type BodyMetrics = {
  height: string;
  weight: string;
  shoulders: string;
  chest: string;
  waist: string;
  belly: string;
  leftArm: string;
  rightArm: string;
  leftLeg: string;
  rightLeg: string;
};

type WorkoutTask = {
  id: string;
  label: string;
  required: boolean;
};

type SaveData = {
  playerName?: string;
  baseline?: BodyMetrics;
  monthEnd: BodyMetrics;
  level?: number;
  xp?: number;
  points?: number;
  statPoints?: number;
  stats?: Stats;
  streak?: number;
  lastOpenedDate?: string | null;
  lastCompletedDate?: string | null;
  completedToday?: boolean;
  dailyRewardClaimed?: boolean;
  missedYesterday?: boolean;
  hasOnboarded?: boolean;
  quests?: Quest[];
};

type SystemMessage = {
  title: string;
  body: string;
};

const defaultBodyMetrics: BodyMetrics = {
  height: "",
  weight: "",
  shoulders: "",
  chest: "",
  waist: "",
  belly: "",
  leftArm: "",
  rightArm: "",
  leftLeg: "",
  rightLeg: "",
};

const DEV_MODE = false;
const CLAIM_THRESHOLD = 0.8;

const defaultQuests: Quest[] = [
  { name: "Drink 3L Water", current: 0, goal: 3, category: "RECOVERY", xp: 15 },
  { name: "No Soda / Sugary Drinks", current: 0, goal: 1, category: "DISCIPLINE", xp: 15 },
  { name: "No Junk Food / Snacking", current: 0, goal: 1, category: "DISCIPLINE", xp: 15 },
  { name: "Prepared Clean Meals", current: 0, goal: 1, category: "NUTRITION", xp: 20 },
  { name: "Protein Goal 100g+", current: 0, goal: 100, category: "NUTRITION", xp: 25 },
  { name: "10K Steps", current: 0, goal: 10000, category: "ACTIVITY", xp: 25 },
  { name: "30 Min Run / Cardio", current: 0, goal: 30, category: "ENDURANCE", xp: 30 },
  { name: "Strength Training", current: 0, goal: 1, category: "STRENGTH", xp: 35 },
  { name: "Core Training", current: 0, goal: 1, category: "CORE", xp: 20 },
  { name: "Cold Shower", current: 0, goal: 1, category: "DISCIPLINE", xp: 10 },
  { name: "Read / Journal", current: 0, goal: 1, category: "MIND", xp: 15 },
  { name: "Sleep 7+ Hours", current: 0, goal: 7, category: "RECOVERY", xp: 20 },
];

const defaultStats: Stats = {
  STR: 10,
  AGI: 10,
  PER: 10,
  VIT: 10,
  INT: 10,
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getActivePlayer() {
  return localStorage.getItem("active-player") || "player-one";
}

function getSaveKey(player: string) {
  return `arise-protocol-save-${player}`;
}

function getSavedData(player = getActivePlayer()): SaveData | null {
  try {
    const savedData = localStorage.getItem(getSaveKey(player));
    return savedData ? JSON.parse(savedData) : null;
  } catch {
    return null;
  }
}

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export default function AwakeningScreen() {
  const [activePlayer, setActivePlayer] = useState(getActivePlayer());
  const savedData = getSavedData(activePlayer);
  const [playerName, setPlayerName] = useState(savedData?.playerName ?? "");
  const [baseline, setBaseline] = useState<BodyMetrics>(
    savedData?.baseline ?? defaultBodyMetrics
  );
  const [monthEnd, setMonthEnd] = useState<BodyMetrics>(
    savedData?.monthEnd ?? defaultBodyMetrics
  );
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const todayString = getToday();

  const savedLastOpenedDate = savedData?.lastOpenedDate ?? todayString;
  const savedLastCompletedDate = savedData?.lastCompletedDate ?? null;

  const isNewDay = savedLastOpenedDate !== todayString;

  const missedDay = Boolean(
    isNewDay &&
      savedData?.dailyRewardClaimed !== true
  );

  const [screen, setScreen] = useState<ScreenState>(
    savedData?.hasOnboarded ? "dashboard" : "profileSelect"
  );

  const [hasOnboarded, setHasOnboarded] = useState(
    savedData?.hasOnboarded ?? false
  );

  const [quests, setQuests] = useState<Quest[]>(
    isNewDay ? defaultQuests : savedData?.quests ?? defaultQuests
  );

  const [stats, setStats] = useState<Stats>(savedData?.stats ?? defaultStats);
  const [statPoints, setStatPoints] = useState(savedData?.statPoints ?? 3);

  const [level, setLevel] = useState(savedData?.level ?? 1);
  const [xp, setXp] = useState(savedData?.xp ?? 0);
  const [points, setPoints] = useState(savedData?.points ?? 0);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [systemFlash, setSystemFlash] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);
  const [systemMessage, setSystemMessage] = useState<SystemMessage | null>(null);

  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(
    isNewDay ? false : savedData?.dailyRewardClaimed ?? false
  );

  const [streak, setStreak] = useState(missedDay ? 0 : savedData?.streak ?? 0);

  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(
    savedLastCompletedDate
  );

  const [lastOpenedDate, setLastOpenedDate] = useState<string | null>(
    isNewDay ? todayString : savedLastOpenedDate
  );

  const [completedToday, setCompletedToday] = useState(
    isNewDay ? false : savedData?.completedToday ?? false
  );

  const [missedYesterday, setMissedYesterday] = useState(
    missedDay ? true : savedData?.missedYesterday ?? false
  );

  const [activeWorkout, setActiveWorkout] = useState<Quest | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedWorkoutItems, setCompletedWorkoutItems] = useState<string[]>([]);

  const xpNeeded = getXpNeeded();
  const xpPercent = Math.min((xp / xpNeeded) * 100, 100);

  const completedQuestCount = quests.filter((q) => q.current >= getGoal(q)).length;
  const completionRatio = quests.length > 0 ? completedQuestCount / quests.length : 0;
  const canClaimRewards = completionRatio >= CLAIM_THRESHOLD;
  const allComplete = quests.every((q) => q.current >= getGoal(q));
  const [rankUpMessage, setRankUpMessage] = useState<string | null>(null);

  const availableQuestXp = quests.reduce(
    (total, quest) =>
      quest.current >= getGoal(quest) ? total + getQuestXp(quest) : total,
    0
  );

  const fullQuestXp = quests.reduce((total, quest) => total + getQuestXp(quest), 0);

  const rewardMode = allComplete
    ? "FULL CLEAR"
    : canClaimRewards
    ? "PARTIAL CLEAR"
    : "LOCKED";

  const todayProtocol = getTodayProtocol();

  const morningWorkoutComplete = quests.some(
    (q) => q.name === todayProtocol.questName && q.current >= getGoal(q)
  );

  const workoutTasks = activeWorkout ? getWorkoutMission(activeWorkout.name) : [];
  const requiredWorkoutTasks = workoutTasks.filter((task) => task.required);
  const optionalWorkoutTasks = workoutTasks.filter((task) => !task.required);

  const isWorkoutComplete =
    requiredWorkoutTasks.length > 0 &&
    requiredWorkoutTasks.every((task) => completedWorkoutItems.includes(task.id));

  function triggerRankUpMessage(newLevel: number) {
    const message = `${getRankDisplay(newLevel)} • ${getRankTitle(newLevel)}`;

    setRankUpMessage(message);
    playSound("rank-up");

    setTimeout(() => {
      setRankUpMessage(null);
    }, 2400);
  }

  function playSound(sound: "click" | "complete" | "level-up" | "error" | "rank-up") {
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.volume = 0.45;
    audio.play().catch(() => {});
  }

  function triggerSystemFlash(sound?: "click" | "complete" | "level-up" | "error") {
    if (sound) playSound(sound);

    setSystemFlash(true);

    setTimeout(() => {
      setSystemFlash(false);
    }, 650);
  }

  function showSystemMessage(title: string, body: string) {
    setSystemMessage({ title, body });

    setTimeout(() => {
      setSystemMessage(null);
    }, 2200);
  }

  function getTodayProtocol() {
    const day = new Date().getDay();

    if (day === 1) {
      return {
        dayName: "MONDAY",
        title: "RUN + CORE",
        questName: "30 Min Run / Cardio",
      };
    }

    if (day === 3) {
      return {
        dayName: "WEDNESDAY",
        title: "RUN + STRENGTH",
        questName: "30 Min Run / Cardio",
      };
    }

    return {
      dayName: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ][day],
      title: "MORNING STRENGTH PROTOCOL",
      questName: "Strength Training",
    };
  }

  function getSystemStatus() {
    if (missedYesterday) return "WARNING: MISSED DAY";
    if (completedToday || dailyRewardClaimed) return "CLEARED";
    if (morningWorkoutComplete) return "IN PROGRESS";
    if (streak >= 3) return "STREAK ACTIVE";
    return "AWAITING MISSION";
  }

  function startMorningProtocol() {
    const quest = quests.find((q) => q.name === todayProtocol.questName);

    if (!quest) {
      triggerSystemFlash("error");
      return;
    }

    setActiveWorkout(quest);
    setTimer(getWorkoutDuration(quest));
    setCompletedWorkoutItems([]);
    setScreen("workout");
    playSound("click");
  }

  function getXpNeeded(levelNumber = level) {
    return levelNumber * 100;
  }

  function getRankLetter(level: number) {
    if (level >= 70) return "MONARCH";
    if (level >= 50) return "S";
    if (level >= 35) return "A";
    if (level >= 20) return "B";
    if (level >= 10) return "C";
    if (level >= 5) return "D";
    return "E";
  }

  function getRankTitle(level: number) {
    if (level >= 70) return "Shadow Monarch";
    if (level >= 50) return "Sovereign Hunter";
    if (level >= 35) return "Strike Commander";
    if (level >= 20) return "Vanguard Hunter";
    if (level >= 10) return "Field Hunter";
    if (level >= 5) return "Initiate Hunter";
    return "Awakened";
  }

  function getRankDisplay(level: number) {
    const letter = getRankLetter(level);
    const title = getRankTitle(level);

    if (letter === "MONARCH") return title;
    return `${letter}-Rank`;
  }

  function getDifficultyTier() {
    if (streak >= 21) return "MONARCH";
    if (streak >= 14) return "ELITE";
    if (streak >= 7) return "ADVANCED";
    return "BASE";
  }

  function getProgressionBonus() {
    return Math.floor(streak / 7) * 5 + Math.floor(level / 5) * 2;
  }

  function getGoal(quest: Quest) {
    const penaltyMultiplier = missedYesterday ? 1.5 : 1;
    return Math.round(quest.goal * penaltyMultiplier);
  }

  function getIncrement(quest: Quest) {
    if (quest.goal === 1) return 1;
    if (quest.name.includes("Steps")) return 1000;
    if (quest.name.includes("Water")) return 1;
    if (quest.name.includes("Protein")) return 25;
    if (quest.name.includes("Run") || quest.name.includes("Cardio")) return 5;
    if (quest.name.includes("Sleep")) return 1;
    return 1;
  }

  function getStatBonus() {
    return {
      strengthXp: Math.max(0, Math.floor((stats.STR - 10) * 1.5)),
      enduranceXp: Math.max(0, Math.floor((stats.VIT - 10) * 1.2)),
      disciplineXp: Math.max(0, Math.floor((stats.PER - 10) * 1)),
      mindXp: Math.max(0, Math.floor((stats.INT - 10) * 1)),
      agilityXp: Math.max(0, Math.floor((stats.AGI - 10) * 1.2)),
    };
  }

  function getBonusXpForQuest(quest: Quest) {
    const bonus = getStatBonus();

    if (quest.category === "STRENGTH" || quest.category === "CORE") {
      return bonus.strengthXp;
    }

    if (quest.category === "ENDURANCE" || quest.category === "ACTIVITY") {
      return bonus.enduranceXp + bonus.agilityXp;
    }

    if (quest.category === "DISCIPLINE") {
      return bonus.disciplineXp;
    }

    if (quest.category === "MIND") {
      return bonus.mindXp;
    }

    return 0;
  }

  function getStreakXpMultiplier() {
    return 1 + Math.min(streak * 0.03, 0.45);
  }

  function getQuestXp(quest: Quest) {
    const baseXp = quest.xp + getBonusXpForQuest(quest);
    return Math.max(1, Math.floor(baseXp * getStreakXpMultiplier()));
  }

  function formatQuestProgress(quest: Quest) {
    const goal = getGoal(quest);

    if (goal === 1) return quest.current >= 1 ? "[✔]" : "[ ]";
    if (quest.name.includes("Water")) return `[${quest.current}/${goal}L]`;
    if (quest.name.includes("Run") || quest.name.includes("Cardio")) {
      return `[${quest.current}/${goal}min]`;
    }
    if (quest.name.includes("Protein")) return `[${quest.current}/${goal}g]`;
    if (quest.name.includes("Sleep")) return `[${quest.current}/${goal}hrs]`;

    return `[${quest.current}/${goal}]`;
  }

  function getWorkoutDetails(name: string) {
    if (name === "Strength Training") {
      return ["Push-ups, squats/lunges, press/rows, finisher"];
    }

    if (name === "Core Training") {
      return ["Plank, leg raises, Russian twists, mountain climbers"];
    }

    if (name.includes("Run") || name.includes("Cardio")) {
      return ["Run, incline walk, stairmaster, bike, or long walk"];
    }

    return [];
  }

  function getWorkoutMission(name: string): WorkoutTask[] {
    const bonus = getProgressionBonus();
    const tier = getDifficultyTier();

    if (name === "Strength Training") {
      return [
        { id: "pushups", label: `${20 + bonus} Push-ups`, required: true },
        { id: "squats", label: `${25 + bonus} Squats`, required: true },
        { id: "lunges", label: `${20 + bonus} Lunges`, required: true },
        { id: "press-rows", label: `${15 + bonus} Shoulder Press / Rows`, required: true },
        { id: "burpees", label: `${10 + Math.floor(bonus / 2)} Burpees`, required: true },
        { id: "tier", label: `Difficulty Tier: ${tier}`, required: false },
      ];
    }

    if (name === "Core Training") {
      return [
        { id: "plank", label: `${45 + bonus} sec Plank`, required: true },
        { id: "situps", label: `${20 + bonus} Sit-ups`, required: true },
        { id: "leg-raises", label: `${20 + bonus} Leg Raises`, required: true },
        { id: "twists", label: `${30 + bonus} Russian Twists`, required: true },
        { id: "climbers", label: `${30 + bonus} Mountain Climbers`, required: true },
        { id: "tier", label: `Difficulty Tier: ${tier}`, required: false },
      ];
    }

    if (name.includes("Run") || name.includes("Cardio")) {
      return [
        {
          id: "cardio-block",
          label: `${30 + Math.floor(bonus / 2)} min run, incline walk, stairmaster, bike, or long walk`,
          required: true,
        },
        { id: "move", label: "Keep moving until timer ends", required: false },
        { id: "breathing", label: "Focus on breathing and steady pace", required: false },
        { id: "tier", label: `Difficulty Tier: ${tier}`, required: false },
      ];
    }

    return [
      {
        id: "mission",
        label: "Complete the timer to clear this mission.",
        required: true,
      },
    ];
  }

  function getWorkoutDuration(quest: Quest) {
    if (quest.name.includes("Run") || quest.name.includes("Cardio")) return 1800;
    return 900;
  }

  function increaseProgress(index: number) {
    setQuests((current) =>
      current.map((q, i) => {
        if (i !== index) return q;

        return {
          ...q,
          current: Math.min(q.current + getIncrement(q), getGoal(q)),
        };
      })
    );

    showSystemMessage("SYSTEM", "Quest progress updated.");
    triggerSystemFlash("click");
  }

  function decreaseProgress(index: number) {
    setQuests((current) =>
      current.map((q, i) => {
        if (i !== index) return q;

        return {
          ...q,
          current: Math.max(q.current - getIncrement(q), 0),
        };
      })
    );

    triggerSystemFlash("error");
  }

  function handleQuestClick(index: number) {
    const quest = quests[index];

    if (
      quest.name === "30 Min Run / Cardio" ||
      quest.name === "Strength Training" ||
      quest.name === "Core Training"
    ) {
      setActiveWorkout(quest);
      setTimer(getWorkoutDuration(quest));
      setCompletedWorkoutItems([]);
      setScreen("workout");
      playSound("click");
      return;
    }

    increaseProgress(index);
  }

  function increaseStat(stat: keyof Stats) {
    if (statPoints <= 0) return;

    setStats((current) => ({
      ...current,
      [stat]: current[stat] + 1,
    }));

    setStatPoints((current) => current - 1);
    triggerSystemFlash("click");
  }

  function gainXp(amount: number) {
    setXp((currentXp) => {
      let nextXp = currentXp + amount;
      let levelsGained = 0;
      let needed = getXpNeeded(level + levelsGained);

      while (nextXp >= needed) {
        nextXp -= needed;
        levelsGained += 1;
        needed = getXpNeeded(level + levelsGained);
      }

      setXpAnimating(true);
      setTimeout(() => setXpAnimating(false), 400);

      if (levelsGained > 0) {
        setLevel((currentLevel) => {
          const newLevel = currentLevel + levelsGained;

          if (getRankLetter(newLevel) !== getRankLetter(currentLevel)) {
            triggerRankUpMessage(newLevel);
          }

          return newLevel;
        });

        setPoints((currentPoints) => currentPoints + levelsGained * 3);
        setStatPoints((currentPoints) => currentPoints + levelsGained * 3);

        setShowLevelUp(true);
        triggerSystemFlash("level-up");

        setTimeout(() => {
          setShowLevelUp(false);
        }, 2200);
      }

      return nextXp;
    });
  }

  function claimRewards() {
    if (!canClaimRewards || dailyRewardClaimed) {
      triggerSystemFlash("error");
      return;
    }

    const today = getToday();

    if (lastCompletedDate !== today) {
      setStreak((current) => (allComplete ? current + 1 : current));
      setLastCompletedDate(today);
    }

    gainXp(availableQuestXp);

    setXpPopup(availableQuestXp);

    setTimeout(() => {
      setXpPopup(null);
    }, 1800);

    setStatPoints((current) => current + (allComplete ? 3 : 1));

    setMissedYesterday(false);
    setDailyRewardClaimed(true);
    setCompletedToday(allComplete);
    setScreen("status");
    showSystemMessage("REWARD ACQUIRED", `+${availableQuestXp} XP gained.`);
    triggerSystemFlash("complete");
  }

  function completeWorkoutQuest() {
    if (!activeWorkout) return;

    if (!isWorkoutComplete && timer > 0) {
      triggerSystemFlash("error");
      return;
    }

    setQuests((current) =>
      current.map((q) =>
        q.name === activeWorkout.name
          ? {
              ...q,
              current: getGoal(q),
            }
          : q
      )
    );

    setScreen("quest");
    setActiveWorkout(null);
    setCompletedWorkoutItems([]);
    setTimer(0);
    setIsRunning(false);
    showSystemMessage("MISSION CLEAR", `${activeWorkout.name} completed.`);
    triggerSystemFlash("complete");
  }

  function toggleWorkoutItem(taskId: string, required: boolean) {
    if (!required) return;

    setCompletedWorkoutItems((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );

    playSound("click");
  }

  function getRankClass(level: number) {
    if (level >= 70) return "rank-monarch";
    if (level >= 50) return "rank-s";
    if (level >= 35) return "rank-a";
    if (level >= 20) return "rank-b";
    if (level >= 10) return "rank-c";
    if (level >= 5) return "rank-d";
    return "rank-e";
  }

  function getDifference(start: string, current: string) {
    const startNum = Number(start);
    const currentNum = Number(current);

    if (!start || !current || Number.isNaN(startNum) || Number.isNaN(currentNum)) {
      return "--";
    }

    const diff = currentNum - startNum;

    if (diff > 0) return `+${diff.toFixed(1)}`;
    if (diff < 0) return `${diff.toFixed(1)}`;
    return "0";
  }

  useEffect(() => {
    if (!isNewDay) return;

    const resetTimer = window.setTimeout(() => {
      setQuests(defaultQuests);
      setDailyRewardClaimed(false);
      setCompletedToday(false);
      setMissedYesterday(missedDay);
      setLastOpenedDate(todayString);

      if (missedDay) {
        setStreak(0);
        showSystemMessage("SYSTEM WARNING", "Previous daily quest was not cleared.");
        triggerSystemFlash("error");
      } else {
        showSystemMessage("SYSTEM", "New daily quest generated.");
      }
    }, 0);

    return () => window.clearTimeout(resetTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saveData: SaveData = {
      playerName,
      baseline,
      monthEnd,
      level,
      xp,
      points,
      statPoints,
      stats,
      streak,
      lastOpenedDate,
      lastCompletedDate,
      completedToday,
      dailyRewardClaimed,
      missedYesterday,
      hasOnboarded,
      quests,
    };

    localStorage.setItem(getSaveKey(activePlayer), JSON.stringify(saveData));
  }, [
    activePlayer,
    playerName,
    baseline,
    monthEnd,
    level,
    xp,
    points,
    statPoints,
    stats,
    streak,
    lastOpenedDate,
    lastCompletedDate,
    completedToday,
    dailyRewardClaimed,
    missedYesterday,
    hasOnboarded,
    quests,
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setIsRunning(false);
          playSound("complete");
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div
      className={`system-root ${
        screen !== "notification" ? "is-awakening" : ""
      } ${getRankClass(level)} ${streak >= 3 ? "streak-aura" : ""}`}
    >
      <LevelUpPopup show={showLevelUp} level={level} />

      {systemFlash && <div className="system-flash" />}

      {xpPopup !== null && (
        <div className="xp-popup">
          <p>EXPERIENCE ACQUIRED</p>
          <h2>+{xpPopup} XP</h2>
        </div>
      )}

      {systemMessage && (
        <div className="system-message-popup">
          <p>{systemMessage.title}</p>
          <h2>{systemMessage.body}</h2>
        </div>
      )}

      <div className="system-grid" />
      <div className="system-energy" />
      <div className="system-rail top" />
      <div className="system-rail bottom" />
      <div className="system-side left" />
      <div className="system-side right" />

      <div className="system-window">
        <div className="system-frame" />
        <div className="monarch-silhouette">
          <div className="monarch-head" />
          <div className="monarch-body" />
          <div className="monarch-wing left-wing" />
          <div className="monarch-wing right-wing" />
        </div>
        <div className="shadow-gate" />
        <div className="shadow-orb orb-one" />
        <div className="shadow-orb orb-two" />

        <div className="system-runes">
          <span>戦え</span>
          <span>PLAYER</span>
          <span>MILITARE</span>
        </div>

        <div className="aura-panel left-aura">DISCIPLINE</div>
        <div className="aura-panel right-aura">{getRankTitle(level)}</div>
        <div className="shadow-silhouette left-shadow" />
        <div className="shadow-silhouette right-shadow" />

        <div className="brand-lockup">
          <img src="/logo.svg" className="brand-logo-img" alt="Arise Protocol logo" />

          <div>
            <p>ARISE PROTOCOL</p>
            <span>VIVERE EST MILITARE</span>
          </div>
        </div>

        <div className="system-header">
          <span className="system-icon">!</span>

          <span className="system-title">
            {screen === "quest"
              ? "QUEST INFO"
              : screen === "welcome"
              ? "SYSTEM ONLINE"
              : screen === "dashboard"
              ? "SYSTEM"
              : screen === "workout"
              ? "WORKOUT MODE"
              : "NOTIFICATION"}
          </span>
        </div>

        {screen === "profileSelect" && (
          <div className="onboarding-screen">
            <h1>ARISE PROTOCOL</h1>
            <p className="onboarding-subtitle">System ready. Awaiting user.</p>

            <button
              className="pulse-btn"
              onClick={() => {
                localStorage.setItem("active-player", "default");
                setActivePlayer("default");
                setScreen("baseline");
                triggerSystemFlash("complete");
              }}
            >
              ENTER SYSTEM
            </button>
          </div>
        )}

        {screen === "baseline" && (
          <div className="onboarding-screen">
            <h1>INITIAL SCAN</h1>
            <p className="onboarding-subtitle">Enter your starting measurements.</p>

            <input
              className="system-input"
              placeholder="Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            {Object.entries(baseline).map(([key, value]) => (
              <input
                key={key}
                className="system-input"
                placeholder={formatLabel(key).toUpperCase()}
                value={value}
                onChange={(e) =>
                  setBaseline((current) => ({
                    ...current,
                    [key]: e.target.value,
                  }))
                }
              />
            ))}

            <button
              className="quest-complete-btn"
              onClick={() => {
                setHasOnboarded(true);
                setScreen("onboarding");
                triggerSystemFlash("complete");
              }}
            >
              CONFIRM BASELINE
            </button>
          </div>
        )}

        {screen === "onboarding" && (
          <div className="onboarding-screen">
            <h1>SOLO SYSTEM</h1>
            <p className="onboarding-subtitle">Build your training protocol.</p>

            <div className="onboarding-card">
              <span>BUILD GOAL</span>
              <b>Korra × Bloodhounds</b>
            </div>

            <div className="onboarding-card">
              <span>PRIMARY PURPOSE</span>
              <b>Firefighter Readiness</b>
            </div>

            <div className="onboarding-card">
              <span>FOCUS</span>
              <b>Fat Loss / Strength / Endurance / Discipline</b>
            </div>

            <button
              className="quest-complete-btn"
              onClick={() => {
                setHasOnboarded(true);
                setScreen("notification");
                triggerSystemFlash("complete");
              }}
            >
              GENERATE SYSTEM
            </button>
          </div>
        )}

        {screen === "notification" && (
          <>
            <div className="system-content">
              <p>You have acquired the qualifications</p>
              <h2>to become a Player.</h2>
              <p>Will you accept?</p>
            </div>

            <div className="system-actions">
              <button
                className="system-btn"
                onClick={() => {
                  triggerSystemFlash("complete");
                  setScreen("welcome");
                }}
              >
                YES
              </button>

              <button
                className="system-btn secondary"
                onClick={() => triggerSystemFlash("error")}
              >
                NO
              </button>
            </div>
          </>
        )}

        {screen === "welcome" && (
          <button
            className="system-awakened"
            onClick={() => {
              triggerSystemFlash("complete");
              setScreen("quest");
            }}
          >
            <h1>WELCOME, PLAYER.</h1>
            <p>[Combat Conditioning Protocol has arrived.]</p>
          </button>
        )}

        {screen === "quest" && (
          <div className="quest-screen">
            <button className="back-btn" onClick={() => setScreen("dashboard")}>
              ← BACK
            </button>

            {missedYesterday && !completedToday && (
              <p className="quest-warning">
                PENALTY: You failed to complete yesterday’s quest.
              </p>
            )}

            <p className="quest-arrived">
              [SYSTEM PROTOCOL: HYBRID COMBAT / FIREGROUND CONDITIONING]
            </p>

            <h2 className="quest-goal">GOAL</h2>

            <div className="quest-summary">
              <div>
                <span>QUESTS</span>
                <b>
                  {completedQuestCount}/{quests.length}
                </b>
              </div>

              <div>
                <span>REWARD</span>
                <b>
                  +{availableQuestXp}/{fullQuestXp} XP
                </b>
              </div>

              <div>
                <span>CLEAR</span>
                <b>{rewardMode}</b>
              </div>
            </div>

            {!completedToday && (
              <>
                <div className="quest-list">
                  {quests.map((quest, index) => {
                    const completed = quest.current >= getGoal(quest);

                    return (
                      <div
                        key={`${quest.name}-${index}`}
                        className={`quest-item ${completed ? "completed" : ""}`}
                      >
                        <span>
                          <small className="quest-category">{quest.category}</small>
                          {quest.name}

                          {getWorkoutDetails(quest.name).length > 0 && (
                            <small className="quest-detail">
                              {getWorkoutDetails(quest.name)[0]}
                            </small>
                          )}
                        </span>

                        <span className="quest-progress">
                          {formatQuestProgress(quest)}
                        </span>

                        <button
                          className="system-btn secondary quest-mini-btn"
                          onClick={() => handleQuestClick(index)}
                        >
                          +
                        </button>

                        <button
                          className="system-btn secondary quest-mini-btn danger"
                          onClick={() => decreaseProgress(index)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="system-directive-box">
                  <p className="quest-arrived">[System Directive]</p>

                  <div className="directive-grid">
                    <div>
                      <span>BUILD</span>
                      <b>Korra × Bloodhounds</b>
                    </div>

                    <div>
                      <span>PURPOSE</span>
                      <b>Firefighter Readiness</b>
                    </div>

                    <div>
                      <span>TODAY</span>
                      <b>
                        {todayProtocol.dayName}: {todayProtocol.title}
                      </b>
                    </div>

                    <div>
                      <span>MODE</span>
                      <b>Morning Protocol</b>
                    </div>
                  </div>
                </div>
              </>
            )}

            {canClaimRewards && !dailyRewardClaimed && (
              <button className="quest-complete-btn" onClick={() => setScreen("rewards")}>
                {allComplete ? "QUEST COMPLETE" : "CLAIM PARTIAL REWARD"}
              </button>
            )}

            {!canClaimRewards && !completedToday && (
              <p className="quest-lock-note">
                Complete at least 80% of quests to claim partial rewards.
              </p>
            )}

            {dailyRewardClaimed && (
              <p className="quest-arrived">
                [Rewards claimed. Continue progress or return tomorrow.]
              </p>
            )}

            <p className="quest-warning">
              WARNING: Failure to complete the daily quest will result in an appropriate{" "}
              <b>penalty.</b>
            </p>
          </div>
        )}

        {screen === "rewards" && (
          <div className="reward-screen">
            <button className="back-btn" onClick={() => setScreen("dashboard")}>
              ← BACK
            </button>

            <h2>QUEST REWARDS</h2>

            <div className="reward-list">
              <p>1. Clear Status: {rewardMode}</p>
              <p>2. Experience +{availableQuestXp}</p>
              <p>3. Ability Points +{allComplete ? 3 : 1}</p>
              <p>4. Streak {allComplete ? "+1" : "unchanged"}</p>
            </div>

            <p>Accept these rewards?</p>

            <div className="system-actions">
              <button className="system-btn" onClick={claimRewards}>
                YES
              </button>

              <button className="system-btn secondary" onClick={() => setScreen("quest")}>
                NO
              </button>
            </div>
          </div>
        )}

        {screen === "status" && (
          <div className="status-screen">
            <button className="back-btn" onClick={() => setScreen("dashboard")}>
              ← BACK
            </button>

            <h2>STATUS</h2>

            <div className="status-top">
              <div>
                <p className="status-level">{level}</p>
                <p>LEVEL</p>
              </div>

              <div className="status-info">
                <p>JOB: Combat Trainee</p>
                <p>RANK: {getRankDisplay(level)}</p>
                <p>TITLE: {getRankTitle(level)}</p>
                <p>BUILD: Korra / Bloodhounds</p>
              </div>
            </div>

            <div className="status-bars">
              <p>
                ✚ HP <span>100/100</span>
              </p>
              <p>
                ♢ MP <span>10/10</span>
              </p>
              <p>◎ FATIGUE: 0</p>
            </div>

            <div className="status-stats">
              {Object.entries(stats).map(([name, value]) => (
                <button
                  key={name}
                  className="stat-row"
                  onClick={() => increaseStat(name as keyof Stats)}
                  disabled={statPoints <= 0}
                >
                  <span>
                    {name}: {value}
                  </span>
                  <span className="stat-plus">+</span>
                </button>
              ))}

              <p className="points-row">POINTS: {statPoints}</p>

              <div className="stat-bonus-box">
                <p>STR: Bonus XP for strength/core missions</p>
                <p>AGI: Bonus XP for cardio/activity missions</p>
                <p>VIT: Endurance scaling support</p>
                <p>PER: Discipline quest bonus</p>
                <p>INT: Mind quest bonus</p>
              </div>
            </div>

            <button className="quest-complete-btn" onClick={() => setScreen("dashboard")}>
              ENTER SYSTEM
            </button>
          </div>
        )}

        {screen === "dashboard" && (
          <div className="dashboard-screen">
            <button className="back-btn" onClick={() => setScreen("dashboard")}>
              ← BACK
            </button>

            <div className="dashboard-header">
              <p>SYSTEM INTERFACE</p>
              <h1>PLAYER DASHBOARD</h1>
              <div className="rank-subtitle">
                {getRankTitle(level)}
              </div>
              <span>HYBRID COMBAT / FIREGROUND CONDITIONING</span>
            </div>

            <div className="system-status-bar">
              SYSTEM STATUS: <b>{getSystemStatus()}</b>
            </div>

            <div className="dashboard-grid">
              <div
                className={`dashboard-card primary-card ${
                  morningWorkoutComplete ? "cleared" : ""
                }`}
                onClick={startMorningProtocol}
              >
                <h2>TODAY’S PROTOCOL</h2>
                <p>{morningWorkoutComplete ? "CLEARED" : todayProtocol.title}</p>
              </div>

              <div
                className={`dashboard-card primary-card ${
                  dailyRewardClaimed ? "cleared" : ""
                }`}
                onClick={() => setScreen("quest")}
              >
                <h2>DAILY QUESTS</h2>
                <p>
                  {dailyRewardClaimed
                    ? "Rewards Claimed"
                    : `${completedQuestCount} / ${quests.length} completed`}
                </p>
              </div>

              <div className="dashboard-card" onClick={() => setScreen("status")}>
                <h2>STATUS</h2>
                <p>Level {level}</p>
              </div>

              <div className="dashboard-card">
                <h2>STREAK</h2>
                <p>{streak} days</p>
              </div>

              <div className="dashboard-card">
                <h2>POINTS</h2>
                <p>{points} available</p>
              </div>

              <div className="dashboard-card rank-card">
                <h2>RANK</h2>
                <p>{getRankDisplay(level)}</p>
              </div>

              <div className="dashboard-card">
                <h2>DIFFICULTY</h2>
                <p>{getDifficultyTier()}</p>
              </div>

              <div className="dashboard-card">
                <h2>REWARD XP</h2>
                <p>+{availableQuestXp}</p>
              </div>

              <div className="dashboard-card primary-card">
                <h2>EXPERIENCE</h2>
                <p>
                  {xp} / {xpNeeded} XP
                </p>

                <div className="xp-bar">
                  <div
                    className={`xp-fill ${xpAnimating ? "gain" : ""}`}
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {DEV_MODE && (
              <>
                <button className="quest-complete-btn" onClick={() => gainXp(25)}>
                  TEST GAIN XP
                </button>

                <button
                  className="quest-complete-btn"
                  onClick={() => {
                    setCompletedToday(false);
                    setDailyRewardClaimed(false);
                    setMissedYesterday(false);
                  }}
                >
                  DEV RESET DAY
                </button>
              </>
            )}

            <button
              className="quest-complete-btn"
              onClick={() => {
                localStorage.removeItem(getSaveKey(activePlayer));
                location.reload();
              }}
            >
              RESET SYSTEM
            </button>

            <button
              className="quest-complete-btn"
              onClick={() => setScreen("monthlyCheck")}
            >
              MONTHLY EVALUATION
            </button>
          </div>
        )}

        {screen === "monthlyCheck" && (
          <div className="onboarding-screen">
            <button className="back-btn" onClick={() => setScreen("dashboard")}>
              ← BACK
            </button>

            <h1>MONTHLY EVALUATION</h1>
            <p className="onboarding-subtitle">Compare your Day 1 stats to now.</p>

            {Object.entries(baseline).map(([key, startValue]) => (
              <div key={key} className="compare-row">
                <span>{formatLabel(key)}</span>
                <small>START: {startValue || "--"}</small>

                <input
                  className="system-input"
                  placeholder="Now"
                  value={monthEnd[key as keyof BodyMetrics]}
                  onChange={(e) =>
                    setMonthEnd((current) => ({
                      ...current,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <div className="progress-report">
              <h2>PROGRESS REPORT</h2>

              {Object.entries(baseline).map(([key, startValue]) => {
                const currentValue = monthEnd[key as keyof BodyMetrics];

                return (
                  <p key={key}>
                    <b>{formatLabel(key)}</b>: {startValue || "--"} →{" "}
                    {currentValue || "--"} (
                    {getDifference(String(startValue), String(currentValue))})
                  </p>
                );
              })}
            </div>

            <button
              className="quest-complete-btn"
              onClick={() => {
                showSystemMessage("EVALUATION SAVED", "Monthly scan recorded.");
                triggerSystemFlash("complete");
                setScreen("dashboard");
              }}
            >
              SAVE MONTHLY SCAN
            </button>
          </div>
        )}

        {screen === "workout" && activeWorkout && (
          <div className="workout-screen">
            <button className="back-btn" onClick={() => setScreen("quest")}>
              ← BACK
            </button>

            <h2>{activeWorkout.name.toUpperCase()}</h2>

            <p className="workout-mode-label">
              MISSION IN PROGRESS • {requiredWorkoutTasks.length} REQUIRED TASKS
            </p>

            <div className="workout-directive">
              {requiredWorkoutTasks.map((task) => (
                <button
                  key={task.id}
                  className={`workout-task ${
                    completedWorkoutItems.includes(task.id) ? "done" : ""
                  }`}
                  onClick={() => toggleWorkoutItem(task.id, task.required)}
                >
                  <span>{completedWorkoutItems.includes(task.id) ? "✓" : "▸"}</span>
                  {task.label}
                </button>
              ))}

              {optionalWorkoutTasks.length > 0 && (
                <div className="workout-notes">
                  {optionalWorkoutTasks.map((task) => (
                    <p key={task.id}>◇ {task.label}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="workout-timer">
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
            </div>

            <div className="system-actions">
              {!isRunning ? (
                <button
                  className="system-btn"
                  onClick={() => {
                    setIsRunning(true);
                    playSound("click");
                  }}
                >
                  START
                </button>
              ) : (
                <button
                  className="system-btn secondary"
                  onClick={() => setIsRunning(false)}
                >
                  PAUSE
                </button>
              )}
            </div>

            <button
              onClick={completeWorkoutQuest}
              disabled={!isWorkoutComplete && timer > 0}
              className={`quest-complete-btn complete-btn ${
                isWorkoutComplete || timer === 0 ? "active" : "locked"
              }`}
            >
              {isWorkoutComplete || timer === 0 ? "COMPLETE WORKOUT" : "MISSION LOCKED"}
            </button>
          </div>
        )}
        {rankUpMessage && (
          <div className="rank-up-overlay">
            <div className="rank-up-content">
              <p className="rank-up-system">SYSTEM</p>

              <h1 className="rank-up-title">RANK UP</h1>

              <h2 className="rank-up-rank">
                {rankUpMessage}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}