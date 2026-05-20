import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Destinations" },
  { href: "/explore", label: "Voyages organises" },
  { href: "/about", label: "Notre histoire" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://www.facebook.com/people/Dreamland-Travel/61587513642728/#", label: "Facebook" },
  { href: "https://www.instagram.com/dreamlandtravel.dz/", label: "Instagram" },
  { href: "https://wa.me/213557010838", label: "WhatsApp" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions legales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialite" },
  { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#3b2b16] bg-[#090909] text-[#f2e4cc]">
      <div className="container-max mx-auto grid grid-cols-1 gap-6 px-5 py-20 md:grid-cols-4 md:px-16">
        <div>
          <div className="mb-2 text-4xl font-bold italic text-[#c89a4b]">Dreamland Travel</div>
          <p className="mb-4 text-[12px] uppercase tracking-wider text-[#9f8a66]">Agence de voyage et tourisme</p>
          <p className="text-base text-[#d6c29a]">Experiences de voyage premium en Mediterranee et au coeur du Sahara.</p>
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
                <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-[#e0b86b]">{link.label}</a>
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
        © 2024 DreamLand Travel. Boufarik, Algerie. Tous droits reserves.
      </div>
    </footer>
  );
}
