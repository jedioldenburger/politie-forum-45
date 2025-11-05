import { Metadata } from "next";
import Script from "next/script";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Politie Forum Nederland",
  description:
    "Neem contact op met Politie Forum Nederland. Algemene vragen, technische support, partnerships, redactie, moderatie, of anonieme tips indienen. Meerdere contactmogelijkheden beschikbaar.",
  keywords: [
    "contact politie forum", "contact opnemen", "klantenservice",
    "technische support", "redactie contact", "moderatie contact",
    "partnerships", "samenwerking", "media contact", "persberichten",
    "anonieme tips", "pgp contact", "versleutelde communicatie",
    "whatsapp tips", "email contact", "telefoon contact",
  ],
  alternates: {
    canonical: "https://politie-forum.nl/contact",
  },
  openGraph: {
    url: "https://politie-forum.nl/contact",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Contact | Politie Forum Nederland",
    description:
      "Neem contact op met Politie Forum Nederland voor vragen, support, partnerships of om anonieme tips in te dienen.",
  },
  other: {
    "og:updated_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Contact | Politie Forum Nederland",
    description: "Algemene vragen, support, partnerships of anonieme tips - meerdere contactmogelijkheden",
  },
};

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://politie-forum.nl/contact#webpage",
        "url": "https://politie-forum.nl/contact",
        "name": "Contact | Politie Forum Nederland",
        "description": "Neem contact op met Politie Forum Nederland. Algemene vragen, technische support, partnerships, redactie, moderatie, of anonieme tips indienen.",
        "isPartOf": { "@id": "https://politie-forum.nl/#website" },
        "about": { "@id": "https://politie-forum.nl/#organization" },
        "mainEntity": {
          "@type": "Organization",
          "@id": "https://politie-forum.nl/#organization",
          "name": "Politie Forum Nederland",
          "url": "https://politie-forum.nl",
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "general",
              "email": "info@politie-forum.nl",
              "telephone": "+31-6-48319167",
              "availableLanguage": "nl"
            },
            {
              "@type": "ContactPoint",
              "contactType": "redactie",
              "email": "redactie@politie-forum.nl",
              "availableLanguage": "nl"
            },
            {
              "@type": "ContactPoint",
              "contactType": "moderatie",
              "email": "moderatie@politie-forum.nl",
              "availableLanguage": "nl"
            },
            {
              "@type": "ContactPoint",
              "contactType": "tips",
              "email": "tips@politie-forum.nl",
              "url": "https://politie-forum.nl/tips",
              "availableLanguage": "nl"
            }
          ]
        },
        "dateModified": new Date().toISOString().split('T')[0]
      }
    ]
  };

  return (
    <>
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactClient />
    </>
  );
}
