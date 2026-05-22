"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string; _count?: { announcements: number } };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);

  async function loadData() {
    const res = await fetch("/api/admin/categories");
    const json = await res.json();
    setItems(json.data ?? []);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <h1 className="text-[30px] font-semibold text-[#c89a4b]">Types d&apos;offres disponibles</h1>
        <p className="mt-1 text-[13px] text-[#d9c9ab]">
          Cette page sert de repere. Lorsqu&apos;une annonce est ajoutee, il suffit de choisir le type d&apos;offre correspondant.
        </p>
      </div>

      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-[#3b2b16] bg-[#120f0a] px-4 py-3 text-[13px] text-[#d9c9ab]">
              <p className="font-semibold text-[#c89a4b]">{item.name}</p>
              <p className="mt-1 text-[12px] text-[#9f8a66]">{item._count ? `${item._count.announcements} annonce(s) dans ce type` : "Aucune annonce dans ce type"}</p>
            </div>
          ))}
          {items.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucune categorie.</p> : null}
        </div>
      </div>
    </div>
  );
}
