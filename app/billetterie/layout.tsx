import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Billetterie",
  description: "Reservation de billets d'avion, vols reguliers ou charter, options bagages et assistance avant depart.",
  path: "/billetterie",
  image: "/heroes/billetterie-hero-enhanced.jpg",
});

export default function BilletterieLayout({ children }: { children: React.ReactNode }) {
  return children;
}

