import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Work } from "@/components/site/Work";
import { Ethos } from "@/components/site/Ethos";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work & Case Studies | Millennials Creatives" },
      {
        name: "description",
        content:
          "Selected case studies with real outcomes: brand launches, cinematic campaigns, and AI platforms built and shipped in-house.",
      },
      { property: "og:title", content: "Work & Case Studies | Millennials Creatives" },
      {
        property: "og:description",
        content: "Brand launches, cinematic campaigns, and AI platforms with measurable results.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <PageShell
      kicker="Selected Work"
      title="Proof, not portfolios."
      intro="Every engagement below shipped, launched, and moved a number that mattered to the client."
    >
      <Work />
      <Ethos />
    </PageShell>
  );
}
