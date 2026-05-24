"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrency } from "@/components/currency-context";
import { AnnouncementImageBadge } from "@/components/announcement-image-badge";

const testimonials = [
  ["DreamLand Travel a depasse toutes nos attentes. Notre expedition dans le Sahara etait parfaitement organisee.", "Mohamed F.", "VOYAGEUR PASSIONNE"],
  ["L'itineraire sur mesure a Alger nous a permis de decouvrir des lieux que les touristes ratent souvent.", "Yasmine B.", "EXPLORATRICE CULTURELLE"],
  ["Une attention aux details remarquable. Chaque transfert et chaque hotel etaient irreprochables.", "Sofiane K.", "VOYAGEUR PREMIUM"],
] as const;

const serviceHighlights = [
  {
    title: "Voyages organises",
    eyebrow: "Annonce voyage organise",
    text: "Circuits publies par l'agence avec dates, programmes, avantages visibles et tarifs par chambre.",
    image: "/heroes/explore-hero-generated.png",
    href: "/explore",
    cta: "Voir les voyages",
    icon: "route",
  },
  {
    title: "Omra",
    eyebrow: "Accompagnement spirituel",
    text: "Formules Omra avec suivi dossier, preferences hotel, type de chambre et assistance avant depart.",
    image: "/omra-hero-unsplash.jpg",
    href: "/omra",
    cta: "Voir la Omra",
    icon: "crescent",
  },
  {
    title: "Billetterie",
    eyebrow: "Vols & billets",
    text: "Recherche de vols, horaires, bagages et options adaptes au planning du client.",
    image: "/heroes/billetterie-hero-enhanced.jpg",
    href: "/billetterie",
    cta: "Demander un billet",
    icon: "ticket",
  },
  {
    title: "Sejour a la carte",
    eyebrow: "Voyage sur mesure",
    text: "Destination, hotel, aqua park, all inclusive, activites et budget construits selon l'envie du client.",
    image: "/custom-trip/custom-trip-maldives-villa.jpg",
    href: "/sejour-a-la-carte",
    cta: "Construire mon sejour",
    icon: "compass",
  },
  {
    title: "Services Visa",
    eyebrow: "Dossier & suivi",
    text: "Accompagnement pour preparer le dossier, verifier les pieces et suivre la demande.",
    image: "/heroes/visa-hero-generated.png",
    href: "/visa",
    cta: "Voir les visas",
    icon: "passport",
  },
  {
    title: "Transfert",
    eyebrow: "Chauffeur & trajet",
    text: "Transferts aeroport, hotel, inter-villes et trajets professionnels avec reservation rapide.",
    image: "/heroes/transfert-hero-enhanced.jpg",
    href: "/transfert",
    cta: "Reserver un transfert",
    icon: "car",
  },
] as const;

type ServiceIconName = (typeof serviceHighlights)[number]["icon"];

