'use client';

import AuthModal from "@/components/AuthModal";
import CommentThread from "@/components/CommentThread";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ArrowRight, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";

// Loading skeleton for CommentThread
function CommentThreadSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
      <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </div>
  );
}

interface ForumDiscussionClientProps {
  article: {
    title: string;
    excerpt?: string;
    summary?: string; // Pre-generated 300-word summary from server
    publishedAt: any;
    author?: string;
    category?: string;
  };
  slug: string;
  newsArticleUrl: string;
  comments: any[];
}

export default function ForumDiscussionClient({
  article,
  slug,
  newsArticleUrl,
  comments,
}: ForumDiscussionClientProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Use pre-generated summary from server (max 300 words)
  const summary = article.summary || article.excerpt || 'Lees het volledige artikel voor meer informatie.';

  // Truncate H1 to ≤70 chars for SEO
  const displayTitle = article.title.length > 70
    ? article.title.slice(0, 67).trim() + '...'
    : article.title;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Discussion Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {displayTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>{article.author || "Politie Forum Redactie"}</span>
                <span>•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString('nl-NL')}</span>
                {article.category && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                      {article.category}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>

          {/* Call-to-Action: Read Full Article */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-6 border-l-4 border-primary-600">
            <div className="flex items-start gap-4">
              <ExternalLink className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Lees het volledige artikel
                </h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Dit is een discussietopic. Het volledige nieuwsartikel met alle details vind je op:
                </p>
                <Link
                  href={newsArticleUrl}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <span>Bekijk volledig artikel</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Section with Advanced CommentThread */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              Discussie
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Wat vind jij van dit nieuws? Reageer hieronder en discussieer mee met de community.
            </p>
          </div>

          <Suspense fallback={<CommentThreadSkeleton />}>
            <CommentThread
              articleSlug={slug}
              articleTitle={article.title}
            />
          </Suspense>
        </div>

        {/* SEO Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-600">
            <Link href={newsArticleUrl} className="hover:underline">
              Canonical artikel: {newsArticleUrl}
            </Link>
          </p>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
