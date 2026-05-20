import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Mentions legales",
  description: "Mentions legales de Dreamland Travel, agence de voyage et tourisme a Boufarik.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions legales"
      intro="Cette page rassemble les informations legales relatives au site Dreamland Travel et a son exploitation."
      sections={[
        {
          title: "Editeur du site",
          body: [
            `${siteConfig.legalName} est une agence de voyage et tourisme basee a Boufarik, Algerie.`,
            `Adresse: ${siteConfig.address}. Email: ${siteConfig.email}. Telephone: ${siteConfig.phone}.`,
          ],
        },
        {
          title: "Activite",
          body: [
            "Le site presente des services de voyages organises, Omra, billetterie, transfert, sejours personnalises et assistance visa.",
            "Les informations affichees sont fournies a titre indicatif et peuvent evoluer selon les disponibilites, les conditions des prestataires et les exigences administratives.",
          ],
        },
        {
          title: "Hebergement",
          body: [
            "Le site est heberge sur Vercel Inc., plateforme d'hebergement web et de deploiement d'applications.",
            "Les donnees applicatives peuvent etre traitees par les services techniques necessaires au fonctionnement du site et de sa base de donnees.",
          ],
        },
        {
          title: "Propriete intellectuelle",
          body: [
            "Les textes, visuels, interfaces et elements graphiques du site sont proteges. Toute reproduction ou utilisation non autorisee est interdite.",
            "Les marques, logos et contenus tiers restent la propriete de leurs titulaires respectifs.",
          ],
        },
        {
          title: "Responsabilite",
          body: [
            "Dreamland Travel met en oeuvre des efforts raisonnables pour maintenir des informations exactes et a jour.",
            "L'agence ne peut toutefois garantir l'absence d'erreurs, d'interruptions ou de modifications externes liees aux compagnies, hotels, autorites consulaires ou partenaires.",
          ],
        },
      ]}
    />
  );
}
