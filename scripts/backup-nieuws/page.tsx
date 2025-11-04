import { getAllNews } from "@/data/news";
import { ArrowLeft, Shield } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

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
  openGraph: {
    title: "Politie Nieuws & Updates | Politie Forum Nederland",
    description:
      "Blijf op de hoogte van het laatste politie nieuws en politie discussies in Nederland",
    type: "website",
  },
};

export default function NewsPage() {
  const newsArticles = getAllNews();
  return (
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
              itemListElement: newsArticles.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "NewsArticle",
                  headline: article.title,
                  description: article.excerpt,
                  datePublished: article.publishedAt,
                  author: {
                    "@type": "Person",
                    name: article.author,
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Politie Forum Nederland",
                    url: "https://politie-forum.nl",
                  },
                  url: `https://politie-forum.nl/nieuws/${article.slug}`,
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
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 mb-4 transition-colors"
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
              Blijf op de hoogte van het laatste nieuws over de politie,
              sollicitaties en opleidingen
            </p>
          </div>
        </header>

        {/* News Articles Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          {newsArticles.map((article, index) => {
            const date = new Date(article.publishedAt);
            const formattedDate = date.toLocaleDateString("nl-NL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <article
                key={article.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                itemScope
                itemType="https://schema.org/NewsArticle"
                itemProp="itemListElement"
              >
                <meta itemProp="position" content={String(index + 1)} />

                {/* Image Header */}
                <div className="h-48 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                  <Shield className="h-20 w-20 text-white opacity-50" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded"
                      itemProp="articleSection"
                    >
                      {article.category}
                    </span>
                    <time
                      className="text-xs text-slate-500 dark:text-slate-400"
                      dateTime={article.publishedAt}
                      itemProp="datePublished"
                    >
                      {formattedDate}
                    </time>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2"
                    itemProp="headline"
                  >
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3"
                    itemProp="description"
                  >
                    {article.excerpt}
                  </p>

                  {/* Author (hidden but for SEO) */}
                  <meta itemProp="author" content={article.author} />
                  <meta itemProp="inLanguage" content="nl-NL" />
                  <div
                    itemProp="publisher"
                    itemScope
                    itemType="https://schema.org/Organization"
                  >
                    <meta itemProp="name" content="Politie Forum Nederland" />
                    <meta itemProp="url" content="https://politie-forum.nl" />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href={`/nieuws/${article.slug}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 font-medium text-sm inline-flex items-center gap-1"
                      itemProp="url"
                    >
                      Lees meer →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

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
  );
}
