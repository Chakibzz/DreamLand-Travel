"use client";

import Image from "next/image";
import { useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { AnnouncementModal } from "@/components/announcement-modal";

const transfers = [
  { title: "Aeroport - Hotel", text: "Transfert prive 24/7 avec chauffeur.", image: "/upscaled/7d5879b3811b.jpg", transferType: "AEROPORT_HOTEL" as const },
  { title: "Inter-villes", text: "Mise a disposition vehicule confortable.", image: "/upscaled/84ef16f16089.jpg", transferType: "INTER_VILLES" as const },
  { title: "Business Transfer", text: "Solution premium pour deplacements pro.", image: "/upscaled/e015a6eaddf0.jpg", transferType: "BUSINESS" as const },
];

export default function TransfertPage() {
  const [selectedTransfer, setSelectedTransfer] = useState<(typeof transfers)[number] | null>(null);

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/transfert-hero-enhanced.jpg" alt="Transfert" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Transfert</h1>
          <p className="mt-2 text-[14px] text-white/90">Service de transport aeroport, hotel et circuits.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {transfers.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]"><Image src={item.image} alt={item.title} fill className="object-cover image-hover" quality={100} unoptimized /></div>
              <div className="p-4">
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{item.title}</h3>
                <p className="mt-1 text-[13px] text-[#d9c9ab]">{item.text}</p>
                <button onClick={() => setSelectedTransfer(item)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <ServiceBookingForm serviceType="TRANSFER" defaultDestination="Transfert" title="Reservation transport" />
        </div>
      </section>

      <AnnouncementModal
        open={Boolean(selectedTransfer)}
        onClose={() => setSelectedTransfer(null)}
        announcement={
          selectedTransfer
            ? {
                title: selectedTransfer.title,
                description: `${selectedTransfer.text} Planification flexible selon votre arrivee et votre planning.`,
                image: selectedTransfer.image,
                categoryName: "Transfert",
                highlights: ["Chauffeurs verifies", "Ponctualite", "Confort premium"],
              }
            : null
        }
        serviceType="TRANSFER"
        showTransferFields
        transferPreset={selectedTransfer?.transferType}
      />
    </>
  );
}


