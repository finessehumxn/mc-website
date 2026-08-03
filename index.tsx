import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Work } from "@/components/site/Work";
import { Ethos } from "@/components/site/Ethos";
import { Scoper } from "@/components/site/Scoper";
import { Apps } from "@/components/site/Apps";
import { Pricing } from "@/components/site/Pricing";
import { Government } from "@/components/site/Government";
import { ContactFooter } from "@/components/site/ContactFooter";
import ogImage from "@/assets/mc-og.png.asset.json";

const OG_URL = `https://project--7581a99a-82c4-4ac3-a6c8-e6ff8ffa4ef8.lovable.app${ogImage.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Millennials Creatives | Brand, Film & AI Software Studio" },
      {
        name: "description",
        content:
          "Certified woman-owned creative studio and software house. Branding, cinematic video, high-converting websites, AI products, and government contracting.",
      },
      { property: "og:title", content: "Millennials Creatives | Brand, Film & AI Software Studio" },
      {
        property: "og:description",
        content:
          "Bold brands, cinematic video, high-converting sites, and AI-powered software. Scope your project and get a real price range in 60 seconds.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_URL },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Ethos />
        <Scoper />
        <Apps />
        <Pricing />
        <Government />
        <ContactFooter />
      </main>
    </div>
  );
}
