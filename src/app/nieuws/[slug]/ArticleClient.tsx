"use client";

import ArticleAISEO from "@/components/ArticleAISEO";
import ArticleComments from "@/components/ArticleComments";
import ArticleFAQ from "@/components/ArticleFAQ";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { ArticleCategoryInfo } from "@/lib/articleCategory";
import { toISO } from "@/lib/dates";
import { sanitizeHtml } from "@/lib/htmlUtils";
import type { AIEnhancedArticle } from "@/lib/types";
import type { Article } from "@/types/article";
import {
    ArrowLeft,
    Calendar,
    Copy,
    Eye,
    MessageCircle,
    Share2,
    User
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

// Lazy-load comments voor betere initial load performance (below-the-fold)
const CommentThread = dynamic(() => import("@/components/CommentThread"), {
  loading: () => (
    <div className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
    </div>
  ),
  ssr: false, // Comments niet nodig voor initial SEO
});

const BASE_URL = "https://politie-forum.nl";

interface ArticleClientProps {
  article: Article & Partial<AIEnhancedArticle>;
  slug: string;
  categoryInfo: ArticleCategoryInfo;
  ogImageUrl: string;
  relatedArticles?: Array<{
    slug: string;
    title: string;
  }>;
  relatedArticlesContent?: React.ReactNode;
  commentCount?: number;
}

export default function ArticleClient({ article, slug, categoryInfo, ogImageUrl, relatedArticles = [], relatedArticlesContent, commentCount = 0 }: ArticleClientProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const heroAlt = ((article as unknown as { imageAlt?: string })?.imageAlt || "").trim();
  const heroCaption = (article as unknown as { imageCaption?: string })?.imageCaption;

  // Share functionality with Web Share API fallback
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt || article.title,
      url: `${BASE_URL}/nieuws/${slug}/`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // No client-side HTML manipulation to prevent hydration mismatch (#418)
  // Image optimization should be done server-side during article generation

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <article
          className="container mx-auto px-4 py-8 max-w-4xl"
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          {/* Hidden microdata for complete schema compliance */}
          <meta itemProp="image" content={`${ogImageUrl}.jpg`} />
          <meta itemProp="datePublished" content={toISO(article.publishedAt)} />
          <meta itemProp="dateModified" content={toISO(article.updatedAt || article.publishedAt)} />
          <meta itemProp="url" content={`${BASE_URL}/nieuws/${slug}/`} />
          <meta itemProp="description" content={article.excerpt || article.title} />
          <meta itemProp="inLanguage" content="nl-NL" />
          <meta itemProp="isAccessibleForFree" content="true" />
          <div itemProp="author" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Politie Forum Nederland" />
            <meta itemProp="url" content={BASE_URL} />
            <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
              <meta itemProp="url" content={`${BASE_URL}/logo.svg`} />
              <meta itemProp="width" content="512" />
              <meta itemProp="height" content="512" />
            </div>
          </div>
          <div itemProp="publisher" itemScope itemType="https://schema.org/Organization" className="hidden">
            <meta itemProp="name" content="Politie Forum Nederland" />
            <meta itemProp="url" content={BASE_URL} />
            <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
              <meta itemProp="url" content={`${BASE_URL}/logo.svg`} />
              <meta itemProp="width" content="512" />
              <meta itemProp="height" content="512" />
            </div>
          </div>
          <link itemProp="mainEntityOfPage" href={`${BASE_URL}/nieuws/${slug}/`} />

          {/* Back Button */}
          <Link
            href="/nieuws"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Terug naar nieuws</span>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Link
                href={`/categorie/${categoryInfo.slug}/`}
                className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-300 text-sm font-semibold rounded-full hover:bg-accent-200 dark:hover:bg-accent-800 transition-colors"
                itemProp="articleSection"
              >
                {categoryInfo.displayName}
              </Link>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={toISO(article.publishedAt)} itemProp="datePublished">
                    {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {article.author || "Politie Forum Redactie"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span
                    itemProp="interactionStatistic"
                    itemScope
                    itemType="https://schema.org/InteractionCounter"
                  >
                    <meta
                      itemProp="interactionType"
                      content="https://schema.org/ViewAction"
                    />
                    <span itemProp="userInteractionCount">{article.viewCount || 0}</span>
                  </span>
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Share Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                aria-label="Delen"
                aria-expanded={shareMenuOpen}
              >
                <Share2 className="h-4 w-4" />
                Delen
              </button>

              {shareMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShareMenuOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${BASE_URL}/nieuws/${slug}/`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShareMenuOpen(false)}
                    >
                      <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-slate-900 dark:text-white font-medium">Facebook</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${BASE_URL}/nieuws/${slug}/`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShareMenuOpen(false)}
                    >
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      <span className="text-slate-900 dark:text-white font-medium">WhatsApp</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${BASE_URL}/nieuws/${slug}/`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShareMenuOpen(false)}
                    >
                      <svg className="h-5 w-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-slate-900 dark:text-white font-medium">X</span>
                    </a>

                    {/* Divider */}
                    <div className="border-t border-slate-200 dark:border-slate-700" />

                    {/* Copy Link */}
                    <button
                      onClick={() => {
                        handleShare();
                        setShareMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      {shareSuccess ? (
                        <>
                          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-900 dark:text-white font-medium">Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-900 dark:text-white font-medium">Kopieer link</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Featured Snippet Summary - Direct onder H1 voor Google featured snippets */}
          {article.excerpt && (
            <div className="mb-6 p-5 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg border-l-4 border-primary-600 dark:border-primary-400">
              <p
                className="text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium"
                dangerouslySetInnerHTML={{
                  __html: `<strong class="text-primary-700 dark:text-primary-300">Samenvatting:</strong> ${sanitizeHtml(article.excerpt)}`
                }}
              />
            </div>
          )}
          {/* Location and Date Metadata + Crime Map Link */}
          {(article.location?.name || article.publishedAt) && (
            <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Artikel Details</h2>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-300 flex-wrap">
                  {article.location?.name && (
                    <span className="font-medium">
                      Locatie: <span className="text-primary-600 dark:text-primary-400">{article.location.name}</span>
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="font-medium">
                      Datum: <span className="text-primary-600 dark:text-primary-400">
                        {new Date(article.publishedAt).toLocaleString("nl-NL", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="font-medium">
                      Jaar: <span className="text-primary-600 dark:text-primary-400">
                        {new Date(article.publishedAt).getFullYear()}
                      </span>
                    </span>
                  )}
                </div>
                {article.location?.name && (
                  <Link
                    href="/crime-map-nederland/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors w-fit"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Bekijk op Crime Map Nederland →
                  </Link>
                )}
              </div>
            </div>
          )}

          {article.imageUrl && (
            <figure className="mb-8 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
              <img
                src={article.imageUrl}
                alt={heroAlt || `${article.title} – nieuwsbeeld`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {heroCaption && (
                <figcaption className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {heroCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />

          {/* FAQ Section */}
          {article.faq && article.faq.length > 0 && (
            <div suppressHydrationWarning>
              <ArticleFAQ faqs={article.faq} articleTitle={article.title} />
            </div>
          )}

          {/* Tags Section - Visible and consistent with meta keywords */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                    itemProp="keywords"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          {relatedArticles && relatedArticles.length > 0 && (
            <aside className="mb-12 p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Gerelateerde Artikelen
              </h2>
              <div className="grid gap-3">
                {relatedArticles.map((related, index) => (
                  <Link
                    key={index}
                    href={`/nieuws/${related.slug}/`}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-slate-900 dark:text-white font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {related.title}
                    </span>
                    <svg className="flex-shrink-0 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {/* Join Discussion CTA - Link to forum discussion page */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-xl border-l-4 border-primary-600">
            <div className="flex items-start gap-4">
              <MessageCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Discussieer mee in het forum
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Wat vind jij van dit nieuws? Ga naar onze forumdiscussie en praat mee met andere leden.
                </p>
                <Link
                  href={`/forum/${slug}/`}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Open discussie</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* 🧠 SEMANTIC INTELLIGENCE LAYER - AI-Enhanced Related Articles (Server-Rendered) */}
          {relatedArticlesContent}

          {/* 🚀 AI-ENHANCED SEO META TAGS - Next-Gen Search Optimization */}
          <ArticleAISEO article={article as AIEnhancedArticle} />

          {/* Discussion Section with AI Features */}
          {/* Comments Section */}
          <section id="reacties" className="mt-12" suppressHydrationWarning>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Reacties ({commentCount})
            </h2>

            {/* Existing comments list (if any) */}
            <div className="space-y-4 mb-6">
              {/* Comment items would go here from Firebase */}
            </div>

            {/* Interactive comment system */}
            <ArticleComments articleSlug={slug} />
          </section>
        </article>
      </div>
      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
