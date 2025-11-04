// app/page.tsx (Server Component - CANONICAL HOMEPAGE)
import HomepageFAQ from "@/components/HomepageFAQ";
import { getStaticCategories } from "@/data/categories";
import { faqData } from "@/data/faqData";
import { getFirstCommentsForArticles, getLatestArticles, getServerCategories, type Article } from "@/lib/firebaseAdmin";
import { consolidateKnowledgeGraphs, generateHomepageKnowledgeGraph, generateLayoutKnowledgeGraph } from "@/lib/generateCompleteKnowledgeGraph";
import type { Category } from "@/lib/types";
import type { Metadata } from "next";
import ForumClient from "./forum/ForumClient";

export const revalidate = 120; // ISR: rebuild every 2 min
export const dynamic = 'force-static'; // Force SSR for schema rendering

export const metadata: Metadata = {
  title: 'Politie Forum Nederland - Het Grootste Nederlandse Politie Forum',
  description:
    'Welkom bij Politie Forum Nederland. Bespreek politiezaken, deel ervaringen en blijf op de hoogte van het laatste nieuws over de Nederlandse politie.',
  alternates: {
    canonical: 'https://politie-forum.nl/',
  },
  openGraph: {
    url: "https://politie-forum.nl/",
    type: "website",
    siteName: "Politie Forum Nederland",
    locale: "nl_NL",
    title: "Politie Forum Nederland - Het Grootste Nederlandse Politie Forum",
    description: "Welkom bij Politie Forum Nederland. Bespreek politiezaken, deel ervaringen en blijf op de hoogte van het laatste nieuws over de Nederlandse politie.",
    modifiedTime: new Date().toISOString(),
    images: [{
      url: "https://politie-forum.nl/og/politie-forum-1200x630.png",
      width: 1200,
      height: 630,
      alt: "Politie Forum Nederland — Forum, nieuws & discussie",
    }],
  },
  other: {
    "og:updated_time": new Date().toISOString(),
    // App Links for homepage (consistent with article pages)
    "al:web:url": "https://politie-forum.nl/",
    "al:web:should_fallback": "true",
  },
  twitter: {
    card: "summary_large_image",
    site: "@politieforum",
    creator: "@politieforum",
    images: ["https://politie-forum.nl/og/politie-forum-1200x630.png"],
  },
};

export default async function HomePage() {
  // Server-side fetches
  const [articles, categoriesData, schemaArticles] = await Promise.all([
    getLatestArticles(15), // For featured display (increased to 15)
    getServerCategories().catch(() => []),
    getLatestArticles(10), // For SEO schema (10 latest articles with full data)
  ]);

  // Fetch first comments for those schema articles (batch)
  const firstCommentsMap = await getFirstCommentsForArticles(schemaArticles.map(a => a.slug));

  // Fallback to static categories if Firebase is empty
  const categories: Category[] =
    categoriesData && categoriesData.length > 0 ? categoriesData : getStaticCategories();

  // Generate separate graphs
  const layoutGraph = generateLayoutKnowledgeGraph();
  const homepageDynamicGraph = generateHomepageKnowledgeGraph(
    schemaArticles.map((article) => ({
      slug: article.slug,
      title: article.title,
      publishedAt: typeof article.publishedAt === 'number'
        ? new Date(article.publishedAt).toISOString()
        : article.publishedAt,
      updatedAt: article.updatedAt
        ? (typeof article.updatedAt === 'number'
          ? new Date(article.updatedAt).toISOString()
          : article.updatedAt)
        : undefined,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      // Fallback OG image if article has no image
      image: article.image || 'https://politie-forum.nl/og/politie-forum-1200x630.png',
      // Dynamic comment count from Firebase (real-time)
      commentCount: 0, // Comment counts komen later via real-time listener
      viewCount: 0,
      schemaComments: firstCommentsMap[article.slug] ? [{
        id: firstCommentsMap[article.slug]!.id,
        authorName: firstCommentsMap[article.slug]!.authorName,
        content: firstCommentsMap[article.slug]!.content,
        createdAt: firstCommentsMap[article.slug]!.createdAt,
        likes: firstCommentsMap[article.slug]!.likes
      }] : []
    })),
    faqData,
    categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      slug: cat.id.toLowerCase().replace(/\s+/g, '-'), // Generate slug from ID
      topicCount: cat.topicsCount || 0
    }))
  );

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
