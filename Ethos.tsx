import { Reveal, SectionLabel } from "./Reveal";
import can0 from "@/assets/mc-can-0.jpg.asset.json";
import can1 from "@/assets/mc-can-1.jpg.asset.json";
import can2 from "@/assets/mc-can-2.jpg.asset.json";
import can3 from "@/assets/mc-can-3.jpg.asset.json";
import can4 from "@/assets/mc-can-4.jpg.asset.json";
import can5 from "@/assets/mc-can-5.jpg.asset.json";

const cans = [
  { src: can5.url, word: "Create", body: "Original work only. No templates, no recycled decks." },
  { src: can4.url, word: "Believe", body: "We take on brands other studios call too early." },
  { src: can2.url, word: "Invent", body: "Products get built, shipped, and maintained in-house." },
  { src: can1.url, word: "Design", body: "Systems, not one-offs: every asset scales with you." },
  { src: can0.url, word: "Love", body: "Founder-led. Your project is never handed to a junior." },
  { src: can3.url, word: "Connect", body: "One team across brand, film, web, AI, and contracting." },
];

export function Ethos() {
  return (
    <section id="ethos" className="relative overflow-hidden border-y border-border py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-25" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>The Line-Up</SectionLabel>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-extrabold leading-[1.03] tracking-[-0.025em]">
            Six cans. Six rules we <span className="text-gradient">actually work by.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cans.map((c, i) => (
            <Reveal key={c.word} delay={(i % 3) * 0.07}>
              <div className="surface-panel hover-lift group flex h-full items-center gap-5 overflow-hidden rounded-3xl p-5">
                <img
                  src={c.src}
                  alt={`Millennials Creatives ${c.word} spray can label`}
                  loading="lazy"
                  className="h-32 w-24 shrink-0 rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div>
                  <h3 className="font-display text-xl font-extrabold">{c.word}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
