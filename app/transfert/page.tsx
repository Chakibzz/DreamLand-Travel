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

export default function TransfertPage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<Announcement | null>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Transfert");
      const json = await response.json();
      if (response.ok && json.success) setAnnouncements(json.data ?? []);
    };
    void loadAnnouncements();
  }, []);

  return (
    <>
      <section className="relative h-[340px] overflow-hidden scroll-reveal">
        <Image src="/heroes/transfert-hero-enhanced.jpg" alt="Transfert" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Transfert</h1>
          <p className="mt-2 text-[14px] text-white/90">Services de transport ajoutes depuis l&apos;administration.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]">
                <Image src={item.image} alt={item.title} fill className="object-cover image-hover" quality={100} unoptimized />
              </div>
              <div className="p-4">
                <h3 className="text-[24px] font-semibold text-[#c89a4b]">{item.title}</h3>
                <p className="mt-1 text-[13px] font-semibold text-[#d9c9ab]">A partir de {formatPrice(Number(item.price))}</p>
                <p className="mt-2 line-clamp-2 text-[12px] text-[#9f8a66]">{item.description}</p>
                <button onClick={() => setSelectedTransfer(item)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        {announcements.length === 0 ? <p className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4 text-[13px] text-[#9f8a66]">Aucune annonce transfert publiee pour le moment.</p> : null}
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
                description: selectedTransfer.description,
                image: selectedTransfer.image,
                location: selectedTransfer.location,
                categoryName: "Transfert",
                price: selectedTransfer.price,
                tags: selectedTransfer.tags,
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="TRANSFER"
        showTransferFields
      />
    </>
  );
}
