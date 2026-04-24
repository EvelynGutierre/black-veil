export type WorkoutDay = {
  title: string;
  focus: string;
  blocks: string[];
  difficulty?: string;
};

function getRankTier(rank: string) {
  if (rank === "S" || rank === "A") return "monarch";
  if (rank === "B") return "awakened";
  return "base";
}

function scaleWorkout(blocks: string[], rank: string): string[] {
  const tier = getRankTier(rank);

  if (tier === "base") return blocks;

  if (tier === "awakened") {
    return blocks.map((block) =>
      block
        .replace("10 pushups", "15 pushups")
        .replace("12 pushups", "18 pushups")
        .replace("15 squats", "20 squats")
        .replace("20 squats", "25 squats")
        .replace("10 min run", "15 min run")
        .replace("12 min run", "18 min run")
        .replace("3 x 20 sec dead hang", "3 x 30 sec dead hang")
        .replace("3 x 30 sec plank", "3 x 40 sec plank")
    );
  }

  return blocks.map((block) =>
    block
      .replace("10 pushups", "20 pushups")
      .replace("12 pushups", "25 pushups")
      .replace("15 squats", "30 squats")
      .replace("20 squats", "35 squats")
      .replace("10 min run", "20 min run")
      .replace("12 min run", "25 min run")
      .replace("3 x 20 sec dead hang", "4 x 30 sec dead hang")
      .replace("3 x 30 sec plank", "4 x 45 sec plank")
  );
}

const weeklyWorkouts: Record<number, WorkoutDay> = {
  0: {
    title: "Recovery Gate: Shadow Reset",
    focus: "Mobility, walking, recovery, breath control",
    blocks: [
      "20 min walk",
      "10 min mobility flow",
      "Light stretch",
      "3 x 20 sec dead hang",
      "5 min breathing reset",
    ],
  },

  1: {
    title: "Endurance Protocol: After Work Run",
    focus: "Monday run day + light strength",
    blocks: [
      "After work: 12 min run",
      "10 pushups",
      "15 squats",
      "3 x 30 sec plank",
      "Light stretch",
    ],
  },

  2: {
    title: "Strength Gate: Hound Conditioning",
    focus: "Lean strength, legs, core, control",
    blocks: [
      "12 pushups",
      "20 squats",
      "3 x 10 reverse lunges each leg",
      "3 x 12 glute bridges",
      "3 x 20 sec dead hang",
    ],
  },

  3: {
    title: "Endurance Protocol: After Work Run",
    focus: "Wednesday run day + grip durability",
    blocks: [
      "After work: 12 min run",
      "3 x 20 sec dead hang",
      "3 x 30 sec wall sit",
      "10 pushups",
      "5 min cooldown walk",
    ],
  },

  4: {
    title: "Control Gate: Recovery & Core",
    focus: "Mobility, core stability, injury prevention",
    blocks: [
      "20 min walk",
      "3 x 30 sec plank",
      "3 x 10 dead bugs",
      "3 x 10 leg raises",
      "10 min mobility flow",
    ],
  },

  5: {
    title: "Combat Gate: Explosive Strength",
    focus: "Bloodhounds-style bodyweight strength and power",
    blocks: [
      "12 pushups",
      "15 squats",
      "3 x 5 jump squats",
      "3 boxing rounds",
      "3 x 30 sec plank",
    ],
  },

  6: {
    title: "Fireground Trial: Carry & Endurance",
    focus: "Firefighter strength, legs, grip, conditioning",
    blocks: [
      "10 min stairs",
      "Farmer carry / backpack carry x 3",
      "3 x 12 step-ups",
      "3 x 10 lunges each leg",
      "3 x max dead hang",
    ],
  },
};

function getDifficultyLabel(rank: string) {
  const tier = getRankTier(rank);

  if (tier === "monarch") return "MONARCH DUNGEON";
  if (tier === "awakened") return "AWAKENED DUNGEON";
  return "BASE DUNGEON";
}

export function getTodayWorkout(
  rank = "E",
  date = new Date(),
  sleepHours?: number
): WorkoutDay {
  const baseWorkout = weeklyWorkouts[date.getDay()];
  const hour = date.getHours();
  const isAfterWorkWindow = hour >= 17;
  const isRunDay = date.getDay() === 1 || date.getDay() === 3;
  const lowSleep = typeof sleepHours === "number" && sleepHours > 0 && sleepHours < 6;

  let blocks = scaleWorkout(baseWorkout.blocks, rank);
  let focus = baseWorkout.focus;

  if (isRunDay && isAfterWorkWindow) {
    focus = `${focus} // after-work run window active`;
  }

  if (lowSleep) {
    blocks = blocks.map((block) =>
      block
        .replace("25 min run", "12 min easy run or walk")
        .replace("20 min run", "10 min easy run or walk")
        .replace("18 min run", "10 min easy run or walk")
        .replace("15 min run", "10 min easy run or walk")
        .replace("12 min run", "10 min easy run or walk")
        .replace("10 min stairs", "10 min walk")
        .replace("3 boxing rounds", "2 light boxing rounds")
        .replace("3 x 5 jump squats", "3 x 10 slow squats")
    );

    focus = `${focus} // recovery adjustment active`;
  }

  return {
    ...baseWorkout,
    focus,
    blocks,
    difficulty: getDifficultyLabel(rank),
  };
}