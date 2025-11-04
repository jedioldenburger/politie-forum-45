// app/page.tsx (Server Component - CANONICAL HOMEPAGE)
import HomepageFAQ from "@/components/HomepageFAQ";
import { getStaticCategories } from "@/data/categories";
import { getLatestArticles, getServerCategories, type Article } from "@/lib/firebaseAdmin";
import { consolidateKnowledgeGraphs, generateHomepageKnowledgeGraph, generateLayoutKnowledgeGraph } from "@/lib/generateCompleteKnowledgeGraph";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";
import ForumClient from "./forum/ForumClient";

// ISR: Rebuild every 5 minutes for fresh content while allowing caching
export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: 'Politie Forum Nederland – Politienieuws, Discussies & Crime Map',
  description:
    'Nederlands grootste politie forum met 10.000+ leden. Dagelijks nieuws, expert discussies, Crime Map. Voor professionals en geïnteresseerden. Word nu lid!',
  keywords: [
    // Primary keywords
    'politie forum', 'politie forum nederland', 'nederlands politie forum', 'politieforum',
    // Career & recruitment
    'politie sollicitatie', 'politie assessment', 'politie werving', 'sollicitatie politie',
    'politie sollicitatie tips', 'politie assessment voorbereiding', 'politie assessment tips',
    'politie werving sollicitatie', 'aspirant politieagent', 'politie carriere',
    // News & discussion
    'politie nieuws', 'politie nieuws forum', 'politie discussie', 'politie praat',
    'actueel politienieuws', 'breaking news politie', 'politie updates', 'politienieuws nederland',
    // Community & engagement
    'politie community', 'forum politie', 'politie platform', 'politie netwerk',
    'politie professionals', 'politie ervaringen', 'politie forum leden',
    // Crime & safety
    'criminaliteit', 'misdaad nederland', 'crime map', 'misdaadkaart nederland',
    'veiligheid nederland', 'opsporing', 'politieacties', 'criminologie',
    // Legal & justice
    'justitie', 'rechtspraak', 'strafrecht', 'advocaten', 'rechtbank',
    'politie wetgeving', 'strafrechtketen', 'openbaar ministerie',
    // Education & study
    'criminologie studie', 'politie opleiding', 'politieacademie', 'veiligheid studeren',
    'forensisch onderzoek', 'criminologie student', 'politie stage',
    // Specializations
    'recherche', 'cybercrime', 'digitale opsporing', 'forensische opsporing',
    'arrestatieteam', 'DSI', 'ME', 'politie specialisaties',
    // Location-based
    'politie amsterdam', 'politie rotterdam', 'politie den haag', 'politie utrecht',
    'nederlandse politie', 'politie nederland', 'landelijke politie',
    // Long-tail queries
    'hoe word ik politieagent', 'politie sollicitatie procedure', 'politie assessment ervaring',
    'wat doet de politie', 'politie taken', 'politie bevoegdheden', 'politie organisatie',
  ],
  alternates: {
    canonical: 'https://politie-forum.nl/',
  },
  openGraph: {
    url: "https://politie-forum.nl/",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Politie Forum Nederland – Politienieuws, Discussies & Crime Map",
    description: "Nederlands grootste politie forum met 10.000+ leden. Dagelijks nieuws, expert discussies, Crime Map. Voor professionals en geïnteresseerden. Word nu lid!",
    modifiedTime: new Date().toISOString(),
    images: [{
      url: "https://politie-forum.nl/og/politie-forum-1200x630.png",
      width: 1200,
      height: 630,
      alt: "Politie Forum Nederland - Het Grootste Politie Forum van Nederland",
    }],
  },
  other: {
    "og:updated_time": new Date().toISOString(),
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    images: ["https://politie-forum.nl/og/politie-forum-1200x630.png"],
  },
};

export default async function HomePage() {
  // Dynamic import for optimized schemas (avoid old deprecated functions)
  const { generateCompleteHomepageSchema } = await import("@/lib/optimizedSchemas");

  // Server-side fetches (UI data only - no schema data needed)
  const [articles, categoriesData] = await Promise.all([
    getLatestArticles(10), // For featured display (optimized for speed)
    getServerCategories().catch(() => []),
  ]);

  console.log(`[HomePage] Received ${articles.length} articles from getLatestArticles(10)`);
  console.log(`[HomePage] Article slugs:`, articles.map(a => a.slug).join(', ') || 'NONE');

  // Fallback to static categories if Firebase is empty
  const categories: Category[] =
    categoriesData && categoriesData.length > 0 ? categoriesData : getStaticCategories();

  // Generate complete optimized schema (2025 SEO standards)
  // Includes: Base (Organization, WebSite, BreadcrumbList, ContactPage, AboutPage)
  // + WebPage + FAQPage (20 Q&A) + HowTo + VideoObject
  const completeSchema = generateCompleteHomepageSchema();

  return (
    <>
      {/* Optimized JSON-LD Schema - 2025 SEO Standards */}
      {/* Includes: Base, FAQ, HowTo, Video - All consolidated, no duplicates */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(completeSchema, null, 0) }}
      />
      <ForumClient
        featuredArticles={articles as Article[]}
        categories={categories}
        faqComponent={<HomepageFAQ mode="short" />}
      />
    </>
  );
}
