"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { FormSuccessBadge } from "@/components/form-success-badge";

type BookingService = "CUSTOM_TRIP" | "OMRA" | "TICKETING" | "TRANSFER";
type TransferType = "AEROPORT_HOTEL" | "INTER_VILLES" | "BUSINESS";

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
            <p className="mt-3 inline-flex rounded-full bg-[#12100c]/15 px-3 py-1 text-[13px] font-semibold">{displayPrice}</p>
          </div>
        </div>

        <div className="max-h-[95vh] overflow-y-auto p-5 md:p-6">
          <div className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4">
            <h4 className="text-[24px] font-semibold text-[#c89a4b]">Details de l&apos;annonce</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[#e4d7c0]">{announcement.description}</p>
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


