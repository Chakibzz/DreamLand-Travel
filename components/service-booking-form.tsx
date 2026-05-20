"use client";

import { FormEvent, useState } from "react";
import { FormSuccessBadge } from "@/components/form-success-badge";

type ServiceBookingFormProps = {
  serviceType: "CUSTOM_TRIP" | "OMRA" | "TICKETING" | "TRANSFER";
  defaultDestination: string;
  title: string;
};

export function ServiceBookingForm({ serviceType, defaultDestination, title }: ServiceBookingFormProps) {
  const isTicketing = serviceType === "TICKETING";
  const isTransfer = serviceType === "TRANSFER";
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    destination: defaultDestination,
    transferType: "AEROPORT_HOTEL",
    city: "",
    transferFrom: "",
    transferTo: "",
    companyName: "",
    pickupAddress: "",
    departurePlace: "",
    arrivalPlace: "",
    departureDate: "",
    endDate: "",
    adults: 1,
    children: 0,
    childrenAges: "",
    notes: "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "idle", message: "" });

    const response = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        destination: isTicketing
          ? `${form.departurePlace} -> ${form.arrivalPlace}`
          : isTransfer
            ? form.transferType === "AEROPORT_HOTEL"
              ? `Transfert aeroport-hotel (${form.city || "ville non precisee"})`
              : form.transferType === "INTER_VILLES"
                ? `Transfert inter-villes (${form.transferFrom || "depart"} -> ${form.transferTo || "arrivee"})`
                : `Business transfert (${form.companyName || "societe"})`
            : form.destination,
        notes: [
          isTransfer && form.transferType === "AEROPORT_HOTEL" && form.city.trim() ? `Ville: ${form.city.trim()}` : "",
          isTransfer && form.transferType === "INTER_VILLES" && form.transferFrom.trim() ? `Ville de depart: ${form.transferFrom.trim()}` : "",
          isTransfer && form.transferType === "INTER_VILLES" && form.transferTo.trim() ? `Ville d'arrivee: ${form.transferTo.trim()}` : "",
          isTransfer && form.transferType === "BUSINESS" && form.companyName.trim() ? `Societe: ${form.companyName.trim()}` : "",
          isTransfer && form.transferType === "BUSINESS" && form.pickupAddress.trim() ? `Adresse de prise en charge: ${form.pickupAddress.trim()}` : "",
          form.children > 0 && form.childrenAges.trim() ? `Ages des enfants: ${form.childrenAges.trim()}` : "",
          form.notes.trim(),
        ]
          .filter(Boolean)
          .join("\n"),
        serviceType,
      }),
    });

    const json = await response.json();
    setSending(false);

    if (!response.ok || !json.success) {
      setStatus({ type: "error", message: json.message || "Erreur lors de l'envoi." });
      return;
    }

    setStatus({ type: "success", message: "Votre demande a ete envoyee avec succes." });
    setForm({
      fullname: "",
      phone: "",
      destination: defaultDestination,
      transferType: "AEROPORT_HOTEL",
      city: "",
      transferFrom: "",
      transferTo: "",
      companyName: "",
      pickupAddress: "",
      departurePlace: "",
      arrivalPlace: "",
      departureDate: "",
      endDate: "",
      adults: 1,
      children: 0,
      childrenAges: "",
      notes: "",
    });
  };

  return (
    <div className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
      <h3 className="text-[28px] font-semibold text-[#c89a4b]">{title}</h3>
      <form className="mt-3 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Nom complet</label>
          <input required value={form.fullname} onChange={(e) => setForm((v) => ({ ...v, fullname: e.target.value }))} placeholder="Ex: Mohamed B." className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Telephone (WhatsApp de preference)</label>
          <input required value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} placeholder="Ex: 0557 01 08 38" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
        </div>
        {isTicketing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Lieu de depart</label>
              <input required value={form.departurePlace} onChange={(e) => setForm((v) => ({ ...v, departurePlace: e.target.value }))} placeholder="Ex: Alger" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Lieu d&apos;arrivee</label>
              <input required value={form.arrivalPlace} onChange={(e) => setForm((v) => ({ ...v, arrivalPlace: e.target.value }))} placeholder="Ex: Istanbul" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </div>
          </div>
        ) : isTransfer ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Type de transfert</label>
              <select
                value={form.transferType}
                onChange={(e) => setForm((v) => ({ ...v, transferType: e.target.value }))}
                className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
              >
                <option value="AEROPORT_HOTEL">Aeroport - Hotel</option>
                <option value="INTER_VILLES">Inter-villes</option>
                <option value="BUSINESS">Business transfert</option>
              </select>
            </div>

            {form.transferType === "AEROPORT_HOTEL" ? (
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))}
                  placeholder="Ex: Alger"
                  className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
              </div>
            ) : null}

            {form.transferType === "INTER_VILLES" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville de depart</label>
                  <input
                    required
                    value={form.transferFrom}
                    onChange={(e) => setForm((v) => ({ ...v, transferFrom: e.target.value }))}
                    placeholder="Ex: Alger"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Ville d&apos;arrivee</label>
                  <input
                    required
                    value={form.transferTo}
                    onChange={(e) => setForm((v) => ({ ...v, transferTo: e.target.value }))}
                    placeholder="Ex: Oran"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                </div>
              </div>
            ) : null}

            {form.transferType === "BUSINESS" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Societe / entreprise</label>
                  <input
                    required
                    value={form.companyName}
                    onChange={(e) => setForm((v) => ({ ...v, companyName: e.target.value }))}
                    placeholder="Ex: Dreamland Corp"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Adresse de prise en charge</label>
                  <input
                    required
                    value={form.pickupAddress}
                    onChange={(e) => setForm((v) => ({ ...v, pickupAddress: e.target.value }))}
                    placeholder="Ex: Centre d'affaires Bab Ezzouar"
                    className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Destination / offre souhaitee</label>
            <input required value={form.destination} onChange={(e) => setForm((v) => ({ ...v, destination: e.target.value }))} placeholder="Ex: Omra Confort ou Istanbul" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
          </div>
        )}
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
              placeholder="Ex: 3, 7, 11"
              className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
            />
            <p className="mt-1 text-[11px] text-[#9f8a66]">Indiquez les ages separes par des virgules.</p>
          </div>
        ) : null}
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-[#d6c29a]">Notes complementaires (optionnel)</label>
          <textarea value={form.notes} onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))} placeholder="Ex: hotel 4*, chambres communicantes, budget, contraintes..." rows={4} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
        </div>
        <button disabled={sending} className="w-full rounded-md bg-[#a97b32] py-2.5 text-[12px] font-bold text-white">{sending ? "Envoi..." : "Envoyer la demande"}</button>
        {status.type === "success" ? <FormSuccessBadge message={status.message} /> : null}
        {status.type === "error" ? <p className="text-[12px] text-[#ba1a1a]">{status.message}</p> : null}
      </form>
    </div>
  );
}


