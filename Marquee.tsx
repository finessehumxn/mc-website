const items = [
  "Branding",
  "Video Production",
  "Web Design",
  "Motion + 3D",
  "Photography",
  "App Development",
  "Government Contracting",
  "AI Tools",
  "Packaging",
  "E-commerce",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/40 py-5">
      <div className="flex w-max marquee-track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-6 px-6 text-lg font-bold sm:text-xl">
            {item}
            <span className="text-pink">✦</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
