import { useRef, type ReactNode } from "react";
import { Reveal, SectionLabel } from "./Reveal";

const services = [
  {
    kicker: "Identity",
    title: "Branding & Identity",
    body: "Logos, brand systems, packaging, guidelines, and visual identity that stops the scroll.",
    tone: "yellow",
  },
  {
    kicker: "Film",
    title: "Video Production",
    body: "Commercials, documentaries, event coverage, brand films, and raw footage delivery.",
    tone: "pink",
  },
  {
    kicker: "Stills",
    title: "Photography",
    body: "Product, lifestyle, editorial, and event photography for brands and organizations.",
    tone: "cyan",
  },
  {
    kicker: "Post",
    title: "Editing & Motion",
    body: "Color, sound, motion graphics, 3D renders, and finishing on any footage you bring us.",
    tone: "yellow",
  },
  {
    kicker: "Web",
    title: "Web Design & Development",
    body: "Marketing sites, e-commerce, landing pages, and custom builds engineered to convert.",
    tone: "pink",
  },
  {
    kicker: "Software",
    title: "Apps & AI Systems",
    body: "Custom SaaS, AI tools, and full-stack platforms, from prototype to production.",
    tone: "cyan",
  },
  {
    kicker: "Public Sector",
    title: "Government Contracting",
    body: "SAM.gov registered vendor for federal, state, local, and tribal creative and tech services.",
    tone: "yellow",
  },
  {
    kicker: "Education",
    title: "Courses & Training",
    body: "The MC Course Academy plus live corporate training, taught by the founding team.",
    tone: "pink",
  },
];

const toneText: Record<string, string> = {
  yellow: "text-yellow",
  pink: "text-pink",
  cyan: "text-cyan",
};

function SpotlightCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 hover-lift hover:border-pink/60"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--x) var(--y), color-mix(in oklab, var(--brand-yellow) 16%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <SectionLabel>What We Do</SectionLabel>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
          Full-stack creative for brands that <span className="text-gradient">refuse to blend in.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={(i % 4) * 0.07}>
            <SpotlightCard>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${toneText[s.tone]}`}>
                {s.kicker}
              </p>
              <h3 className="mt-4 text-lg font-bold leading-snug">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
