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
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#020611] to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#020611] to-transparent z-10" />
      <div className="flex gap-2 overflow-x-auto px-2 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            whitespace-nowrap
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`
              relative shrink-0 whitespace-nowrap px-3 py-2 sm:px-5 rounded-xl text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300
              ${
                currentTab === tab.id
                  ? "text-cyan-300"
                  : "text-slate-500 hover:text-cyan-300"
              }
            `}
          >
            {currentTab === tab.id && (
              <div className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-400/30 blur-[1px]" />
            )}

            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}