"use client";

import { getStaticCategories } from "@/data/categories";
import { getCategories } from "@/lib/database";
import { Category } from "@/lib/types";
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
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
import { useEffect, useState } from "react";

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      // Use Firebase data if available, otherwise use static data
      setCategories(data.length > 0 ? data : getStaticCategories());
    } catch (error) {
      console.error("Error loading categories:", error);
      // Fallback to static categories on error
      setCategories(getStaticCategories());
    } finally {
      setLoading(false);
    }
  }

  const iconMap: { [key: string]: any } = {
    MessageSquare,
    Users,
    TrendingUp,
    Shield,
    Scale,
    Target,
    Cpu,
    Coffee,
    Briefcase,
    Globe,
    Gavel,
    AlertCircle,
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
            url: "https://politie-forum.nl/categorieen",
            isPartOf: {
              "@type": "WebSite",
              name: "Politie Forum Nederland",
              url: "https://politie-forum.nl",
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
              Vind de juiste categorie voor jouw vragen en discussies
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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
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
                  itemType="https://schema.org/DiscussionForumPosting"
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
                          itemProp="headline"
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
                          <span
                            className="flex items-center gap-1"
                            itemProp="interactionStatistic"
                            itemScope
                            itemType="https://schema.org/InteractionCounter"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <meta
                              itemProp="interactionType"
                              content="https://schema.org/CommentAction"
                            />
                            <span itemProp="userInteractionCount">
                              {category.topicsCount || 0}
                            </span>{" "}
                            topics
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
                  <meta itemProp="inLanguage" content="nl-NL" />
                  <link
                    itemProp="url"
                    href={`https://politie-forum.nl/categorie/${category.id}`}
                  />
                </article>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              Geen categorieën gevonden.
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
                  name: "Categorieën",
                  item: "https://politie-forum.nl/categorieen",
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}
