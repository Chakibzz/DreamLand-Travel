"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Category = { id: string; name: string };
type PriceOption = { label: string; price: string };
type RichTariff = { label: string; price: number };
type RichFormula = { name: string; hotel?: string; tariffs: RichTariff[] };
type RichDetails = {
  source?: "facebook";
  duration?: string;
  airline?: string;
  dates?: string[];
  images?: string[];
  badge?: string;
  formulas?: RichFormula[];
  included?: string[];
  excluded?: string[];
  alert?: string;
};

type Announcement = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  tags: string[];
  priceOptions: Array<{ label: string; price: number | string }>;
  richDetails?: RichDetails;
  image: string;
  location: string;
  categoryId: string;
  category: Category;
};

type AdType = "GENERAL" | "VOYAGE" | "OMRA" | "VISA" | "BILLETTERIE" | "TRANSFERT" | "SEJOUR";

const adTypes: Array<{ value: AdType; label: string }> = [
  { value: "GENERAL", label: "Generale" },
  { value: "VOYAGE", label: "Voyage organise" },
  { value: "OMRA", label: "Omra" },
  { value: "VISA", label: "Visa" },
  { value: "BILLETTERIE", label: "Billetterie" },
  { value: "TRANSFERT", label: "Transfert" },
  { value: "SEJOUR", label: "Sejour a la carte" },
];

const categoryToType: Array<{ match: RegExp; type: AdType }> = [
  { match: /voyages?\s+organis/i, type: "VOYAGE" },
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
  tags: [] as string[],
  priceOptions: [{ label: "Chambre double", price: "" }] as PriceOption[],
  richDetails: {} as RichDetails,
  image: "",
  location: "",
  categoryId: "",
};

const suggestedTags = ["Hotel 5*", "All inclusive", "Aqua park", "Vol inclus", "Transfert inclus", "Famille", "Promo", "Depart Alger"];
const suggestedImageBadges = ["Places limitees", "Dernieres places", "Complet", "Epuise", "Promo", "Nouveau", "Depart garanti"];

const stepTitleClass = "text-[18px] font-semibold text-[#c89a4b]";
const helpTextClass = "mt-1 text-[12px] leading-relaxed text-[#9f8a66]";
const labelClass = "mb-1 block text-[12px] font-semibold text-[#d9c9ab]";

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

