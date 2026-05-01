export default function SystemFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="system-stage">
      <div className="system-rail system-rail-top" />
      <div className="system-rail system-rail-bottom" />

      <div className="system-panel">
        <div className="system-panel-noise" />

        <div className="system-corner top-left" />
        <div className="system-corner top-right" />
        <div className="system-corner bottom-left" />
        <div className="system-corner bottom-right" />

        <div className="system-side left" />
        <div className="system-side right" />

        <div className="system-inner">{children}</div>
      </div>
    </div>
  );
}