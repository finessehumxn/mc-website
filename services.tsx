import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Services } from "@/components/site/Services";
import { Marquee } from "@/components/site/Marquee";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Branding, Film, Web & AI — Millennials Creatives" },
      {
        name: "description",
        content:
          "Branding, video production, photography, post, web development, AI software, government contracting, and training from one full-stack creative studio.",
      },
      { property: "og:title", content: "Services | Millennials Creatives" },
      {
        property: "og:description",
        content: "Branding, film, photography, web, AI software, and government creative services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <PageShell
      kicker="What We Do"
      title="Eight disciplines. One accountable team."
      intro="Brand, film, web, and software under one roof — so nothing gets lost in the handoff between agencies."
    >
      <Services />
      <Marquee />
    </PageShell>
  );
}
