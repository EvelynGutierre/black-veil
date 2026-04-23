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
    <div className="mb-5">
      <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-300/75">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-50">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}