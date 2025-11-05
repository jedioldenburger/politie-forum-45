"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Category } from "@/lib/types";
import { useEffect, useState } from 'react';

import {
    AlertCircle,
    Briefcase,
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
  category?: string;
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
    "forum-artikelen", // Featured content open by default for SEO
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
                  ⚠️ <a href="https://hetnieuws.app" target="_blank" rel="noopener noreferrer nofollow sponsored" className="font-bold hover:underline">HETNIEUWS.APP</a> voor het laatste Nieuws uit Nederland en de Wereld ⚠️
                </span>
                {/* Duplicate for seamless marquee - text only, no duplicate link */}
                <span className="whitespace-nowrap px-4" aria-hidden="true">
                  ⚠️ HETNIEUWS.APP voor het laatste Nieuws uit Nederland en de Wereld ⚠️
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
            <section className="lg:col-span-2 space-y-6">
              {/* Permanent H1 for SEO (always present, visible when hero shows) */}
              <h1 className={heroVisible ? "text-3xl font-bold mb-4 text-white" : "sr-only"}>
                Politie Forum Nederland - Het Grootste Politie Forum
              </h1>
              
              {/* Forum Header - Fades out after 5 seconds */}
              {heroVisible && (
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 text-white shadow-xl transition-opacity duration-1000">
                  <div className="space-y-3 text-base leading-relaxed">
                    <p className="hero-text">
                      Welkom bij het grootste <strong>veiligheidsforum</strong> van Nederland en het meest actieve <strong>politie forum</strong>. Deze <strong>community</strong> is dé ontmoetingsplaats waar Nederland over <strong>justitie en veiligheid</strong> praat - van criminaliteit en forensisch onderzoek tot rechtspraak.
                    </p>
                    <p className="opacity-95">
                      <strong>Politie Forum Nederland</strong> is meer dan een forum - het is een levendige community waar dagelijks <strong>expertise wordt gedeeld</strong>. Onze politie professionals, <strong>criminologie studenten</strong>, journalisten en <strong>veiligheidsexperts</strong> delen kennis en ervaringen over politiewerk en rechtshandhaving.
                    </p>
                    <p className="opacity-90">
                      Discussieer over actuele <strong>politieacties</strong>, sollicitatieprocedures, <strong>assessmentcentra</strong> en politieopleidingen. Deel ervaringen, stel vragen over <strong>forensische opsporing</strong> en praat mee in onze open community. Dit platform biedt een veilige omgeving voor constructieve dialoog over <strong>criminaliteitsbestrijding en veiligheidsvraagstukken</strong>.
                    </p>
                  </div>
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

              {/* Populaire Forum Artikelen (SSR + ISR) - MOVED UP for SEO (featured content first) */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="populaire-forum-artikelen">
                <h2 id="populaire-forum-artikelen" className="sr-only">
                  Nieuws en Forum Artikelen
                </h2>
                <button
                  onClick={() => toggleCategory("forum-artikelen")}
                  aria-label={expandedCategories.includes("forum-artikelen") ? "Sluit forum artikelen" : "Open forum artikelen"}
                  aria-expanded={expandedCategories.includes("forum-artikelen")}
                  aria-controls="forum-artikelen-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
                    Nieuws en Forum Artikelen
                  </span>
                  {expandedCategories.includes("forum-artikelen") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("forum-artikelen") && (
                  <div id="forum-artikelen-content" className="divide-y divide-slate-200 dark:divide-slate-700">
                    {featuredArticles.length ? (
                      featuredArticles.map((article, index) => {
                        const categoryColors = [
                          "from-blue-500 to-blue-600",
                          "from-green-500 to-green-600",
                          "from-purple-500 to-purple-600",
                          "from-orange-500 to-orange-600",
                          "from-red-500 to-red-600",
                        ];
                        const categoryColor = categoryColors[index % categoryColors.length];

                        return (
                          <article
                            key={article.slug}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <Link
                              className="block p-5"
                              href={`/nieuws/${article.slug}/`}
                              aria-label={`Lees artikel: ${article.title}`}
                            >
                              <div className="flex gap-4">
                                <div
                                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryColor} flex items-center justify-center shadow-lg`}
                                >
                                  <Shield className="h-7 w-7 text-white" aria-hidden="true" focusable="false" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                                      {article.category || "Nieuws"}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                                    {article.title}
                                  </h3>
                                  {article.excerpt && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                      {article.excerpt}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3.5 w-3.5" aria-hidden="true" focusable="false" />
                                      0 reacties
                                    </span>
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                      Lees meer →
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </article>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <p>Geen artikelen gevonden</p>
                      </div>
                    )}

                    <div className="p-5 bg-slate-50 dark:bg-slate-700/30 text-center">
                      <Link
                        className="inline-flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                        href="/nieuws/"
                      >
                        Bekijk alle Artikelen
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" aria-hidden="true" focusable="false" />
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              {/* Why Join Section - Collapsible */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="waarom-lid-worden">
                <h2 id="waarom-lid-worden" className="sr-only">
                  Waarom Lid Worden van Politie Forum Nederland?
                </h2>
                <button
                  onClick={() => toggleCategory("waarom-lid-worden")}
                  aria-label={expandedCategories.includes("waarom-lid-worden") ? "Sluit waarom lid worden" : "Open waarom lid worden"}
                  aria-expanded={expandedCategories.includes("waarom-lid-worden")}
                  aria-controls="waarom-lid-worden-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
                    Waarom Lid Worden van Politie Forum Nederland?
                  </span>
                  {expandedCategories.includes("waarom-lid-worden") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("waarom-lid-worden") && (
                  <div id="waarom-lid-worden-content" className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Expertise & Kennis</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              Toegang tot een community van politieprofessionals, oud-agenten, criminologen en veiligheidsexperts. Leer van échte ervaringen en vakkennis uit het veld.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600 dark:bg-red-500 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Actueel Nieuws</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              Dagelijks de laatste updates over politieacties, criminaliteit, rechtszaken en veiligheid. Wees sneller op de hoogte dan via reguliere media met onze live updates.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Actieve Discussies</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              Duizenden leden bespreken dagelijks politietactieken, rechtsontwikkelingen en veiligheidskwesties. Stel vragen, deel meningen en debatteer constructief.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Interactieve Crime Map</h3>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              Visualiseer misdaadgegevens uit heel Nederland op onze interactieve kaart. Bekijk trends, hotspots en regionale analyses - uniek in Nederland voor een politie forum.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-5 text-white">
                      <h3 className="font-bold text-lg mb-2">Voor Professionals & Geïnteresseerden</h3>
                      <p className="text-sm opacity-95 leading-relaxed">
                        Of je nu werkt bij de politie, studeert voor een carrière in veiligheid, journalist bent die dieper wil graven, of gewoon passie hebt voor criminaliteit en justitie - <strong>Politie Forum Nederland</strong> is jouw platform. Samen bouwen we aan een kennisbank over de Nederlandse politie die nergens anders te vinden is.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* DigestPaper Network Section - Collapsible */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="digestpaper-network">
                <h2 id="digestpaper-network" className="sr-only">
                  DigestPaper Publisher Network
                </h2>
                <button
                  onClick={() => toggleCategory("digestpaper-network")}
                  aria-label={expandedCategories.includes("digestpaper-network") ? "Sluit DigestPaper netwerk" : "Open DigestPaper netwerk"}
                  aria-expanded={expandedCategories.includes("digestpaper-network")}
                  aria-controls="digestpaper-network-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <picture>
                      <source srcSet="/politie-future-64.webp" type="image/webp" />
                      <img
                        src="/politie-future-64.png"
                        alt="Toekomst politie technologie - AI-gedreven politie nieuws en digitale veiligheid"
                        title="DigestPaper Publisher Network - Toekomst Politie"
                        className="w-12 h-12 rounded-full object-cover hidden sm:block"
                        loading="lazy"
                        width={64}
                        height={64}
                        decoding="async"
                      />
                    </picture>
                    <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
                      DigestPaper Publisher Network
                    </span>
                  </span>
                  {expandedCategories.includes("digestpaper-network") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("digestpaper-network") && (
                  <div id="digestpaper-network-content" className="p-6">
                                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Publicaties van nieuws en diepgaande onderzoeken. Elk platform met eigen focus en doelgroep.
                  </p>

                    <div className="space-y-3">{/* Single column layout */}
                  {/* Politie-Forum.nl */}
                  <a
                    href="https://politie-forum.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Politie-Forum.nl
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Forum & Nieuws over Politie en Veiligheid
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Interactief forum voor politie-nieuws, misdaad en veiligheid. Lees analyses en discussieer mee.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Politie-NL.nl */}
                  <a
                    href="https://politie-nl.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          Politie-NL.nl
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Onafhankelijk Nieuws over Politie & Justitie
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Onafhankelijke nieuwssite met focus op politie, justitie en opsporing. Dagelijks updates en analyses.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* OnderzoekPortaal.nl */}
                  <a
                    href="https://onderzoekportaal.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                        <Search className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          OnderzoekPortaal.nl
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Investigative Journalism & Data Analysis
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Platform voor diepgaande onderzoeksjournalistiek en data-analyse. Transparante dossiers en feitenonderzoek.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* OnderzoekPlatform.nl */}
                  <a
                    href="https://onderzoekplatform.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Scale className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          OnderzoekPlatform.nl
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Data Dossiers & Methodologies
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Uitgebreid platform met onderzoeksmethoden, datadossiers en achtergrondartikelen voor professionals.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Cybersecurity-AI.eu */}
                  <a
                    href="https://cybersecurity-ai.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Cpu className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Cybersecurity-AI.eu
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Europees Platform voor Cybersecurity & AI
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Nieuws en analyses over cybersecurity, AI en digitale veiligheid. Europees platform met focus op onderzoek.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* DigestPaper.com */}
                  <a
                    href="https://digestpaper.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                          DigestPaper.com
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Internationaal Journalistiek Platform
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Global news and analysis. Independent journalism with focus on transparency and international reporting.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* HeadlinesMagazine.com */}
                  <a
                    href="https://headlinesmagazine.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                        <Coffee className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          HeadlinesMagazine.com
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Digitale Long-Reads & Achtergronden
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Online magazine met diepgaande long-reads, verhalen en achtergrondartikelen over maatschappelijke thema's.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* HetNieuws.app */}
                  <a
                    href="https://hetnieuws.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          HetNieuws.app
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Mobiele Nieuwsapp met Real-Time Alerts
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Nieuwsapp met push-notificaties, snelle updates en real-time alerts. Altijd actueel nieuws op je telefoon.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* CyberSecurityAD.com */}
                  <a
                    href="https://cybersecurityad.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          CyberSecurityAD.com
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          Cybersecurity Nieuws & Analyse
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Platform voor cybersecurity, digitale veiligheid en AI. Actuele analyses over cyberdreigingen en technologie.
                        </p>
                      </div>
                    </div>
                  </a>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 px-6 pb-6">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    <strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer nofollow" className="text-blue-600 dark:text-blue-400 hover:underline">DigestPaper.com</a> | @ <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer nofollow" className="text-blue-600 dark:text-blue-400 hover:underline">P. Oldenburger</a>
                  </p>
                </div>
              </div>
            )}
              </section>

              {/* Helpful Resources Section - Phase 3 Long-Tail Keywords - Collapsible */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden mb-8" aria-labelledby="hulpbronnen">
                <h2 id="hulpbronnen" className="sr-only">
                  Populaire Hulpbronnen
                </h2>
                <button
                  onClick={() => toggleCategory("hulpbronnen")}
                  aria-label={expandedCategories.includes("hulpbronnen") ? "Sluit populaire hulpbronnen" : "Open populaire hulpbronnen"}
                  aria-expanded={expandedCategories.includes("hulpbronnen")}
                  aria-controls="hulpbronnen-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <picture>
                      <source srcSet="/politie-man-1-64.webp" type="image/webp" />
                      <img
                        src="/politie-man-1-64.png"
                        alt="Nederlandse politieagent - Professionele politie forum begeleiding voor sollicitatie en assessment"
                        title="Politie Forum Begeleiding - Sollicitatie &amp; Assessment"
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 hidden sm:block"
                        loading="lazy"
                        width={64}
                        height={64}
                        decoding="async"
                      />
                    </picture>
                    <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
                      Populaire Hulpbronnen
                    </span>
                  </span>
                  {expandedCategories.includes("hulpbronnen") ? (
                    <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" focusable="false" />
                  )}
                </button>

                {expandedCategories.includes("hulpbronnen") && (
                  <div id="hulpbronnen-content" className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                      De meest gezochte informatie op ons politie nieuws forum. Van politie sollicitatie tips tot assessment voorbereiding.
                    </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sollicitatie Resources */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Politie Sollicitatie Tips</h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            Uitgebreide politie sollicitatie gids met ervaringen van honderden geslaagde kandidaten. Van motivatiebrief tot sollicitatiegesprek.
                          </p>
                          <a href="/categorie/werving-sollicitatie" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                            Bekijk politie sollicitatie forum →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Resources */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Politie Assessment Voorbereiding</h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            Alles over het politie assessment: oefenvragen, tijdlijnen en succestips. Recente ervaringen en scores van kandidaten.
                          </p>
                          <a href="/categorie/werving-sollicitatie" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                            Lees politie assessment ervaringen →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* News Forum Resources */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-2">Politie Nieuws Forum</h3>
                          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            Dagelijks het laatste politie nieuws met reacties en analyses. Bespreek actuele zaken in ons politie nieuws forum.
                          </p>
                          <a href="/nieuws" className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
                            Naar politie nieuws forum →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional helpful links */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">Meest Gelezen Onderwerpen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a href="/categorie/werving-sollicitatie" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        Hoe bereid ik me voor op politie sollicitatie?
                      </a>
                      <a href="/categorie/werving-sollicitatie" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        Wat verwachten bij het politie assessment?
                      </a>
                      <a href="/nieuws" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        Laatste politie nieuws en updates
                      </a>
                      <a href="/categorie/criminaliteit-opsporing" className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        Actuele criminaliteit discussies
                      </a>
                    </div>
                  </div>
                </div>
              )}
              </section>

              {/* Forum Categorieën */}
              <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden" aria-labelledby="forum-categorieen">
                <h2 id="forum-categorieen" className="sr-only">
                  Forum Categorieën
                </h2>
                <button
                  onClick={() => toggleCategory("algemene-categorieen")}
                  aria-label={expandedCategories.includes("algemene-categorieen") ? "Sluit categorieën" : "Open categorieën"}
                  aria-expanded={expandedCategories.includes("algemene-categorieen")}
                  aria-controls="algemene-categorieen-content"
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 hover:from-slate-200 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                >
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-400">
                    Forum Categorieën
                  </span>
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
            </section>

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
                          title={(currentUser as any).nickname || currentUser.displayName || "User Profile"}
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
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-2">
                      <Phone className="h-5 w-5" aria-hidden="true" focusable="false" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-90">WhatsApp</div>
                      <a href="https://wa.me/31648319167" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                        +31648319167
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
                <div className="bg-red-800/40 rounded-lg p-3 text-xs border border-red-500/30">
                  <p className="font-semibold mb-1">⚠️ Privacy-opmerking:</p>
                  <p className="opacity-90">WhatsApp gebruikt end-to-end encryptie, maar uw telefoonnummer is zichtbaar voor ons. Voor volledige anonimiteit raden wij aan: Signal (anonieme registratie), ProtonMail (versleuteld zonder telefoon), of Tor + anonieme email.</p>
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

        {/* Footer - Full Width */}
        <footer className="bg-[#0a1628] text-white mt-12 border-t-4 border-red-600" aria-labelledby="site-footer">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" itemScope itemType="https://schema.org/SiteNavigationElement">
              {/* Column 1: Politie Forum Nederland */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Politie Forum Nederland</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Het grootste Nederlandse forum over politie, veiligheid en justitie.
                </p>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Quick Links</h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/nieuws" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Nieuws</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/categorieen" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Categorieën</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/crime-map-nederland" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Crime Map</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">FAQ</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/leden" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Leden</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Informatie */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Informatie</h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/over" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Over ons</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/redactie" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Redactie</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Privacy</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/voorwaarden" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Voorwaarden</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" rel="nofollow" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Cookies</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" rel="nofollow" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Disclaimer</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/toegankelijkheid" rel="nofollow" itemProp="url" className="text-slate-400 hover:text-white transition-colors">
                      <span itemProp="name">Toegankelijkheid</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact - microdata removed, already in JSON-LD */}
              <div>
                <h3 className="font-bold text-white mb-4 text-lg">Contact</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-slate-400">
                    <a href="mailto:jedi@xcom.dev" rel="nofollow" className="hover:text-white transition-colors">
                      jedi@xcom.dev
                    </a>
                    {" - "}
                    <a href="mailto:info@politie-forum.nl" rel="nofollow" className="hover:text-white transition-colors">
                      info@politie-forum.nl
                    </a>
                  </p>
                  <p className="text-slate-400">
                    <a href="tel:+31648319167" rel="nofollow" className="hover:text-white transition-colors">
                      +31 6 48319167
                    </a>
                  </p>
                  <p className="text-slate-400 text-xs flex items-start gap-1">
                    <span className="text-blue-400">💡</span>
                    <span>WhatsApp Tip Lijn - Anonieme tips welkom</span>
                  </p>

                  <div className="pt-2">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Sint Olofssteeg 4<br></br>
                      1012AK Amsterdam<br></br>
                      Netherlands
                    </p>
                  </div>

                  <div className="pt-3 flex gap-3">
                    <a
                      href="https://x.com/politieforum"
                      target="_blank"
                      rel="me noopener nofollow noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a
                      href="https://facebook.com/politieforum"
                      target="_blank"
                      rel="me noopener nofollow noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a
                      href="https://instagram.com/politieforum"
                      target="_blank"
                      rel="me noopener nofollow noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-slate-700 mt-8 pt-6">
              <div className="text-center text-sm text-slate-400">
                <p className="mb-2">
                  © {new Date().getFullYear()} Politie Forum Nederland. Alle rechten voorbehouden.
                </p>
                <p className="text-xs">
                  Publisher: <a href="https://digestpaper.com" target="_blank" rel="noopener nofollow noreferrer" className="hover:text-white transition-colors">DigestPaper.com</a> | @ <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">P. Oldenburger</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}


