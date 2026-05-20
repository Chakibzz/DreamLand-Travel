import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Details d'offre",
  description: "Details d'une offre de voyage Dreamland Travel avec informations, programme et demande de reservation.",
  path: "/details",
  image: "/heroes/details-hero-generated.png",
});

export default function DetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

