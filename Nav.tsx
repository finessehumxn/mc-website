import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Link } from "@tanstack/react-router";
import mcLogo from "@/assets/mc-logo.png.asset.json";

const links = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "Products", to: "/products" },
  { label: "Pricing", to: "/pricing" },
  { label: "Government", to: "/government" },
] as const;


export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          solid ? "backdrop-blur-xl bg-background/80 border-b border-border" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={mcLogo.url} alt="Millennials Creatives" className="h-9 w-auto sm:h-10" />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.04] glow-yellow sm:inline-flex"
            >
              Book a Call
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-foreground" />
                <span className="block h-0.5 w-5 bg-foreground" />
              </span>
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-border px-5 py-4 lg:hidden">
            <div className="grid gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="text-sm font-semibold text-primary">
                Book a Call
              </Link>
            </div>
          </div>
        )}
      </div>
      <motion.div className="h-0.5 origin-left bg-pink" style={{ scaleX: progress }} />
    </header>
  );
}
