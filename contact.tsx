import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Scoper } from "@/components/site/Scoper";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Project Brief | Millennials Creatives" },
      {
        name: "description",
        content:
          "Tell us about your brand, film, web, or AI project and get a scoped price range and timeline back from the founding team.",
      },
      { property: "og:title", content: "Contact & Project Brief | Millennials Creatives" },
      {
        property: "og:description",
        content: "Send a project brief and get a scoped price range and timeline back.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell
      kicker="Start a Project"
      title="Tell us what you're building."
      intro="Scope it yourself below, then send the brief — you'll hear back from the founders, not a form robot."
    >
      <Scoper />
    </PageShell>
  );
}
