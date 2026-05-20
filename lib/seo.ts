import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frontend-six-eta-75.vercel.app";

export const siteConfig = {
  name: "Dreamland Travel",
  legalName: "Dreamland Travel",
  description:
    "Agence de voyage et tourisme a Boufarik specialisee en voyages organises, Omra, billetterie, transferts et assistance visa.",
  address: "Rue Boukhtachi Djilali, Boufarik 09001, Algerie",
  phone: "+213557010838",
  email: "dreamlandtravel.dz@gmail.com",
  instagram: "https://www.instagram.com/dreamlandtravel.dz/",
  facebook: "https://www.facebook.com/people/Dreamland-Travel/61587513642728/#",
};

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path = "/", image = "/heroes/home-hero-generated.png", noIndex = false }: SeoInput): Metadata {
  const url = new URL(path, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "fr_DZ",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

