import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Transfert",
  description: "Transferts aeroport-hotel, inter-villes et business avec chauffeur, confort et reservation rapide.",
  path: "/transfert",
  image: "/heroes/transfert-hero-enhanced.jpg",
});

export default function TransfertLayout({ children }: { children: React.ReactNode }) {
  return children;
}

