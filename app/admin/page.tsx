import { prisma } from "@/lib/server/prisma";
import Link from "next/link";

export default async function AdminHomePage() {
  const [
    announcements,
    categories,
    contacts,
    bookings,
    pendingCount,
    contactedCount,
    confirmedCount,
    cancelledCount,
    latestRequests,
    latestContacts,
  ] = await prisma.$transaction([
    prisma.announcement.count(),
    prisma.category.count(),
    prisma.contactRequest.count(),
    prisma.bookingRequest.count(),
    prisma.bookingRequest.count({ where: { status: "PENDING" } }),
    prisma.bookingRequest.count({ where: { status: "CONTACTED" } }),
    prisma.bookingRequest.count({ where: { status: "CONFIRMED" } }),
    prisma.bookingRequest.count({ where: { status: "CANCELLED" } }),
    prisma.bookingRequest.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactRequest.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const statusCounts = {
    PENDING: pendingCount,
    CONTACTED: contactedCount,
    CONFIRMED: confirmedCount,
    CANCELLED: cancelledCount,
  };

  const pendingRatio = bookings > 0 ? Math.round((statusCounts.PENDING / bookings) * 100) : 0;

  const workflowCards = [
    { label: "Nouvelles reservations", value: statusCounts.PENDING, tone: "text-[#f4d7a1] bg-[#1a130b] border-[#5b4526]" },
    { label: "Clients contactes", value: statusCounts.CONTACTED, tone: "text-[#d9c9ab] bg-[#15110c] border-[#3b2b16]" },
    { label: "Reservations confirmees", value: statusCounts.CONFIRMED, tone: "text-[#d9c9ab] bg-[#15110c] border-[#3b2b16]" },
    { label: "Annulees", value: statusCounts.CANCELLED, tone: "text-[#d9c9ab] bg-[#15110c] border-[#3b2b16]" },
  ];

  const formatDate = (value: Date) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <h1 className="text-[34px] font-semibold text-[#c89a4b]">Dashboard admin</h1>
        <p className="text-[13px] text-[#d9c9ab]">Pilotage quotidien de l&apos;agence et traitement des demandes clients.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Link href="/admin/requests" className="rounded-lg bg-[#c89a4b] px-4 py-3 text-center text-[13px] font-semibold text-white hover:bg-[#004b92]">
            Ouvrir le workflow clients
          </Link>
          <Link href="/admin/announcements" className="rounded-lg border border-[#5b4526] px-4 py-3 text-center text-[13px] font-semibold text-[#c89a4b] hover:bg-[#16110a]">
            Gerer les annonces
          </Link>
          <Link href="/admin/categories" className="rounded-lg border border-[#5b4526] px-4 py-3 text-center text-[13px] font-semibold text-[#c89a4b] hover:bg-[#16110a]">
            Gerer les categories
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[{ label: "Annonces", value: announcements }, { label: "Categories", value: categories }, { label: "Contacts", value: contacts }, { label: "Reservations", value: bookings }].map((card) => (
          <article key={card.label} className="rounded-xl border border-[#3b2b16] bg-[#12100c] p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-widest text-[#9f8a66]">{card.label}</p>
            <p className="mt-1 text-[36px] font-semibold text-[#c89a4b]">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {workflowCards.map((card) => (
          <article key={card.label} className={`rounded-xl border p-4 ${card.tone}`}>
            <p className="text-[11px] uppercase tracking-widest">{card.label}</p>
            <p className="mt-1 text-[28px] font-semibold">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Etat du pipeline reservations</h2>
          <span className="rounded-full bg-[#1a130b] px-3 py-1 text-[12px] font-semibold text-[#f4d7a1]">{pendingRatio}% en attente</span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1a140d]">
          <div className="h-full bg-[#c89a4b]" style={{ width: `${Math.min(100, pendingRatio)}%` }} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Dernieres reservations</h2>
          <div className="mt-3 space-y-2">
            {latestRequests.map((item) => (
              <div key={item.id} className="rounded-lg bg-[#120f0a] px-3 py-2 text-[12px] text-[#d9c9ab]">
                <p className="font-semibold text-[#c89a4b]">{item.fullname} - {item.destination}</p>
                <p>{item.phone} · {item.status} · {formatDate(item.createdAt)}</p>
              </div>
            ))}
            {latestRequests.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucune reservation pour le moment.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Derniers messages de contact</h2>
          <div className="mt-3 space-y-2">
            {latestContacts.map((item) => (
              <div key={item.id} className="rounded-lg bg-[#120f0a] px-3 py-2 text-[12px] text-[#d9c9ab]">
                <p className="font-semibold text-[#c89a4b]">{item.fullname}</p>
                <p>{item.email} · {item.serviceType} · {formatDate(item.createdAt)}</p>
              </div>
            ))}
            {latestContacts.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucun message de contact.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