function ServiceIcon({ name }: { name: ServiceIconName }) {
  const common = "h-8 w-8";

  if (name === "route") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19c3-6 11 0 14-6" />
        <path d="M5 5c3 6 11 0 14 6" />
        <circle cx="5" cy="19" r="1.8" />
        <circle cx="19" cy="5" r="1.8" />
      </svg>
    );
  }

  if (name === "crescent") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 15.5A7.5 7.5 0 0 1 8.5 6.5 7.6 7.6 0 1 0 17.5 15.5Z" />
        <path d="M18.5 5.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" />
      </svg>
    );
  }

  if (name === "ticket") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
        <path d="M9 8v8" />
        <path d="M13 10h4" />
        <path d="M13 14h3" />
      </svg>
    );
  }

  if (name === "compass") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </svg>
    );
  }

  if (name === "passport") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <circle cx="11.5" cy="11" r="3" />
        <path d="M8.5 16h6" />
        <path d="M11.5 8v6" />
        <path d="M8.8 11h5.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 17h12l1-6H5l1 6Z" />
      <path d="M8 11l1.5-3h5L16 11" />
      <circle cx="8" cy="18" r="1.6" />
      <circle cx="16" cy="18" r="1.6" />
      <path d="M7 14h10" />
    </svg>
  );
}

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [latestAnnouncements, setLatestAnnouncements] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      price: string;
      location: string;
      tags?: string[];
      priceOptions?: Array<{ label: string; price: number | string }>;
      richDetails?: { duration?: string; dates?: string[]; formulas?: Array<{ name: string }>; badge?: string };
    }>
  >([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/announcements");
      const json = await res.json();
      if (res.ok && json.success) {
        setLatestAnnouncements((json.data ?? []).slice(0, 3));
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveServiceIndex((current) => (current + 1) % serviceHighlights.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);

  const activeService = serviceHighlights[activeServiceIndex];

  return (
    <>
      <section className="relative h-[610px] overflow-hidden scroll-reveal md:h-[760px]">
        <Image src={activeService.image} alt={activeService.title} fill priority sizes="100vw" quality={100} unoptimized className="object-cover transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/86 via-[#30200e]/48 to-[#090909]/14" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2b1b0b]/48" />
        <div className="container-max relative mx-auto px-4 pt-36 md:px-10 md:pt-48">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d8ad63]">{activeService.eyebrow}</p>
          <h1 className="mt-3 max-w-[620px] text-[54px] font-bold leading-[58px] text-white md:text-[66px] md:leading-[70px]">{activeService.title}</h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-white/90">{activeService.text}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={activeService.href} className="rounded-lg bg-[#c89a4b] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#b88735]">
              {activeService.cta}
            </Link>
            <button type="button" onClick={() => setActiveServiceIndex((activeServiceIndex + 1) % serviceHighlights.length)} className="rounded-lg border border-white/30 bg-[#12100c]/35 px-5 py-3 text-[13px] font-bold text-white backdrop-blur-md hover:bg-[#12100c]/60">
              Service suivant
            </button>
          </div>
          <div className="mt-8 flex gap-2">
            {serviceHighlights.map((service, index) => (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveServiceIndex(index)}
                aria-label={`Afficher ${service.title}`}
                className={`h-2.5 rounded-full transition-all ${index === activeServiceIndex ? "w-10 bg-[#c89a4b]" : "w-2.5 bg-white/65 hover:bg-white"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">NOS SERVICES</p>
            <h2 className="mt-1 text-[42px] font-semibold leading-[48px] text-[#7c5420]">Choisissez votre besoin</h2>
          </div>
          <p className="max-w-xl text-[13px] leading-6 text-[#6f5b3b]">Accedez directement au service souhaite. Chaque fiche ouvre la page correspondante pour consulter les offres ou envoyer une demande.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceHighlights.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative overflow-hidden rounded-xl border border-[#d8c29f] bg-[#fff8ec] p-5 shadow-[0_16px_38px_rgba(72,45,14,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#c89a4b] hover:bg-white hover:shadow-[0_22px_50px_rgba(72,45,14,0.16)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9aa75] bg-[#1a130b] text-[#c89a4b] transition duration-300 group-hover:border-[#c89a4b] group-hover:bg-[#c89a4b] group-hover:text-[#12100c]">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="mt-5 text-[24px] font-semibold text-[#8a6025]">{service.title}</h3>
              <p className="mt-2 min-h-[70px] text-[13px] leading-6 text-[#5e4b31]">{service.text}</p>
              <span className="mt-4 inline-flex text-[12px] font-bold text-[#8b714b] transition group-hover:text-[#c89a4b]">{service.cta}</span>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#c89a4b] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#22180d] py-14 scroll-reveal">
        <div className="container-max mx-auto grid items-center gap-10 px-4 md:grid-cols-2 md:px-10">
          <div className="group relative overflow-hidden rounded-2xl">
            <Image src="/upscaled/83a4543bcba0.jpg" alt="Voyageur" width={520} height={420} quality={100} className="w-full rounded-2xl image-hover" />
            <div className="absolute bottom-[-18px] right-6 rounded-lg bg-[#a97b32] px-6 py-4 text-white">
              <p className="text-[30px] leading-none font-semibold">24/7</p>
              <p className="text-[10px] tracking-widest">ASSISTANCE CLIENT</p>
            </div>
          </div>
          <div className="text-[#f2e4cc]">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">EXCELLENCE INEGALEE</p>
            <h2 className="mt-2 text-[48px] font-semibold leading-[54px] text-[#c89a4b]">Nous construisons votre voyage de reve avec precision</h2>
            <div className="mt-6 space-y-5 text-[16px]">
              <p><strong>Conseils d&apos;experts</strong><br/>Nos experts locaux revelent les joyaux caches de l&apos;Algerie.</p>
              <p><strong>Itineraires personnalises</strong><br/>Chaque voyage est adapte a votre style et vos attentes.</p>
              <p><strong>Service premium</strong><br/>Suivi humain, assistance continue et execution rigoureuse.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[38px] font-semibold text-[#7c5420]">Dernieres annonces ajoutees</h2>
          <Link href="/explore" className="text-[13px] font-semibold text-[#6f5b3b] hover:text-[#c89a4b]">Voir toutes les annonces</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latestAnnouncements.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-[#d8c29f] bg-[#fff8ec] shadow-[0_16px_38px_rgba(72,45,14,0.08)]">
              <div className="relative h-[230px] bg-[#090909]">
                <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" quality={100} className="object-contain" unoptimized />
                <AnnouncementImageBadge label={item.richDetails?.badge} />
              </div>
              <div className="p-4">
                {item.tags?.length ? (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-[#5b4526] bg-[#090909] px-2 py-0.5 text-[10px] font-semibold text-[#c89a4b]">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h3 className="text-[24px] font-semibold text-[#8a6025]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#5e4b31]">{item.description}</p>
                <p className="mt-2 text-[11px] text-[#9f8a66]">{item.location}</p>
                {item.richDetails?.duration || item.richDetails?.dates?.length ? (
                  <p className="mt-1 text-[11px] text-[#5e4b31]">
                    {item.richDetails.duration ? item.richDetails.duration : null}
                    {item.richDetails.duration && item.richDetails.dates?.length ? " · " : null}
                    {item.richDetails.dates?.length ? `${item.richDetails.dates.length} departs` : null}
                  </p>
                ) : null}
                <p className="mt-1 text-[18px] font-bold text-[#c89a4b]">A partir de {formatPrice(Number(item.price))}</p>
                {item.priceOptions?.[0] ? (
                  <p className="mt-1 text-[11px] text-[#5e4b31]">{item.priceOptions[0].label}: {formatPrice(Number(item.priceOptions[0].price))}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {latestAnnouncements.length === 0 ? <p className="mt-3 text-[12px] text-[#9f8a66]">Aucune annonce recente pour le moment.</p> : null}
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">TEMOIGNAGES</p>
          <h2 className="mt-1 text-[42px] font-semibold text-[#7c5420]">Les voix des explorateurs modernes</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <article key={name} className="rounded-xl border border-[#d8c29f] bg-[#fff8ec] p-5 shadow-[0_16px_38px_rgba(72,45,14,0.08)]">
              <p className="text-[12px] text-[#5e4b31]">&quot;{quote}&quot;</p>
              <p className="mt-5 text-[19px] font-semibold text-[#8a6025]">{name}</p>
              <p className="text-[10px] text-[#9f8a66]">{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-max mx-auto px-4 pb-14 scroll-reveal md:px-10">
        <div className="rounded-2xl bg-[#a97b32] p-6 text-white shadow-xl md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-[42px] font-semibold">Pret a planifier votre voyage ?</h3>
            <p className="text-[14px] text-white/90">Parlez a nos conseillers pour recevoir un devis personnalise.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 md:mt-0">
            <a
              href="mailto:dreamlandtravel.dz@gmail.com"
              className="rounded-lg bg-[#12100c] px-5 py-3 text-[13px] font-bold text-[#c89a4b]"
            >
              Email
            </a>
            <a
              href="https://wa.me/213557010838?text=Bonjour%2C%20je%20souhaite%20obtenir%20des%20informations%20concernant%20vos%20offres%20de%20voyage."
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#c89a4b] px-5 py-3 text-[13px] font-bold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


