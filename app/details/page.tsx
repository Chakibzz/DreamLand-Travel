"use client";

import Image from "next/image";
import { useCurrency } from "@/components/currency-context";

export default function DetailsPage() {
  const { formatPrice } = useCurrency();

  return (
    <>
      <section className="relative h-[420px] overflow-hidden scroll-reveal">
        <Image src="/heroes/details-hero-generated.png" alt="Sahara" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="hero-mask-vertical absolute inset-0" />
        <div className="container-max relative mx-auto px-4 pb-10 pt-44 md:px-10">
          <p className="mb-2 inline-block rounded bg-[#a97b32] px-2 py-0.5 text-[9px] font-bold text-[#090909]">AVENTURE</p>
          <h1 className="text-[56px] font-bold leading-[58px] text-[#f3e5cc] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">Aventure dans le desert du Sahara</h1>
          <p className="mt-2 text-[13px] text-[#e3d2b2]">Note voyageurs 5.0 | Merzouga, Algerie</p>
        </div>
      </section>

      <section className="container-max mx-auto grid gap-6 px-4 py-8 scroll-reveal md:grid-cols-12 md:px-10">
        <div className="space-y-7 md:col-span-8">
          <div className="scroll-reveal">
            <h2 className="text-[38px] font-semibold text-[#c89a4b]">Points forts de l&apos;expedition</h2>
            <p className="mt-2 text-[14px] text-[#d9c9ab]">Partez pour une aventure unique au coeur du plus grand desert chaud du monde.</p>
          </div>
          <div className="scroll-reveal">
            <h2 className="text-[38px] font-semibold text-[#c89a4b]">Itineraire</h2>
            <p className="mt-2 text-[14px] text-[#d9c9ab]"><strong>Jour 1 :</strong> Arrivee aux portes d&apos;or</p>
            <div className="group overflow-hidden rounded-xl">
              <Image src="/upscaled/87ee7e59e75b.jpg" alt="Camp" width={900} height={400} quality={100} className="mt-3 rounded-xl image-hover" />
            </div>
          </div>
          <div className="scroll-reveal rounded-xl border border-[#3b2b16] bg-[#12100c] p-6">
            <h3 className="text-[32px] font-semibold text-[#c89a4b]">Ce qui est inclus</h3>
            <p className="mt-3 text-[13px] text-[#d9c9ab]">Transferts 4x4 luxe · Camp premium · Repas gastronomiques · Guides locaux experts.</p>
          </div>
        </div>

        <aside className="md:col-span-4">
          <div className="sticky top-24 space-y-4">
            <div className="scroll-reveal rounded-xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#9f8a66]">PRIX PAR PERSONNE</p>
                  <p className="text-[42px] font-bold text-[#c89a4b]">{formatPrice(499)}</p>
                </div>
                <span className="rounded-full bg-[#a97b32] px-2 py-1 text-[10px] font-bold text-[#090909]">-15%</span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-[#a97b32] py-3 text-[13px] font-bold text-white">Reserver l&apos;expedition</button>
            </div>
            <div className="scroll-reveal rounded-xl bg-[#c89a4b] p-5 text-white">
              <h4 className="text-[30px] font-semibold">Des questions ?</h4>
              <p className="text-[12px] text-white/85">Discutez directement avec nos conseillers voyage en Algerie.</p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}


