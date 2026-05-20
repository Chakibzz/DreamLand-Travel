type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <section className="container-max mx-auto px-4 py-12 md:px-10">
      <div className="max-w-4xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f8a66]">Informations legales</p>
        <h1 className="mt-2 text-[42px] font-semibold leading-tight text-[#c89a4b] md:text-[54px]">{title}</h1>
        <p className="mt-4 text-[15px] leading-7 text-[#d9c9ab]">{intro}</p>
      </div>

      <div className="mt-8 max-w-4xl space-y-5">
        {sections.map((section) => (
          <article key={section.title} className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-5">
            <h2 className="text-[24px] font-semibold text-[#c89a4b]">{section.title}</h2>
            <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#d9c9ab]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

