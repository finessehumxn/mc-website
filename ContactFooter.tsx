import { useState } from "react";
import { Reveal, SectionLabel } from "./Reveal";
import mcLogo from "@/assets/mc-logo.png.asset.json";

export function ContactFooter() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section id="contact" className="relative overflow-hidden border-t border-border py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-violet/20 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <SectionLabel>Let's Build</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
              Tell us what you need.
              <br />
              <span className="text-gradient">We respond in 24 hours.</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Book a discovery call or send a project brief, and we route it to the right founder.
              Same-day replies before 3 PM Arizona time.
            </p>
            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Studio</p>
                <p className="mt-1 font-semibold">Arizona · Remote worldwide</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Minimum</p>
                <p className="mt-1 font-semibold">$5K projects · $9K/mo retainers</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="surface-panel rounded-3xl p-7 sm:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <input
                    required
                    className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-yellow"
                    placeholder="Jordan Reyes"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <input
                    required
                    type="email"
                    className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-yellow"
                    placeholder="you@company.com"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm">
                <span className="text-muted-foreground">Budget range</span>
                <select className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-yellow">
                  <option>$5K – $15K</option>
                  <option>$15K – $50K</option>
                  <option>$50K – $100K</option>
                  <option>$100K+ / Government</option>
                </select>
              </label>
              <label className="mt-4 block text-sm">
                <span className="text-muted-foreground">Project brief</span>
                <textarea
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-yellow"
                  placeholder="What are we building, and by when?"
                />
              </label>
              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.02] glow-yellow"
              >
                {sent ? "Brief received — check your inbox" : "Send inquiry"}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border bg-ink/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <img src={mcLogo.url} alt="Millennials Creatives" className="h-10 w-auto" />
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Millennials Creatives. Certified WOSB · MBE · DBE.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#services" className="hover:text-foreground">Services</a>
            <a href="#work" className="hover:text-foreground">Work</a>
            <a href="#government" className="hover:text-foreground">Government</a>
          </div>
        </div>
      </footer>
    </>
  );
}
