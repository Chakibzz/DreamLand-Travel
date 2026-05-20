import Image from "next/image";
import { featuredTrips } from "@/lib/site-data";

export function TripGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Selection</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Destinations favorites</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {featuredTrips.map((trip) => (
          <article key={trip.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#12100c] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-52 overflow-hidden">
              <Image src={trip.image} alt={trip.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-slate-900">{trip.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{trip.place}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-cyan-700">{trip.price}</span>
                <button className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:border-cyan-600 hover:text-cyan-700">Voir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


