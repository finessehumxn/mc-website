import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Reveal, SectionLabel } from "./Reveal";

const cases = [
  {
    id: "branding",
    tag: "Branding & Design",
    title: "Bella High",
    sub: "Identity, packaging, illustration",
    metric: "3.4x",
    metricLabel: "retail sell-through after rebrand",
    body: "A full identity system, packaging line, and the Royal Blue illustration series — built to own shelf space, not blend into it.",
    swatch: ["bg-yellow", "bg-pink", "bg-violet"],
  },
  {
    id: "websites",
    tag: "Websites & Platforms",
    title: "Legal Nurse Jeanie",
    sub: "Web, e-commerce, apps",
    metric: "+218%",
    metricLabel: "qualified inbound in 90 days",
    body: "Conversion-engineered site architecture, booking flow, and content system for a specialist practice scaling nationally.",
    swatch: ["bg-cyan", "bg-yellow", "bg-pink"],
  },
  {
    id: "media",
    tag: "Video, Print & Media",
    title: "Bloom Series",
    sub: "Motion, photography, print",
    metric: "1.2M",
    metricLabel: "organic views across the campaign",
    body: "Cinematic brand films, studio photography, and a print system that carried one story across every channel.",
    swatch: ["bg-pink", "bg-violet", "bg-cyan"],
  },
];

export function Work() {
  const [active, setActive] = useState(0);
  const item = cases[active]!;

  return (
    <section id="work" className="relative border-y border-border bg-ink/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>Selected Work</SectionLabel>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
            Brands, campaigns & platforms we have built.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-2">
            {cases.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                className={`group rounded-2xl border p-5 text-left transition-all duration-500 ${
                  i === active
                    ? "border-pink bg-surface glow-pink"
                    : "border-border bg-surface/30 hover:border-border hover:bg-surface/60"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {c.tag}
                </p>
                <p className="mt-2 font-display text-xl font-bold">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.sub}</p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="surface-panel relative overflow-hidden rounded-3xl p-8 sm:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet/30 blur-3xl" />
              <div className="relative">
                <div className="flex gap-2">
                  {item.swatch.map((s, i) => (
                    <span key={i} className={`h-3 w-14 rounded-full ${s}`} />
                  ))}
                </div>
                <p className="mt-8 font-display text-6xl font-extrabold text-gradient sm:text-7xl">
                  {item.metric}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">
                  {item.metricLabel}
                </p>
                <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">{item.body}</p>
                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-yellow hover:underline"
                >
                  Request the full case study →
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
