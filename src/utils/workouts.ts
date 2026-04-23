export type WorkoutDay = {
  title: string;
  focus: string;
  blocks: string[];
};

export const weeklyWorkouts: Record<number, WorkoutDay> = {
  0: {
    title: "Recovery Gate: Shadow Reset",
    focus: "Mobility, recovery, light movement",
    blocks: [
      "10 min mobility flow",
      "20-30 min walk",
      "3 x 20 sec dead hang",
      "5 pushups",
      "Light stretch",
    ],
  },
  1: {
    title: "Dungeon: Iron Path Trial",
    focus: "Lower body + run conditioning",
    blocks: [
      "After Work Run",
      "3 x 12 bodyweight squats",
      "3 x 10 reverse lunges each leg",
      "3 x 12 step-ups",
      "5 pushups",
      "3 x 20 sec dead hang",
    ],
  },
  2: {
    title: "Dungeon: Upper Dominion",
    focus: "Upper body + boxing",
    blocks: [
      "3 x 8 pushups",
      "3 x 12 rows (backpack or dumbbell)",
      "3 x 20 shoulder taps",
      "4 boxing rounds",
      "5 pushups",
      "3 x 20-30 sec dead hang",
    ],
  },
  3: {
    title: "Dungeon: Core Abyss Run",
    focus: "Run + core stability",
    blocks: [
      "After Work Run",
      "3 x 30 sec plank",
      "3 x 12 glute bridges",
      "3 x 20 mountain climbers",
      "5 pushups",
      "3 x 20 sec dead hang",
    ],
  },
  4: {
    title: "Dungeon: Endurance Gauntlet",
    focus: "Leg endurance + grip",
    blocks: [
      "15-20 min stairs",
      "3 x 12 split squats",
      "3 x 30 sec wall sit",
      "Farmer carry / backpack carry x 3",
      "5 pushups",
      "3 x max dead hang",
    ],
  },
  5: {
    title: "Gate: Quick Clearance Protocol",
    focus: "Short session (workday)",
    blocks: [
      "10 min brisk walk or stairs",
      "3 x 10 squats",
      "3 x 8 pushups",
      "3 boxing rounds",
      "3 x 20 sec dead hang",
    ],
  },
  6: {
    title: "Dungeon: Hunter’s Trial",
    focus: "Full conditioning + boxing",
    blocks: [
      "5 boxing rounds",
      "3 x 12 squats",
      "3 x 10 lunges each leg",
      "3 x 10 pushups",
      "10 min core circuit",
      "3 x max dead hang",
    ],
  },
};

export function getTodayWorkout(date = new Date()): WorkoutDay {
  return weeklyWorkouts[date.getDay()];
}