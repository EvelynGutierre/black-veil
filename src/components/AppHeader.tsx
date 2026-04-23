import AnimatedNumber from "./AnimatedNumber";
import HoloPanel from "./HoloPanel";

type Props = {
  rank: string;
  totalVeil: number;
  completedCount: number;
  directivesLength: number;
};

export default function AppHeader({
  rank,
  totalVeil,
  completedCount,
  directivesLength,
}: Props) {
  return (
    <div className="relative border-b border-cyan-400/10 px-5 py-5 md:px-8 md:py-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70">
            Tracking Protocol
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
            <h1 className="text-3xl font-semibold tracking-wide text-cyan-300 md:text-4xl">
              BLACK VEIL: HOUNDS
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Classified pursuit interface initialized.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:min-w-[360px]">
          <HoloPanel title="Rank" compact glow="blue">
            <div className="text-2xl font-bold text-cyan-200">{rank}</div>
          </HoloPanel>

          <HoloPanel title="Veil" compact glow="cyan">
            <div className="text-2xl font-bold text-cyan-300">
              <AnimatedNumber value={totalVeil} />
            </div>
          </HoloPanel>

          <HoloPanel title="Directives" compact glow="violet">
            <div className="text-2xl font-bold text-cyan-200">
              {completedCount}/{directivesLength}
            </div>
          </HoloPanel>
        </div>
      </div>
    </div>
  );
}