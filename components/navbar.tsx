"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Destinations" },
  { href: "/about", label: "A propos" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/explore", label: "Voyages organises" },
  { href: "/sejour-a-la-carte", label: "Sejour a la carte" },
  { href: "/omra", label: "Omra" },
  { href: "/billetterie", label: "Billetterie" },
  { href: "/transfert", label: "Transfert" },
  { href: "/visa", label: "Services Visa" },
];

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <header className="fixed top-0 z-[80] w-full border-b border-[#3b2b16] bg-[#090909]/95 backdrop-blur">
      <nav className="container-max mx-auto flex h-14 items-center gap-4 px-4 md:h-16 md:px-8">
        <Link href="/" className="flex flex-none items-center">
          <span className="relative block h-11 w-[190px] md:h-14 md:w-[260px]">
            <Image src="/dreamland-logo-cropped.png" alt="Dreamland Travel" fill sizes="(max-width: 768px) 190px, 260px" className="object-contain object-left" priority />
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-5 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "border-b border-[#a97b32] pb-0.5 text-[11px] font-bold text-[#a97b32] lg:text-[12px]"
                    : "text-[11px] text-[#d6c29a] hover:text-[#c89a4b] lg:text-[12px]"
                }
              >
                {link.label}
              </Link>
            );
          })}

          <details className="group relative">
            <summary
              className={`flex cursor-pointer list-none items-center gap-1 pb-0.5 text-[11px] font-semibold lg:text-[12px] [&::-webkit-details-marker]:hidden ${
                serviceLinks.some((link) => pathname === link.href)
                  ? "border-b border-[#a97b32] text-[#a97b32]"
                  : "text-[#d6c29a] hover:text-[#c89a4b]"
              }`}
            >
              Services
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="absolute left-1/2 top-8 w-64 -translate-x-1/2 rounded-xl border border-[#3b2b16] bg-[#090909]/98 p-2 shadow-[0_20px_55px_rgba(0,0,0,0.45)]">
              {serviceLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-3 py-2 text-[12px] transition ${
                      active ? "bg-[#1a130b] font-bold text-[#c89a4b]" : "text-[#d6c29a] hover:bg-[#12100c] hover:text-[#c89a4b]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </details>
        </div>

        {status === "authenticated" ? (
          <Link
            href="/admin"
            className="hidden rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[12px] font-semibold text-[#c89a4b] hover:bg-[#1a130b] lg:inline-flex"
          >
            Retour admin
          </Link>
        ) : null}

        <details className="relative z-[90] md:hidden">
          <summary className="inline-flex h-9 w-9 cursor-pointer list-none touch-manipulation items-center justify-center rounded-md border border-[#5b4526] bg-[#12100c] text-[#c89a4b] [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>

          <div className="fixed left-0 right-0 top-14 z-[85] border-t border-[#3b2b16] bg-[#090909] px-4 pb-4 pt-3 shadow-lg">
            <div className="space-y-2">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-md px-3 py-2 text-[13px] ${active ? "bg-[#1a130b] font-bold text-[#c89a4b]" : "text-[#d6c29a] hover:bg-[#12100c]"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="rounded-lg border border-[#3b2b16] bg-[#0d0b08] p-2">
                <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9f8a66]">Services</p>
                <div className="mt-1 space-y-1">
                  {serviceLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-md px-3 py-2 text-[13px] ${active ? "bg-[#1a130b] font-bold text-[#c89a4b]" : "text-[#d6c29a] hover:bg-[#12100c]"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              {status === "authenticated" ? (
                <Link href="/admin" className="block rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] font-semibold text-[#c89a4b]">
                  Retour admin
                </Link>
              ) : null}
            </div>

          </div>
        </details>
      </nav>
    </header>
  );
}
