"use client";

import { useEffect, useMemo, useState } from "react";

type ContactRequest = {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  message: string;
  serviceType: string;
  createdAt?: string;
};

type BookingRequest = {
  id: string;
  fullname: string;
  phone: string;
  destination: string;
  status: "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED";
  serviceType: string;
  travelers?: number;
  adults?: number;
  children?: number;
  departureDate?: string;
  endDate?: string;
  notes?: string | null;
  createdAt?: string;
};

const statusLabels: Record<BookingRequest["status"], string> = {
  PENDING: "En attente",
  CONTACTED: "Contacte",
  CONFIRMED: "Confirmee",
  CANCELLED: "Annulee",
};

const serviceLabels: Record<string, string> = {
  CONTACT: "Contact",
  CUSTOM_TRIP: "Sejour a la carte",
  OMRA: "Omra",
  TICKETING: "Billetterie",
  TRANSFER: "Transfert",
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusChipClass(status: BookingRequest["status"]) {
  switch (status) {
    case "PENDING":
      return "bg-[#1a130b] text-[#f4d7a1] border-[#5b4526]";
    case "CONTACTED":
      return "bg-[#15110c] text-[#d9c9ab] border-[#3b2b16]";
    case "CONFIRMED":
      return "bg-[#15110c] text-[#d9c9ab] border-[#3b2b16]";
    case "CANCELLED":
      return "bg-[#1a130b] text-[#f4d7a1] border-[#5b4526]";
    default:
      return "bg-[#16110a] text-[#c89a4b] border-[#3b2b16]";
  }
}

export default function AdminRequestsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "contacts">("bookings");
  const [statusFilter, setStatusFilter] = useState<BookingRequest["status"] | "ALL">("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function loadData() {
    const [cRes, bRes] = await Promise.all([fetch("/api/admin/contact-requests"), fetch("/api/admin/booking-requests")]);
    const cJson = await cRes.json();
    const bJson = await bRes.json();
    setContacts(cJson.data ?? []);
    setBookings(bJson.data ?? []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const updateStatus = async (id: string, status: BookingRequest["status"]) => {
    setBusy(id);
    await fetch(`/api/admin/booking-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    await loadData();
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const statusOk = statusFilter === "ALL" || item.status === statusFilter;
      const serviceOk = serviceFilter === "ALL" || item.serviceType === serviceFilter;
      const q = search.trim().toLowerCase();
      const searchOk =
        q.length === 0 ||
        item.fullname.toLowerCase().includes(q) ||
        item.destination.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q);
      return statusOk && serviceOk && searchOk;
    });
  }, [bookings, statusFilter, serviceFilter, search]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      const serviceOk = serviceFilter === "ALL" || item.serviceType === serviceFilter;
      const q = search.trim().toLowerCase();
      const searchOk =
        q.length === 0 ||
        item.fullname.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q);
      return serviceOk && searchOk;
    });
  }, [contacts, serviceFilter, search]);

  const bookingCounters = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((x) => x.status === "PENDING").length,
      contacted: bookings.filter((x) => x.status === "CONTACTED").length,
      confirmed: bookings.filter((x) => x.status === "CONFIRMED").length,
      cancelled: bookings.filter((x) => x.status === "CANCELLED").length,
    }),
    [bookings],
  );

  const fieldClass = "rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] text-[#f5e6cc]";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <h1 className="text-[30px] font-semibold text-[#c89a4b]">Workflow clients</h1>
        <p className="text-[13px] text-[#d9c9ab]">Traitez les demandes par priorite avec filtres et actions rapides.</p>

        <div className="mt-4 grid gap-2 md:grid-cols-5">
          <div className="rounded-lg border border-[#3b2b16] bg-[#120f0a] p-3 text-[12px] text-[#d9c9ab]">
            <p>Total reservations</p>
            <p className="text-[22px] font-semibold text-[#c89a4b]">{bookingCounters.all}</p>
          </div>
          <div className="rounded-lg border border-[#5b4526] bg-[#1a130b] p-3 text-[12px] text-[#f4d7a1]">
            <p>En attente</p>
            <p className="text-[22px] font-semibold">{bookingCounters.pending}</p>
          </div>
          <div className="rounded-lg border border-[#3b2b16] bg-[#15110c] p-3 text-[12px] text-[#d9c9ab]">
            <p>Contactes</p>
            <p className="text-[22px] font-semibold">{bookingCounters.contacted}</p>
          </div>
          <div className="rounded-lg border border-[#3b2b16] bg-[#15110c] p-3 text-[12px] text-[#d9c9ab]">
            <p>Confirmees</p>
            <p className="text-[22px] font-semibold">{bookingCounters.confirmed}</p>
          </div>
          <div className="rounded-lg border border-[#5b4526] bg-[#1a130b] p-3 text-[12px] text-[#f4d7a1]">
            <p>Annulees</p>
            <p className="text-[22px] font-semibold">{bookingCounters.cancelled}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`rounded-md px-3 py-2 text-[12px] font-semibold ${activeTab === "bookings" ? "bg-[#c89a4b] text-white" : "bg-[#16110a] text-[#c89a4b]"}`}
          >
            Reservations ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`rounded-md px-3 py-2 text-[12px] font-semibold ${activeTab === "contacts" ? "bg-[#c89a4b] text-white" : "bg-[#16110a] text-[#c89a4b]"}`}
          >
            Contacts ({contacts.length})
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "bookings" ? "Rechercher client, destination, telephone" : "Rechercher client, email, message"}
            className={`${fieldClass} md:col-span-2`}
          />
          <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={fieldClass}>
            <option value="ALL">Tous les services</option>
            <option value="CONTACT">Contact</option>
            <option value="CUSTOM_TRIP">Sejour a la carte</option>
            <option value="OMRA">Omra</option>
            <option value="TICKETING">Billetterie</option>
            <option value="TRANSFER">Transfert</option>
          </select>
          <select
            disabled={activeTab !== "bookings"}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingRequest["status"] | "ALL")}
            className={`${fieldClass} disabled:bg-[#201a12] disabled:text-[#8a7960]`}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONTACTED">Contacte</option>
            <option value="CONFIRMED">Confirmee</option>
            <option value="CANCELLED">Annulee</option>
          </select>
        </div>
      </div>

      {activeTab === "bookings" ? (
        <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Demandes de reservation</h2>
          <div className="mt-3 space-y-2">
            {filteredBookings.map((b) => (
              <div key={b.id} className="rounded-lg border border-[#3b2b16] bg-[#120f0a] p-3 text-[12px] text-[#d9c9ab]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#c89a4b]">{b.fullname} - {b.destination}</p>
                    <p className="mt-1">{b.phone} · {serviceLabels[b.serviceType] ?? b.serviceType} · {formatDate(b.createdAt)}</p>
                    <p className="mt-1">Sejour: {formatDate(b.departureDate)} -&gt; {formatDate(b.endDate)} · Adultes: {b.adults ?? "-"} · Enfants: {b.children ?? "-"} · Total: {b.travelers ?? "-"}</p>
                    {b.notes ? <p className="mt-2 rounded-md bg-[#1a130b] px-2 py-1 text-[12px] text-[#f5e6cc]">{b.notes}</p> : null}
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${statusChipClass(b.status)}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${b.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Bonjour ${b.fullname}, nous revenons vers vous concernant votre demande ${b.destination}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-[#5b4526] px-3 py-1 text-[12px] text-[#d9c9ab] hover:bg-[#1a130b]"
                  >
                    Contacter WhatsApp
                  </a>
                  <button disabled={busy === b.id} onClick={() => updateStatus(b.id, "CONTACTED")} className="rounded-md bg-[#16110a] px-3 py-1 text-[12px] text-[#c89a4b] disabled:opacity-60">
                    Marquer contacte
                  </button>
                  <button disabled={busy === b.id} onClick={() => updateStatus(b.id, "CONFIRMED")} className="rounded-md bg-[#1a130b] px-3 py-1 text-[12px] text-[#f4d7a1] disabled:opacity-60">
                    Confirmer
                  </button>
                  <button disabled={busy === b.id} onClick={() => updateStatus(b.id, "CANCELLED")} className="rounded-md bg-[#1a130b] px-3 py-1 text-[12px] text-[#f4d7a1] disabled:opacity-60">
                    Annuler
                  </button>
                  <button disabled={busy === b.id} onClick={() => updateStatus(b.id, "PENDING")} className="rounded-md bg-[#16110a] px-3 py-1 text-[12px] text-[#d9c9ab] disabled:opacity-60">
                    Remettre en attente
                  </button>
                </div>
              </div>
            ))}
            {filteredBookings.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucune reservation correspondant aux filtres.</p> : null}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Demandes de contact</h2>
          <div className="mt-3 space-y-2">
            {filteredContacts.map((c) => (
              <div key={c.id} className="rounded-lg border border-[#3b2b16] bg-[#120f0a] p-3 text-[12px] text-[#d9c9ab]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#c89a4b]">{c.fullname}</p>
                    <p className="mt-1">{c.email} {c.phone ? `· ${c.phone}` : ""} · {serviceLabels[c.serviceType] ?? c.serviceType}</p>
                    <p className="mt-1 text-[11px] text-[#9f8a66]">{formatDate(c.createdAt)}</p>
                  </div>
                  <a href={`mailto:${c.email}`} className="rounded-md border border-[#5b4526] px-3 py-1 text-[12px] text-[#d9c9ab] hover:bg-[#1a130b]">
                    Repondre par email
                  </a>
                </div>
                <p className="mt-2 rounded-md bg-[#1a130b] px-2 py-2 text-[12px] text-[#f5e6cc]">{c.message}</p>
              </div>
            ))}
            {filteredContacts.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucune demande de contact correspondant aux filtres.</p> : null}
          </div>
        </div>
      )}
    </div>
  );
}

