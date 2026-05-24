"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ServiceBookingForm } from "@/components/service-booking-form";
import { useCurrency } from "@/components/currency-context";
import { AnnouncementModal } from "@/components/announcement-modal";
import { AnnouncementImageBadge } from "@/components/announcement-image-badge";

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
    badge?: string;
    images?: string[];
  };
};

const omraSupport = [
  "Selection de formules selon votre budget et votre niveau de confort",
  "Hotels a Makkah et Madinah avec preference de proximite",
  "Accompagnement avant depart et suivi pendant le sejour",
];

const omraSteps = [
  ["01", "Choix de la formule", "Economique, confort, VIP ou famille selon vos priorites."],
  ["02", "Verification du dossier", "Passeport, dates, disponibilites et conditions du depart."],
  ["03", "Reservation encadree", "Vols, hotels, transferts et coordination du groupe."],
  ["04", "Suivi voyageur", "Assistance et reponse rapide jusqu'au retour."],
] as const;

const omraGallery = [
  { src: "/omra-1.jpg", title: "Makkah", text: "Preparation du sejour et choix des dates." },
  { src: "/omra-2.jpg", title: "Haram", text: "Formules avec hotels proches selon disponibilite." },
  { src: "/omra-3.jpg", title: "Accompagnement", text: "Suivi avant depart et assistance durant le voyage." },
];

export default function OmraPage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

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
      <section className="relative h-[420px] overflow-hidden scroll-reveal">
        <Image src="/omra-hero-unsplash.jpg" alt="Kaaba a Makkah" fill sizes="100vw" className="object-cover object-center" quality={100} priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080807]/82 via-[#080807]/38 to-[#080807]/8" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#090909]/45" />
        <div className="container-max relative mx-auto px-4 pt-32 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Omra</h1>
          <p className="mt-2 max-w-lg text-[14px] leading-6 text-white/90">Des formules Omra accompagnees, avec conseil, reservation et suivi jusqu&apos;au retour.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        <div className="mb-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-[#d8c29f] bg-[#fff8ec] p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d6746]">Accompagnement Omra</p>
            <h2 className="mt-2 text-[36px] font-semibold leading-[42px] text-[#8a6025]">Un voyage spirituel prepare avec attention</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5e4b31]">
              Dreamland Travel vous aide a choisir la formule adaptee: duree, budget, proximite des hotels, type de chambre, ville de depart et niveau d&apos;accompagnement.
            </p>
            <div className="mt-4 grid gap-2">
              {omraSupport.map((item) => (
                <div key={item} className="rounded-lg border border-[#d8c29f] bg-[#f7eddd] px-3 py-2 text-[13px] text-[#5e4b31]">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-3 sm:grid-cols-2">
            {omraSteps.map(([number, title, text]) => (
              <div key={number} className="rounded-xl border border-[#d8c29f] bg-[#f7eddd] p-4">
                <p className="text-[26px] font-bold text-[#7f6541]">{number}</p>
                <p className="mt-1 text-[17px] font-semibold text-[#8a6025]">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#5e4b31]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7d6746]">Voyage spirituel</p>
              <h2 className="mt-1 text-[34px] font-semibold text-[#8a6025]">Une experience preparee avec soin</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {omraGallery.map((item) => (
              <article key={item.src} className="group overflow-hidden rounded-xl border border-[#d8c29f] bg-[#fff8ec] shadow-sm">
                <div className="relative h-[330px]">
                  <Image src={item.src} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover image-hover" quality={100} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-[22px] font-semibold text-[#8a6025]">{item.title}</h3>
                    <p className="mt-1 text-[12px] text-white/85">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((pack) => (
            <article key={pack.id} className="group overflow-hidden rounded-xl border border-[#d8c29f] bg-[#fff8ec] shadow-sm">
              <div className="relative h-[230px] bg-[#090909]">
                <Image src={pack.image} alt={pack.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-contain" quality={100} unoptimized />
                <AnnouncementImageBadge label={pack.richDetails?.badge} />
              </div>
              <div className="p-4">
                {pack.tags?.length ? (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {pack.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-[#5b4526] bg-[#1a130b] px-2 py-0.5 text-[10px] font-semibold text-[#c89a4b]">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h3 className="text-[24px] font-semibold text-[#8a6025]">{pack.title}</h3>
                <p className="mt-1 text-[13px] font-semibold text-[#5e4b31]">A partir de {formatPrice(Number(pack.price))}</p>
                <p className="mt-2 line-clamp-2 text-[12px] text-[#7d6746]">{pack.description}</p>
                <button onClick={() => setSelectedAnnouncement(pack)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#f7eddd]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        {announcements.length === 0 ? (
          <p className="rounded-xl border border-[#d8c29f] bg-[#fff8ec] p-4 text-[13px] text-[#7d6746]">
            Aucune formule Omra publiee pour le moment. Envoyez votre demande ci-dessous et l&apos;equipe vous proposera les disponibilites.
          </p>
        ) : null}
        <div className="mt-6">
          <ServiceBookingForm serviceType="OMRA" defaultDestination="Omra" title="Demande Omra personnalisee" omraMode />
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
                categoryName: "Omra",
                price: selectedAnnouncement.price,
                tags: selectedAnnouncement.tags,
                priceOptions: selectedAnnouncement.priceOptions,
                richDetails: selectedAnnouncement.richDetails,
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="OMRA"
      />
    </>
  );
}
