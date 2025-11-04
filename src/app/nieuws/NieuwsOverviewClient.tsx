"use client";

import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Article } from "@/lib/firebaseAdmin";
import { ArrowLeft, Calendar, Eye, MessageCircle, Search, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  articles: Article[];
};

export default function NieuwsOverviewClient({ articles }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.category && article.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Politie Forum Nieuws",
              description:
                "Laatste nieuws en updates over de politie in Nederland",
              inLanguage: "nl-NL",
              url: "https://politie-forum.nl/nieuws",
              isPartOf: {
                "@type": "WebSite",
                name: "Politie Forum Nederland",
                url: "https://politie-forum.nl",
              },
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: filteredArticles.length,
                itemListElement: filteredArticles.slice(0, 20).map((article, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "NewsArticle",
                    "@id": `https://politie-forum.nl/nieuws/${article.slug}/#article`,
                    headline: article.title,
                    description: article.excerpt || article.summary,
                    datePublished: new Date(article.publishedAt).toISOString(),
                    author: {
                      "@type": "Organization",
                      name: "Politie Forum Redactie",
                    },
                    publisher: {
                      "@type": "Organization",
                      name: "Politie Forum Nederland",
                      url: "https://politie-forum.nl",
                    },
                    url: `https://politie-forum.nl/nieuws/${article.slug}/`,
                    inLanguage: "nl-NL",
                  },
                })),
              },
            }),
          }}
        />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <Link
              href="/"
              className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Terug naar home</span>
            </Link>
            <div itemScope itemType="https://schema.org/CollectionPage">
              <h1
                itemProp="name"
                className="text-4xl font-bold text-slate-900 dark:text-white mb-2"
              >
                Nieuws & Updates
              </h1>
              <p
                itemProp="description"
                className="text-lg text-slate-600 dark:text-slate-400"
              >
                Blijf op de hoogte van het laatste nieuws over de politie in Nederland
              </p>
            </div>
          </header>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek artikelen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {filteredArticles.map((article, index) => {
              const date = new Date(article.publishedAt);
              const formattedDate = date.toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <article
                  key={article.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] duration-300"
                  itemScope
                  itemType="https://schema.org/NewsArticle"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={String(index + 1)} />

                  <Link href={`/nieuws/${article.slug}/`} className="block">
                    {/* Image Header */}
                    {article.imageUrl ? (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                        <Shield className="h-20 w-20 text-white opacity-50" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta Information */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {article.category && (
                          <span
                            className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded"
                            itemProp="articleSection"
                          >
                            {article.category}
                          </span>
                        )}
                        <time
                          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"
                          dateTime={date.toISOString()}
                          itemProp="datePublished"
                        >
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </time>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        itemProp="headline"
                      >
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      {(article.excerpt || article.summary) && (
                        <p
                          className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3"
                          itemProp="description"
                        >
                          {article.excerpt || article.summary}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        {article.viewCount && article.viewCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.viewCount}
                          </span>
                        )}
                        {article.commentCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {article.commentCount}
                          </span>
                        )}
                      </div>

                      {/* Hidden SEO data */}
                      <div itemProp="author" itemScope itemType="https://schema.org/Organization">
                        <meta itemProp="name" content="Politie Forum Redactie" />
                        <meta itemProp="url" content="https://politie-forum.nl/redactie/" />
                      </div>
                      <meta itemProp="inLanguage" content="nl-NL" />
                      <div
                        itemProp="publisher"
                        itemScope
                        itemType="https://schema.org/Organization"
                      >
                        <meta itemProp="name" content="Politie Forum Nederland" />
                        <meta itemProp="url" content="https://politie-forum.nl" />
                      </div>
                      <link itemProp="url" href={`https://politie-forum.nl/nieuws/${article.slug}/`} />
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Geen artikelen gevonden{searchQuery && ` voor "${searchQuery}"`}.
              </p>
            </div>
          )}

          {/* Results Count */}
          {searchQuery && filteredArticles.length > 0 && (
            <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artikel' : 'artikelen'} gevonden
            </div>
          )}

          {/* Breadcrumb Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://politie-forum.nl",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Nieuws",
                    item: "https://politie-forum.nl/nieuws",
                  },
                ],
              }),
            }}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
