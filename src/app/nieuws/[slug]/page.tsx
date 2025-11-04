import ArticleJsonLd from "@/components/ArticleJsonLd";
import RelatedArticles from "@/components/RelatedArticles";
import { resolveArticleCategory } from "@/lib/articleCategory";
import { generateArticleBreadcrumbs } from "@/lib/breadcrumbs";
import { toISO, toLocalISO } from "@/lib/dates";
import { getAllArticleSlugs, getRelatedArticles, getServerArticle, getServerArticleComments } from "@/lib/firebaseAdmin";
import { consolidateKnowledgeGraphs, generateLayoutKnowledgeGraph } from "@/lib/generateCompleteKnowledgeGraph";
import { ForumThread } from "@/lib/generateForumSchema";
import { buildThreadSchemaWithCount } from "@/lib/threadSchema";
import type { AIEnhancedArticle } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleClient from "./ArticleClient";

const BASE_URL = "https://politie-forum.nl";

// ISR Configuration - automatically rebuild pages every 10 minutes
export const revalidate = 600; // 10 minutes

// Pre-generate all article pages at build time for optimal performance
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      return {
        title: "Artikel niet gevonden | Politie Forum Nederland",
        description: "Het gevraagde artikel kon niet worden gevonden.",
      };
    }

    const articleUrl = `${BASE_URL}/nieuws/${slug}/`;
    // Dynamic OG image via next/og API route (unique per article) with .jpg extension
    const ogImageUrl = `${BASE_URL}/api/og/${slug}.jpg`;
    // Fallback for JSON-LD schema (article-specific or generic)
    const imageUrl = article.imageUrl || `${BASE_URL}/og/politie-forum-1200x630.png`;

    // Convert timestamps to Dutch timezone (+01:00 CET / +02:00 CEST)
    // Google News/Discover prefers local timezone for regional relevance
    const publishedTime = toLocalISO(article.publishedAt);
    const modifiedTime = article.updatedAt ? toLocalISO(article.updatedAt) : publishedTime;

    const categoryInfo = resolveArticleCategory(article);

    // Optimize description for SERP (clean, max 155 chars, no CTA to avoid low-quality appearance)
    const cleanDescription = (article.excerpt || article.summary || "").trim();
    let description = cleanDescription;

    if (cleanDescription.length > 155) {
      // Find last period or space before 155 chars
      const truncated = cleanDescription.slice(0, 155);
      const lastPeriod = truncated.lastIndexOf(".");
      const lastSpace = truncated.lastIndexOf(" ");

      // Prefer period for complete sentence, fallback to space
      const breakPoint = lastPeriod > 120 ? lastPeriod + 1 : (lastSpace > 130 ? lastSpace : 155);
      description = cleanDescription.slice(0, breakPoint).trim();

      // Only add ellipsis if we actually cut mid-sentence
      if (!description.endsWith(".") && !description.endsWith("!") && !description.endsWith("?")) {
        description += "…";
      }
    }

    // Calculate reading time
    const readingTimeMinutes = article.content
      ? Math.max(
          1,
          Math.ceil(
            article.content
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .split(/\s+/).length / 200
          )
        )
      : 4;

    // Use SEO-optimized title for meta tags if available, otherwise use full title
    const metaTitle = article.seo_title || article.title;

    // Build keywords array: headline first, then tags, category, and base keywords
    const keywordsArray = [
      article.title, // ✅ Article headline as primary keyword
      ...(article.tags || []),
      article.category || '',
      'politie nieuws',
      'politie forum',
      'criminaliteit',
      'veiligheid',
    ].filter(Boolean);

    return {
      title: metaTitle, // Template from layout.tsx adds "| Politie Forum Nederland"
      description,
      keywords: keywordsArray, // ✅ Include article headline and tags as keywords
      category: categoryInfo.metaCategory,
      alternates: {
        canonical: articleUrl,
        languages: {
          'nl-nl': articleUrl,
          'nl-be': articleUrl,
          'x-default': articleUrl,
        },
      },
      robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
        },
      },
      openGraph: {
        type: "article",
        url: articleUrl,
        title: metaTitle,
        description,
        siteName: "Politie Forum Nederland",
        locale: "nl_NL",
        publishedTime,
        modifiedTime, // This automatically adds og:updated_time
        authors: ["Politie Forum Redactie"],
        section: categoryInfo.articleSection, // Dynamic based on content (Binnenland/Buitenland/etc)
        tags: article.tags,
        images: [
          {
            url: ogImageUrl,
            secureUrl: ogImageUrl, // HTTPS version for secure contexts
            width: 1200,
            height: 630,
            alt: article.title,
            type: "image/jpeg",
          },
        ],
      },
      // Additional properties for rich results
      other: {
        "og:updated_time": modifiedTime, // Explicit for better crawling
        // iOS Safari: prevent unwanted telephone link detection
        "format-detection": "telephone=no",
      },
      twitter: {
        card: "summary_large_image",
        site: "@politieforum",
        creator: "@politieforum",
        title: metaTitle,
        description,
        images: [ogImageUrl], // Dynamic next/og image
        // Twitter reading time labels (structured UI)
        label1: "Leestijd",
        data1: `${readingTimeMinutes} minuten`,
      },
      // ✅ Additional metadata for Bing, Google News, and Google Discover
      other: {
        "og:updated_time": modifiedTime, // Explicit for better crawling
        // iOS Safari: prevent unwanted telephone link detection
        "format-detection": "telephone=no",
        // Bing-specific meta tags for better indexing
        "msvalidate.01": process.env.NEXT_PUBLIC_BING_WEBMASTER_ID || "", // Add Bing Webmaster verification if available
        // Google News/Discover specific tags
        "article:published_time": publishedTime,
        "article:modified_time": modifiedTime,
        "article:author": "Politie Forum Redactie",
        "article:publisher": "https://politie-forum.nl/",
        "article:section": categoryInfo.articleSection,
        "news_keywords": article.tags?.slice(0, 10).join(", ") || "", // Max 10 keywords for Google News
        // Social media integration for Meta AI / Facebook
        "fb:app_id": "123456789", // TODO: Replace with actual Facebook App ID
        // Mobile optimization for Google Discover
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "theme-color": "#004bbf", // Match site primary color
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Artikel | Politie Forum Nederland",
      description: "Politie nieuws en discussies",
    };
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      notFound();
    }

    const categoryInfo = resolveArticleCategory(article);

    // Fetch comments and related articles for JSON-LD (server-side)
    const [comments, relatedArticles] = await Promise.all([
      getServerArticleComments(slug),
      getRelatedArticles(slug, article.category, article.tags, 5),
    ]);

    // Build thread schema for SEO
    const articleUrl = `${BASE_URL}/nieuws/${slug}/`;
    const threadSchema = await buildThreadSchemaWithCount({
      slug,
      articleTitle: article.title,
      articleUrl,
    });

    // Convert to ForumThread format for automatic schema generation
    const forumThread: ForumThread = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      url: articleUrl,
      author: article.author || 'Politie Forum Redactie',
      datePublished: toISO(article.publishedAt),
      dateModified: toISO(article.updatedAt || article.publishedAt),
      text: article.content,
      excerpt: article.excerpt || article.summary,
      commentCount: comments.length,
      viewCount: article.viewCount || 0,
      comments: comments.slice(0, 10).map(comment => ({
        id: comment.id,
        author: comment.author?.displayName || comment.author?.username || 'Anoniem',
        authorPhoto: comment.author?.photoURL,
        text: comment.content,
        datePublished: toISO(comment.createdAt),
        upvoteCount: comment.upvotes || 0,
      })),
    };

    // Generate breadcrumbs for this article
    const breadcrumbSchema = generateArticleBreadcrumbs(
      { displayName: categoryInfo.displayName, path: categoryInfo.path },
      article.title,
      slug
    );

    // Dynamic OG image (same as in metadata)
    const ogImageUrl = `${BASE_URL}/api/og/${slug}`;

    // Generate consolidated graph for server-side rendering
    const layoutGraph = generateLayoutKnowledgeGraph();
    const articleGraph = {
      "@context": "https://schema.org",
      "@graph": await ArticleJsonLd.getSchemaGraph({
        article,
        slug,
        comments,
        relatedArticles,
        breadcrumbSchema,
        categoryInfo,
      })
    };
    const unifiedGraph = consolidateKnowledgeGraphs(layoutGraph, articleGraph);

    // Server-render RelatedArticles component if article has AI entities
    const relatedArticlesContent = article.aiEntities ? (
      <RelatedArticles
        currentSlug={slug}
        article={article as AIEnhancedArticle}
        limit={5}
      />
    ) : null;

    return (
      <>
        {/* Unified JSON-LD Graph (layout + article-specific) - SINGLE SOURCE */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedGraph, null, 0) }}
        />

        <ArticleClient
          article={article}
          slug={slug}
          categoryInfo={categoryInfo}
          ogImageUrl={ogImageUrl}
          relatedArticles={relatedArticles}
          relatedArticlesContent={relatedArticlesContent}
          commentCount={comments.length}
          skipSchema={true}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}
