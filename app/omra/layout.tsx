import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Omra",
  description: "Packages Omra economique, confort et VIP avec accompagnement complet et formulaire de reservation.",
  path: "/omra",
  image: "/omra-hero-unsplash.jpg",
});

export default function OmraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
