import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "A propos",
  description: "Decouvrez Dreamland Travel, agence de voyage et tourisme specialisee dans les voyages premium et l'accompagnement client.",
  path: "/about",
  image: "/heroes/details-hero-generated.png",
});

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}

