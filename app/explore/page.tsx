"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/currency-context";
import { AnnouncementModal } from "@/components/announcement-modal";

type PriceOption = { label: string; price: number | string };
type RichDetails = {
  duration?: string;
  airline?: string;
  dates?: string[];
  formulas?: Array<{ name: string; hotel?: string; tariffs?: PriceOption[] }>;
  included?: string[];
  excluded?: string[];
  alert?: string;
};

type Announcement = {
  id: string;
  title: string;
  description: string;
  price: string;
  tags: string[];
  priceOptions: PriceOption[];
  richDetails?: RichDetails;
  image: string;
  location: string;
  category?: { name: string };
};

export default function ExplorePage() {
  const { formatPrice } = useCurrency();
  const [location, setLocation] = useState("Tous");
  const [maxBudgetDzd, setMaxBudgetDzd] = useState(500000);
  const [selectedTag, setSelectedTag] = useState("Tous");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Voyages%20organises");
      const json = await response.json();
      if (response.ok && json.success) {
        setAnnouncements(json.data ?? []);
      }
    };
    void loadAnnouncements();
  }, []);

  const locations = useMemo(() => {
    return Array.from(new Set(announcements.map((item) => item.location).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [announcements]);

  const tags = useMemo(() => {
    return Array.from(new Set(announcements.flatMap((item) => item.tags ?? []))).sort((a, b) => a.localeCompare(b));
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const locationOk = location === "Tous" || item.location === location;
      const budgetOk = Number(item.price) <= maxBudgetDzd;
      const tagOk = selectedTag === "Tous" || (item.tags ?? []).includes(selectedTag);
      return locationOk && budgetOk && tagOk;
    });
  }, [announcements, location, maxBudgetDzd, selectedTag]);

  return (
    <>
      <header className="relative h-[300px] overflow-hidden scroll-reveal">
        <Image src="/heroes/explore-hero-generated.png" alt="Explore" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="bg-hero-gradient absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="max-w-xl text-[56px] font-bold leading-[58px] text-white">Voyages organises</h1>
          <p className="mt-2 max-w-lg text-[14px] text-white/90">Toutes les offres affichees ici sont ajoutees manuellement depuis l&apos;admin.</p>
        </div>
      </header>

      <section className="container-max mx-auto grid gap-6 px-4 py-6 scroll-reveal md:grid-cols-4 md:px-10">
        <aside className="rounded-xl bg-[#12100c] p-4 shadow-sm md:col-span-1">
          <h3 className="text-[30px] font-semibold text-[#c89a4b]">Filtrer</h3>

          <div className="mt-4">
            <label className="text-[11px] font-bold text-[#9f8a66]">Destination</label>
            <select className="mt-1 w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option>Tous</option>
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-[11px] font-bold text-[#9f8a66]">Budget max (DZD): {maxBudgetDzd.toLocaleString("fr-DZ")}</label>
            <input type="range" min={50000} max={900000} step={10000} value={maxBudgetDzd} onChange={(e) => setMaxBudgetDzd(Number(e.target.value))} className="mt-1 w-full" />
          </div>

          {tags.length > 0 ? (
            <div className="mt-5 border-t border-[#3b2b16] pt-4">
              <label className="text-[11px] font-bold text-[#9f8a66]">Avantages</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Tous", ...tags].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                      selectedTag === tag ? "border-[#c89a4b] bg-[#c89a4b] text-[#12100c]" : "border-[#5b4526] text-[#d9c9ab]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </aside>

        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between text-[12px] text-[#d9c9ab]">
            <span>{filteredAnnouncements.length} annonce(s) affichee(s)</span>
            <span>Source : admin</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAnnouncements.map((item) => (
              <article key={item.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
                <div className="relative h-[190px]">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover image-hover" unoptimized />
                </div>
                <div className="p-4">
                  {item.tags?.length ? (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 4).map((tag) => (
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
                  <p className="mt-2 text-[10px] text-[#9f8a66]">A PARTIR DE</p>
                  <p className="text-[20px] font-bold text-[#c89a4b]">{formatPrice(Number(item.price))}</p>
                  <button onClick={() => setSelectedAnnouncement(item)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                    Voir details
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filteredAnnouncements.length === 0 ? <p className="mt-3 rounded-xl border border-[#3b2b16] bg-[#12100c] p-4 text-[13px] text-[#9f8a66]">Aucune annonce voyage organise n&apos;est publiee pour le moment.</p> : null}
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
                categoryName: selectedAnnouncement.category?.name,
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
