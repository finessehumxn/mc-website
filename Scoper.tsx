import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Reveal, SectionLabel } from "./Reveal";

type Module = { id: string; label: string; blurb: string; low: number; high: number; weeks: number };

const modules: Module[] = [
  { id: "brand", label: "Brand system", blurb: "Identity, guidelines, packaging", low: 12000, high: 26000, weeks: 5 },
  { id: "web", label: "Website / e-commerce", blurb: "Design + build, conversion-led", low: 15000, high: 40000, weeks: 6 },
  { id: "video", label: "Video & photography", blurb: "Brand film, product, editorial", low: 10000, high: 32000, weeks: 4 },
  { id: "motion", label: "Motion + 3D", blurb: "Renders, animation, finishing", low: 8000, high: 22000, weeks: 3 },
  { id: "app", label: "App / AI platform", blurb: "SaaS, AI tooling, integrations", low: 35000, high: 120000, weeks: 12 },
  { id: "gov", label: "Gov / compliance", blurb: "508, VPAT, SOW-ready delivery", low: 14000, high: 45000, weeks: 6 },
  { id: "retainer", label: "Ongoing retainer", blurb: "Embedded creative team", low: 9000, high: 18000, weeks: 2 },
];

const speeds = [
  { id: "standard", label: "Standard", mult: 1, note: "Normal production calendar" },
  { id: "priority", label: "Priority", mult: 1.2, note: "Dedicated pod, tighter cycles" },
  { id: "blitz", label: "Blitz", mult: 1.45, note: "All hands, compressed timeline" },
];

const fmt = (n: number) => `$${Math.round(n / 1000)}K`;

export function Scoper() {
  const [picked, setPicked] = useState<string[]>(["brand", "web"]);
  const [speed, setSpeed] = useState("standard");

  const result = useMemo(() => {
    const chosen = modules.filter((m) => picked.includes(m.id));
    const mult = speeds.find((s) => s.id === speed)?.mult ?? 1;
    const low = chosen.reduce((a, m) => a + m.low, 0) * mult;
    const high = chosen.reduce((a, m) => a + m.high, 0) * mult;
    const weeks = chosen.reduce((a, m) => a + m.weeks, 0);
    const timeline = Math.max(2, Math.round((weeks * 0.7) / (mult > 1 ? mult : 1)));
    const tier =
      high >= 100000
        ? "Tier 04 · Gov / Enterprise"
        : low >= 45000
          ? "Tier 03 · Scale"
          : low >= 15000
            ? "Tier 02 · Surge"
            : "Tier 01 · Spark";
    return { low, high, timeline, tier, count: chosen.length };
  }, [picked, speed]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <section id="scoper" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-[700px] -translate-x-1/2 rounded-full bg-pink/15 blur-[130px]" />
      <Reveal>
        <SectionLabel>Project Scoper</SectionLabel>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
          Price your build before the call.
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Pick your modules and pace. You get a real range, a timeline, and the tier your scope lands
          in — no discovery-call theater.
        </p>
      </Reveal>

      <div className="relative mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="surface-panel rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              01 · Scope
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {modules.map((m) => {
                const on = picked.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 ${
                      on ? "border-yellow bg-yellow/10" : "border-border bg-surface/40 hover:border-muted-foreground/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] font-black ${
                        on ? "border-yellow bg-yellow text-primary-foreground" : "border-border"
                      }`}
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.blurb}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              02 · Pace
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {speeds.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSpeed(s.id)}
                  className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                    speed === s.id ? "border-pink bg-pink/10" : "border-border bg-surface/40"
                  }`}
                >
                  <span className="block text-sm font-bold">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.note}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="sticky top-28 overflow-hidden rounded-3xl border border-yellow/40 bg-surface p-8 glow-yellow">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Your estimate
            </p>
            <motion.p
              key={`${result.low}-${result.high}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 font-display text-5xl font-extrabold leading-none"
            >
              {result.count === 0 ? "—" : `${fmt(result.low)}–${fmt(result.high)}`}
            </motion.p>
            <p className="mt-3 text-sm text-muted-foreground">
              {result.count === 0
                ? "Select at least one module."
                : `${result.count} modules · ${result.timeline} week timeline`}
            </p>

            <div className="mt-6 h-px bg-border" />

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Engagement tier</dt>
                <dd className="font-bold text-yellow">{result.tier}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Response time</dt>
                <dd className="font-bold">Under 24 hours</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Team</dt>
                <dd className="font-bold">In-house, 4 founders</dd>
              </div>
            </dl>

            <a
              href="#contact"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
            >
              Send this scope →
            </a>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Estimates are directional. Final pricing follows a scoped SOW.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
