"use client";

import Image from "next/image";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormSuccessBadge } from "@/components/form-success-badge";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const getInitialValues = (): FormValues => {
  const subjectFromQuery = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("subject")
    : null;

  return {
    name: "",
    email: "",
    phone: "",
    subject: subjectFromQuery || "Nouvelle demande de contact depuis le site DreamLand Travel",
    message: "",
  };
};

function ContactPageContent() {
  const searchParams = useSearchParams();
  const subjectFromQuery = searchParams.get("subject");
  const [values, setValues] = useState<FormValues>(getInitialValues);
  const [subjectTouched, setSubjectTouched] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const effectiveSubject = !subjectTouched && subjectFromQuery ? subjectFromQuery : values.subject;


  const validate = (payload: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!payload.name.trim()) nextErrors.name = "Le nom complet est requis.";

    if (!payload.email.trim()) {
      nextErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = "Veuillez saisir une adresse email valide.";
    }

    if (payload.phone.trim() && !/^[0-9+()\-\s]{6,20}$/.test(payload.phone)) {
      nextErrors.phone = "Veuillez saisir un numero de telephone valide.";
    }

    if (!payload.subject.trim()) {
      nextErrors.subject = "Le sujet est requis.";
    }

    if (!payload.message.trim()) {
      nextErrors.message = "Le message est requis.";
    } else if (payload.message.trim().length < 10) {
      nextErrors.message = "Message trop court (10 caracteres minimum).";
    }

    return nextErrors;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setStatusMessage("");

    const payload = { ...values, subject: effectiveSubject };
    const validationErrors = validate(payload);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSending(true);
      const response = await fetch("/api/contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: values.name,
          email: values.email,
          phone: values.phone,
          message: `${payload.subject}\n\n${values.message}`,
          serviceType: "CONTACT",
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.message || "Echec de l'envoi");

      setStatus("success");
      setStatusMessage("Demande enregistree avec succes. Nous vous contacterons rapidement.");
      setValues(getInitialValues());
      setSubjectTouched(false);
      setErrors({});
    } catch (error: unknown) {
      const fallback = "Echec de l'envoi. Veuillez reessayer.";
      const details = error instanceof Error ? error.message : "";
      setStatus("error");
      setStatusMessage(details ? `Echec de l'envoi : ${details}` : fallback);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="relative h-[260px] overflow-hidden scroll-reveal">
        <Image src="/heroes/contact-hero-generated.png" alt="Contact" fill sizes="100vw" quality={100} unoptimized className="object-cover image-hover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#c89a4b]/80 to-transparent" />
        <div className="container-max relative mx-auto px-4 pt-20 md:px-10">
          <h1 className="text-[56px] font-bold leading-[58px] text-white">Contactez-nous</h1>
          <p className="mt-2 text-[13px] text-white">Nous sommes la pour vous aider a planifier votre prochain voyage exceptionnel.</p>
        </div>
      </section>

      <section className="container-max mx-auto grid gap-6 px-4 py-10 scroll-reveal md:grid-cols-2 md:px-10">
        <div className="scroll-reveal rounded-2xl border border-[#3b2b16] bg-[#12100c] p-6 shadow-[0_18px_35px_-24px_rgba(0,70,137,0.35)]">
          <h2 className="text-[38px] font-semibold text-[#c89a4b]">Envoyez-nous un message</h2>
          <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
            <div>
              <input
                className="w-full rounded-lg border border-[#5b4526] bg-[#fbfcff] px-3 py-2 text-[12px] outline-none transition focus:border-[#a97b32] focus:ring-2 focus:ring-[#d5e3ff]"
                placeholder="Nom complet"
                value={values.name}
                onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? <p className="mt-1 text-[11px] text-[#ba1a1a]">{errors.name}</p> : null}
            </div>

            <div>
              <input
                className="w-full rounded-lg border border-[#5b4526] bg-[#fbfcff] px-3 py-2 text-[12px] outline-none transition focus:border-[#a97b32] focus:ring-2 focus:ring-[#d5e3ff]"
                placeholder="Adresse email"
                type="email"
                value={values.email}
                onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="mt-1 text-[11px] text-[#ba1a1a]">{errors.email}</p> : null}
            </div>

            <div>
              <input
                className="w-full rounded-lg border border-[#5b4526] bg-[#fbfcff] px-3 py-2 text-[12px] outline-none transition focus:border-[#a97b32] focus:ring-2 focus:ring-[#d5e3ff]"
                placeholder="Telephone (optionnel)"
                value={values.phone}
                onChange={(e) => setValues((prev) => ({ ...prev, phone: e.target.value }))}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? <p className="mt-1 text-[11px] text-[#ba1a1a]">{errors.phone}</p> : null}
            </div>

            <div>
              <input
                className="w-full rounded-lg border border-[#5b4526] bg-[#fbfcff] px-3 py-2 text-[12px] outline-none transition focus:border-[#a97b32] focus:ring-2 focus:ring-[#d5e3ff]"
                placeholder="Sujet"
                value={effectiveSubject}
                onChange={(e) => {
                  setSubjectTouched(true);
                  setValues((prev) => ({ ...prev, subject: e.target.value }));
                }}
                aria-invalid={Boolean(errors.subject)}
              />
              {errors.subject ? <p className="mt-1 text-[11px] text-[#ba1a1a]">{errors.subject}</p> : null}
            </div>

            <div>
              <textarea
                className="w-full rounded-lg border border-[#5b4526] bg-[#fbfcff] px-3 py-2 text-[12px] outline-none transition focus:border-[#a97b32] focus:ring-2 focus:ring-[#d5e3ff]"
                rows={5}
                placeholder="Comment pouvons-nous vous aider a organiser votre voyage ?"
                value={values.message}
                onChange={(e) => setValues((prev) => ({ ...prev, message: e.target.value }))}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? <p className="mt-1 text-[11px] text-[#ba1a1a]">{errors.message}</p> : null}
            </div>

            <button
              className="w-full rounded-lg bg-[#a97b32] py-2.5 text-[12px] font-bold text-white shadow-[0_8px_20px_-12px_rgba(0,70,137,0.6)] transition hover:bg-[#8f6527] disabled:opacity-70"
              disabled={sending}
              type="submit"
            >
              {sending ? "Envoi..." : "Envoyer le message"}
            </button>

            {status === "success" ? <FormSuccessBadge message={statusMessage} /> : null}
            {status === "error" ? <p className="text-[12px] text-[#ba1a1a]">{statusMessage}</p> : null}
          </form>
        </div>

        <div className="space-y-4 scroll-reveal">
          <h2 className="text-[38px] font-semibold text-[#c89a4b]">Retrouvez-nous</h2>
          <div className="scroll-reveal rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-[0_18px_35px_-24px_rgba(0,70,137,0.35)]">
            <p className="text-[14px] font-bold text-[#c89a4b]">Adresse</p>
            <p className="mt-1 text-[14px] text-[#d9c9ab]">Rue Boukhtachi Djilali, Boufarik 09001, Algerie</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:0557010838" className="scroll-reveal rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-[0_18px_35px_-24px_rgba(0,70,137,0.35)] transition hover:border-[#a97b32]">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9f8a66]">Ligne 1</p>
              <p className="mt-2 text-[30px] font-semibold leading-none text-[#c89a4b]">0557 01 08 38</p>
            </a>
            <a href="tel:0784008523" className="scroll-reveal rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-[0_18px_35px_-24px_rgba(0,70,137,0.35)] transition hover:border-[#a97b32]">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#9f8a66]">Ligne 2</p>
              <p className="mt-2 text-[30px] font-semibold leading-none text-[#c89a4b]">0784 00 85 23</p>
            </a>
          </div>

          <div className="scroll-reveal overflow-hidden rounded-2xl border border-[#3b2b16] bg-[#12100c] shadow-[0_18px_35px_-24px_rgba(0,70,137,0.35)]">
            <iframe
              title="Google Maps DreamLand Travel"
              src="https://www.google.com/maps?q=HWH4%2B4QV%2C%20Rue%20Sabet%20Khalile%2C%20Boufarik&output=embed"
              className="h-[240px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="scroll-reveal rounded-2xl border border-[#3b2b16] bg-gradient-to-br from-[#c89a4b] to-[#a97b32] p-5 text-white shadow-[0_20px_36px_-24px_rgba(0,70,137,0.6)]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Disponibilite</p>
            <p className="mt-2 text-[16px]">Lun - Sam : 09:00 - 19:00</p>
            <p className="text-[14px] text-white/85">Reponse rapide sur WhatsApp et email.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="https://wa.me/213557010838" target="_blank" rel="noreferrer" className="rounded-md bg-[#12100c] px-3 py-1.5 text-[12px] font-bold text-[#c89a4b]">WhatsApp</a>
              <a href="mailto:dreamlandtravel.dz@gmail.com" className="rounded-md border border-white/40 px-3 py-1.5 text-[12px] font-bold text-white">Email</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<section className="container-max mx-auto px-4 py-10 md:px-10" />}>
      <ContactPageContent />
    </Suspense>
  );
}




