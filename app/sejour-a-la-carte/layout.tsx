import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sejour a la carte",
  description: "Voyages personnalises selon vos dates, budget, envies et nombre de voyageurs.",
  path: "/sejour-a-la-carte",
  image: "/heroes/home-hero-generated.png",
});

export default function SejourALaCarteLayout({ children }: { children: React.ReactNode }) {
  return children;
}

