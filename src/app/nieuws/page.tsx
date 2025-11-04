// app/nieuws/page.tsx (Server Component - NEWS OVERVIEW PAGE)
import { getLatestArticles } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import NieuwsOverviewClient from "./NieuwsOverviewClient";

// Force dynamic rendering - always fetch fresh data from Firestore
// ISR: Rebuild every 5 minutes
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Politie Nieuws Forum - Dagelijks Politie Nieuws & Updates",
  description:
    "Het politie nieuws forum van Nederland. Dagelijks laatste politie nieuws, updates over sollicitaties, opleidingen en politie discussies. Politie nieuws forum voor professionals en geïnteresseerden. Blijf op de hoogte!",
  keywords: [
    // Primary news keywords
    "politie nieuws forum", "politie nieuws", "politienieuws", "politie news",
    "actueel politienieuws", "laatste politie nieuws", "breaking news politie",
    // News categories
    "criminaliteit nieuws", "misdaad nieuws", "opsporing nieuws", "rechtspraak nieuws",
    "politie updates", "politie nederland nieuws", "dagelijks politie nieuws",
    // Career news
    "sollicitatie nieuws", "werving nieuws", "politieacademie nieuws", "politie vacatures nieuws",
    // Forum integration
    "politie forum nieuws", "politie discussies", "politie community nieuws",
    "politie praat nieuws", "nederlands politie forum nieuws",
    // Location-specific
    "amsterdam politie nieuws", "rotterdam politie nieuws", "den haag politie nieuws",
    "utrecht politie nieuws", "nationale politie nieuws",
    // Topic-specific
    "cybercrime nieuws", "terreur nieuws", "drugs nieuws", "geweld nieuws",
    "verkeer nieuws", "fraude nieuws", "rechtszaken nieuws",
    // Long-tail
    "wat gebeurt er bij de politie", "laatste politie updates", "politie acties vandaag",
    "politie breaking news", "politie live updates", "politie 24/7 nieuws",
  ],
  alternates: {
    canonical: 'https://politie-forum.nl/nieuws/',
  },
  openGraph: {
    url: "https://politie-forum.nl/nieuws/",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Politie Nieuws Forum - Dagelijks Politie Nieuws & Updates",
    description:
      "Het politie nieuws forum van Nederland. Blijf op de hoogte van het laatste politie nieuws en politie discussies",
    modifiedTime: new Date().toISOString(),
    images: [{
      url: "https://politie-forum.nl/og/politie-forum-1200x630.png",
      width: 1200,
      height: 630,
      alt: "Politie Forum Nederland - Nieuws",
    }],
  },
  other: {
    "og:updated_time": new Date().toISOString(),
    "al:web:url": "https://politie-forum.nl/nieuws/",
    "al:web:should_fallback": "true",
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Politie Nieuws Forum - Dagelijks Updates",
    description: "Het politie nieuws forum van Nederland. Blijf op de hoogte van het laatste politie nieuws",
    images: ["https://politie-forum.nl/og/politie-forum-1200x630.png"],
  },
};

export default async function NewsPage() {
  // Fetch latest 30 articles from Firebase (server-side, optimized for speed)
  const articles = await getLatestArticles(30).catch(() => []);

  return <NieuwsOverviewClient articles={articles} />;
}
