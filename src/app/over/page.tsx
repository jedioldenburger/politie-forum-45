import { Metadata } from "next";
import OverClient from "./OverClient";

export const metadata: Metadata = {
  title: "Over DigestPaper & Politie Forum Nederland - AI-Gedreven Nieuws & Community Platform",
  description: "DigestPaper.com is een innovatieve AI startup gespecialiseerd in geautomatiseerde nieuwsgeneratie via MCP (Model Context Protocol) servers. Politie Forum Nederland is onderdeel van ons content-netwerk voor veiligheid en justitie.",
  keywords: "digestpaper, ai nieuws, mcp server, automated journalism, cybersecurity, politie forum, ai startup, news automation, model context protocol",
  alternates: {
    canonical: "https://politie-forum.nl/over",
  },
  openGraph: {
    url: "https://politie-forum.nl/over",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Over DigestPaper & Politie Forum Nederland - AI News Automation",
    description: "AI-gedreven startup voor geautomatiseerde nieuwsgeneratie met MCP servers. Cybersecurity en veiligheidsjournalistiek via cutting-edge AI technologie.",
    modifiedTime: new Date().toISOString(),
  },
  other: {
    "og:updated_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Over DigestPaper - AI News Automation Startup",
    description: "MCP Server-gedreven nieuwsautomatisering voor cybersecurity en veiligheidsjournalistiek",
  },
};

export default function OverPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AboutPage", "WebPage"],
        "@id": "https://politie-forum.nl/over/#page",
        "url": "https://politie-forum.nl/over/",
        "name": "Over DigestPaper & Politie Forum Nederland",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "primaryImageOfPage": { "@id": "https://politie-forum.nl/#logo" },
        "about": { "@id": "https://politie-forum.nl/#publisher" },
        "mainEntity": { "@id": "https://politie-forum.nl/#publisher" },
        "inLanguage": "nl-NL"
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://politie-forum.nl/#publisher",
        "name": "Politie Forum Nederland",
        "url": "https://politie-forum.nl/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://politie-forum.nl/logo.svg"
        },
        "parentOrganization": {
          "@type": "Organization",
          "name": "DigestPaper",
          "url": "https://digestpaper.com"
        },
        "foundingDate": "2020-01-01",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sint Olofssteeg 4",
          "postalCode": "1012AK",
          "addressLocality": "Amsterdam",
          "addressCountry": "NL"
        },
        "telephone": "+31648319167",
        "sameAs": [
          "https://x.com/politieforum",
          "https://facebook.com/politieforum",
          "https://instagram.com/politieforum",
          "https://www.linkedin.com/company/politie-forum",
          "https://www.youtube.com/@politieforum",
          "https://www.threads.net/@politieforum"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "info@politie-forum.nl",
            "telephone": "+31648319167",
            "areaServed": "NL",
            "availableLanguage": ["nl"]
          },
          {
            "@type": "ContactPoint",
            "contactType": "News Tips",
            "email": "tip@politie-forum.nl",
            "telephone": "+31648319167",
            "areaServed": "NL",
            "availableLanguage": ["nl"],
            "description": "Tipkanaal; zie tip-disclaimer voor anonimiteit."
          }
        ],
        "publishingPrinciples": "https://politie-forum.nl/redactie/",
        "correctionsPolicy": "https://politie-forum.nl/over/#correcties",
        "verificationFactCheckingPolicy": "https://politie-forum.nl/over/#factcheck",
        "unnamedSourcesPolicy": "https://politie-forum.nl/over/#bronbeleid",
        "ownershipFundingInfo": "https://politie-forum.nl/over/#eigendom",
        "actionableFeedbackPolicy": "https://politie-forum.nl/contact/",
        "ethicsPolicy": "https://politie-forum.nl/over/#ethiek"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema, null, 0) }}
      />
      <OverClient />
    </>
  );
}
