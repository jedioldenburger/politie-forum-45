"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Category } from "@/lib/types";
import { useEffect, useState } from 'react';

import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Coffee,
    Cpu,
    Gavel,
    Globe,
    MessageSquare,
    Phone,
    Scale,
    Search,
    Shield,
    Target,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";

// types uit Admin helper
export type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  featured?: boolean;
  datePublished?: string;
};

type Props = {
  featuredArticles: Article[];
  categories: Category[];
  faqComponent?: React.ReactNode;
};

export default function ForumClient({ featuredArticles, categories, faqComponent }: Props) {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [heroVisible, setHeroVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPlayCount, setVideoPlayCount] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "forum-artikelen",
  ]);

  // Fade out hero after 5 seconds, then show video
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroVisible(false);
      setTimeout(() => setShowVideo(true), 1000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Handle video end - play 3 times then hide
  const handleVideoEnd = () => {
    const newCount = videoPlayCount + 1;
    setVideoPlayCount(newCount);
    if (newCount >= 3) {
      setShowVideo(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const iconMap: { [key: string]: any } = {
    MessageSquare,
    Users,
    TrendingUp,
    Shield,
    Scale,
    Target,
    Cpu,
    Coffee,
    AlertCircle,
    Search,
    Globe,
    Gavel,
  };

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Breaking News Banner */}
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white py-2 px-4 overflow-hidden" role="region" aria-label="Breaking nieuws" aria-live="polite">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <span className="font-bold uppercase text-sm whitespace-nowrap">
              BREAKING NEWS:
            </span>
            <div className="flex-1 overflow-hidden relative">
              <div className="flex animate-marquee">
                <span className="whitespace-nowrap px-4">
                  {featuredArticles.length > 0
                    ? featuredArticles
                        .slice(0, 3)
                        .map((article) => article.title)
                        .join(" • ")
                    : "Laden van laatste nieuwsberichten..."}
                </span>
                <span className="whitespace-nowrap px-4" aria-hidden="true">
                  {featuredArticles.length > 0
                    ? featuredArticles
                        .slice(0, 3)
                        .map((article) => article.title)
                        .join(" • ")
                    : "Laden van laatste nieuwsberichten..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-slate-900 dark:text-white font-medium">
                Home
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Forum Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Forum Header - Fades out after 5 seconds */}
              {heroVisible && (
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 text-white shadow-xl transition-opacity duration-1000">
                  <h1 className="text-3xl font-bold mb-3">
                    Politie Forum Nederland — Forum over Politie, Nieuws en Veiligheid
                  </h1>
                  <p className="hero-text">
                    Welkom op het Forum van politie en justitie. Bespreek actuele politieberichten, misdaadnieuws en veiligheidskwesties — alles over de rechtgang der Nederlanden. Deel je mening, blijf op de hoogte van incidenten en praat mee over politie, rechtspraak en veiligheid in Nederland.
                  </p>
                </div>
              )}

              {/* Welcome Video - Shows after hero fades */}
              {showVideo && (
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative">
                    <button
                      onClick={() => setShowVideo(false)}
                      aria-label="Sluit welkomstvideo"
                      className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <video
                      src="/welkom_op_politie-forum-nl.mp4"
                      autoPlay
                      playsInline
                      controls
                      onEnded={handleVideoEnd}
                      className="w-full rounded-2xl"
                      aria-label="Welkom bij Politie Forum Nederland"
                    />
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                      {[1, 2, 3].map((num) => (
                        <div
                          key={num}
                          className={`w-3 h-3 rounded-full transition-all ${
                            videoPlayCount >= num ? 'bg-primary-400 scale-110' : 'bg-gray-400'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Populaire Forum Artikelen (SSR + ISR) */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="populaire-forum-artikelen">
                <button
                  onClick={() => toggleCategory("forum-artikelen")}
                  aria-label={expandedCategories.includes("forum-artikelen") ? "Sluit forum artikelen" : "Open forum artikelen"}
                  aria-expanded={expandedCategories.includes("forum-artikelen")}
                  aria-controls="forum-artikelen-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <h2 id="populaire-forum-artikelen" className="text-xl font-bold text-blue-900 dark:text-blue-400">
                    Populaire Forum Artikelen
                  </h2>
                  {expandedCategories.includes("forum-artikelen") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("forum-artikelen") && (
                  <div id="forum-artikelen-content" className="divide-y divide-slate-200 dark:divide-slate-700">
                    {featuredArticles.length ? (
                      featuredArticles.map((article) => (
                        <article
                          key={article.slug}
                          itemScope
                          itemType="https://schema.org/DiscussionForumPosting"
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <Link
                            href={`/nieuws/${article.slug}`}
                            itemProp="url"
                            className="block p-5"
                          >
                            <div className="flex gap-4">
                              {/* Icon */}
                              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md">
                                <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" focusable="false" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded">
                                    Forum Artikel
                                  </span>
                                  {article.featured && (
                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <h3 itemProp="headline" className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                  {article.title}
                                </h3>
                                {article.excerpt && (
                                  <p itemProp="text" className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {article.excerpt}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" aria-hidden="true" focusable="false" />
                                    Bekijk reacties
                                  </span>
                                  <span className="text-accent-600 dark:text-white font-medium">
                                    Lees artikel →
                                  </span>
                                  {article.datePublished && (
                                    <time itemProp="datePublished" className="ml-auto" dateTime={article.datePublished}>
                                      {new Date(article.datePublished).toLocaleDateString(
                                        "nl-NL",
                                        { year: "numeric", month: "long", day: "numeric" }
                                      )}
                                    </time>
                                  )}
                                </div>
                                {article.author && (
                                  <div itemProp="author" itemScope itemType="https://schema.org/Person">
                                    <meta itemProp="name" content={article.author} />
                                    <meta itemProp="url" content="https://politie-forum.nl/redactie" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))
                    ) : (
                      <div className="p-6 text-slate-600 dark:text-slate-400">
                        Nog geen artikelen gevonden.
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Forum Categorieën */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="forum-categorieen">
                <button
                  onClick={() => toggleCategory("algemene-categorieen")}
                  aria-label={expandedCategories.includes("algemene-categorieen") ? "Sluit categorieën" : "Open categorieën"}
                  aria-expanded={expandedCategories.includes("algemene-categorieen")}
                  aria-controls="algemene-categorieen-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <h2 id="forum-categorieen" className="text-xl font-bold text-blue-900 dark:text-blue-400">
                    Forum Categorieën
                  </h2>
                  {expandedCategories.includes("algemene-categorieen") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("algemene-categorieen") && (
                  <div id="algemene-categorieen-content" className="divide-y divide-slate-200 dark:divide-slate-700">
                    {categories.slice(0, 8).map((category) => {
                    const Icon = iconMap[category.icon] || MessageSquare;
                    return (
                      <Link
                        key={category.id}
                        href={`/categorie/${category.id}`}
                        className="block hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="p-5">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                              <Icon className="h-6 w-6 text-white" aria-hidden="true" focusable="false" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                {category.name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                {category.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" focusable="false" />
                                  {category.topicsCount || 0} topics
                                </span>
                                <span>{category.postsCount || 0} posts</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  </div>
                )}
              </section>

              {/* FAQ Section */}
              {faqComponent && (
                <div className="mt-6">
                  {faqComponent}
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Sidebar informatie">
              {/* User Login/Info */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6" aria-labelledby="user-info-heading">
                <h3 id="user-info-heading" className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {currentUser ? (
                    `Welkom ${(currentUser as any).nickname || currentUser.displayName || "Gebruiker"}`
                  ) : (
                    "Gebruikersnaam / Nickname"
                  )}
                </h3>
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="h-12 w-12 rounded-full"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                          {currentUser.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {(currentUser as any).nickname || currentUser.displayName || "Welkom terug!"}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    aria-label="Open inlog dialoog"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Inloggen
                  </button>
                )}
              </section>

              {/* Search */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6" aria-labelledby="search-heading">
                <h3 id="search-heading" className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" aria-hidden="true" focusable="false" />
                  Zoeken
                </h3>
                <form action="/zoeken" method="get" role="search" aria-label="Zoek in het forum">
                  <div className="relative">
                    <label htmlFor="forum-search-aside" className="sr-only">
                      Zoek in het forum
                    </label>
                    <input
                      id="forum-search-aside"
                      name="q"
                      type="search"
                      placeholder="Zoek in het forum..."
                      autoComplete="off"
                      className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    aria-label="Zoek in het forum"
                    type="submit"
                    className="w-full mt-3 bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all"
                  >
                    Zoeken
                  </button>
                </form>
              </section>

              {/* Tip Line */}
              <section className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg p-6 text-white" aria-labelledby="tipline-heading">
                <h3 id="tipline-heading" className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" aria-hidden="true" focusable="false" />
                  <span className="ml-3">Tip Lijn Politie-Forum</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Phone className="h-5 w-5" aria-hidden="true" focusable="false" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90">WhatsApp</div>
                      <a href="https://wa.me/31648319167" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                        +31 6 48319167
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <MessageSquare className="h-5 w-5" aria-hidden="true" focusable="false" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90">Email</div>
                      <a href="mailto:tip@politie-forum.nl" className="text-lg font-bold hover:underline break-all">
                        tip@politie-forum.nl
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Shield className="h-5 w-5" aria-hidden="true" focusable="false" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90">PGP Public Key</div>
                      <a href="/pgp-public-key.asc" download className="text-sm font-bold hover:underline flex items-center gap-1">
                        Download
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Crime Map Widget - Static Screenshot */}
              <Link href="/crime-map-nederland" className="block" aria-label="Bekijk de interactieve misdaadkaart van Nederland">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="p-6">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                      {/* Static map placeholder - instant load, no JS overhead */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interactieve Misdaadkaart</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Klik voor volledige kaart</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Crime Map Nederland</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Bekijk hier de misdaad in Nederland</p>
                      </div>
                      <svg className="w-5 h-5 text-primary-600 dark:text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}


