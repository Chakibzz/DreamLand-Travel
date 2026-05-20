"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useCurrency } from "@/components/currency-context";
import { AnnouncementModal } from "@/components/announcement-modal";

type Circuit = {
  title: string;
  usd: number;
  rating: number;
  image: string;
  region: "Sahara" | "Cote" | "Montagne" | "International";
  durationDays: number;
  maxTravelers: number;
};

const circuits: Circuit[] = [
  { title: "Trek nomade Tassili", usd: 1240, rating: 5.0, image: "/upscaled/0a6dd3153ea8.jpg", region: "Sahara", durationDays: 7, maxTravelers: 12 },
  { title: "Villa cote turquoise", usd: 850, rating: 4.9, image: "/upscaled/4fb5dbd22e92.jpg", region: "Cote", durationDays: 5, maxTravelers: 8 },
  { title: "Grand circuit europeen", usd: 2400, rating: 4.8, image: "/upscaled/f8778c920608.jpg", region: "International", durationDays: 10, maxTravelers: 16 },
  { title: "Pics enneiges du Djurdjura", usd: 650, rating: 4.7, image: "/upscaled/fdbee6c4312d.jpg", region: "Montagne", durationDays: 4, maxTravelers: 10 },
  { title: "Camp premium du Sahara", usd: 980, rating: 4.9, image: "/upscaled/2e3467b739eb.jpg", region: "Sahara", durationDays: 3, maxTravelers: 14 },
  { title: "Escapade culturelle a Alger", usd: 740, rating: 4.8, image: "/upscaled/b62cb6f8483e.jpg", region: "Cote", durationDays: 2, maxTravelers: 20 },
  { title: "Route du patrimoine romain", usd: 1120, rating: 4.9, image: "/upscaled/0fe489d651c3.jpg", region: "Montagne", durationDays: 6, maxTravelers: 10 },
  { title: "Semaine luxe en Mediterranee", usd: 1650, rating: 5.0, image: "/upscaled/31df43bda50b.jpg", region: "Cote", durationDays: 8, maxTravelers: 6 },
  { title: "Egypte Decouverte", usd: 990, rating: 4.8, image: "/upscaled/a173fa19aae4.jpg", region: "International", durationDays: 6, maxTravelers: 18 },
  { title: "Turquie Classique", usd: 1080, rating: 4.8, image: "/upscaled/d5178bc52af5.jpg", region: "International", durationDays: 7, maxTravelers: 18 },
  { title: "Circuit culturel Cuba", usd: 1320, rating: 4.7, image: "/upscaled/ab90d4c35f6f.jpg", region: "International", durationDays: 8, maxTravelers: 14 },
  { title: "Jordanie Horizon", usd: 1190, rating: 4.8, image: "/upscaled/4fb5dbd22e92.jpg", region: "International", durationDays: 6, maxTravelers: 14 },
  { title: "Azerbaidjan express", usd: 860, rating: 4.6, image: "/upscaled/f8778c920608.jpg", region: "International", durationDays: 5, maxTravelers: 20 },
  { title: "Oman Authentic", usd: 1010, rating: 4.7, image: "/upscaled/2e3467b739eb.jpg", region: "International", durationDays: 6, maxTravelers: 16 },
  { title: "Thailande Colors", usd: 1490, rating: 4.9, image: "/upscaled/31df43bda50b.jpg", region: "International", durationDays: 10, maxTravelers: 12 },
  { title: "Cambodge Heritage", usd: 940, rating: 4.7, image: "/upscaled/0a6dd3153ea8.jpg", region: "International", durationDays: 7, maxTravelers: 18 },
  { title: "Escale premium Qatar", usd: 790, rating: 4.6, image: "/upscaled/b62cb6f8483e.jpg", region: "International", durationDays: 4, maxTravelers: 16 },
  { title: "Safari decouverte Tanzanie", usd: 1710, rating: 4.9, image: "/upscaled/fdbee6c4312d.jpg", region: "International", durationDays: 9, maxTravelers: 10 },
  { title: "Escapade urbaine Bahrein", usd: 820, rating: 4.6, image: "/upscaled/87ee7e59e75b.jpg", region: "International", durationDays: 4, maxTravelers: 20 },
  { title: "Vietnam Panorama", usd: 1380, rating: 4.8, image: "/upscaled/83a4543bcba0.jpg", region: "International", durationDays: 9, maxTravelers: 12 },
  { title: "Escapade Indonesie", usd: 1580, rating: 4.9, image: "/upscaled/6159bcff413e.jpg", region: "International", durationDays: 10, maxTravelers: 12 },
];

