import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[320px] overflow-hidden scroll-reveal">
        <Image src="/heroes/details-hero-generated.png" alt="A propos" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e40]/70 to-[#001e40]/25" />
        <div className="container-max relative mx-auto px-4 pt-24 md:px-10">
          <h1 className="max-w-2xl text-[56px] font-bold leading-[58px] text-white">A propos de DreamLand Travel</h1>
          <p className="mt-2 max-w-2xl text-[14px] text-white/90">Une agence specialisee dans les voyages premium, les circuits sur mesure et l&apos;accompagnement visa.</p>
        </div>
      </section>

      <section className="container-max mx-auto grid gap-6 px-4 py-10 scroll-reveal md:grid-cols-2 md:px-10">
        <article className="scroll-reveal rounded-xl bg-[#12100c] p-6 shadow-sm">
          <h2 className="text-[34px] font-semibold text-[#c89a4b]">Notre mission</h2>
          <p className="mt-3 text-[14px] text-[#d9c9ab]">Creer des voyages memorables en combinant securite, confort et immersion culturelle. Notre equipe construit chaque itineraire selon vos objectifs et votre budget.</p>
        </article>
        <article className="scroll-reveal rounded-xl bg-[#12100c] p-6 shadow-sm">
          <h2 className="text-[34px] font-semibold text-[#c89a4b]">Notre expertise</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] text-[#d9c9ab]">
            <li>Circuits Algerie et international</li>
            <li>Assistance visa de A a Z</li>
            <li>Accompagnement client avant, pendant et apres le voyage</li>
          </ul>
        </article>
        <article className="scroll-reveal rounded-xl bg-[#c89a4b] p-6 text-white md:col-span-2">
          <h2 className="text-[34px] font-semibold">Pourquoi nous choisir</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div><p className="text-[40px] font-bold">5.0</p><p>Avis moyens verifies</p></div>
            <div><p className="text-[40px] font-bold">+500</p><p>Voyages accompagnes</p></div>
            <div><p className="text-[40px] font-bold">24/7</p><p>Support et assistance</p></div>
          </div>
        </article>
      </section>
    </>
  );
}


