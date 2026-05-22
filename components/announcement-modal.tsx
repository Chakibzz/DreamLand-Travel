"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { FormSuccessBadge } from "@/components/form-success-badge";

type BookingService = "CUSTOM_TRIP" | "OMRA" | "TICKETING" | "TRANSFER";
type TransferType = "AEROPORT_HOTEL" | "INTER_VILLES" | "BUSINESS";
type PriceOption = { label: string; price: number | string };
type RichFormula = { name: string; hotel?: string; tariffs?: PriceOption[] };
type RichDetails = {
  duration?: string;
  airline?: string;
  dates?: string[];
  formulas?: RichFormula[];
  included?: string[];
  excluded?: string[];
  alert?: string;
};

type AnnouncementModalProps = {
  open: boolean;
  onClose: () => void;
  announcement: {
    title: string;
    description: string;
    image: string;
    location?: string;
    categoryName?: string;
    price?: string;
    tags?: string[];
    priceOptions?: PriceOption[];
    richDetails?: RichDetails;
    highlights?: string[];
  } | null;
  serviceType: BookingService;
  formatPrice?: (value: number) => string;
  showCountryField?: boolean;
  showTransferFields?: boolean;
  transferPreset?: TransferType;
};

export function AnnouncementModal({
  open,
  onClose,
  announcement,
  serviceType,
  formatPrice,
  showCountryField = false,
  showTransferFields = false,
  transferPreset,
}: AnnouncementModalProps) {
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    country: "",
    transferType: "AEROPORT_HOTEL" as TransferType,
    city: "",
    transferFrom: "",
    transferTo: "",
    companyName: "",
    pickupAddress: "",
    destination: "",
    departureDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    childrenAges: "",
    selectedPriceOption: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !announcement) return null;
  const currentTransferType: TransferType = showTransferFields && transferPreset ? transferPreset : form.transferType;

  const parsedPrice = announcement.price ? Number(announcement.price) : NaN;
  const displayPrice = announcement.price
    ? formatPrice && !Number.isNaN(parsedPrice)
      ? formatPrice(parsedPrice)
      : announcement.price
    : "Sur demande";
  const priceOptions = announcement.priceOptions ?? [];
  const richDetails = announcement.richDetails ?? {};
  const richFormulas = richDetails.formulas ?? [];
  const hasRichDetails =
    Boolean(richDetails.duration) ||
    Boolean(richDetails.airline) ||
    Boolean(richDetails.dates?.length) ||
    Boolean(richFormulas.length) ||
    Boolean(richDetails.included?.length) ||
    Boolean(richDetails.excluded?.length);
  const selectablePriceOptions =
    richFormulas.length > 0
      ? richFormulas.flatMap((formula) => (formula.tariffs ?? []).map((tariff) => ({ label: `${formula.name} - ${tariff.label}`, price: tariff.price })))
      : priceOptions;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "idle", message: "" });

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        destination: showTransferFields
          ? currentTransferType === "AEROPORT_HOTEL"
            ? `Transfert aeroport-hotel (${form.city || "ville non precisee"})`
            : currentTransferType === "INTER_VILLES"
              ? `Transfert inter-villes (${form.transferFrom || "depart"} -> ${form.transferTo || "arrivee"})`
            : `Business transfert (${form.companyName || "societe"})`
          : form.destination || announcement.title,
        notes:
          [
            showCountryField && form.country.trim() ? `Pays choisi: ${form.country.trim()}` : "",
            showTransferFields && currentTransferType === "AEROPORT_HOTEL" && form.city.trim() ? `Ville: ${form.city.trim()}` : "",
            showTransferFields && currentTransferType === "INTER_VILLES" && form.transferFrom.trim() ? `Ville de depart: ${form.transferFrom.trim()}` : "",
            showTransferFields && currentTransferType === "INTER_VILLES" && form.transferTo.trim() ? `Ville d'arrivee: ${form.transferTo.trim()}` : "",
            showTransferFields && currentTransferType === "BUSINESS" && form.companyName.trim() ? `Societe: ${form.companyName.trim()}` : "",
            showTransferFields && currentTransferType === "BUSINESS" && form.pickupAddress.trim() ? `Adresse de prise en charge: ${form.pickupAddress.trim()}` : "",
            form.selectedPriceOption.trim() ? `Option tarifaire souhaitee: ${form.selectedPriceOption.trim()}` : "",
            form.children > 0 && form.childrenAges.trim() ? `Ages des enfants: ${form.childrenAges.trim()}` : "",
            form.notes,
          ]
            .filter(Boolean)
            .join("\n")
            .trim(),
        serviceType,
      }),
    });

    const json = await response.json();
    setSending(false);

    if (!response.ok || !json.success) {
      setStatus({ type: "error", message: json.message || "Erreur lors de l'envoi de la reservation." });
      return;
    }

    setStatus({ type: "success", message: "Demande envoyee. Notre equipe vous recontacte rapidement." });
    setForm({
      fullname: "",
      phone: "",
      country: "",
      transferType: transferPreset || "AEROPORT_HOTEL",
      city: "",
      transferFrom: "",
      transferTo: "",
      companyName: "",
      pickupAddress: "",
      destination: "",
      departureDate: "",
      endDate: "",
      adults: 1,
      children: 0,
      childrenAges: "",
      selectedPriceOption: "",
      notes: "",
    });
  };

  return (
    <div className="fixed inset-0 z-[130] bg-[#081a33]/70 px-3 py-4 md:px-6 md:py-6" onClick={onClose}>
      <div
        className="mx-auto grid max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#3b2b16] bg-[#12100c] shadow-[0_35px_90px_-35px_rgba(0,35,85,0.7)] md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-[260px] md:min-h-[640px]">
          <Image src={announcement.image} alt={announcement.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06224d]/80 via-[#06224d]/20 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-[#12100c]/95 px-3 py-1 text-[12px] font-semibold text-[#1b2a44] shadow-sm">
            Fermer
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-[11px] uppercase tracking-widest text-white/80">{announcement.categoryName || "Offre"}</p>
            <h3 className="mt-1 text-[34px] font-semibold leading-tight">{announcement.title}</h3>
            <p className="mt-1 text-[14px] text-white/90">{announcement.location || "Destination a confirmer"}</p>
            <p className="mt-3 inline-flex rounded-full bg-[#12100c]/15 px-3 py-1 text-[13px] font-semibold">A partir de {displayPrice}</p>
          </div>
        </div>

        <div className="max-h-[95vh] overflow-y-auto p-5 md:p-6">
          <div className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4">
            <h4 className="text-[24px] font-semibold text-[#c89a4b]">Details de l&apos;annonce</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[#e4d7c0]">{announcement.description}</p>
            {announcement.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {announcement.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#5b4526] bg-[#090909] px-3 py-1 text-[11px] font-semibold text-[#c89a4b]">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {hasRichDetails ? (
              <div className="mt-4 space-y-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {richDetails.duration ? (
                    <div className="rounded-lg border border-[#3b2b16] bg-[#0f0c08] p-3">
                      <p className="text-[10px] uppercase tracking-widest text-[#9f8a66]">Duree</p>
                      <p className="mt-1 text-[13px] font-semibold text-[#e4d7c0]">{richDetails.duration}</p>
                    </div>
                  ) : null}
                  {richDetails.airline ? (
                    <div className="rounded-lg border border-[#3b2b16] bg-[#0f0c08] p-3">
                      <p className="text-[10px] uppercase tracking-widest text-[#9f8a66]">Compagnie</p>
                      <p className="mt-1 text-[13px] font-semibold text-[#e4d7c0]">{richDetails.airline}</p>
                    </div>
                  ) : null}
                </div>
                {richDetails.dates?.length ? (
                  <div className="rounded-xl border border-[#3b2b16] bg-[#0f0c08] p-3">
                    <p className="text-[12px] font-semibold text-[#d6c29a]">Dates disponibles</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {richDetails.dates.map((date) => (
                        <span key={date} className="rounded-md bg-[#16110a] px-3 py-2 text-[12px] text-[#e4d7c0]">
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {richFormulas.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[12px] font-semibold text-[#d6c29a]">Formules et tarifs</p>
                    {richFormulas.map((formula) => (
                      <div key={formula.name} className="overflow-hidden rounded-xl border border-[#3b2b16] bg-[#0f0c08]">
                        <div className="border-b border-[#3b2b16] px-3 py-2">
                          <p className="text-[13px] font-semibold text-[#c89a4b]">{formula.name}</p>
                          {formula.hotel ? <p className="text-[11px] text-[#9f8a66]">{formula.hotel}</p> : null}
                        </div>
                        <div className="divide-y divide-[#3b2b16]">
                          {(formula.tariffs ?? []).map((option) => (
                            <div key={`${formula.name}-${option.label}`} className="flex items-center justify-between gap-4 px-3 py-2 text-[12px]">
                              <span className="text-[#e4d7c0]">{option.label}</span>
                              <span className="shrink-0 font-bold text-[#c89a4b]">{formatPrice ? formatPrice(Number(option.price)) : option.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {richDetails.included?.length ? (
                  <div className="rounded-xl border border-[#3b2b16] bg-[#0f0c08] p-3">
                    <p className="text-[12px] font-semibold text-[#d6c29a]">Inclus dans le prix</p>
                    <ul className="mt-2 space-y-1 text-[12px] text-[#e4d7c0]">
                      {richDetails.included.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {richDetails.excluded?.length ? (
                  <div className="rounded-xl border border-[#5b4526] bg-[#16110a] p-3">
                    <p className="text-[12px] font-semibold text-[#d6c29a]">Non inclus</p>
                    <ul className="mt-2 space-y-1 text-[12px] text-[#e4d7c0]">
                      {richDetails.excluded.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {richDetails.alert ? <p className="rounded-lg bg-[#a97b32] px-3 py-2 text-[12px] font-bold text-white">{richDetails.alert}</p> : null}
              </div>
            ) : priceOptions.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#3b2b16] bg-[#0f0c08]">
                <div className="border-b border-[#3b2b16] px-3 py-2 text-[12px] font-semibold text-[#d6c29a]">Tarifs disponibles</div>
                <div className="divide-y divide-[#3b2b16]">
                  {priceOptions.map((option) => (
                    <div key={option.label} className="flex items-center justify-between gap-4 px-3 py-2 text-[12px]">
                      <span className="text-[#e4d7c0]">{option.label}</span>
                      <span className="shrink-0 font-bold text-[#c89a4b]">{formatPrice ? formatPrice(Number(option.price)) : option.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {(announcement.highlights && announcement.highlights.length > 0
                ? announcement.highlights
                : ["Accompagnement personnalise", "Assistance rapide", "Suivi de reservation complet"]
              ).map((point) => (
                <span key={point} className="rounded-full border border-[#5b4526] bg-[#090909] px-3 py-1 text-[11px] text-[#c89a4b]">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#3b2b16] bg-[#12100c] p-4">
            <h4 className="text-[24px] font-semibold text-[#c89a4b]">Demande de reservation</h4>
            <form className="mt-3 space-y-3" onSubmit={onSubmit}>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Nom complet</label>
                <input required value={form.fullname} onChange={(e) => setForm((v) => ({ ...v, fullname: e.target.value }))} placeholder="Ex: Sara A." className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Telephone (WhatsApp de preference)</label>
                <input required value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="Ex: 0784 00 85 23" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              </div>
              {!showTransferFields ? (
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Destination / annonce selectionnee</label>
                  <input required value={form.destination || announcement.title} onChange={(e) => setForm((v) => ({ ...v, destination: e.target.value }))} placeholder="Nom de l'offre" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                </div>
              ) : null}
              {selectablePriceOptions.length > 0 ? (
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Option tarifaire souhaitee</label>
                  <select value={form.selectedPriceOption} onChange={(e) => setForm((v) => ({ ...v, selectedPriceOption: e.target.value }))} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]">
                    <option value="">A confirmer avec un conseiller</option>
                    {selectablePriceOptions.map((option) => {
                      const label = `${option.label} - ${formatPrice ? formatPrice(Number(option.price)) : option.price}`;
                      return (
                        <option key={option.label} value={label}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : null}
              {showCountryField ? (
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Pays choisi</label>
                  <input
                    required
                    value={form.country}
                    onChange={(e) => setForm((v) => ({ ...v, country: e.target.value }))}
                    placeholder="Ex: Canada"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                </div>
              ) : null}
              {showTransferFields ? (
                <div className="space-y-3">
                  {currentTransferType === "AEROPORT_HOTEL" ? (
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville</label>
                      <input required value={form.city} onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))} placeholder="Ex: Alger" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                    </div>
                  ) : null}
                  {currentTransferType === "INTER_VILLES" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville de depart</label>
                        <input required value={form.transferFrom} onChange={(e) => setForm((v) => ({ ...v, transferFrom: e.target.value }))} placeholder="Ex: Alger" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville d&apos;arrivee</label>
                        <input required value={form.transferTo} onChange={(e) => setForm((v) => ({ ...v, transferTo: e.target.value }))} placeholder="Ex: Oran" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                      </div>
                    </div>
                  ) : null}
                  {currentTransferType === "BUSINESS" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Societe / entreprise</label>
                        <input required value={form.companyName} onChange={(e) => setForm((v) => ({ ...v, companyName: e.target.value }))} placeholder="Ex: Dreamland Corp" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Adresse de prise en charge</label>
                        <input required value={form.pickupAddress} onChange={(e) => setForm((v) => ({ ...v, pickupAddress: e.target.value }))} placeholder="Ex: Centre d'affaires Bab Ezzouar" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Date de depart (a partir de)</label>
                  <input required type="date" value={form.departureDate} onChange={(e) => setForm((v) => ({ ...v, departureDate: e.target.value }))} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Date de retour / fin (jusqu&apos;a)</label>
                  <input required type="date" value={form.endDate} onChange={(e) => setForm((v) => ({ ...v, endDate: e.target.value }))} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Nombre d&apos;adultes</label>
                  <input required type="number" min={1} max={50} value={form.adults} onChange={(e) => setForm((v) => ({ ...v, adults: Number(e.target.value) }))} placeholder="Ex: 2" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Nombre d&apos;enfants</label>
                  <input required type="number" min={0} max={20} value={form.children} onChange={(e) => setForm((v) => ({ ...v, children: Number(e.target.value) }))} placeholder="Ex: 1" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                </div>
              </div>
              {form.children > 0 ? (
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ages des enfants</label>
                  <input
                    value={form.childrenAges}
                    onChange={(e) => setForm((v) => ({ ...v, childrenAges: e.target.value }))}
                    placeholder="Ex: 4, 8"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                  <p className="mt-1 text-[11px] text-[#9f8a66]">Indiquez les ages separes par des virgules.</p>
                </div>
              ) : null}
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Notes complementaires (optionnel)</label>
                <textarea value={form.notes} onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))} placeholder="Ex: budget, type d'hebergement, preferences..." rows={4} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              </div>
              <button disabled={sending} className="w-full rounded-md bg-[#a97b32] py-2.5 text-[12px] font-bold text-white hover:bg-[#8f6527] disabled:opacity-70">
                {sending ? "Envoi..." : "Envoyer la demande"}
              </button>
              {status.type === "success" ? <FormSuccessBadge message={status.message} /> : null}
              {status.type === "error" ? <p className="text-[12px] text-[#ba1a1a]">{status.message}</p> : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


