export const rankOrder: Record<string, number> = {
  E: 1,
  D: 2,
  C: 3,
  B: 4,
  A: 5,
  S: 6,
};

export function getRank(totalVeil: number) {
  if (totalVeil >= 250) return "S";
  if (totalVeil >= 180) return "A";
  if (totalVeil >= 130) return "B";
  if (totalVeil >= 90) return "C";
  if (totalVeil >= 50) return "D";
  return "E";
}

export function getStatusTitle(rank: string) {
  if (rank === "S") return "The One Who Finishes the Round";
  if (rank === "A") return "The One Who Cannot Be Stopped";
  if (rank === "B") return "Hunter of the Ring";
  if (rank === "C") return "Awakened Under Pressure";
  if (rank === "D") return "Still Standing";
  return "The One in Pursuit";
}

export function getJobTitle(rank: string) {
  if (rank === "S") return "Black Veil Monarch";
  if (rank === "A") return "Executioner";
  if (rank === "B") return "Veil Enforcer";
  if (rank === "C") return "Veil Initiate";
  if (rank === "D") return "Pit Fighter";
  return "Street Rat";
}

export function getRankColor(rank: string) {
  if (rank === "S") return "text-yellow-300";
  if (rank === "A") return "text-purple-300";
  if (rank === "B") return "text-blue-300";
  if (rank === "C") return "text-green-300";
  if (rank === "D") return "text-cyan-300";
  return "text-slate-400";
}

export function getRankBadge(rank: string) {
  if (rank === "S") {
    return "border-yellow-300/40 bg-yellow-400/10 text-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.18)]";
  }
  if (rank === "A") {
    return "border-fuchsia-300/40 bg-fuchsia-400/10 text-fuchsia-300 shadow-[0_0_18px_rgba(232,121,249,0.18)]";
  }
  if (rank === "B") {
    return "border-blue-300/40 bg-blue-400/10 text-blue-300 shadow-[0_0_18px_rgba(96,165,250,0.18)]";
  }
  if (rank === "C") {
    return "border-emerald-300/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.18)]";
  }
  if (rank === "D") {
    return "border-cyan-300/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.18)]";
  }
  return "border-slate-500/30 bg-slate-400/10 text-slate-400";
}

export function getStreakStyle(streak: number) {
  if (streak >= 14) {
    return "text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.45)]";
  }
  if (streak >= 7) {
    return "text-fuchsia-300 drop-shadow-[0_0_10px_rgba(232,121,249,0.4)]";
  }
  if (streak >= 3) {
    return "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.35)]";
  }
  return "text-cyan-300";
}

export function getStreakBonus(streak: number) {
  if (streak >= 7) return 30;
  if (streak >= 5) return 20;
  if (streak >= 3) return 10;
  return 0;
}