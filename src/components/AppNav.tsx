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
      <div className="grid grid-cols-3 gap-2 px-2 pb-1 sm:flex sm:gap-2 sm:px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`
              relative min-w-0 rounded-xl px-2 py-2 text-[10px] uppercase tracking-[0.18em] transition-all duration-300
              sm:shrink-0 sm:whitespace-nowrap sm:px-5 sm:text-xs sm:tracking-widest
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

            <span className="relative z-10 block truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}