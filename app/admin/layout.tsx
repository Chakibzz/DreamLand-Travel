import Link from "next/link";
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
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/announcements", label: "Annonces" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/requests", label: "Workflow clients" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin-login");

  return (
    <div className="min-h-screen bg-[#090909] pt-20">
      <div className="container-max mx-auto grid gap-4 px-4 pb-10 md:grid-cols-[250px_1fr] md:px-10">
        <aside className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#9f8a66]">Admin</p>
          <h2 className="mt-1 text-[26px] font-semibold text-[#c89a4b]">DreamLand</h2>
          <nav className="mt-4 space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-[13px] text-[#d6c29a] hover:bg-[#1a140c] hover:text-[#c89a4b]">
                {link.label}
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

