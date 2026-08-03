import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Apps } from "@/components/site/Apps";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & AI Platforms | Millennials Creatives" },
      {
        name: "description",
        content:
          "In-house software: BarterThat, MedCompanion AI, and other AI-powered platforms designed, built, and maintained by our team.",
      },
      { property: "og:title", content: "Products & AI Platforms | Millennials Creatives" },
      {
        property: "og:description",
        content: "AI-powered platforms designed, built, and maintained in-house.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <PageShell
      kicker="Built In-House"
      title="We ship our own software, too."
      intro="The same team that builds your platform already runs products in production."
    >
      <Apps />
    </PageShell>
  );
}
