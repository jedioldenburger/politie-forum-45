"use client";

import ArticleComments from "@/components/ArticleComments";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLdArticleWithDiscussion from "@/components/JsonLdArticleWithDiscussion";
import { NewsArticle } from "@/data/news";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Share2,
  User
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BASE_URL = "https://politie-forum.nl";

interface ArticleClientProps {
  article: NewsArticle;
  slug: string;
}

export default function ArticleClient({ article, slug }: ArticleClientProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const toIsoStringWithFallback = (value?: string | null) => {
    if (!value) {
      return new Date().toISOString();
    }

    if (/T.*(Z|[+-]\d{2}:\d{2})$/.test(value)) {
      return value;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();
  };

  // Prepare structured data
  const articleImageUrl = article.imageUrl
    ? article.imageUrl.startsWith("http")
      ? article.imageUrl
      : `${BASE_URL}${article.imageUrl}`
    : `${BASE_URL}/og/politie-forum-1200x630.png`;
  const articleKeywords = article.tags?.length
    ? article.tags.join(", ")
    : "politie, nieuws, Nederland";
  const articleDescription = article.excerpt?.trim() || article.title;
  const articlePublishedAt = toIsoStringWithFallback(article.publishedAt);
  const articleUpdatedAt = toIsoStringWithFallback(
    article.updatedAt || article.publishedAt
  );
  const articleSlug = article.slug || slug;

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <JsonLdArticleWithDiscussion
          headline={article.title}
          description={articleDescription}
          datePublished={articlePublishedAt}
          dateModified={articleUpdatedAt}
          slug={articleSlug}
          image={articleImageUrl}
          commentCount={0}
          category={article.category}
          keywords={articleKeywords}
        />

        <article
          className="container mx-auto px-4 py-8 max-w-4xl"
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
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
              <span
                className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-sm font-medium rounded-full"
                itemProp="articleSection"
              >
                {article.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.publishedAt} itemProp="datePublished">
                    {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span itemProp="author">{article.author}</span>
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
                    <span itemProp="userInteractionCount">245</span>
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

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                <Share2 className="h-4 w-4" />
                Delen
              </button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Comments Section */}
          <ArticleComments articleSlug={slug} />

          {/* Publisher Info (hidden but for SEO) */}
          <div
            itemProp="publisher"
            itemScope
            itemType="https://schema.org/Organization"
            style={{ display: "none" }}
          >
            <span itemProp="name">Politie Forum Nederland</span>
            <span itemProp="url">https://politie-forum.nl</span>
            <div
              itemProp="logo"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <span itemProp="url">https://politie-forum.nl/logo.png</span>
            </div>
          </div>
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
