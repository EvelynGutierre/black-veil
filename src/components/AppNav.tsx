type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: readonly Tab[];
  currentTab: string;
  setTab: (tab: string) => void;
};

export default function AppNav({
  tabs,
  currentTab,
  setTab,
}: Props) {
  return (
    <div className="relative border-t border-cyan-400/10">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-[#020611] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#020611] to-transparent" />

      <div className="overflow-x-auto overflow-y-hidden px-2 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`
                relative shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 sm:px-5 sm:text-xs
                ${
                  currentTab === tab.id
                    ? "text-cyan-300"
                    : "text-slate-500 hover:text-cyan-300"
                }
              `}
            >
              {currentTab === tab.id && (
                <div className="absolute inset-0 rounded-xl border border-cyan-400/30 bg-cyan-500/10 blur-[1px]" />
              )}

              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}