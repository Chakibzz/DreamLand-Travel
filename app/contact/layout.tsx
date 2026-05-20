import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Contactez Dreamland Travel a Boufarik pour une demande de voyage, Omra, visa, billet ou transfert.",
  path: "/contact",
  image: "/heroes/contact-hero-generated.png",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

