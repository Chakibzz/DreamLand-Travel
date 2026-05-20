import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialite",
  description: "Politique de confidentialite de Dreamland Travel concernant les demandes de contact et de reservation.",
  path: "/politique-confidentialite",
});

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialite"
      intro="Cette politique explique comment Dreamland Travel collecte et utilise les donnees transmises via ses formulaires."
      sections={[
        {
          title: "Donnees collectees",
          body: [
            "Nous collectons les informations que vous saisissez volontairement: nom, email, telephone, destination, dates de voyage, nombre de voyageurs et message.",
            "Ces donnees sont necessaires pour traiter votre demande, vous recontacter et preparer une proposition adaptee.",
          ],
        },
        {
          title: "Utilisation des donnees",
          body: [
            "Les donnees sont utilisees uniquement pour la gestion des demandes clients, des reservations, des demandes visa et du suivi commercial lie a votre projet de voyage.",
            "Nous ne vendons pas vos donnees personnelles a des tiers.",
          ],
        },
        {
          title: "Conservation",
          body: [
            "Les demandes peuvent etre conservees le temps necessaire au traitement commercial, au suivi client et aux obligations administratives applicables.",
            "Vous pouvez demander la suppression ou la correction de vos donnees en contactant l'agence.",
          ],
        },
        {
          title: "Contact confidentialite",
          body: [
            `Pour toute question relative a vos donnees personnelles, vous pouvez nous ecrire a ${siteConfig.email}.`,
          ],
        },
      ]}
    />
  );
}

