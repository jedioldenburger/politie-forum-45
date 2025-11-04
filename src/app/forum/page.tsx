// app/forum/page.tsx (Server Component - FORUM OVERVIEW PAGE)
import { getStaticCategories } from "@/data/categories";
import { getServerCategories } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import ForumOverviewClient from "./ForumOverviewClient";

export const revalidate = 120; // ISR: rebuild every 2 min

export const metadata: Metadata = {
  title: 'Forum Categorieën - Politie Forum Nederland',
  description:
    'Overzicht van alle forumcategorieën op Politie Forum Nederland. Vind de juiste categorie voor jouw vragen over politie, veiligheid, criminaliteit en justitie.',
  keywords: [
    "politie forum",
    "forum categorieën",
    "discussie politie",
    "veiligheidsforum",
    "criminaliteitsforum",
    "justitieforum",
    "politiediscussie",
  ],
  alternates: {
    canonical: 'https://politie-forum.nl/forum/',
  },
  openGraph: {
    url: "https://politie-forum.nl/forum/",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Forum Categorieën - Politie Forum Nederland",
    description: "Overzicht van alle forumcategorieën. Vind de juiste categorie voor jouw vragen over politie, veiligheid en justitie.",
    modifiedTime: new Date().toISOString(),
    images: [{
      url: "https://politie-forum.nl/og/politie-forum-1200x630.png",
      width: 1200,
      height: 630,
      alt: "Politie Forum Nederland - Forum Categorieën",
    }],
  },
  other: {
    "og:updated_time": new Date().toISOString(),
    "al:web:url": "https://politie-forum.nl/forum/",
    "al:web:should_fallback": "true",
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    title: "Forum Categorieën - Politie Forum Nederland",
    description: "Overzicht van alle forumcategorieën voor discussies over politie, veiligheid en justitie.",
    images: ["https://politie-forum.nl/og/politie-forum-1200x630.png"],
  },
};

export default async function ForumPage() {
  // Server-side fetch categories
  const categoriesData = await getServerCategories().catch(() => []);

  // Fallback to static categories if Firebase is empty
  const categories = categoriesData && categoriesData.length > 0 ? categoriesData : getStaticCategories();

  return <ForumOverviewClient categories={categories} />;
}
