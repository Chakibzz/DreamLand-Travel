"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { useCurrency } from "@/components/currency-context";
import { AnnouncementModal } from "@/components/announcement-modal";

const packs = [
  { title: "Omra Economique", price: "A partir de 165000 DZD", image: "/upscaled/ab90d4c35f6f.jpg" },
  { title: "Omra Confort", price: "A partir de 235000 DZD", image: "/upscaled/f8778c920608.jpg" },
  { title: "Omra VIP", price: "A partir de 320000 DZD", image: "/upscaled/83a4543bcba0.jpg" },
];

export default function OmraPage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<
    Array<{ id: string; title: string; price: string; image: string; description: string }>
  >([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<{ title: string; price: string; image: string; description: string } | null>(null);
  const hasDbAnnouncements = announcements.length > 0;

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Omra");
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
        <Image src="/heroes/omra-hero-enhanced.jpg" alt="Omra" fill className="object-cover image-hover" quality={100} unoptimized />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Omra</h1>
          <p className="mt-2 text-[14px] text-white/90">Packages Omra avec accompagnement complet.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {hasDbAnnouncements
            ? announcements.map((pack) => (
                <article key={pack.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
                  <div className="relative h-[170px]"><Image src={pack.image} alt={pack.title} fill className="object-cover image-hover" quality={100} unoptimized /></div>
                  <div className="p-4">
                    <h3 className="text-[24px] font-semibold text-[#c89a4b]">{pack.title}</h3>
                    <p className="mt-1 text-[13px] text-[#d9c9ab]">{formatPrice(Number(pack.price))}</p>
                    <p className="mt-2 text-[12px] text-[#9f8a66]">{pack.description}</p>
                    <button
                      onClick={() =>
                        setSelectedAnnouncement({
                          title: pack.title,
                          price: String(pack.price),
                          image: pack.image,
                          description: pack.description,
                        })
                      }
                      className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]"
                    >
                      Voir details
                    </button>
                  </div>
                </article>
              ))
            : packs.map((pack) => (
                <article key={pack.title} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
                  <div className="relative h-[170px]"><Image src={pack.image} alt={pack.title} fill className="object-cover image-hover" quality={100} unoptimized /></div>
                  <div className="p-4">
                    <h3 className="text-[24px] font-semibold text-[#c89a4b]">{pack.title}</h3>
                    <p className="mt-1 text-[13px] text-[#d9c9ab]">{pack.price}</p>
                    <button
                      onClick={() =>
                        setSelectedAnnouncement({
                          title: pack.title,
                          price: String(pack.price),
                          image: pack.image,
                          description: "Demandez plus d'informations sur cette offre Omra.",
                        })
                      }
                      className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]"
                    >
                      Voir details
                    </button>
                  </div>
                </article>
              ))}
        </div>
        <div className="mt-6">
          <ServiceBookingForm serviceType="OMRA" defaultDestination="Omra" title="Formulaire reservation Omra" />
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
                categoryName: "Omra",
                price: selectedAnnouncement.price,
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="OMRA"
      />
    </>
  );
}


