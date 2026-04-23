type Props = {
  rankUpAlert: { from: string; to: string } | null;
  rankChangeDirection: "up" | "down" | "same";
  jobTitle: string;
  statusTitle: string;
  onClose: () => void;
};

export default function RankAlertModal({
  rankUpAlert,
  rankChangeDirection,
  jobTitle,
  statusTitle,
  onClose,
}: Props) {
  if (!rankUpAlert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rank-popup-pulse relative w-[420px] rounded-[24px] border border-cyan-400/30 bg-[#050b1a]/95 p-6 shadow-[0_0_45px_rgba(34,211,238,0.22)]">
        <div className="rank-flash-overlay pointer-events-none absolute inset-0 rounded-[24px] bg-cyan-300/10" />

        <p className="mb-2 text-[11px] uppercase tracking-[0.38em] text-cyan-300">
          System Alert
        </p>

        <h2 className="mb-3 text-2xl font-semibold tracking-wide text-white">
          {rankChangeDirection === "down"
            ? "Rank Regression Detected"
            : "Rank Advancement Detected"}
        </h2>

        <p className="mb-6 text-sm text-slate-400">
          {rankChangeDirection === "down"
            ? "Your operational classification has fallen. Recovery is required."
            : "Your operational classification has improved."}
        </p>

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="text-2xl text-slate-500">{rankUpAlert.from}</span>
          <span
            className={`text-xl ${
              rankChangeDirection === "down" ? "text-pink-400" : "text-cyan-300"
            }`}
          >
            →
          </span>
          <span className="text-4xl font-bold text-cyan-200">{rankUpAlert.to}</span>
        </div>

        <div
          className={`mb-6 rounded-2xl p-4 ${
            rankChangeDirection === "down"
              ? "border border-pink-400/20 bg-pink-500/5"
              : "border border-cyan-400/20 bg-cyan-500/5"
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
            New Job
          </p>
          <p className="mt-2 text-lg font-medium text-cyan-200">
            {jobTitle}
          </p>

          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Title
          </p>
          <p className="mt-2 text-sm text-white">
            {statusTitle}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
        >
          {rankChangeDirection === "down"
            ? "Acknowledge Setback"
            : "Confirm Advancement"}
        </button>
      </div>
    </div>
  );
}