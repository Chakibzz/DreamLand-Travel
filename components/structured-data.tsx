import { siteConfig, siteUrl } from "@/lib/seo";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue Boukhtachi Djilali",
      addressLocality: "Boufarik",
      addressRegion: "Blida",
      postalCode: "09001",
      addressCountry: "DZ",
    },
    sameAs: [siteConfig.facebook, siteConfig.instagram],
    areaServed: ["Algerie", "Boufarik", "Blida"],
    serviceType: ["Voyages organises", "Omra", "Billetterie", "Transfert", "Services Visa"],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

