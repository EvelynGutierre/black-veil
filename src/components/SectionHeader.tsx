export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 sm:mb-5">
      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.32em] text-cyan-300/75">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-50">{title}</h2>
      <p className="mt-1 text-sm sm:text-sm text-slate-400">{description}</p>
    </div>
  );
}