"use client";

import Image from "next/image";
import { useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { AnnouncementModal } from "@/components/announcement-modal";

const cards = [
  { title: "Sahara Signature", text: "Itineraire prive adapte a votre rythme.", image: "/upscaled/2e3467b739eb.jpg" },
  { title: "Mediterranee Prestige", text: "Programme premium sur mesure pour couples et familles.", image: "/upscaled/31df43bda50b.jpg" },
  { title: "Culture & Patrimoine", text: "Parcours personnalise entre histoire et experiences locales.", image: "/upscaled/0fe489d651c3.jpg" },
];

export default function SejourALaCartePage() {
  const [selectedCard, setSelectedCard] = useState<(typeof cards)[number] | null>(null);

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/explore-hero-generated.png" alt="Sejour" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="max-w-[680px] text-[56px] font-bold leading-[58px] text-white">Sejour a la carte</h1>
          <p className="mt-2 text-[14px] text-white/90">Composez un voyage totalement personnalise avec nos experts.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]">
                <Image src={card.image} alt={card.title} fill className="object-cover image-hover" quality={100} unoptimized />
              </div>
              <div className="p-4">
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{card.title}</h3>
                <p className="mt-1 text-[13px] text-[#d9c9ab]">{card.text}</p>
                <button onClick={() => setSelectedCard(card)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6">
          <ServiceBookingForm serviceType="CUSTOM_TRIP" defaultDestination="Sejour a la carte" title="Demande personnalisee" />
        </div>
      </section>

      <AnnouncementModal
        open={Boolean(selectedCard)}
        onClose={() => setSelectedCard(null)}
        announcement={
          selectedCard
            ? {
                title: selectedCard.title,
                description: `${selectedCard.text} Construction de programme 100% personnalise selon votre budget et vos envies.`,
                image: selectedCard.image,
                categoryName: "Sejour a la carte",
                highlights: ["Itineraire sur mesure", "Selection premium", "Conseiller dedie"],
              }
            : null
        }
        serviceType="CUSTOM_TRIP"
      />
    </>
  );
}


