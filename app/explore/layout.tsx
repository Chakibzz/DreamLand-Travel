import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Voyages organises",
  description: "Circuits organises en Algerie et a l'international avec accompagnement, filtres par budget, dates et voyageurs.",
  path: "/explore",
  image: "/heroes/explore-hero-generated.png",
});

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}

