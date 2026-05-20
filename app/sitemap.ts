import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  "",
  "/explore",
  "/details",
  "/contact",
  "/visa",
  "/about",
  "/sejour-a-la-carte",
  "/omra",
  "/billetterie",
  "/transfert",
  "/mentions-legales",
  "/politique-confidentialite",
  "/conditions-utilisation",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("mentions") || route.includes("conditions") || route.includes("confidentialite") ? 0.3 : 0.8,
  }));
}

