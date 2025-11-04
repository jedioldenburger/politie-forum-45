import { Metadata } from "next";
import LedenClient from "./LedenClient";

export const metadata: Metadata = {
  title: "Leden & Community - Politie Forum Nederland",
  description: "Sluit je aan bij 10.000+ leden van Politie Forum Nederland. Registreer gratis en word deel van de grootste Nederlandse politie community.",
  keywords: "politie forum leden, registreren, politie community, forum aanmelden, politie forum inloggen",
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
