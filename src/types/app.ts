export type Directive = {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
};

export type TrainingLog = {
  weight: string;
  sleep: string;
  water: string;
  steps: string;
  boxingRounds: string;
  workoutNotes: string;
};

export type DailyRecord = {
  date: string;
  totalVeil: number;
  rank: string;
  jobTitle: string;
  statusTitle: string;
  completedCount: number;
  directivesTotal: number;
  completionRate: number;
  readinessScore: number;
  fatigue: number;
  recovery: number;
  weight: string;
  sleep: string;
  water: string;
  steps: string;
  boxingRounds: string;
  workoutNotes: string;
};