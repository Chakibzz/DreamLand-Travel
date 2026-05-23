"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrency } from "@/components/currency-context";

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
  },
  {
    title: "Omra",
    eyebrow: "Accompagnement spirituel",
    text: "Formules Omra avec suivi dossier, preferences hotel, type de chambre et assistance avant depart.",
    image: "/omra-hero-unsplash.jpg",
    href: "/omra",
    cta: "Voir la Omra",
  },
  {
    title: "Billetterie",
    eyebrow: "Vols & billets",
    text: "Recherche de vols, horaires, bagages et options adaptes au planning du client.",
    image: "/heroes/billetterie-hero-enhanced.jpg",
    href: "/billetterie",
    cta: "Demander un billet",
  },
  {
    title: "Sejour a la carte",
    eyebrow: "Voyage sur mesure",
    text: "Destination, hotel, aqua park, all inclusive, activites et budget construits selon l'envie du client.",
    image: "/custom-trip/custom-trip-maldives-villa.jpg",
    href: "/sejour-a-la-carte",
    cta: "Construire mon sejour",
  },
  {
    title: "Services Visa",
    eyebrow: "Dossier & suivi",
    text: "Accompagnement pour preparer le dossier, verifier les pieces et suivre la demande.",
    image: "/heroes/visa-hero-generated.png",
    href: "/visa",
    cta: "Voir les visas",
  },
  {
    title: "Transfert",
    eyebrow: "Chauffeur & trajet",
    text: "Transferts aeroport, hotel, inter-villes et trajets professionnels avec reservation rapide.",
    image: "/heroes/transfert-hero-enhanced.jpg",
    href: "/transfert",
    cta: "Reserver un transfert",
  },
] as const;

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
      richDetails?: { duration?: string; dates?: string[]; formulas?: Array<{ name: string }> };
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
        <Image src="/heroes/home-hero-generated.png" alt="Hero" fill priority sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-36 md:px-10 md:pt-48">
          <h1 className="max-w-[560px] text-[56px] font-bold leading-[58px] text-white">Decouvrez la Magie de l&apos;Algerie</h1>
          <div className="mt-7 max-w-[720px] rounded-xl border border-white/20 bg-[#12100c]/25 p-3 backdrop-blur-xl">
            <p className="px-1 text-[14px] leading-7 text-white/90">
              Des voyages organises, sejours personnalises, Omra, billets, transferts et services visa prepares avec un suivi humain du premier contact jusqu&apos;au retour.
            </p>
          </div>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">SERVICES DREAMLAND</p>
            <h2 className="mt-1 text-[42px] font-semibold leading-[48px] text-[#c89a4b]">Tout le voyage au meme endroit</h2>
          </div>
          <Link href={activeService.href} className="rounded-lg border border-[#5f4722] px-4 py-2 text-[13px] font-bold text-[#d9c9ab] hover:bg-[#16110a]">
            {activeService.cta}
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
          <div className="grid min-h-[430px] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[430px]">
              <Image src={activeService.image} alt={activeService.title} fill sizes="(max-width: 1024px) 100vw, 55vw" quality={100} unoptimized className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#12100c]" />
            </div>
            <div className="flex flex-col justify-center p-5 md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f8a66]">{activeService.eyebrow}</p>
              <h3 className="mt-2 text-[44px] font-semibold leading-[50px] text-[#c89a4b]">{activeService.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#d9c9ab]">{activeService.text}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {serviceHighlights.map((service, index) => (
                  <button
                    key={service.title}
                    type="button"
                    onClick={() => setActiveServiceIndex(index)}
                    className={`rounded-lg border px-3 py-2 text-left text-[12px] font-semibold transition ${index === activeServiceIndex ? "border-[#c89a4b] bg-[#1d160d] text-[#c89a4b]" : "border-[#3b2b16] text-[#d9c9ab] hover:bg-[#16110a]"}`}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href={activeService.href} className="rounded-lg bg-[#c89a4b] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#b88735]">
                  {activeService.cta}
                </Link>
                <button type="button" onClick={() => setActiveServiceIndex((activeServiceIndex + 1) % serviceHighlights.length)} className="rounded-lg border border-[#5f4722] px-5 py-3 text-[13px] font-bold text-[#d9c9ab] hover:bg-[#16110a]">
                  Service suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#12100c] py-14 scroll-reveal">
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
          <h2 className="text-[38px] font-semibold text-[#c89a4b]">Dernieres annonces ajoutees</h2>
          <Link href="/explore" className="text-[13px] font-semibold text-[#d9c9ab] hover:text-[#c89a4b]">Voir toutes les annonces</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latestAnnouncements.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c]">
              <div className="relative h-[170px]">
                <Image src={item.image} alt={item.title} fill className="object-cover image-hover" />
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
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#d9c9ab]">{item.description}</p>
                <p className="mt-2 text-[11px] text-[#9f8a66]">{item.location}</p>
                {item.richDetails?.duration || item.richDetails?.dates?.length ? (
                  <p className="mt-1 text-[11px] text-[#d9c9ab]">
                    {item.richDetails.duration ? item.richDetails.duration : null}
                    {item.richDetails.duration && item.richDetails.dates?.length ? " · " : null}
                    {item.richDetails.dates?.length ? `${item.richDetails.dates.length} departs` : null}
                  </p>
                ) : null}
                <p className="mt-1 text-[18px] font-bold text-[#c89a4b]">A partir de {formatPrice(Number(item.price))}</p>
                {item.priceOptions?.[0] ? (
                  <p className="mt-1 text-[11px] text-[#d9c9ab]">{item.priceOptions[0].label}: {formatPrice(Number(item.priceOptions[0].price))}</p>
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
          <h2 className="mt-1 text-[42px] font-semibold text-[#c89a4b]">Les voix des explorateurs modernes</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <article key={name} className="rounded-xl border border-[#ebedf8] bg-[#12100c] p-5">
              <p className="text-[12px] text-[#d9c9ab]">&quot;{quote}&quot;</p>
              <p className="mt-5 text-[19px] font-semibold text-[#c89a4b]">{name}</p>
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


