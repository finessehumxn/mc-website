import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Pricing } from "@/components/site/Pricing";
import { Scoper } from "@/components/site/Scoper";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Project Scoper | Millennials Creatives" },
      {
        name: "description",
        content:
          "Transparent packages from $5K sprints to $100K+ government and enterprise engagements. Scope your project and get a real price range in 60 seconds.",
      },
      { property: "og:title", content: "Pricing & Project Scoper | Millennials Creatives" },
      {
        property: "og:description",
        content: "Transparent tiers from $5K to $100K+, plus an instant project scoper.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <PageShell
      kicker="Packages"
      title="Transparent pricing. Real scope."
      intro="Pick a tier or build your own estimate — no discovery call required to see a number."
    >
      <Pricing />
      <Scoper />
    </PageShell>
  );
}
