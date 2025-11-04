// app/nieuws/page.tsx (Server Component - NEWS OVERVIEW PAGE)
import { getLatestArticles } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import NieuwsOverviewClient from "./NieuwsOverviewClient";

// Force dynamic rendering - always fetch fresh data from Firestore
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: "Politie Nieuws & Updates - Politie Forum Nederland",
  description:
    "Laatste politie nieuws, updates en belangrijke informatie over de politie nederland, sollicitaties, opleidingen en politie discussies. Blijf op de hoogte!",
  keywords: [
    "politie nieuws",
    "politie news",
    "politie updates",
    "politie nederland nieuws",
    "sollicitatie nieuws",
    "politieacademie nieuws",
    "politie forum nieuws",
    "politie discussies",
  ],
  alternates: {
    canonical: 'https://politie-forum.nl/nieuws/',
  },
  openGraph: {
    url: "https://politie-forum.nl/nieuws/",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Politie Nieuws & Updates | Politie Forum Nederland",
    description:
      "Blijf op de hoogte van het laatste politie nieuws en politie discussies in Nederland",
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
    title: "Politie Nieuws & Updates",
    description: "Blijf op de hoogte van het laatste politie nieuws in Nederland",
    images: ["https://politie-forum.nl/og/politie-forum-1200x630.png"],
  },
};

export default async function NewsPage() {
  // Fetch latest 30 articles from Firebase (server-side, optimized for speed)
  const articles = await getLatestArticles(30).catch(() => []);

  return <NieuwsOverviewClient articles={articles} />;
}
