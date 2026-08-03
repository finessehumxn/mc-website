import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import heroVideo from "@/assets/mc-welcome.mp4.asset.json";
import heroPoster from "@/assets/mc-poster.jpg.asset.json";
import cansLineup from "@/assets/mc-cans-lineup.jpg.asset.json";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 50, suffix: "+", label: "Brands launched since 2020", tone: "text-yellow" },
  { value: 7, suffix: " live", label: "Software products shipped", tone: "text-pink" },
  { value: 10, suffix: "", label: "Courses in the MC Academy", tone: "text-cyan" },
  { value: 4, suffix: "", label: "Founders. AI, business, health, safety", tone: "text-yellow" },
];

export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <section
      id="top"
      ref={wrap}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="noise relative overflow-hidden pt-32 pb-16 sm:pt-40 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-violet/25 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ opacity: fade }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink" />
            Creative Studio · Software House · Government Contractor
          </motion.span>

          <h1 className="mt-7 font-display text-[clamp(2.9rem,7vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            {["We turn", "boring", "into", "iconic."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className={`mr-4 inline-block ${
                  word === "boring"
                    ? "relative text-muted-foreground line-through decoration-pink decoration-[6px]"
                    : word === "iconic."
                      ? "text-yellow"
                      : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Bold brands. Cinematic video. High-converting sites. AI-powered software. Built for
            businesses and business owners, by a certified woman-owned studio that does the work
            itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.04] glow-yellow"
            >
              Book a Discovery Call
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#scoper"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:border-pink"
            >
              Build your scope in 60s
            </a>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-2xl border border-border sm:grid-cols-4 sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface/40 p-5 backdrop-blur">
                <div className={`font-display text-3xl font-extrabold ${s.tone}`}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: yImage, rotateX: rx, rotateY: ry }} className="relative [perspective:1200px]">
          <div className="halo">
            <div className="relative z-10 overflow-hidden rounded-[2rem] border border-border shadow-panel float-slow">
              <video
                src={heroVideo.url}
                poster={heroPoster.url}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Millennials Creatives brand film"
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 z-20 hidden rounded-2xl border border-border bg-background/90 px-5 py-3 backdrop-blur sm:block">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Now booking</p>
            <p className="text-sm font-bold">Q3 retainers · 2 slots left</p>
          </div>
          <img
            src={cansLineup.url}
            alt="Millennials Creatives limited edition spray can line"
            loading="lazy"
            className="absolute -right-4 -top-8 z-20 hidden w-40 rotate-6 rounded-2xl border border-border object-cover shadow-panel lg:block"
          />
        </motion.div>
      </div>
    </section>
  );
}
