import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conditions d'utilisation",
  description: "Conditions d'utilisation du site Dreamland Travel et de ses formulaires de demande.",
  path: "/conditions-utilisation",
});

export default function ConditionsUtilisationPage() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      intro="L'utilisation du site implique l'acceptation des conditions ci-dessous."
      sections={[
        {
          title: "Objet du site",
          body: [
            "Le site permet de consulter les services de Dreamland Travel et d'envoyer des demandes d'information ou de reservation.",
            "Les demandes transmises via le site ne constituent pas une reservation definitive tant qu'elles ne sont pas confirmees par l'agence.",
          ],
        },
        {
          title: "Prix et disponibilites",
          body: [
            "Les prix affiches sont indicatifs et peuvent varier selon les disponibilites, les dates, les compagnies, les taux de change et les conditions des partenaires.",
            "Une confirmation personnalisee est fournie apres etude de votre demande.",
          ],
        },
        {
          title: "Obligations utilisateur",
          body: [
            "L'utilisateur s'engage a transmettre des informations exactes et a jour.",
            "Toute utilisation frauduleuse, abusive ou contraire a la legislation applicable peut entrainer le refus de traitement de la demande.",
          ],
        },
        {
          title: "Services visa",
          body: [
            "Dreamland Travel accompagne la preparation et le suivi des dossiers visa, mais la decision finale appartient exclusivement aux autorites competentes.",
            "Les delais et exigences documentaires peuvent changer selon les pays et les autorites consulaires.",
          ],
        },
      ]}
    />
  );
}

