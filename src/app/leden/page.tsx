import { Metadata } from "next";
import LedenClient from "./LedenClient";

export const metadata: Metadata = {
  title: "Leden & Community - Politie Forum Nederland",
  description: "Sluit je aan bij 10.000+ leden van Politie Forum Nederland. Registreer gratis en word deel van de grootste Nederlandse politie community.",
  keywords: [
    // Membership actions
    "politie forum leden", "politie forum registreren", "word lid politie forum",
    "aanmelden politie forum", "inschrijven politie forum", "politie forum aanmelden",
    "politie forum inloggen", "politie forum account", "gratis registreren",
    // Community benefits
    "politie community", "politie netwerk", "forum community", "politie professionals netwerk",
    "politie discussies meedoen", "politie kennis delen", "politie ervaringen delen",
    // Membership features
    "10000 leden", "grootste politie forum", "gratis lidmaatschap", "forum toegang",
    "politie nieuws ontvangen", "politie updates", "crime map toegang",
    // Target audience
    "voor politieagenten", "voor studenten criminologie", "voor aspirant agenten",
    "voor journalisten", "voor veiligheidsexperts", "voor geïnteresseerden",
    // Actions & benefits
    "politie sollicitatie tips krijgen", "assessment ervaringen lezen", "politie praat mee",
    "politie discussie voeren", "politie vragen stellen", "politie antwoorden krijgen",
    // Value propositions
    "24/7 toegang", "dagelijkse updates", "expert community", "actieve community",
    "betrouwbare informatie", "politie professionals", "ervaringen uit het veld",
  ],
  alternates: {
    canonical: "https://politie-forum.nl/leden",
  },
  openGraph: {
    url: "https://politie-forum.nl/leden",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Word Lid van Politie Forum Nederland",
    description: "Sluit je aan bij 10.000+ politieprofessionals en geïnteresseerden",
    modifiedTime: new Date().toISOString(),
  },
  other: {
    "og:updated_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
  },
};

export default function LedenPage() {
  const membershipSchema = {
    "@context": "https://schema.org",
    "@type": "MemberProgramTier",
    "name": "Politie Forum Nederland Lidmaatschap",
    "membershipPointsEarned": 1,
    "programName": "Politie Forum Community",
    "url": "https://politie-forum.nl/leden",
    "description": "Gratis lidmaatschap met toegang tot discussies, nieuws en community features"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(membershipSchema, null, 0) }}
      />
      <LedenClient />
    </>
  );
}
