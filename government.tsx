import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Government } from "@/components/site/Government";

export const Route = createFileRoute("/government")({
  head: () => ({
    meta: [
      { title: "Government Contracting | WOSB Creative & Tech Vendor" },
      {
        name: "description",
        content:
          "SAM.gov registered, certified woman-owned creative and technology vendor for federal, state, local, and tribal agencies. NAICS-aligned scope and past performance ready.",
      },
      { property: "og:title", content: "Government Contracting | Millennials Creatives" },
      {
        property: "og:description",
        content: "SAM.gov registered WOSB/MBE/DBE vendor for public-sector creative and tech services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GovernmentPage,
});

function GovernmentPage() {
  return (
    <PageShell
      kicker="Public Sector"
      title="A creative partner your contracting officer can approve."
      intro="Certified woman-owned, SAM.gov registered, and structured for federal, state, local, and tribal work."
    >
      <Government />
    </PageShell>
  );
}
