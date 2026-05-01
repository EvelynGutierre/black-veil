export default function SystemWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="sl-root">

      {/* ENERGY FIELD */}
      <div className="sl-energy-field" />

      {/* TOP HARD BAR */}
      <div className="sl-top-bar" />

      {/* SIDE FRAME */}
      <div className="sl-side-frame left" />
      <div className="sl-side-frame right" />

      {/* MAIN FLOATING PANEL */}
      <div className="sl-panel">
        <div className="sl-panel-inner">
          {children}
        </div>
      </div>

      {/* BOTTOM LIGHT */}
      <div className="sl-bottom-bar" />

    </div>
  );
}