import type { ReactNode } from "react";

export default function HoloPanel({
  title,
  subtitle,
  children,
  glow = "cyan",
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  glow?: "cyan" | "blue" | "violet";
  compact?: boolean;
}) {
  const glowMap = {
    cyan: "shadow-cyan-500/10 border-cyan-400/15",
    blue: "shadow-blue-500/10 border-blue-400/15",
    violet: "shadow-fuchsia-500/10 border-fuchsia-400/15",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border bg-[linear-gradient(180deg,rgba(8,20,45,0.82)_0%,rgba(5,13,31,0.9)_100%)] shadow-2xl ${glowMap[glow]}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(56,189,248,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
      <div className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-6 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />

      <div className={`${compact ? "p-4" : "p-5 md:p-6"} relative z-10`}>
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-slate-300/90">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}