export default function ExplorePage() {
  const { formatPrice } = useCurrency();
  const [region, setRegion] = useState<string>("Tous");
  const [maxBudgetDzd, setMaxBudgetDzd] = useState(350000);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [announcements, setAnnouncements] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      price: string;
      image: string;
      location: string;
      category?: { name: string };
    }>
  >([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<(typeof announcements)[number] | null>(null);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);

  const filtered = useMemo(() => {
    return circuits.filter((c) => {
      const regionOk = region === "Tous" || c.region === region;
      const budgetOk = c.usd * 134.5 <= maxBudgetDzd;

      const totalTravelers = adults + children;
      const travelersOk = totalTravelers <= c.maxTravelers;

      let durationOk = true;
      if (dateFrom && dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to >= from) {
          const requestedDays = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1);
          durationOk = c.durationDays >= requestedDays;
        }
      }

      return regionOk && budgetOk && travelersOk && durationOk;
    });
  }, [region, maxBudgetDzd, dateFrom, dateTo, adults, children]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements");
      const json = await response.json();
      if (response.ok && json.success) {
        setAnnouncements(json.data ?? []);
      }
    };
    void loadAnnouncements();
  }, []);

  return (
    <>
      <header className="relative h-[300px] overflow-hidden scroll-reveal">
        <Image src="/heroes/explore-hero-generated.png" alt="Explore" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="bg-hero-gradient absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="max-w-xl text-[56px] font-bold leading-[58px] text-white">Voyages organises</h1>
          <p className="mt-2 max-w-lg text-[14px] text-white/90">Decouvrez nos programmes organises pour voyager avec confort et serenite.</p>
        </div>
      </header>

      <section className="container-max mx-auto grid gap-6 px-4 py-6 scroll-reveal md:grid-cols-4 md:px-10">
        <aside className="rounded-xl bg-[#12100c] p-4 shadow-sm md:col-span-1">
          <h3 className="text-[30px] font-semibold text-[#c89a4b]">Filtrer les voyages</h3>

          <div className="mt-4">
            <label className="text-[11px] font-bold text-[#9f8a66]">Zone</label>
            <select className="mt-1 w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option>Tous</option>
              <option>Sahara</option>
              <option>Cote</option>
              <option>Montagne</option>
              <option>International</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="text-[11px] font-bold text-[#9f8a66]">Budget max (DZD): {maxBudgetDzd.toLocaleString("fr-DZ")}</label>
            <input type="range" min={70000} max={500000} step={5000} value={maxBudgetDzd} onChange={(e) => setMaxBudgetDzd(Number(e.target.value))} className="mt-1 w-full" />
          </div>

          <div className="mt-4 grid gap-2">
            <label className="text-[11px] font-bold text-[#9f8a66]">Date de depart (a partir de)</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" />
          </div>

          <div className="mt-4 grid gap-2">
            <label className="text-[11px] font-bold text-[#9f8a66]">Date de retour / fin (jusqu&apos;a)</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#9f8a66]">Adultes</label>
              <input type="number" min={1} max={50} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="mt-1 w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#9f8a66]">Enfants</label>
              <input type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="mt-1 w-full rounded-md border border-[#5b4526] px-2 py-2 text-[12px]" />
            </div>
          </div>
        </aside>

        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between text-[12px] text-[#d9c9ab]"><span>{filtered.length} circuits affiches</span><span>Trier : popularite</span></div>
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((c) => (
              <article key={c.title} className="group overflow-hidden rounded-xl bg-[#12100c] shadow-sm">
                <div className="relative h-[150px]">
                  <Image src={c.image} alt={c.title} fill sizes="(max-width:768px) 100vw, 50vw" quality={100} unoptimized className="object-cover image-hover" />
                </div>
                <div className="p-4">
                  <h4 className="text-[26px] font-semibold text-[#c89a4b]">{c.title}</h4>
                  <p className="text-[12px] text-[#d9c9ab]">{c.rating.toFixed(1)} · {c.durationDays} jours</p>
                  <p className="mt-2 text-[10px] text-[#9f8a66]">A PARTIR DE</p>
                  <p className="text-[20px] font-bold text-[#c89a4b]">{formatPrice(c.usd)}</p>
                  <button onClick={() => setSelectedCircuit(c)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                    Voir details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0f73cc] py-14 text-center text-white scroll-reveal">
        <h2 className="text-[56px] font-bold">Ne manquez pas le voyage</h2>
        <p className="mt-2 text-[14px]">Abonnez-vous pour recevoir nos offres exclusives et nos expeditions prestige.</p>
      </section>

      <section className="container-max mx-auto px-4 py-12 scroll-reveal md:px-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[34px] font-semibold text-[#c89a4b]">Annonces recentes</h2>
          <p className="text-[12px] text-[#9f8a66]">{announcements.length} annonce(s)</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
              <div className="relative h-[170px]">
                <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover image-hover" unoptimized />
              </div>
              <div className="p-4">
                <h3 className="text-[22px] font-semibold text-[#c89a4b]">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-[12px] text-[#d9c9ab]">{item.description}</p>
                <p className="mt-2 text-[11px] text-[#9f8a66]">{item.category?.name ?? "Sans categorie"} · {item.location}</p>
                <p className="mt-1 text-[18px] font-bold text-[#c89a4b]">{formatPrice(Number(item.price))}</p>
                <button onClick={() => setSelectedAnnouncement(item)} className="mt-3 rounded-md border border-[#5f4722] px-3 py-1 text-[12px] font-semibold text-[#30507f] hover:bg-[#16110a]">
                  Voir details
                </button>
              </div>
            </article>
          ))}
        </div>
        {announcements.length === 0 ? <p className="mt-3 text-[12px] text-[#9f8a66]">Aucune annonce publiee pour le moment.</p> : null}
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
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="CUSTOM_TRIP"
      />

      <AnnouncementModal
        open={Boolean(selectedCircuit)}
        onClose={() => setSelectedCircuit(null)}
        announcement={
          selectedCircuit
            ? {
                title: selectedCircuit.title,
                description: `Circuit ${selectedCircuit.region.toLowerCase()} de ${selectedCircuit.durationDays} jours, note ${selectedCircuit.rating.toFixed(1)}. Programme organise avec accompagnement sur mesure.`,
                image: selectedCircuit.image,
                location: selectedCircuit.region,
                categoryName: "Voyage organise",
                price: String(selectedCircuit.usd),
                highlights: ["Itineraire optimise", "Accompagnement local", "Assistance continue"],
              }
            : null
        }
        formatPrice={formatPrice}
        serviceType="CUSTOM_TRIP"
      />
    </>
  );
}


