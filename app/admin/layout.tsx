import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/server/auth";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Administration",
  description: "Tableau de bord admin Dreamland Travel.",
  path: "/admin",
  noIndex: true,
});

const links = [
  { href: "/admin", label: "Accueil admin", description: "Vue rapide du jour" },
  { href: "/admin/requests", label: "Demandes clients", description: "Reservations et messages" },
  { href: "/admin/announcements", label: "Creer / modifier une annonce", description: "Offres visibles sur le site" },
  { href: "/admin/categories", label: "Types d'offres", description: "Voyage, Omra, Visa..." },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin-login");

  return (
    <div className="min-h-screen bg-[#f4ead8] pt-20 text-[#22180d]">
      <div className="container-max mx-auto grid gap-4 px-4 pb-10 md:grid-cols-[250px_1fr] md:px-10">
        <aside className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-4 shadow-[0_18px_45px_rgba(72,45,14,0.12)]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9f8a66]">Espace agence</p>
          <div className="relative mt-2 h-14 w-full">
            <Image src="/dreamland-logo-cropped.png" alt="Dreamland Travel" fill sizes="220px" className="object-contain object-left" priority />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#d9c9ab]">Choisissez simplement ce que vous voulez faire.</p>
          <nav className="mt-4 space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-lg border border-[#3b2b16] bg-[#16110a] px-3 py-3 text-[#d6c29a] hover:border-[#5b4526] hover:bg-[#1a140c] hover:text-[#c89a4b]">
                <span className="block text-[13px] font-semibold">{link.label}</span>
                <span className="mt-0.5 block text-[11px] text-[#9f8a66]">{link.description}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-5 border-t border-[#3b2b16] pt-4">
            <AdminLogoutButton />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}


