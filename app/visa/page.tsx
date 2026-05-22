"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnnouncementModal } from "@/components/announcement-modal";
import { useCurrency } from "@/components/currency-context";

const visaOffers = [
  {
    name: "Visa Chine",
    image: "/upscaled/a173fa19aae4.jpg",
    process: ["Analyse du profil", "Checklist personnalisee", "Depot accompagne"],
  },
  {
    name: "Visa touristique Canada",
    image: "/upscaled/ab90d4c35f6f.jpg",
    process: ["Verification documents", "Correction du dossier", "Suivi jusqu'a validation"],
  },
  {
    name: "Visa touristique Royaume-Uni",
    image: "/upscaled/d5178bc52af5.jpg",
    process: ["Pre-evaluation", "Preparation formulaire", "Assistance complete"],
  },
] as const;

const visaTypes = [
  {
    title: "Visa touristique",
    desc: "Pour vos voyages loisirs, sejours courts et decouvertes culturelles.",
    points: ["Dossier simplifie", "Accompagnement de A a Z", "Conseils sur les justificatifs"],
  },
  {
    title: "Visa affaire",
    desc: "Pour missions professionnelles, salons, reunions et deplacements business.",
    points: ["Verification invitation entreprise", "Preparation justificatifs pro", "Suivi prioritaire"],
  },
  {
    title: "Visa familial",
    desc: "Pour visites familiales, reunification temporaire et invitations privees.",
    points: ["Controle des lettres d'invitation", "Aide pieces familiales", "Suivi dossier complet"],
  },
] as const;

