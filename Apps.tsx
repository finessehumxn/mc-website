import { Reveal, SectionLabel } from "./Reveal";

const apps = [
  { name: "BarterThat", body: "Swap skills, build community: 1000+ services, zero cash.", meta: "App Store · Google Play", tone: "text-yellow" },
  { name: "MedCompanion AI", body: "Your health, finally explained. Plain language, every language, free.", meta: "App Store · Google Play", tone: "text-cyan" },
  { name: "FinesseKey", body: "Credit and debt comeback, legitimate consumer-law moves only.", meta: "App Store · Google Play", tone: "text-pink" },
  { name: "FinesseEdge", body: "Know your edge: documented stats and an Edge Score, not a sportsbook.", meta: "App Store · Google Play", tone: "text-yellow" },
  { name: "FinesseWins", body: "Government contracting for first-timers, discovery to award.", meta: "Live platform", tone: "text-cyan" },
  { name: "MCGrants", body: "The Winnability Engine: see which grants you can actually win.", meta: "Live product", tone: "text-pink" },
  { name: "MCProof", body: "Compliance that survives a lawsuit: 508 + security + VPAT from one scan.", meta: "Live product", tone: "text-yellow" },
  { name: "Custom Builds", body: "SaaS, AI, and internal tools for clients, prototype to production.", meta: "Start a build", tone: "text-cyan" },
];

export function Apps() {
  return (
    <section id="products" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <SectionLabel>Apps & Software</SectionLabel>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
          Products we ship. Not promises, downloads.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {apps.map((a, i) => (
          <Reveal key={a.name} delay={(i % 4) * 0.06}>
            <div className="group h-full bg-background p-7 transition-colors duration-500 hover:bg-surface">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-2 font-display text-sm font-black">
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              <h3 className={`mt-6 text-lg font-bold ${a.tone}`}>{a.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-foreground">
                {a.meta} →
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
