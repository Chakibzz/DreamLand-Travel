import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Dreamland",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#c89a4b",
    lang: "fr-DZ",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