function cleanFacebookLine(line: string) {
  return line
    .replace(/^[\s*•\-]+/, "")
    .replace(/^[✅✈️🏨🗓️🔹💥🎟️🚌🐪❌🚨✨⭐️🇪🇬🇹🇷]+\s*/u, "")
    .replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\s]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDzdPrice(value: string) {
  const match = value.match(/(\d[\d\s.]*)(?:\s*DA|\s*DZD)/i);
  if (!match) return null;
  const amount = Number(match[1].replace(/[^\d]/g, ""));
  return Number.isFinite(amount) ? amount : null;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

type FacebookParts = {
  main: string;
  dates: string;
  hotels: string;
  rooms: string;
  included: string;
};

const initialFacebookParts: FacebookParts = {
  main: "",
  dates: "",
  hotels: "",
  rooms: "",
  included: "",
};

function normalizeTariffLabel(value: string, childMode: boolean) {
  const cleaned = value
    .replace(/à partir de/i, "A partir de")
    .replace(/a partir de/i, "A partir de")
    .replace(/\(\s*SNGL\s*\)/i, "single")
    .replace(/\(\s*DBL\s*\)/i, "double")
    .replace(/\(\s*TRPL\s*\)/i, "triple")
    .replace(/\s+/g, " ")
    .trim();
  if (childMode && !/^enfant/i.test(cleaned)) return `Enfant ${cleaned}`;
  return cleaned || "Tarif";
}

function addTariffsFromLine(formula: RichFormula, line: string, childMode: boolean) {
  const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
  for (const part of parts) {
    const price = parseDzdPrice(part);
    if (price === null) continue;
    const labelSource = part.replace(/[:：]?\s*\d[\d\s.]*\s*(DA|DZD).*/i, "").trim();
    formula.tariffs.push({ label: normalizeTariffLabel(labelSource, childMode), price });
  }
}

function parseFacebookAnnouncement(raw: string): {
  title: string;
  description: string;
  location: string;
  price: string;
  tags: string[];
  priceOptions: PriceOption[];
  richDetails: RichDetails;
} | null {
  const originalLines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const lines = originalLines.map(cleanFacebookLine).filter(Boolean);
  if (lines.length === 0) return null;

  const title = cleanFacebookLine(lines[0]).trim();
  const introLines: string[] = [];
  const dates: string[] = [];
  const included: string[] = [];
  const excluded: string[] = [];
  const formulas: RichFormula[] = [];
  let alert = "";
  let section: "intro" | "dates" | "formulas" | "included" | "excluded" = "intro";
  let currentFormula: RichFormula | null = null;
  let childTariffMode = false;

  for (let index = 1; index < lines.length; index += 1) {
    const originalLine = originalLines[index] ?? lines[index];
    const line = lines[index];
    const upper = line.toUpperCase();
    if (!line) continue;

    if (/^✅/u.test(originalLine.trim())) {
      included.push(line);
      continue;
    }

    if (upper.includes("DATES DISPONIBLES") || upper.includes("DATES DU VOYAGE") || upper === "DATES" || upper.includes("DATES:")) {
      section = "dates";
      childTariffMode = false;
      continue;
    }
    if (upper.includes("FORMULES") || upper.includes("TARIFS") || upper.includes("HÉBERGEMENTS") || upper.includes("HEBERGEMENTS") || upper.includes("HOTELS") || upper.includes("HÔTELS")) {
      section = "formulas";
      childTariffMode = false;
      continue;
    }
    if (upper.includes("CE QUI EST INCLUS") || upper.includes("INCLUS DANS LE PRIX")) {
      section = "included";
      currentFormula = null;
      continue;
    }
    if (upper.includes("CE QUI EST EXCLU") || upper.includes("EXCLU")) {
      section = "excluded";
      const sameLine = line.replace(/ce qui est exclu\s*:?/i, "").trim();
      if (sameLine) excluded.push(sameLine);
      continue;
    }
    if (upper.includes("PLACES") || upper.includes("DÉPARTS GARANTIS") || upper.includes("DEPARTS GARANTIS")) {
      alert = line;
      continue;
    }

    const looksLikeDate =
      /^\d{1,2}\s+\p{L}+.*(?:→|->|-|au).*?\d{4}$/iu.test(line) ||
      /^Du\s+/i.test(line) ||
      /^\d{1,2}[/-]\d{1,2}.*(?:→|->|-|au)/i.test(line);
    if (section === "dates" || looksLikeDate) {
      if (looksLikeDate) dates.push(line.replace(/^Du\s+/i, "Du "));
      else if (!upper.includes("HÉBERGEMENTS") && !upper.includes("HEBERGEMENTS")) dates.push(line);
      continue;
    }

    const formulaMatch = line.match(/^(?:Formule\s*\d+\s*:?\s*)?(.+?(?:\d\s*(?:\*|★|⭐)|Resort|Hotel|Hôtel|Palace|Paradise|Medina|Lagoon|Holiday|Concorde|Pickalbatros).*)$/i);
    if (formulaMatch) {
      currentFormula = { name: formulaMatch[1].trim(), tariffs: [] };
      const hotelMatch = formulaMatch[1].match(/^(.+?)\s*\((.+)\)\s*$/);
      if (hotelMatch) currentFormula.hotel = hotelMatch[1].trim();
      formulas.push(currentFormula);
      section = "formulas";
      continue;
    }

    if (section === "formulas" || parseDzdPrice(line) !== null) {
      if (/^enfants?\s*:?\s*$/i.test(line)) {
        childTariffMode = true;
        continue;
      }
      const priceInLine = parseDzdPrice(line);
      if (priceInLine === null && /comprend|par personne|au choix/i.test(line)) {
        introLines.push(line);
        continue;
      }
      const looksLikeHotelTitle =
        priceInLine === null &&
        !/^enfants?\s*:?\s*$/i.test(line) &&
        !upper.includes("CHAMBRE") &&
        !/^\d+\s*[–-]\s*\d+/.test(line) &&
        !/^moins de/i.test(line);

      if (looksLikeHotelTitle) {
        currentFormula = { name: line, hotel: line, tariffs: [] };
        formulas.push(currentFormula);
        childTariffMode = false;
        continue;
      }

      if (!currentFormula) {
        currentFormula = { name: "Formule", tariffs: [] };
        formulas.push(currentFormula);
      }
      addTariffsFromLine(currentFormula, line, childTariffMode);
      continue;
    }

    if (section === "included") {
      included.push(line);
      continue;
    }

    if (section === "excluded") {
      excluded.push(line);
      continue;
    }

    introLines.push(line);
  }

  const allTariffs = formulas.flatMap((formula) => formula.tariffs.map((tariff) => ({ formula: formula.name, ...tariff })));
  const adultTariffs = allTariffs.filter((tariff) => /chambre|double|single|triple|dbl|sngl|trpl/i.test(tariff.label));
  const tariffsForStartingPrice = adultTariffs.length > 0 ? adultTariffs : allTariffs;
  const minPrice = tariffsForStartingPrice.reduce<number | null>((min, tariff) => (min === null || tariff.price < min ? tariff.price : min), null);
  const titleLocation =
    title.match(/\b(?:à|a)\s+([^–-]+)/i)?.[1]?.trim() ||
    title.match(/^(.+?)\s+avec\s+dreamland/i)?.[1]?.trim() ||
    (title.includes(":") ? title.split(":")[0].trim() : title.split("-")[0].trim());
  const description = introLines.slice(0, 3).join(" ").trim() || "Programme organise avec depart garanti, hebergement et assistance.";
  const tagCandidates = [
    raw.match(/5\*/) ? "Hotel 5*" : "",
    /all inclusive|tout compris/i.test(raw) ? "All inclusive" : "",
    /aqua park/i.test(raw) ? "Aqua park" : "",
    /EgyptAir|Turkish Airlines|billet d.avion/i.test(raw) ? "Vol inclus" : "",
    /transferts?/i.test(raw) ? "Transfert inclus" : "",
    dates.length > 0 ? "Depart garanti" : "",
    /famille|enfant/i.test(raw) ? "Famille" : "",
  ];

  return {
    title,
    description,
    location: titleLocation || "Destination",
    price: minPrice ? String(minPrice) : "",
    tags: uniqueValues(tagCandidates),
    priceOptions: allTariffs.map((tariff) => ({
      label: `${tariff.formula} - ${tariff.label}`,
      price: String(tariff.price),
    })),
    richDetails: {
      source: "facebook",
      duration: raw.match(/(\d{1,2}\s*Jours?\s*\/\s*\d{1,2}\s*Nuits?)/i)?.[1],
      airline: raw.match(/Turkish Airlines/i)?.[0] || raw.match(/EgyptAir/i)?.[0] || undefined,
      dates,
      formulas,
      included,
      excluded,
      alert,
    },
  };
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [details, setDetails] = useState(initialDetails);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [facebookText, setFacebookText] = useState("");
  const [facebookParts, setFacebookParts] = useState<FacebookParts>(initialFacebookParts);
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
  const showAdvantagesAndPrices = adType === "VOYAGE" || adType === "OMRA" || adType === "SEJOUR";

  const importFacebookAnnouncement = () => {
    const hotelLines = facebookParts.hotels.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const roomLines = facebookParts.rooms.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const pairedHotelTariffs =
      hotelLines.length > 0 &&
      hotelLines.length === roomLines.length &&
      roomLines.every((line) => parseDzdPrice(line) !== null && !/chambre|enfant|double|single|triple|individuelle/i.test(line));
    const hotelAndRoomText = pairedHotelTariffs
      ? hotelLines.map((hotel, index) => `${hotel}\n${roomLines[index]}`).join("\n")
      : [facebookParts.hotels, facebookParts.rooms].filter((part) => part.trim()).join("\n");
    const structuredText = [
      facebookParts.main,
      facebookParts.dates ? `Dates disponibles:\n${facebookParts.dates}` : "",
      hotelAndRoomText ? `Hebergements et tarifs:\n${hotelAndRoomText}` : "",
      facebookParts.included ? `Ce qui est inclus:\n${facebookParts.included}` : "",
    ]
      .filter((part) => part.trim())
      .join("\n");
    const textToParse = structuredText || facebookText;
    const parsed = parseFacebookAnnouncement(textToParse);
    if (!parsed) {
      setStatus("Collez d'abord le texte de l'annonce ou remplissez les blocs dates / hotels / tarifs.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      title: parsed.title,
      description: parsed.description,
      location: parsed.location,
      price: parsed.price || prev.price,
      tags: parsed.tags,
      priceOptions: parsed.priceOptions.length > 0 ? parsed.priceOptions : prev.priceOptions,
      richDetails: parsed.richDetails,
    }));
    setDetails((prev) => ({
      ...prev,
      duree: parsed.richDetails.duration || prev.duree,
      compagnie: parsed.richDetails.airline || prev.compagnie,
      inclus: parsed.richDetails.included?.slice(0, 4).join("\n") || prev.inclus,
      notes: parsed.richDetails.alert || prev.notes,
    }));
    setStatus("Annonce Facebook transformee. Verifiez les champs puis ajoutez l'image.");
  };

  const addTag = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setForm((prev) => {
      if (prev.tags.some((tag) => tag.toLowerCase() === clean.toLowerCase())) return prev;
      return { ...prev, tags: [...prev.tags, clean].slice(0, 12) };
    });
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== value) }));
  };

  const updatePriceOption = (index: number, field: keyof PriceOption, value: string) => {
    setForm((prev) => ({
      ...prev,
      priceOptions: prev.priceOptions.map((option, i) => (i === index ? { ...option, [field]: value } : option)),
    }));
  };

  const addPriceOption = () => {
    setForm((prev) => ({ ...prev, priceOptions: [...prev.priceOptions, { label: "", price: "" }].slice(0, 60) }));
  };

  const removePriceOption = (index: number) => {
    setForm((prev) => ({ ...prev, priceOptions: prev.priceOptions.filter((_, i) => i !== index) }));
  };

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
      tags: showAdvantagesAndPrices ? form.tags.map((tag) => tag.trim()).filter(Boolean) : [],
      richDetails: showAdvantagesAndPrices ? form.richDetails ?? {} : {},
      priceOptions: showAdvantagesAndPrices
        ? form.priceOptions
            .map((option) => ({ label: option.label.trim(), price: Number(option.price) }))
            .filter((option) => option.label && Number.isFinite(option.price) && option.price >= 0)
        : [],
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
    setTagInput("");
    setFacebookText("");
    setFacebookParts(initialFacebookParts);
    await loadData();
  };

  const addGalleryImages = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, 10);
    if (selectedFiles.length === 0) return;
    setUploadingImage(true);
    setStatus("");
    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await response.json();
        if (response.ok && json.success) {
          uploadedUrls.push(json.data.url);
          continue;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(new Error("Lecture image impossible"));
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(dataUrl);
      }

      setForm((prev) => {
        const currentImages = prev.richDetails.images ?? [];
        const nextImages = Array.from(new Set([...currentImages, ...uploadedUrls])).slice(0, 12);
        return {
          ...prev,
          image: prev.image || nextImages[0] || "",
          richDetails: { ...prev.richDetails, images: nextImages },
        };
      });
      setStatus(`${uploadedUrls.length} image(s) ajoutee(s) a la galerie.`);
    } catch {
      setStatus("Echec import galerie. Reessayez avec d'autres images.");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeGalleryImage = (imageUrl: string) => {
    setForm((prev) => {
      const nextImages = (prev.richDetails.images ?? []).filter((image) => image !== imageUrl);
      return {
        ...prev,
        image: prev.image === imageUrl ? nextImages[0] || "" : prev.image,
        richDetails: { ...prev.richDetails, images: nextImages },
      };
    });
  };

  const onDelete = async (item: Announcement) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    await fetch(`/api/admin/announcements/${item.id}`, { method: "DELETE" });
    const imagesToDelete = Array.from(new Set([item.image, ...(item.richDetails?.images ?? [])]));
    for (const imageUrl of imagesToDelete) {
      if (imageUrl.startsWith("/uploads/")) {
        await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, { method: "DELETE" });
      }
    }
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <h1 className="text-[30px] font-semibold text-[#c89a4b]">Créer ou modifier une annonce</h1>
        <p className="text-[13px] text-[#d9c9ab]">Remplissez les blocs dans l&apos;ordre. Les champs optionnels peuvent rester vides.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="mb-4 rounded-xl border border-[#5b4526] bg-[#16110a] p-4">
          <h2 className={stepTitleClass}>1. Choisir le type d&apos;offre et le prix principal</h2>
          <p className={helpTextClass}>Ce prix sera affiche comme &quot;A partir de&quot;. Les prix detailles se remplissent plus bas.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] text-[#d9c9ab]">
            <span className="text-[#9f8a66]">Type choisi:</span> <strong>{currentTypeLabel}</strong>
          </div>
          <div>
            <label className={labelClass}>Type d&apos;offre</label>
            <select value={form.categoryId} onChange={(e) => setForm((v) => ({ ...v, categoryId: e.target.value }))} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required>
              <option value="">Choisir dans la liste</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Lieu affiche sur le site</label>
            <input value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Ex: Antalya, Turquie" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required />
          </div>
          <div>
            <label className={labelClass}>Prix de depart</label>
            <input value={form.price} onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))} placeholder="Ex: 185000" type="number" className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required />
          </div>
        </div>

        {showAdvantagesAndPrices ? (
          <div className="mt-4 grid gap-3 rounded-xl border border-[#3b2b16] bg-[#16110a] p-4">
            <div>
              <h2 className={stepTitleClass}>2. Transformer une annonce Facebook</h2>
              <p className={helpTextClass}>Le plus fiable: collez chaque partie dans son bloc. Si vous avez juste le texte complet, utilisez le premier champ.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <textarea
                  value={facebookParts.main}
                  onChange={(e) => {
                    setFacebookParts((v) => ({ ...v, main: e.target.value }));
                    setFacebookText(e.target.value);
                  }}
                  placeholder="Texte principal: titre + description + points forts"
                  className="min-h-32 rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
                <textarea
                  value={facebookParts.dates}
                  onChange={(e) => setFacebookParts((v) => ({ ...v, dates: e.target.value }))}
                  placeholder="Dates disponibles: une date par ligne"
                  className="min-h-32 rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
                <textarea
                  value={facebookParts.hotels}
                  onChange={(e) => setFacebookParts((v) => ({ ...v, hotels: e.target.value }))}
                  placeholder="Hotels / formules: JOYA PARADISE 4*, Ozer Palace, Formule 1..."
                  className="min-h-32 rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
                <textarea
                  value={facebookParts.rooms}
                  onChange={(e) => setFacebookParts((v) => ({ ...v, rooms: e.target.value }))}
                  placeholder="Chambres et prix: Chambre double : 219 000 DA"
                  className="min-h-32 rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
                <textarea
                  value={facebookParts.included}
                  onChange={(e) => setFacebookParts((v) => ({ ...v, included: e.target.value }))}
                  placeholder="Inclus / exclus: billet, transferts, excursions, visa non inclus..."
                  className="min-h-24 rounded-md border border-[#5b4526] px-3 py-2 text-[13px] md:col-span-2"
                />
              </div>
              <button type="button" onClick={importFacebookAnnouncement} className="mt-3 rounded-md bg-[#a97b32] px-4 py-2 text-[12px] font-bold text-white">
                Transformer en annonce du site
              </button>
            </div>
            <div>
              <h2 className={stepTitleClass}>3. Ajouter les avantages visibles</h2>
              <p className={helpTextClass}>Ce bloc apparait uniquement pour les voyages organises, les sejours a la carte et la Omra.</p>
              <label className="mb-2 mt-3 block text-[12px] font-semibold text-[#d9c9ab]">Avantages rapides</label>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full border border-[#5b4526] px-3 py-1 text-[11px] text-[#d9c9ab] hover:bg-[#1f170d]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Ex: Vue mer, Petit dejeuner inclus"
                  className="min-w-0 flex-1 rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
                />
                <button type="button" onClick={() => addTag(tagInput)} className="rounded-md bg-[#a97b32] px-3 py-2 text-[12px] font-bold text-white">
                  Ajouter
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-[#090909] px-3 py-1 text-[11px] text-[#c89a4b]">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-[#d9c9ab]">x</button>
                  </span>
                ))}
                {form.tags.length === 0 ? <span className="text-[11px] text-[#9f8a66]">Aucun avantage ajoute pour le moment.</span> : null}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <h2 className={stepTitleClass}>4. Renseigner les tarifs detailles</h2>
                  <p className={helpTextClass}>Ajoutez une ligne par option vendue au client.</p>
                </div>
                <button type="button" onClick={addPriceOption} className="rounded-md border border-[#5b4526] px-3 py-1 text-[11px] text-[#d9c9ab]">
                  Ajouter un tarif
                </button>
              </div>
              <div className="space-y-2">
                {form.priceOptions.map((option, index) => (
                  <div key={index} className="grid gap-2 md:grid-cols-[1fr_160px_auto]">
                    <input value={option.label} onChange={(e) => updatePriceOption(index, "label", e.target.value)} placeholder="Nom du tarif: Chambre single" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                    <input value={option.price} onChange={(e) => updatePriceOption(index, "price", e.target.value)} placeholder="Prix en DZD" type="number" className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" />
                    <button type="button" onClick={() => removePriceOption(index)} className="rounded-md border border-[#5b4526] px-3 py-2 text-[12px] text-[#d9c9ab]">
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[#9f8a66]">Exemples utiles: Chambre single, Chambre double, Chambre triple, Enfant 2-11 ans.</p>
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 rounded-xl border border-[#3b2b16] bg-[#16110a] p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className={stepTitleClass}>{showAdvantagesAndPrices ? "5" : "2"}. Completer les informations de l&apos;offre</h2>
            <p className={helpTextClass}>Selon le type choisi, seuls les champs utiles apparaissent. Le site pourra generer un titre et une description automatiquement.</p>
          </div>
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

        <div className="mt-4 grid gap-3 rounded-xl border border-[#3b2b16] bg-[#16110a] p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <h2 className={stepTitleClass}>{showAdvantagesAndPrices ? "6" : "3"}. Verifier le texte et ajouter l&apos;image</h2>
            <p className={helpTextClass}>Le titre et la description peuvent etre laisses vides pour les offres guidees. Ajoutez surtout une belle image.</p>
          </div>
          <div>
            <label className={labelClass}>Titre visible par les clients</label>
            <input value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder={adType === "GENERAL" ? "Ex: Sejour Antalya All inclusive" : "Optionnel, sinon le site le cree"} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" required={adType === "GENERAL"} />
          </div>
          <div>
            <label className={labelClass}>Image selectionnee</label>
            <input value={form.image} readOnly placeholder="L'image apparaitra ici apres l'import" className="w-full rounded-md border border-[#5b4526] bg-[#16110a] px-3 py-2 text-[13px] text-[#9f8a66]" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Badge visible sur la photo</label>
            <div className="grid gap-2 md:grid-cols-[220px_1fr]">
              <select
                value={form.richDetails.badge ?? ""}
                onChange={(e) => setForm((v) => ({ ...v, richDetails: { ...v.richDetails, badge: e.target.value } }))}
                className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
              >
                <option value="">Aucun badge</option>
                {suggestedImageBadges.map((badge) => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>
              <input
                value={form.richDetails.badge ?? ""}
                onChange={(e) => setForm((v) => ({ ...v, richDetails: { ...v.richDetails, badge: e.target.value } }))}
                placeholder="Ou ecrire un badge personnalise"
                className="rounded-md border border-[#5b4526] px-3 py-2 text-[13px]"
              />
            </div>
            <p className="mt-1 text-[11px] text-[#9f8a66]">Exemples: Places limitees, Dernieres places, Complet, Epuise.</p>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description visible par les clients</label>
            <textarea value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder={adType === "GENERAL" ? "Expliquez l'offre en quelques phrases simples" : "Optionnel, sinon le site la cree avec les champs remplis"} className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[13px]" rows={3} required={adType === "GENERAL"} />
          </div>
          <div className="rounded-md border border-[#5b4526] px-3 py-2 text-[12px] md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#d9c9ab]">Importer la photo principale</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files?.[0]) await uploadImage(e.target.files[0]);
              }}
              className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[12px]"
            />
            <p className="mt-2 text-[11px] text-[#9f8a66]">
              {uploadingImage ? "Import de l'image en cours..." : form.image ? "Image prete pour publication." : "Choisissez une image depuis l'ordinateur."}
            </p>
          </div>
          <div className="rounded-md border border-[#5b4526] px-3 py-2 text-[12px] md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold text-[#d9c9ab]">Ajouter plusieurs images au detail</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                if (e.target.files?.length) await addGalleryImages(e.target.files);
              }}
              className="w-full rounded-md border border-[#5b4526] px-3 py-2 text-[12px]"
            />
            <p className="mt-2 text-[11px] text-[#9f8a66]">Ces images apparaissent dans le menu “Voir details” sous forme de galerie deroulante.</p>
            {form.richDetails.images?.length ? (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {form.richDetails.images.map((image) => (
                  <div key={image} className="relative h-20 w-28 flex-none overflow-hidden rounded-md border border-[#3b2b16] bg-[#090909]">
                    <Image src={image} alt="Image galerie" fill className="object-contain" sizes="112px" unoptimized />
                    <button type="button" onClick={() => removeGalleryImage(image)} className="absolute right-1 top-1 rounded bg-[#12100c]/90 px-2 py-0.5 text-[10px] text-[#f4ead8]">
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {adType !== "GENERAL" ? (
          <div className="mt-3 rounded-lg bg-[#1a140c] p-3 text-[12px] text-[#d9c9ab]">
            <p className="font-semibold">Texte propose automatiquement</p>
            <p className="mt-1"><strong>Titre:</strong> {generated.title || "-"}</p>
            <p className="mt-1"><strong>Description:</strong> {generated.description || "-"}</p>
          </div>
        ) : null}

        {selectedImage ? (
          <div className="relative mt-3 h-40 w-64 overflow-hidden rounded-lg bg-[#090909]">
            <Image src={selectedImage} alt="preview" fill className="object-contain" sizes="256px" unoptimized />
          </div>
        ) : null}
        <div className="mt-4 flex gap-2">
          <button disabled={busy} className="rounded-md bg-[#a97b32] px-5 py-3 text-[13px] font-bold text-white disabled:opacity-70">
            {busy ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Publier l'annonce"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setDetails(initialDetails);
                setTagInput("");
                setFacebookText("");
                setFacebookParts(initialFacebookParts);
              }}
              className="rounded-md border border-[#5b4526] px-4 py-3 text-[12px]"
            >
              Annuler la modification
            </button>
          ) : null}
        </div>
        {status ? <p className="mt-2 text-[12px] text-[#c89a4b]">{status}</p> : null}
      </form>

      <div className="rounded-2xl border border-[#3b2b16] bg-[#12100c] p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-[24px] font-semibold text-[#c89a4b]">Annonces deja publiees</h2>
          <p className="text-[12px] text-[#9f8a66]">Cliquez sur Modifier pour reprendre une annonce existante.</p>
        </div>
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
                    setTagInput("");
                    setForm({
                      title: item.title,
                      description: item.description,
                      price: item.price,
                      tags: item.tags ?? [],
                      richDetails: {
                        ...(item.richDetails ?? {}),
                        images: Array.from(new Set([item.image, ...((item.richDetails?.images ?? []) as string[])].filter(Boolean))),
                      },
                      priceOptions:
                        item.priceOptions && item.priceOptions.length > 0
                          ? item.priceOptions.map((option) => ({ label: option.label, price: String(option.price) }))
                          : [{ label: "Chambre double", price: "" }],
                      image: item.image,
                      location: item.location,
                      categoryId: item.categoryId,
                    });
                  }}
                  className="rounded-md border border-[#5b4526] px-3 py-1 text-[12px]"
                >
                  Modifier cette annonce
                </button>
                <button onClick={() => onDelete(item)} className="rounded-md border border-[#d77] px-3 py-1 text-[12px] text-[#a33]">
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

