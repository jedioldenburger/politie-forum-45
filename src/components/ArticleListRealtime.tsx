"use client";

import { db } from "@/lib/firebase";
import { Article } from "@/lib/firebaseAdmin";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import { MessageCircle, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  initialArticles: Article[];
  maxArticles?: number;
};

export default function ArticleListRealtime({ initialArticles, maxArticles = 10 }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  useEffect(() => {
    console.log("[ArticleListRealtime] Setting up real-time listener for /news collection");

    // Real-time subscription to Firestore (simplified - no orderBy to avoid index requirement)
    const q = query(
      collection(db, "news"),
      limit(maxArticles)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`[ArticleListRealtime] Received ${snapshot.size} articles from real-time listener`);

        let freshArticles = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            slug: doc.id,
            title: data.title || "Geen titel",
            excerpt: data.excerpt || data.summary || "",
            content: data.content || "",
            image: data.image || "",
            author: data.author || "Politie Forum Redactie",
            category: data.category || "Nieuws",
            tags: data.tags || [],
            sourceUrl: data.sourceUrl,
            source: data.source || "Politie Forum Nederland",
            publishedAt: data.publishedAt?.toMillis ? data.publishedAt.toMillis() : data.publishedAt || Date.now(),
            updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : data.updatedAt,
            datePublished: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : new Date(data.publishedAt || Date.now()).toISOString(),
            dateModified: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt ? new Date(data.updatedAt).toISOString() : undefined,
            featured: data.featured ?? false,
            location: data.location,
            faq: data.faq || [],
          } as Article;
        });

        // Sort client-side by publishedAt (descending)
        freshArticles.sort((a, b) => {
          const timeA = typeof a.publishedAt === 'number' ? a.publishedAt : new Date(a.publishedAt || 0).getTime();
          const timeB = typeof b.publishedAt === 'number' ? b.publishedAt : new Date(b.publishedAt || 0).getTime();
          return timeB - timeA;
        });

        setArticles(freshArticles);
        console.log(`[ArticleListRealtime] Updated state with ${freshArticles.length} articles`);
      },
      (error) => {
        console.error("[ArticleListRealtime] Real-time listener error:", error);
      }
    );

    return () => {
      console.log("[ArticleListRealtime] Cleaning up real-time listener");
      unsubscribe();
    };
  }, [maxArticles]);

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <p>Geen artikelen gevonden</p>
      </div>
    );
  }

  return (
    <div id="forum-artikelen-content" className="divide-y divide-slate-200 dark:divide-slate-700">
      {articles.map((article, index) => {
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
            <Link className="block p-5" href={`/nieuws/${article.slug}/`}>
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryColor} flex items-center justify-center shadow-lg`}
                >
                  <Shield className="h-7 w-7 text-white" aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                      {article.category || "Nieuws"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      0 reacties
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      Bekijk Artikel →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        );
      })}

      {/* View All Link */}
      <div className="p-5 bg-slate-50 dark:bg-slate-700/30 text-center">
        <Link
          className="inline-flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          href="/nieuws/"
        >
          Bekijk alle Artikelen
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 rotate-[-90deg]"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
