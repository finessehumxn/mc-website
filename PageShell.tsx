import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { ContactFooter } from "./ContactFooter";

export function PageShell({
  children,
  title,
  kicker,
  intro,
}: {
  children: ReactNode;
  title?: string;
  kicker?: string;
  intro?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        {title && (
          <section className="relative overflow-hidden border-b border-border pt-32 pb-14 sm:pt-40 sm:pb-20">
            <div className="pointer-events-none absolute inset-0 grid-lines opacity-25" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
              {kicker && (
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink" />
                  {kicker}
                </span>
              )}
              <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,5.2vw,4rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
                {title}
              </h1>
              {intro && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {intro}
                </p>
              )}
            </div>
          </section>
        )}
        {children}
        <ContactFooter />
      </main>
    </div>
  );
}
