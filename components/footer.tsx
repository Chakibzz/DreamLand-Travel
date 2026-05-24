import Link from "next/link";

import Image from "next/image";

const quickLinks = [
  { href: "/", label: "Destinations" },
  { href: "/explore", label: "Voyages organises" },
  { href: "/about", label: "Notre histoire" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://www.facebook.com/people/Dreamland-Travel/61587513642728/#", label: "Facebook", icon: "facebook" },
  { href: "https://www.instagram.com/dreamlandtravel.dz/", label: "Instagram", icon: "instagram" },
  { href: "https://www.tiktok.com/@dreamlandtravel.dz", label: "TikTok", icon: "tiktok" },
  { href: "https://wa.me/213557010838", label: "WhatsApp", icon: "whatsapp" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions legales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialite" },
  { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
];

function SocialIcon({ name }: { name: string }) {
  const className = "h-4 w-4 flex-none";

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M14 8.5V6.8c0-.7.3-1.1 1.2-1.1H17V3h-2.6C11.8 3 10 4.6 10 7.1v1.4H8v3h2V21h3.2v-9.5h2.7l.4-3H13.2Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M16.8 7.3h.01" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M15.2 3c.4 2.4 1.8 3.8 4.2 4.1v3.1a7 7 0 0 1-4.1-1.3v5.9c0 3.7-2.4 6.2-5.9 6.2a5.4 5.4 0 0 1-5.6-5.4c0-3.3 2.4-5.6 5.8-5.6.4 0 .8 0 1.2.1v3.2a4 4 0 0 0-1.1-.2c-1.6 0-2.7 1-2.7 2.4 0 1.5 1 2.4 2.5 2.4 1.6 0 2.6-1 2.6-3V3h3.1Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 20.5 8.7 17A7.1 7.1 0 1 1 12 17.8a7.2 7.2 0 0 1-3.3-.8l-1.2 3.5Z" />
      <path d="M9.8 8.8c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.6 1.5c.1.3.1.5-.1.7l-.4.5c.7 1.1 1.5 1.8 2.6 2.4l.6-.7c.2-.2.4-.2.7-.1l1.4.7c.3.1.4.3.4.6v.4c0 .4-.2.8-.5 1-1.1.7-3.4.2-5.4-1.8-2-2-2.6-4.3-1.9-5.1Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#3b2b16] bg-[#090909] text-[#f2e4cc]">
      <div className="container-max mx-auto grid grid-cols-1 gap-6 px-5 py-20 md:grid-cols-4 md:px-16">
        <div>
          <div className="relative mb-3 h-16 w-[260px] max-w-full">
            <Image src="/dreamland-logo-cropped.png" alt="Dreamland Travel" fill sizes="260px" className="object-contain object-left" />
          </div>
          <p className="mb-4 text-[12px] uppercase tracking-wider text-[#9f8a66]">Agence de voyage et tourisme</p>
          <p className="text-base text-[#d6c29a]">Experiences de voyage premium en Mediterranee et au coeur du Sahara.</p>
          <Link href="/admin-login?from=%2Fadmin" className="mt-5 inline-flex rounded-lg border border-[#5f4722] px-4 py-2 text-[12px] font-bold text-[#d6c29a] hover:bg-[#16110a] hover:text-[#e0b86b]">
            Acces staff
          </Link>
        </div>

        <div>
          <h5 className="mb-4 text-lg font-bold">Liens rapides</h5>
          <ul className="space-y-2 text-base text-[#d6c29a]">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#e0b86b]">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-4 text-lg font-bold">Reseaux sociaux</h5>
          <ul className="space-y-2 text-base text-[#d6c29a]">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#e0b86b]">
                  <SocialIcon name={link.icon} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="mb-4 text-lg font-bold">Mentions legales</h5>
          <ul className="space-y-2 text-base text-[#d6c29a]">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[#e0b86b]">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-max mx-auto border-t border-[#3b2b16] px-5 py-6 text-center text-sm text-[#9f8a66] md:px-16">
        © 2026 DreamLand Travel. Boufarik, Algerie. Tous droits reserves.
      </div>
    </footer>
  );
}