export default function VisaPage() {
  const { formatPrice } = useCurrency();
  const [announcements, setAnnouncements] = useState<
    Array<{ id: string; title: string; price: string; image: string; description: string; location?: string; tags?: string[] }>
  >([]);
  const [selectedVisa, setSelectedVisa] = useState<{
    title: string;
    description: string;
    image: string;
    location?: string;
    categoryName?: string;
    price?: string;
    tags?: string[];
    highlights?: string[];
  } | null>(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      const response = await fetch("/api/announcements?category=Services%20Visa");
      const json = await response.json();
      if (response.ok && json.success) setAnnouncements(json.data ?? []);
    };
    void loadAnnouncements();
  }, []);

  const openVisaModal = (data: {
    title: string;
    description: string;
    image: string;
    highlights?: string[];
  }) => {
    setSelectedVisa({
      ...data,
      location: "Service international",
      categoryName: "Services Visa",
    });
  };

  return (
    <>
      <section className="relative h-[360px] overflow-hidden scroll-reveal">
        <Image src="/heroes/visa-hero-generated.png" alt="Visa" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/80 via-[#090909]/45 to-transparent" />
        <div className="container-max relative mx-auto px-4 pt-20 md:px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d9c9ab]">Services Visa</p>
          <h1 className="max-w-[720px] text-[50px] font-bold leading-[54px] text-white md:text-[56px] md:leading-[58px]">Simplifiez vos voyages avec une assistance visa experte</h1>
          <p className="mt-3 max-w-[620px] text-[14px] text-white/90">Un accompagnement professionnel pour des demandes de visa sans stress.</p>
        </div>
      </section>

      <section className="container-max mx-auto px-4 py-10 scroll-reveal md:px-10">
        {announcements.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-center text-[40px] font-semibold text-[#c89a4b]">Offres visa publiees</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {announcements.map((item) => (
                <article key={item.id} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] shadow-sm">
                  <div className="relative h-[170px]">
                    <Image src={item.image} alt={item.title} fill className="object-cover image-hover" quality={100} unoptimized />
                  </div>
                  <div className="p-4">
                    <h3 className="text-[24px] font-semibold text-[#c89a4b]">{item.title}</h3>
                    <p className="mt-1 text-[13px] font-semibold text-[#d9c9ab]">A partir de {formatPrice(Number(item.price))}</p>
                    <p className="mt-2 line-clamp-2 text-[12px] text-[#9f8a66]">{item.description}</p>
                    <button
                      onClick={() =>
                        setSelectedVisa({
                          title: item.title,
                          description: item.description,
                          image: item.image,
                          location: item.location,
                          categoryName: "Services Visa",
                          price: item.price,
                          tags: item.tags,
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
          </div>
        ) : null}

        <article className="mb-8 rounded-2xl border border-[#3b2b16] bg-[#12100c] p-6 shadow-[0_18px_45px_-30px_rgba(0,35,85,0.6)]">
          <h2 className="text-[30px] font-semibold text-[#c89a4b]">Voyagez sans stress avec DreamLand Travel</h2>
          <p className="mt-3 text-[14px] text-[#d9c9ab]">Obtenez votre E-Visa facilement vers plusieurs destinations.</p>
          <p className="mt-2 text-[14px] text-[#d9c9ab]">Egypte, Turquie, Cuba, Jordanie, Azerbaidjan, Oman, Thailande, Cambodge, Qatar, Tanzanie, Bahrein, Vietnam, Indonesie.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-[#3b2b16] bg-[#16110a] p-3 text-[13px] text-[#d9c9ab]">Traitement rapide</div>
            <div className="rounded-lg border border-[#3b2b16] bg-[#16110a] p-3 text-[13px] text-[#d9c9ab]">Service securise</div>
            <div className="rounded-lg border border-[#3b2b16] bg-[#16110a] p-3 text-[13px] text-[#d9c9ab]">Assistance complete</div>
          </div>

          <button
            type="button"
            onClick={() =>
              openVisaModal({
                title: "E-Visa multi-destinations",
                description:
                  "Accompagnement complet pour votre E-Visa: evaluation, verification des documents et suivi jusqu'a validation.",
                image: "/heroes/visa-hero-generated.png",
                highlights: ["Traitement rapide", "Service securise", "Assistance complete"],
              })
            }
            className="mt-5 inline-block rounded-md bg-[#a97b32] px-5 py-2 text-[12px] font-bold text-white transition hover:bg-[#8f6527]"
          >
            Demander des infos
          </button>
        </article>

        <h2 className="text-center text-[40px] font-semibold text-[#c89a4b]">Types de visa</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {visaTypes.map((item) => (
            <article key={item.title} className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
              <h3 className="text-[24px] font-semibold text-[#c89a4b]">{item.title}</h3>
              <p className="mt-2 text-[13px] text-[#d9c9ab]">{item.desc}</p>
              <ul className="mt-3 space-y-1 text-[12px] text-[#d9c9ab]">
                {item.points.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  openVisaModal({
                    title: item.title,
                    description: item.desc,
                    image: "/heroes/visa-hero-generated.png",
                    highlights: [...item.points],
                  })
                }
                className="mt-4 block w-full rounded-md border border-[#5b4526] bg-[#16110a] py-2 text-center text-[12px] font-bold text-[#c89a4b] transition hover:bg-[#1a130b]"
              >
                Demander des infos
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="container-max mx-auto px-4 pb-12 scroll-reveal md:px-10">
        <h2 className="text-center text-[40px] font-semibold text-[#c89a4b]">Solutions visa sur mesure</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {visaOffers.map((visa) => (
            <article key={visa.name} className="group overflow-hidden rounded-xl border border-[#3b2b16] bg-[#12100c] p-3 shadow-sm">
              <div className="relative h-[165px] overflow-hidden rounded-lg">
                <Image src={visa.image} alt={visa.name} fill sizes="(max-width:768px) 100vw, 33vw" quality={100} unoptimized className="object-cover image-hover" />
              </div>
              <h3 className="mt-3 text-[28px] font-semibold leading-tight text-[#c89a4b]">{visa.name}</h3>
              <div className="mt-3 rounded-lg border border-[#3b2b16] bg-[#16110a] p-3 text-[12px] text-[#d9c9ab]">
                <p className="font-bold text-[#c89a4b]">Processus:</p>
                <ol className="mt-1 list-decimal pl-4">
                  {visa.process.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </div>
              <button
                type="button"
                onClick={() =>
                  openVisaModal({
                    title: visa.name,
                    description: `Traitement complet pour ${visa.name.toLowerCase()} avec accompagnement sur chaque etape du dossier.`,
                    image: visa.image,
                    highlights: [...visa.process],
                  })
                }
                className="mt-3 block w-full rounded-md border border-[#5b4526] bg-[#16110a] py-2 text-center text-[12px] font-bold text-[#c89a4b] transition hover:bg-[#1a130b]"
              >
                Demander des infos
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="container-max mx-auto px-4 pb-14 scroll-reveal md:px-10">
        <h2 className="text-[38px] font-semibold text-[#c89a4b]">Notre processus fluide</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-[#3b2b16] bg-[#16110a] p-4"><p className="text-[42px] font-bold text-[#7f6541]">01</p><p className="text-[24px] font-semibold text-[#c89a4b]">Consultation</p></div>
          <div className="rounded-xl border border-[#3b2b16] bg-[#1b150d] p-4"><p className="text-[42px] font-bold text-[#7f6541]">02</p><p className="text-[24px] font-semibold text-[#c89a4b]">Preparation</p></div>
          <div className="rounded-xl border border-[#3b2b16] bg-[#16110a] p-4"><p className="text-[42px] font-bold text-[#7f6541]">03</p><p className="text-[24px] font-semibold text-[#c89a4b]">Verification</p></div>
          <div className="rounded-xl border border-[#3b2b16] bg-[#1b150d] p-4"><p className="text-[42px] font-bold text-[#7f6541]">04</p><p className="text-[24px] font-semibold text-[#c89a4b]">Validation</p></div>
        </div>
      </section>

      <AnnouncementModal
        open={Boolean(selectedVisa)}
        onClose={() => setSelectedVisa(null)}
        announcement={selectedVisa}
        formatPrice={formatPrice}
        serviceType="CUSTOM_TRIP"
        showCountryField
      />
    </>
  );
}
