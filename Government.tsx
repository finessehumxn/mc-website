import { Reveal, SectionLabel } from "./Reveal";

const creds = ["WOSB Certified", "MBE", "DBE", "SAM.gov Registered", "Section 508 / VPAT", "Small Business"];

const team = [
  { badge: "AI", role: "AI / Engineering Lead", body: "Product, software, and AI systems." },
  { badge: "MBA", role: "Business & Ops", body: "Strategy, contracts, and growth." },
  { badge: "RN", role: "BSN / RN", body: "Healthcare vertical and MedCompanion AI lead." },
  { badge: "MS", role: "MS Public Health & Safety", body: "Government and public sector delivery." },
];

export function Government() {
  return (
    <section id="government" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="surface-panel relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <div className="pointer-events-none absolute -left-20 -bottom-10 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative">
              <SectionLabel>Government Contracting</SectionLabel>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Registered, ready, and delivering.
              </h2>
              <p className="mt-5 text-muted-foreground">
                Federal, state, local, and tribal agencies: accessible digital work from a certified
                WOSB, MBE, DBE small business. Capability statement, past performance, and company
                data available on request.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {creds.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border bg-surface-2/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <a
                href="#contact"
                className="mt-9 inline-flex items-center gap-2 rounded-full border border-cyan/60 px-6 py-3 text-sm font-bold text-cyan transition-colors hover:bg-cyan/10"
              >
                Government capabilities →
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-3xl border border-border bg-surface/40 p-8 sm:p-10">
            <SectionLabel>The Team</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Four co-founders. One studio.
            </h2>
            <div className="mt-8 divide-y divide-border">
              {team.map((t) => (
                <div key={t.badge} className="flex items-start gap-4 py-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-2 font-display text-xs font-black text-yellow">
                    {t.badge}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{t.role}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
