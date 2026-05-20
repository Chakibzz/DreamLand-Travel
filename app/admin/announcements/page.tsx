"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Category = { id: string; name: string };

type Announcement = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  location: string;
  categoryId: string;
  category: Category;
};

type AdType = "GENERAL" | "OMRA" | "VISA" | "BILLETTERIE" | "TRANSFERT" | "SEJOUR";

const adTypes: Array<{ value: AdType; label: string }> = [
  { value: "GENERAL", label: "Generale" },
  { value: "OMRA", label: "Omra" },
  { value: "VISA", label: "Visa" },
  { value: "BILLETTERIE", label: "Billetterie" },
  { value: "TRANSFERT", label: "Transfert" },
  { value: "SEJOUR", label: "Sejour a la carte" },
];

const categoryToType: Array<{ match: RegExp; type: AdType }> = [
  { match: /omra/i, type: "OMRA" },
  { match: /visa/i, type: "VISA" },
  { match: /billetterie/i, type: "BILLETTERIE" },
  { match: /transfert/i, type: "TRANSFERT" },
  { match: /sejour/i, type: "SEJOUR" },
];

const initialForm = {
  title: "",
  description: "",
  price: "",
  image: "",
  location: "",
  categoryId: "",
};

const initialDetails = {
  destination: "",
  departVille: "",
  departDate: "",
  retourDate: "",
  duree: "",
  compagnie: "",
  hotel: "",
  formule: "",
  inclus: "",
  transportType: "",
  pointDepart: "",
  pointArrivee: "",
  nombreNuits: "",
  notes: "",
};

