"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrency } from "@/components/currency-context";

const cards = [
  { title: "Tassili n'Ajjer", reviews: "5.0 (124 avis)", usd: 1250, tag: "AVENTURE", image: "/upscaled/2e3467b739eb.jpg" },
  { title: "Casbah d'Alger", reviews: "4.9 (86 avis)", usd: 890, tag: "CULTURE", image: "/upscaled/b62cb6f8483e.jpg" },
  { title: "Timgad antique", reviews: "5.0 (52 avis)", usd: 950, tag: "HISTOIRE", image: "/upscaled/0fe489d651c3.jpg" },
];

const testimonials = [
  ["DreamLand Travel a depasse toutes nos attentes. Notre expedition dans le Sahara etait parfaitement organisee.", "Mohamed F.", "VOYAGEUR PASSIONNE"],
  ["L'itineraire sur mesure a Alger nous a permis de decouvrir des lieux que les touristes ratent souvent.", "Yasmine B.", "EXPLORATRICE CULTURELLE"],
  ["Une attention aux details remarquable. Chaque transfert et chaque hotel etaient irreprochables.", "Sofiane K.", "VOYAGEUR PREMIUM"],
] as const;

export default function HomePage() {
  const { formatPrice } = useCurrency();
  const [latestAnnouncements, setLatestAnnouncements] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      price: string;
      location: string;
      tags?: string[];
      priceOptions?: Array<{ label: string; price: number | string }>;
      richDetails?: { duration?: string; dates?: string[]; formulas?: Array<{ name: string }> };
    }>
  >([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/announcements");
      const json = await res.json();
      if (res.ok && json.success) {
        setLatestAnnouncements((json.data ?? []).slice(0, 3));
      }
    };
    void load();
  }, []);

  return (
    <>
      <section className="relative h-[610px] overflow-hidden scroll-reveal md:h-[760px]">
        <Image src="/heroes/home-hero-generated.png" alt="Hero" fill priority sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="hero-mask absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pt-36 md:px-10 md:pt-48">
          <h1 className="max-w-[560px] text-[56px] font-bold leading-[58px] text-white">Decouvrez la Magie de l&apos;Algerie</h1>
          <div className="mt-7 max-w-[720px] rounded-xl border border-white/20 bg-[#12100c]/25 p-3 backdrop-blur-xl">
            <p className="mb-2 px-1 text-[12px] text-white/85">Acces rapide a nos services les plus demandes :</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/explore" className="rounded-md border border-[#5f4722] bg-[#12100c] px-4 py-2 text-[12px] font-semibold text-[#d9c9ab] hover:bg-[#1a140c]">Voyages organises</Link>
              <Link href="/omra" className="rounded-md border border-[#5f4722] bg-[#12100c] px-4 py-2 text-[12px] font-semibold text-[#d9c9ab] hover:bg-[#1a140c]">Omra</Link>
              <Link href="/visa" className="rounded-md border border-[#5f4722] bg-[#12100c] px-4 py-2 text-[12px] font-semibold text-[#d9c9ab] hover:bg-[#1a140c]">Services Visa</Link>
              <Link href="/billetterie" className="rounded-md border border-[#5f4722] bg-[#12100c] px-4 py-2 text-[12px] font-semibold text-[#d9c9ab] hover:bg-[#1a140c]">Billetterie</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-max mx-auto bg-[#f3f4fb] px-4 py-14 scroll-reveal md:px-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">EXPERIENCES SUR MESURE</p>
            <h2 className="mt-1 text-[42px] font-semibold leading-[48px] text-[#c89a4b]">Destinations selectionnees</h2>
          </div>
          <span className="text-[20px] text-[#c89a4b]">Voir toutes les destinations ?</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="group overflow-hidden rounded-xl bg-[#12100c] card-shadow">
              <div className="relative h-[180px]">
                <Image src={card.image} alt={card.title} fill sizes="(max-width:768px) 100vw, 33vw" quality={100} unoptimized className="object-cover image-hover" />
                <span className="absolute left-3 top-3 rounded bg-[#c89a4b] px-2 py-0.5 text-[9px] font-bold text-white">{card.tag}</span>
              </div>
              <div className="p-4">
                <h3 className="text-[34px] font-semibold leading-[40px] text-[#c89a4b]">{card.title}</h3>
                <p className="mt-1 text-[12px] text-[#d9c9ab]">? {card.reviews}</p>
                <p className="mt-3 text-[10px] text-[#9f8a66]">A PARTIR DE</p>
                <p className="text-[25px] font-bold text-[#c89a4b]">{formatPrice(card.usd)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#12100c] py-14 scroll-reveal">
        <div className="container-max mx-auto grid items-center gap-10 px-4 md:grid-cols-2 md:px-10">
          <div className="group relative overflow-hidden rounded-2xl">
            <Image src="/upscaled/83a4543bcba0.jpg" alt="Voyageur" width={520} height={420} quality={100} className="w-full rounded-2xl image-hover" />
            <div className="absolute bottom-[-18px] right-6 rounded-lg bg-[#a97b32] px-6 py-4 text-white">
              <p className="text-[30px] leading-none font-semibold">24/7</p>
              <p className="text-[10px] tracking-widest">ASSISTANCE CLIENT</p>
            </div>
          </div>
          <div className="text-[#f2e4cc]">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">EXCELLENCE INEGALEE</p>
            <h2 className="mt-2 text-[48px] font-semibold leading-[54px] text-[#c89a4b]">Nous construisons votre voyage de reve avec precision</h2>
            <div className="mt-6 space-y-5 text-[16px]">
              <p><strong>Conseils d&apos;experts</strong><br/>Nos experts locaux revelent les joyaux caches de l&apos;Algerie.</p>
              <p><strong>Itineraires personnalises</strong><br/>Chaque voyage est adapte a votre style et vos attentes.</p>
              <p><strong>Service premium</strong><br/>Suivi humain, assistance continue et execution rigoureuse.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[38px] font-semibold text-[#c89a4b]">Dernieres annonces ajoutees</h2>
          <Link href="/explore" className="text-[13px] font-semibold text-[#d9c9ab] hover:text-[#c89a4b]">Voir toutes les annonces</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latestAnnouncements.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c]">
              <div className="relative h-[170px]">
                <Image src={item.image} alt={item.title} fill className="object-cover image-hover" />
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
                <p className="mt-1 line-clamp-2 text-[12px] text-[#d9c9ab]">{item.description}</p>
                <p className="mt-2 text-[11px] text-[#9f8a66]">{item.location}</p>
                {item.richDetails?.duration || item.richDetails?.dates?.length ? (
                  <p className="mt-1 text-[11px] text-[#d9c9ab]">
                    {item.richDetails.duration ? item.richDetails.duration : null}
                    {item.richDetails.duration && item.richDetails.dates?.length ? " · " : null}
                    {item.richDetails.dates?.length ? `${item.richDetails.dates.length} departs` : null}
                  </p>
                ) : null}
                <p className="mt-1 text-[18px] font-bold text-[#c89a4b]">A partir de {formatPrice(Number(item.price))}</p>
                {item.priceOptions?.[0] ? (
                  <p className="mt-1 text-[11px] text-[#d9c9ab]">{item.priceOptions[0].label}: {formatPrice(Number(item.priceOptions[0].price))}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {latestAnnouncements.length === 0 ? <p className="mt-3 text-[12px] text-[#9f8a66]">Aucune annonce recente pour le moment.</p> : null}
      </section>

      <section className="container-max mx-auto px-4 py-14 scroll-reveal md:px-10">
        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.16em] text-[#a97b32]">TEMOIGNAGES</p>
          <h2 className="mt-1 text-[42px] font-semibold text-[#c89a4b]">Les voix des explorateurs modernes</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <article key={name} className="rounded-xl border border-[#ebedf8] bg-[#12100c] p-5">
              <p className="text-[12px] text-[#d9c9ab]">&quot;{quote}&quot;</p>
              <p className="mt-5 text-[19px] font-semibold text-[#c89a4b]">{name}</p>
              <p className="text-[10px] text-[#9f8a66]">{role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-max mx-auto px-4 pb-14 scroll-reveal md:px-10">
        <div className="rounded-2xl bg-[#a97b32] p-6 text-white shadow-xl md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-[42px] font-semibold">Pret a planifier votre voyage ?</h3>
            <p className="text-[14px] text-white/90">Parlez a nos conseillers pour recevoir un devis personnalise.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 md:mt-0">
            <a
              href="mailto:dreamlandtravel.dz@gmail.com"
              className="rounded-lg bg-[#12100c] px-5 py-3 text-[13px] font-bold text-[#c89a4b]"
            >
              Email
            </a>
            <a
              href="https://wa.me/213557010838?text=Bonjour%2C%20je%20souhaite%20obtenir%20des%20informations%20concernant%20vos%20offres%20de%20voyage."
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-[#c89a4b] px-5 py-3 text-[13px] font-bold text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


