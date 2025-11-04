"use client";

import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Category } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  Coffee,
  Cpu,
  Gavel,
  Globe,
  MessageSquare,
  Scale,
  Search,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Props = {
  categories: Category[];
};

export default function ForumOverviewClient({ categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const iconMap: { [key: string]: any } = {
    MessageSquare,
    Users,
    TrendingUp,
    Shield,
    Scale,
    Target,
    Cpu,
    Coffee,
    Gavel,
    Globe,
    AlertCircle,
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              name: "Forum Categorieën",
              description:
                "Overzicht van alle forumcategorieën op Politie Forum Nederland",
              inLanguage: "nl-NL",
              url: "https://politie-forum.nl/forum",
              isPartOf: {
                "@type": "WebSite",
                name: "Politie Forum Nederland",
                url: "https://politie-forum.nl",
              },
              mainEntity: {
                "@type": "ItemList",
                name: "Forum Categorieën",
                numberOfItems: categories.length,
                itemListElement: categories.map((category, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Thing",
                    "@id": `https://politie-forum.nl/categorie/${category.id}`,
                    name: category.name,
                    description: category.description,
                    url: `https://politie-forum.nl/categorie/${category.id}`,
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
                Forum Categorieën
              </h1>
              <p
                itemProp="description"
                className="text-lg text-slate-600 dark:text-slate-400"
              >
                Vind de juiste categorie voor jouw vragen en discussies over politie, veiligheid en justitie
              </p>
            </div>
          </header>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek categorieën..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {filteredCategories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || MessageSquare;
              return (
                <article
                  key={category.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-primary-600"
                  itemScope
                  itemType="https://schema.org/Thing"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={String(index + 1)} />

                  <Link
                    href={`/categorie/${category.id}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg group-hover:bg-accent-100 dark:group-hover:bg-accent-900 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary-600 dark:text-primary-400 group-hover:text-accent-600 dark:group-hover:text-accent-400" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h2
                          className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                          itemProp="name"
                        >
                          {category.name}
                        </h2>
                        <p
                          className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2"
                          itemProp="description"
                        >
                          {category.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {category.topicsCount || 0} topics
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {category.postsCount || 0} posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Hidden SEO data */}
                  <link
                    itemProp="url"
                    href={`https://politie-forum.nl/categorie/${category.id}`}
                  />
                </article>
              );
            })}
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Geen categorieën gevonden voor "{searchQuery}".
              </p>
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
                    name: "Forum",
                    item: "https://politie-forum.nl/forum",
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
