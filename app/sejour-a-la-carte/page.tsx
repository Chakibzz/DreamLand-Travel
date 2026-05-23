"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { AnnouncementModal } from "@/components/announcement-modal";
import { useCurrency } from "@/components/currency-context";

type PriceOption = { label: string; price: number | string };
type Announcement = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  location?: string;
  tags?: string[];
  priceOptions?: PriceOption[];
  richDetails?: {
    duration?: string;
    dates?: string[];
    formulas?: Array<{ name: string; hotel?: string; tariffs?: PriceOption[] }>;
    included?: string[];
    excluded?: string[];
    alert?: string;
  };
};

const customBenefits = [
  "Vols et horaires adaptes a votre planning",
  "Hebergements selon vos criteres: luxe, charme ou famille",
  "Activites et circuits entierement personnalises",
];

const destinationIdeas = ["Maldives", "Bali", "Egypte", "Istanbul", "Tunisie", "Dubai"];

const customTripSlides = [
  {
    title: "Tunisie balneaire",
    text: "Plages turquoise, hotel familial, aqua park ou sejour calme selon vos envies.",
    image: "/custom-trip/custom-trip-tunisia-beach.jpg",
  },
  {
    title: "Tunisie en liberte",
    text: "Vols, transferts et hotel adaptes a votre budget pour un sejour simple a organiser.",
    image: "/custom-trip/custom-trip-tunisia-sea.jpg",
  },
  {
    title: "Istanbul culturelle",
    text: "Quartier, hotel, visites et rythme du programme ajustes a votre style de voyage.",
    image: "/custom-trip/custom-trip-istanbul-view.jpg",
  },
  {
    title: "Bosphore & city break",
    text: "Un sejour court ou complet avec vols, hotel central, croisiere et activites au choix.",
    image: "/custom-trip/custom-trip-istanbul-bosphore.jpg",
  },
  {
    title: "Maldives premium",
    text: "Villa sur pilotis, formule repas, transferts et budget construits autour de votre projet.",
    image: "/custom-trip/custom-trip-maldives-villa.jpg",
  },
  {
    title: "Maldives plage",
    text: "Un voyage sur mesure pour lune de miel, famille ou pause au soleil.",
    image: "/custom-trip/custom-trip-maldives-beach.jpg",
  },
] as const;

export default function SejourALaCartePage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeCustomSlide, setActiveCustomSlide] = useState(0);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Sejour%20a%20la%20carte");
      const json = await response.json();
      if (response.ok && json.success) {
        setAnnouncements(json.data ?? []);
      }
    };
    void loadAnnouncements();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCustomSlide((current) => (current + 1) % customTripSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  const customSlide = customTripSlides[activeCustomSlide];

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/explore-hero-generated.png" alt="Sejour" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="max-w-[680px] text-[56px] font-bold leading-[58px] text-white">Sejour a la carte</h1>
          <p className="mt-2 max-w-xl text-[14px] text-white/90">C&apos;est vous qui dessinez votre voyage. Dreamland Travel construit le sejour autour de vos envies.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f8a66]">Votre sejour a la carte</p>
            <h2 className="mt-2 text-[36px] font-semibold leading-[42px] text-[#c89a4b]">Envie d&apos;evasion sans contraintes ?</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#d9c9ab]">
              Que vous reviez des plages paradisiaques des Maldives ou de Bali, de l&apos;histoire fascinante de l&apos;Egypte, de la magie d&apos;Istanbul ou de la douceur de la Tunisie, tout est possible.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#d9c9ab]">
              Dreamland Travel cree votre sejour ideal et 100% sur mesure vers toutes les destinations de votre choix.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {destinationIdeas.map((destination) => (
                <span key={destination} className="rounded-full border border-[#5b4526] bg-[#090909] px-3 py-1 text-[12px] font-semibold text-[#c89a4b]">
                  {destination}
                </span>
              ))}
            </div>
          </article>

          <div className="grid gap-3">
            {customBenefits.map((benefit, index) => (
              <div key={benefit} className="rounded-xl border border-[#3b2b16] bg-[#16110a] p-4">
                <p className="text-[11px] font-bold text-[#9f8a66]">0{index + 1}</p>
                <p className="mt-1 text-[15px] font-semibold text-[#d9c9ab]">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
          <div className="grid min-h-[420px] lg:grid-cols-[1.25fr_0.75fr]">
            <div className="relative min-h-[420px]">
              <Image src={customSlide.image} alt={customSlide.title} fill sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover" quality={100} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#12100c]" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {customTripSlides.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveCustomSlide(index)}
                    aria-label={`Voir ${item.title}`}
                    className={`h-2.5 rounded-full transition-all ${index === activeCustomSlide ? "w-9 bg-[#c89a4b]" : "w-2.5 bg-white/60 hover:bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f8a66]">Inspirations a la carte</p>
              <h2 className="mt-2 text-[38px] font-semibold leading-[44px] text-[#c89a4b]">{customSlide.title}</h2>
              <p className="mt-3 text-[14px] leading-7 text-[#d9c9ab]">{customSlide.text}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#5b4526] px-3 py-1 text-[12px] font-semibold text-[#d9c9ab]">Hotel selon criteres</span>
                <span className="rounded-full border border-[#5b4526] px-3 py-1 text-[12px] font-semibold text-[#d9c9ab]">Vols adaptes</span>
                <span className="rounded-full border border-[#5b4526] px-3 py-1 text-[12px] font-semibold text-[#d9c9ab]">Activites au choix</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="#formulaire-sejour" className="rounded-lg bg-[#c89a4b] px-5 py-3 text-[13px] font-bold text-white hover:bg-[#b88735]">
                  Construire ce sejour
                </Link>
                <button type="button" onClick={() => setActiveCustomSlide((activeCustomSlide + 1) % customTripSlides.length)} className="rounded-lg border border-[#5f4722] px-5 py-3 text-[13px] font-bold text-[#d9c9ab] hover:bg-[#16110a]">
                  Voir une autre idee
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]">
                <Image src={item.image} alt={item.title} fill className="object-cover image-hover" quality={100} unoptimized />
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
                <p className="mt-1 text-[13px] font-semibold text-[#d9c9ab]">A partir de {formatPrice(Number(item.price))}</p>
                <p className="mt-2 line-clamp-2 text-[12px] text-[#9f8a66]">{item.description}</p>
                <button onClick={() => setSelectedAnnouncement(item)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        {announcements.length === 0 ? (
          <p className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4 text-[13px] text-[#9f8a66]">
            Aucune offre fixe pour le moment. Utilisez le formulaire ci-dessous pour demander un sejour totalement personnalise.
          </p>
        ) : null}

        <div id="formulaire-sejour" className="mt-6 scroll-mt-28">
          <ServiceBookingForm serviceType="CUSTOM_TRIP" defaultDestination="Sejour a la carte" title="Construire mon sejour sur mesure" customTripMode />
        </div>
      </section>

      <AnnouncementModal
        open={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={
          selectedAnnouncement
            ? {
                title: selectedAnnouncement.title,
                description: selectedAnnouncement.description,
                image: selectedAnnouncement.image,
                location: selectedAnnouncement.location,
                categoryName: "Sejour a la carte",
                price: selectedAnnouncement.price,
                tags: selectedAnnouncement.tags,
                priceOptions: selectedAnnouncement.priceOptions,
                richDetails: selectedAnnouncement.richDetails,
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="CUSTOM_TRIP"
      />
    </>
  );
}
