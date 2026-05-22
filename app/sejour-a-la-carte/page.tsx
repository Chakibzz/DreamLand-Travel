"use client";

import Image from "next/image";
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

export default function SejourALaCartePage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

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

        <div className="mt-6">
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