function buildGenerated(type: AdType, d: typeof initialDetails, base: typeof initialForm) {
  switch (type) {
    case "OMRA":
      return {
        title: `Pack Omra ${d.formule || "Standard"}${d.departDate ? ` - depart ${d.departDate}` : ""}`,
        description: `Omra ${d.formule || "standard"}${d.hotel ? `, hotel: ${d.hotel}` : ""}${d.duree ? `, duree: ${d.duree}` : ""}. ${d.inclus || "Accompagnement et assistance complete."} ${d.notes}`.trim(),
      };
    case "VISA":
      return {
        title: `Service Visa ${d.destination || base.location || "International"}`,
        description: `Traitement visa pour ${d.destination || "destination internationale"}${d.duree ? `, delai estime: ${d.duree}` : ""}. ${d.inclus || "Constitution dossier, verification et suivi complet."} ${d.notes}`.trim(),
      };
    case "BILLETTERIE":
      return {
        title: `Billet ${d.departVille || "Depart"} - ${d.destination || "Destination"}`,
        description: `Billetterie${d.compagnie ? ` (${d.compagnie})` : ""}${d.departDate ? `, aller: ${d.departDate}` : ""}${d.retourDate ? `, retour: ${d.retourDate}` : ""}. ${d.inclus || "Options flexibles et assistance rebooking."} ${d.notes}`.trim(),
      };
    case "TRANSFERT":
      return {
        title: `Transfert ${d.pointDepart || "Aeroport"} -> ${d.pointArrivee || "Hotel"}`,
        description: `Service transfert ${d.transportType || "prive"}${d.departDate ? ` le ${d.departDate}` : ""}. ${d.inclus || "Chauffeur professionnel et ponctualite garantie."} ${d.notes}`.trim(),
      };
    case "SEJOUR":
      return {
        title: `Sejour a la carte ${d.destination || base.location || ""}`.trim(),
        description: `Sejour personnalise${d.nombreNuits ? ` (${d.nombreNuits} nuits)` : ""}${d.hotel ? ` avec hebergement ${d.hotel}` : ""}. ${d.inclus || "Programme sur mesure selon vos attentes."} ${d.notes}`.trim(),
      };
    default:
      return {
        title: base.title,
        description: base.description,
      };
  }
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [details, setDetails] = useState(initialDetails);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const selectedImage = useMemo(() => form.image, [form.image]);
  const adType = useMemo<AdType>(() => {
    if (!form.categoryId) return "GENERAL";
    const selectedCategory = categories.find((c) => c.id === form.categoryId);
    if (!selectedCategory) return "GENERAL";
    const mapped = categoryToType.find((entry) => entry.match.test(selectedCategory.name));
    return mapped?.type ?? "GENERAL";
  }, [form.categoryId, categories]);
  const generated = useMemo(() => buildGenerated(adType, details, form), [adType, details, form]);
  const currentTypeLabel = useMemo(() => adTypes.find((x) => x.value === adType)?.label ?? "Generale", [adType]);

  async function loadData() {
    const [aRes, cRes] = await Promise.all([fetch("/api/admin/announcements"), fetch("/api/admin/categories")]);
    const aJson = await aRes.json();
    const cJson = await cRes.json();
    setAnnouncements(aJson.data ?? []);
    setCategories((cJson.data ?? []).map((item: Category) => ({ id: item.id, name: item.name })));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await response.json();

      if (response.ok && json.success) {
        setForm((prev) => ({ ...prev, image: json.data.url }));
        setStatus("Image importee avec succes.");
        return;
      }

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Lecture image impossible"));
        reader.readAsDataURL(file);
      });
      setForm((prev) => ({ ...prev, image: dataUrl }));
      setStatus("Image importee (mode web) avec succes.");
    } catch {
      setStatus("Echec upload image. Reessayez avec une autre image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    if (!form.image.trim()) {
      setBusy(false);
      setStatus("Ajoutez une image via upload (ou renseignez une URL).");
      return;
    }

    const finalTitle = adType === "GENERAL" ? form.title : form.title || generated.title;
    const finalDescription = adType === "GENERAL" ? form.description : form.description || generated.description;

    const payload = {
      ...form,
      title: finalTitle,
      description: finalDescription,
      price: Number(form.price),
    };

    const response = await fetch(editingId ? `/api/admin/announcements/${editingId}` : "/api/admin/announcements", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    setBusy(false);

    if (!response.ok || !json.success) {
      setStatus(json.message || "Erreur lors de l'enregistrement.");
      return;
    }

    setStatus(editingId ? "Annonce modifiee." : "Annonce ajoutee.");
    setEditingId(null);
    setForm(initialForm);
    setDetails(initialDetails);
    await loadData();
  };

  const onDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (imageUrl.startsWith("/uploads/")) {
      await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, { method: "DELETE" });
    }
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <h1 className="text-[30px] font-semibold text-[#c89a4b]">Gestion des annonces</h1>
        <p className="text-[13px] text-[#d9c9ab]">Formulaires differencies par type pour une saisie plus claire.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] text-[#d9c9ab]">
            <span className="text-[#9f8a66]">Type detecte:</span> <strong>{currentTypeLabel}</strong>
          </div>
          <select value={form.categoryId} onChange={(e) => setForm((v) => ({ ...v, categoryId: e.target.value }))} className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required>
            <option value="">Choisir une categorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Lieu / Zone" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required />
          <input value={form.price} onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))} placeholder="Prix" type="number" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required />
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border border-[#3b2b16] bg-[#16110a] p-4 md:grid-cols-2">
          {adType === "OMRA" ? (
            <>
              <input value={details.formule} onChange={(e) => setDetails((v) => ({ ...v, formule: e.target.value }))} placeholder="Formule (Economique / Confort / VIP)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.hotel} onChange={(e) => setDetails((v) => ({ ...v, hotel: e.target.value }))} placeholder="Hotel" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.departDate} onChange={(e) => setDetails((v) => ({ ...v, departDate: e.target.value }))} placeholder="Date depart" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.duree} onChange={(e) => setDetails((v) => ({ ...v, duree: e.target.value }))} placeholder="Duree (ex: 10 jours)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </>
          ) : null}

          {adType === "VISA" ? (
            <>
              <input value={details.destination} onChange={(e) => setDetails((v) => ({ ...v, destination: e.target.value }))} placeholder="Pays de destination" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.duree} onChange={(e) => setDetails((v) => ({ ...v, duree: e.target.value }))} placeholder="Delai estime (ex: 7 jours)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </>
          ) : null}

          {adType === "BILLETTERIE" ? (
            <>
              <input value={details.departVille} onChange={(e) => setDetails((v) => ({ ...v, departVille: e.target.value }))} placeholder="Ville de depart" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.destination} onChange={(e) => setDetails((v) => ({ ...v, destination: e.target.value }))} placeholder="Destination" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.departDate} onChange={(e) => setDetails((v) => ({ ...v, departDate: e.target.value }))} placeholder="Date aller" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.retourDate} onChange={(e) => setDetails((v) => ({ ...v, retourDate: e.target.value }))} placeholder="Date retour (optionnel)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.compagnie} onChange={(e) => setDetails((v) => ({ ...v, compagnie: e.target.value }))} placeholder="Compagnie aerienne (optionnel)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px] md:col-span-2" />
            </>
          ) : null}

          {adType === "TRANSFERT" ? (
            <>
              <input value={details.pointDepart} onChange={(e) => setDetails((v) => ({ ...v, pointDepart: e.target.value }))} placeholder="Point de depart (Aeroport, Hotel...)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.pointArrivee} onChange={(e) => setDetails((v) => ({ ...v, pointArrivee: e.target.value }))} placeholder="Point d'arrivee" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.transportType} onChange={(e) => setDetails((v) => ({ ...v, transportType: e.target.value }))} placeholder="Type transport (Prive, VIP...)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.departDate} onChange={(e) => setDetails((v) => ({ ...v, departDate: e.target.value }))} placeholder="Date du transfert" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </>
          ) : null}

          {adType === "SEJOUR" ? (
            <>
              <input value={details.destination} onChange={(e) => setDetails((v) => ({ ...v, destination: e.target.value }))} placeholder="Destination" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.nombreNuits} onChange={(e) => setDetails((v) => ({ ...v, nombreNuits: e.target.value }))} placeholder="Nombre de nuits" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.hotel} onChange={(e) => setDetails((v) => ({ ...v, hotel: e.target.value }))} placeholder="Hebergement / Hotel" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
              <input value={details.duree} onChange={(e) => setDetails((v) => ({ ...v, duree: e.target.value }))} placeholder="Duree totale" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
            </>
          ) : null}

          <textarea value={details.inclus} onChange={(e) => setDetails((v) => ({ ...v, inclus: e.target.value }))} placeholder="Inclus / points forts" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px] md:col-span-2" rows={2} />
          <textarea value={details.notes} onChange={(e) => setDetails((v) => ({ ...v, notes: e.target.value }))} placeholder="Notes operateur (optionnel)" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px] md:col-span-2" rows={2} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder={adType === "GENERAL" ? "Titre (obligatoire)" : `Titre (optionnel, sinon genere)`} className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required={adType === "GENERAL"} />
          <input value={form.image} readOnly placeholder="L'URL image est remplie automatiquement apres upload" className="rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] text-[#9f8a66]" />
          <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder={adType === "GENERAL" ? "Description (obligatoire)" : "Description (optionnelle, sinon generee)"} className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px] md:col-span-2" rows={3} required={adType === "GENERAL"} />
          <div className="rounded-md border border-[#5b4526] px-3 py-2 text-[12px] md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#d9c9ab]">Image de l&apos;annonce</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files?.[0]) await uploadImage(e.target.files[0]);
              }}
              className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[12px]"
            />
            <p className="mt-2 text-[11px] text-[#9f8a66]">
              {uploadingImage ? "Import de l'image en cours..." : form.image ? "Image prete pour publication." : "Choisissez une image (URL manuelle facultative)."}
            </p>
          </div>
        </div>

        {adType !== "GENERAL" ? (
          <div className="mt-3 rounded-lg bg-[#1a140c] p-3 text-[12px] text-[#d9c9ab]">
            <p className="font-semibold">Apercu genere</p>
            <p className="mt-1"><strong>Titre:</strong> {generated.title || "-"}</p>
            <p className="mt-1"><strong>Description:</strong> {generated.description || "-"}</p>
          </div>
        ) : null}

        {selectedImage ? (
          <div className="relative mt-3 h-32 w-52 overflow-hidden rounded-lg">
            <Image src={selectedImage} alt="preview" fill className="object-cover" sizes="208px" unoptimized />
          </div>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button disabled={busy} className="rounded-md bg-[#a97b32] px-4 py-2 text-[12px] font-bold text-white">
            {editingId ? "Mettre a jour" : "Ajouter"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setDetails(initialDetails);
              }}
              className="rounded-md border border-[#5b4526] px-4 py-2 text-[12px]"
            >
              Annuler
            </button>
          ) : null}
        </div>
        {status ? <p className="mt-2 text-[12px] text-[#c89a4b]">{status}</p> : null}
      </form>

      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="space-y-3">
          {announcements.map((item) => (
            <article key={item.id} className="flex flex-col gap-2 rounded-xl bg-[#120f0a] p-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[16px] font-semibold text-[#c89a4b]">{item.title}</p>
                <p className="text-[12px] text-[#d9c9ab]">{item.category?.name} · {item.location}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(item.id);
                    setDetails(initialDetails);
                    setForm({ title: item.title, description: item.description, price: item.price, image: item.image, location: item.location, categoryId: item.categoryId });
                  }}
                  className="rounded-md border border-[#5b4526] px-3 py-1 text-[12px]"
                >
                  Modifier
                </button>
                <button onClick={() => onDelete(item.id, item.image)} className="rounded-md border border-[#d77] px-3 py-1 text-[12px] text-[#a33]">
                  Supprimer
                </button>
              </div>
            </article>
          ))}
          {announcements.length === 0 ? <p className="text-[12px] text-[#9f8a66]">Aucune annonce.</p> : null}
        </div>
      </div>
    </div>
  );
}

