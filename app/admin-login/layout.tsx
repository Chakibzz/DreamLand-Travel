import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Connexion admin",
  description: "Acces reserve a l'administration Dreamland Travel.",
  path: "/admin-login",
  noIndex: true,
});

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

