"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Clock, MessageSquare, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  datePublished?: string;
  author?: string;
  category?: string;
  tags?: string[];
};

type Category = {
  name: string;
  description: string;
  icon: string;
  slug: string;
};

type Props = {
  category: Category;
  articles: Article[];
  allCategories: any[];
};

export default function CategoryClient({ category, articles, allCategories }: Props) {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Filter articles by category (case-insensitive match)
  const categoryArticles = articles.filter((article) =>
    article.category?.toLowerCase().includes(category.slug.toLowerCase()) ||
    article.tags?.some(tag => tag.toLowerCase().includes(category.slug.toLowerCase()))
  );

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                Home
              </Link>
              <span>/</span>
              <Link href="/categorieen" className="hover:text-primary-600 dark:hover:text-primary-400">
                Categorieën
              </Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {category.name}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 text-white shadow-xl mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{category.name} - Politie Forum Nederland</h1>
                <p className="text-lg text-blue-100">
                  {category.description}
                  {category.slug === 'werving-sollicitatie' && ' Lees politie sollicitatie ervaringen, assessment tips en carrière advies van 10.000+ leden.'}
                  {category.slug === 'criminaliteit-opsporing' && ' Bespreek misdaad, opsporing en forensisch onderzoek met politie experts.'}
                  {category.slug === 'cybersecurity-digitale-veiligheid' && ' Alles over cybercrime, digitale opsporing en online veiligheid.'}
                </p>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    {categoryArticles.length} artikelen
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    Actieve community
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Articles */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" aria-hidden="true" />
                    Recente Artikelen
                  </h2>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {categoryArticles.length > 0 ? (
                    categoryArticles.map((article) => (
                      <article
                        key={article.slug}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <Link href={`/nieuws/${article.slug}`} className="block p-5">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                              <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>

                            <div className="flex-1 min-w-0">
                              {article.category && (
                                <div className="mb-2">
                                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 text-xs font-semibold rounded">
                                    {article.category}
                                  </span>
                                </div>
                              )}
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {article.title}
                              </h3>
                              {article.excerpt && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                  {article.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                  {article.datePublished &&
                                    new Date(article.datePublished).toLocaleDateString("nl-NL", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                </span>
                                <span className="text-accent-600 dark:text-white font-medium">
                                  Lees artikel →
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                      <p className="text-lg font-medium mb-2">Nog geen artikelen in deze categorie</p>
                      <p className="text-sm">Check binnenkort terug voor nieuwe content!</p>
                    </div>
                  )}
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* All Categories */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Alle Categorieën
                </h3>
                <div className="space-y-2">
                  {allCategories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categorie/${cat.id}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        cat.id === category.slug
                          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categorieen"
                  className="block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline text-center"
                >
                  Bekijk alle categorieën →
                </Link>
              </section>

              {/* Category Stats */}
              <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 mb-4">
                  Statistieken
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Totaal artikelen</span>
                    <span className="text-lg font-bold text-blue-900 dark:text-blue-400">
                      {categoryArticles.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Laatst bijgewerkt</span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Vandaag
                    </span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
