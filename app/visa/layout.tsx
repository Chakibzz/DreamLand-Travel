import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services Visa",
  description: "Assistance visa touristique, affaire, familial et E-Visa multi-destinations avec suivi de dossier.",
  path: "/visa",
  image: "/heroes/visa-hero-generated.png",
});

export default function VisaLayout({ children }: { children: React.ReactNode }) {
  return children;
}

