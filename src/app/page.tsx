// app/page.tsx (Server Component - CANONICAL HOMEPAGE)
import HomepageFAQ from "@/components/HomepageFAQ";
import { getStaticCategories } from "@/data/categories";
import { getLatestArticles, getServerCategories, type Article } from "@/lib/firebaseAdmin";
import { consolidateKnowledgeGraphs, generateHomepageKnowledgeGraph, generateLayoutKnowledgeGraph } from "@/lib/generateCompleteKnowledgeGraph";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";
import ForumClient from "./forum/ForumClient";

// Force dynamic rendering - always fetch fresh data from Firestore
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Politie Forum Nederland – Politienieuws, Discussies & Crime Map',
  description:
    'Nederlands grootste politie forum met 10.000+ leden. Dagelijks nieuws, expert discussies, Crime Map. Voor professionals en geïnteresseerden. Word nu lid!',
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

  // Generate structural schemas only (layout graph)
  // Homepage dynamic graph is now empty (no content schemas) to prevent schema stuffing
  const layoutGraph = generateLayoutKnowledgeGraph();
  const homepageDynamicGraph = generateHomepageKnowledgeGraph(); // Returns empty graph

  // Consolidate into one unified graph (deduplicated by @id)
  const unifiedGraph = consolidateKnowledgeGraphs(layoutGraph, homepageDynamicGraph);

  return (
    <>
      {/* Unified JSON-LD Graph (layout + dynamic homepage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraph, null, 0) }}
      />
      <ForumClient
        featuredArticles={articles as Article[]}
        categories={categories}
        faqComponent={<HomepageFAQ mode="short" />}
      />
    </>
  );
}
