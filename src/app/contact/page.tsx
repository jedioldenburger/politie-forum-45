import { Metadata } from "next";
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
  return <ContactClient />;
}
