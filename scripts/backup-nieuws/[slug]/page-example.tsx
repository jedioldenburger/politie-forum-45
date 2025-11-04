/**
 * Dynamic News Article Page with Type-Safe SEO & Live Comment Count
 *
 * Features:
 * - Full TypeScript type safety
 * - Dynamic metadata generation (title, OG, Twitter cards)
 * - JSON-LD structured data (NewsArticle + DiscussionForumPosting + BreadcrumbList)
 * - Live Firebase comment count integration
 * - SEO-optimized for Google News & rich snippets
 *
 * To activate: Rename to `page.tsx` and ensure Firebase is configured
 *
 * @example
 * URL: /nieuws/twee-dna-matches-cold-case-vermoorde-sekswerker
 * Generates: Full SEO metadata + JSON-LD with live comment count
 */

import JsonLdArticleWithDiscussion from "@/components/JsonLdArticleWithDiscussion";
import { getAllArticleSlugs, getArticle, getFirebaseCommentCount } from "@/lib/firebase";
import { Metadata } from "next";
import Link from "next/link";

interface NewsPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generate dynamic metadata for SEO
 * Populates <title>, <meta>, Open Graph, and Twitter Card tags
 */
export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "Artikel niet gevonden — Politie Forum Nederland",
      description: "Dit artikel bestaat niet of is verwijderd.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = "https://politie-forum.nl";
  const url = `${baseUrl}/nieuws/${params.slug}`;
  const image = article.image || `${baseUrl}/og/politie-forum-1200x630.png`;

  return {
    title: `${article.title} — Politie Forum Nederland`,
    description: article.excerpt,
    keywords: article.tags?.join(", ") || "politie, nieuws, Nederland, veiligheid, justitie",
    authors: [{ name: article.author || "Politie Forum Redactie" }],

    // Canonical URL and language alternates
    alternates: {
      canonical: url,
      languages: {
        "nl-NL": url,
        "x-default": url,
      },
    },

    // Open Graph metadata
    openGraph: {
      title: `${article.title} — Politie Forum Nederland`,
      description: article.excerpt,
      url,
      siteName: "Politie Forum Nederland",
      type: "article",
      locale: "nl_NL",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [article.author || "Politie Forum Redactie"],
      section: article.category || "Nieuws",
      tags: article.tags || [],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      site: "@politieforum",
      creator: "@politieforum",
      title: `${article.title} — Politie Forum Nederland`,
      description: article.excerpt,
      images: [image],
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Article-specific metadata
    other: {
      "article:published_time": article.datePublished,
      "article:modified_time": article.dateModified,
      "article:author": article.author || "Politie Forum Redactie",
      "article:section": article.category || "Nieuws",
      "news_keywords": `politie forum, veiligheid, justitie, Nederland, ${article.category}`,
    },
  };
}

/**
 * Generate static params for static site generation (SSG)
 * Enables pre-rendering of article pages at build time
 */
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Main News Article Page Component
 * Renders article content with SEO-optimized JSON-LD and live comment count
 */
export default async function NewsPage({ params }: NewsPageProps) {
  // Fetch article data and comment count in parallel for performance
  const [article, commentCount] = await Promise.all([
    getArticle(params.slug),
    getFirebaseCommentCount(params.slug),
  ]);

  // Handle 404 - Article not found
  if (!article) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            404 - Artikel niet gevonden
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Dit artikel bestaat niet of is verwijderd.
          </p>
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
          >
            ← Terug naar nieuws
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data with Live Comment Count */}
      <JsonLdArticleWithDiscussion
        headline={article.title}
        description={article.excerpt}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        slug={params.slug}
        image={article.image}
        commentCount={commentCount}
        category={article.category}
        keywords={article.tags?.join(", ")}
      />

      {/* Article Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                Home
              </Link>
            </li>
            <li>→</li>
            <li>
              <Link href="/nieuws" className="hover:text-primary-600 dark:hover:text-primary-400">
                Nieuws
              </Link>
            </li>
            <li>→</li>
            <li className="text-slate-900 dark:text-white font-medium truncate">
              {article.title.substring(0, 50)}...
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <Link
          href="/nieuws"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 mb-6 transition-colors font-medium"
        >
          ← Terug naar nieuws
        </Link>

        {/* Article Container */}
        <article
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8"
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          <header className="mb-8">
            {/* Category & Metadata */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-full">
                {article.category || "Nieuws"}
              </span>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  📅{" "}
                  <time dateTime={article.datePublished}>
                    {new Date(article.datePublished).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1">
                  👤 {article.author || "Politie Forum Redactie"}
                </span>
              </div>
            </div>

            {/* Article Title */}
            <h1
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Article Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Share & Source */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md">
                🔗 Delen
              </button>
              {article.source && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Bron: {article.source} →
                </a>
              )}
            </div>
          </header>

          {/* Article Body */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-primary-600 dark:prose-a:text-primary-400"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Footer - Tags */}
          {article.tags && article.tags.length > 0 && (
            <footer className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>

        {/* Comments Section */}
        <section
          id="comments"
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
        >
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 -mx-8 -mt-8 px-8 py-6 rounded-t-2xl mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="bg-primary-600 dark:bg-primary-500 p-2 rounded-lg">
                💬
              </div>
              <span>Reacties ({commentCount})</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 ml-14">
              Deel je gedachten en discussieer mee over dit artikel
            </p>
          </div>

          {/* Comment form and list would go here */}
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>Comments component komt hier...</p>
            <p className="text-sm mt-2">Live comment count: <strong>{commentCount}</strong></p>
          </div>
        </section>
      </main>
    </>
  );
}
