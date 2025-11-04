"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publishDate: string;
  imageUrl?: string;
}

interface TagClientProps {
  tag: {
    name: string;
    description: string;
  };
  slug: string;
}

export default function TagClient({ tag, slug }: TagClientProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch articles from Firebase filtered by tag
    // For now, show placeholder
    setLoading(false);
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tag Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TagIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-primary-600">
              #{tag.name}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            {tag.description}
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/nieuws" className="hover:text-primary-600">
            Nieuws
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Tag: {tag.name}</span>
        </nav>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Artikelen laden...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <TagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Geen artikelen gevonden
            </h2>
            <p className="text-gray-600 mb-6">
              Er zijn nog geen artikelen met de tag <strong>#{tag.name}</strong>.
            </p>
            <Link
              href="/nieuws"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Bekijk alle artikelen
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/nieuws/${article.slug}`}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {article.imageUrl && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs font-semibold text-primary-600 uppercase">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishDate).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Popular Tags */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <TagIcon className="h-6 w-6 text-primary-600 mr-2" />
            Populaire Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            {['actueel', 'nederland', 'nieuws', 'politie', 'veiligheid', 'criminaliteit', 'opsporing', 'rechtspraak', 'cybercrime', 'verkeer'].map((tagSlug) => (
              <Link
                key={tagSlug}
                href={`/tag/${tagSlug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  tagSlug === slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                }`}
              >
                #{tagSlug}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
