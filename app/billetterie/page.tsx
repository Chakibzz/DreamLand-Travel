"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { AnnouncementModal } from "@/components/announcement-modal";
import { useCurrency } from "@/components/currency-context";

type Announcement = {
  id: string;
  title: string;
  price: string;
  image: string;
  description: string;
  location?: string;
  tags?: string[];
};

export default function BilletteriePage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Announcement | null>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Billetterie");
      const json = await response.json();
      if (response.ok && json.success) setAnnouncements(json.data ?? []);
    };
    void loadAnnouncements();
  }, []);

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/billetterie-hero-enhanced.jpg" alt="Billetterie" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Billetterie</h1>
          <p className="mt-2 text-[14px] text-white/90">Billets ajoutes depuis l&apos;administration.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((flight) => (
            <article key={flight.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]">
                <Image src={flight.image} alt={flight.title} fill className="object-cover image-hover" quality={100} unoptimized />
              </div>
              <div className="p-4">
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{flight.title}</h3>
                <p className="mt-1 text-[13px] font-semibold text-[#d9c9ab]">A partir de {formatPrice(Number(flight.price))}</p>
                <p className="mt-2 line-clamp-2 text-[12px] text-[#9f8a66]">{flight.description}</p>
                <button onClick={() => setSelectedFlight(flight)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        {announcements.length === 0 ? <p className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4 text-[13px] text-[#9f8a66]">Aucune annonce billetterie publiee pour le moment.</p> : null}
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
                description: selectedFlight.description,
                image: selectedFlight.image,
                location: selectedFlight.location,
                categoryName: "Billetterie",
                price: selectedFlight.price,
                tags: selectedFlight.tags,
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="TICKETING"
      />
    </>
  );
}
