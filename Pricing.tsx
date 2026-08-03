import { Reveal, SectionLabel } from "./Reveal";

const tiers = [
  {
    tier: "Tier 01 · Spark",
    price: "$5K+",
    items: ["Logo + brand kit", "1-page website", "2-week sprint", "Basic launch assets"],
    featured: false,
  },
  {
    tier: "Tier 02 · Surge",
    price: "$15K–$25K",
    items: ["Full brand system", "Multi-page website", "Launch campaign", "Photo or video shoot"],
    featured: false,
  },
  {
    tier: "Tier 03 · Scale",
    price: "$50K+",
    items: ["Retainer creative team", "Video + web + ads", "Ongoing production", "Monthly reporting"],
    featured: true,
  },
  {
    tier: "Tier 04 · Gov / Enterprise",
    price: "$100K+",
    items: ["NAICS-aligned scope", "Past performance ready", "SAM.gov registered", "Custom SOW & pricing"],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-y border-border bg-ink/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>Packages</SectionLabel>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
            Transparent pricing. Real scope.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-4">
          {tiers.map((t, i) => (
            <Reveal key={t.tier} delay={i * 0.07}>
              <div
                className={`flex h-full flex-col rounded-3xl border p-7 transition-all duration-500 hover-lift ${
                  t.featured
                    ? "border-yellow bg-surface glow-yellow"
                    : "border-border bg-surface/40 hover:border-pink/50"
                }`}
              >
                {t.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary-foreground">
                    Most requested
                  </span>
                )}
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t.tier}
                </p>
                <p className="mt-4 font-display text-4xl font-extrabold">{t.price}</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {t.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <span className="text-pink">✦</span>
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition-transform duration-300 hover:scale-[1.03] ${
                    t.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface-2/60"
                  }`}
                >
                  Start here
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
