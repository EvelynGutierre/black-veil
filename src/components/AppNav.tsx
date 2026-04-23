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
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`
              relative px-5 py-2 rounded-xl text-xs tracking-widest uppercase transition-all duration-300
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