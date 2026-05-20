"use client";

import Image from "next/image";
import { useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { AnnouncementModal } from "@/components/announcement-modal";

const flights = [
  { title: "Alger - Istanbul", text: "Vols regulier et charter selon saison.", image: "/upscaled/d5178bc52af5.jpg" },
  { title: "Alger - Dubai", text: "Billets flexibles et options bagages.", image: "/upscaled/4fb5dbd22e92.jpg" },
  { title: "Alger - Paris", text: "Reservation accompagnee pour tous profils.", image: "/upscaled/b62cb6f8483e.jpg" },
];

export default function BilletteriePage() {
  const [selectedFlight, setSelectedFlight] = useState<(typeof flights)[number] | null>(null);

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/billetterie-hero-enhanced.jpg" alt="Billetterie" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Billetterie</h1>
          <p className="mt-2 text-[14px] text-white/90">Reservation de billets et assistance complete.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {flights.map((flight) => (
            <article key={flight.title} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]"><Image src={flight.image} alt={flight.title} fill className="object-cover image-hover" quality={100} unoptimized /></div>
              <div className="p-4">
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{flight.title}</h3>
                <p className="mt-1 text-[13px] text-[#d9c9ab]">{flight.text}</p>
                <button onClick={() => setSelectedFlight(flight)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <ServiceBookingForm serviceType="TICKETING" defaultDestination="Billetterie" title="Demande de billet" />
        </div>
      </section>

      <AnnouncementModal
        open={Boolean(selectedFlight)}
        onClose={() => setSelectedFlight(null)}
        announcement={
          selectedFlight
            ? {
                title: selectedFlight.title,
                description: `${selectedFlight.text} Assistance emission, options bagages et suivi de reservation.`,
                image: selectedFlight.image,
                categoryName: "Billetterie",
                highlights: ["Tarifs competitifs", "Suivi avant depart", "Support rebooking"],
              }
            : null
        }
        serviceType="TICKETING"
      />
    </>
  );
}


