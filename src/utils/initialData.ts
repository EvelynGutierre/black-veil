import type { Directive, TrainingLog } from "../types/app";

export const initialDirectives: Directive[] = [
  { id: "wake", title: "Wake at 5:00 AM", reward: 25, completed: false },
  { id: "steps", title: "10K Steps", reward: 20, completed: false },
  { id: "water", title: "100 oz Water", reward: 20, completed: false },
  { id: "workout", title: "Morning Workout", reward: 40, completed: false },
  { id: "no_ordering_out", title: "No Ordering Out", reward: 15, completed: false },
  { id: "no_junk", title: "No Junk Food", reward: 15, completed: false },
  { id: "journal", title: "Journal", reward: 10, completed: false },
  { id: "pushups", title: "5 Pushups", reward: 10, completed: false },
  { id: "dead_hang", title: "Dead Hang", reward: 15, completed: false },
  { id: "run", title: "Run", reward: 30, completed: false },
];

export const initialTrainingLog: TrainingLog = {
  weight: "",
  sleep: "",
  water: "",
  steps: "",
  boxingRounds: "",
  workoutNotes: "",
};