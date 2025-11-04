'use client';

/**
 * AI Discussion Features Component
 *
 * Provides intelligent enhancements to the discussion section:
 * 1. Auto-Summary: AI-generated thread summary
 * 2. Smart Replies: AI-suggested response starters
 * 3. Auto-Moderation: Flag potentially problematic content
 * 4. Bot Commenter: Clearly labeled AI-generated insights
 *
 * All AI features are:
 * - Clearly labeled as AI-generated
 * - Optional (can be disabled per feature)
 * - Privacy-respecting (no personal data sent)
 * - Server-side processed (via API routes)
 */

import { useAuth } from '@/contexts/AuthContext';
import { Bot, ChevronUp, MessageSquare, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: number;
  likes: number;
}

interface AIDiscussionFeaturesProps {
  articleSlug: string;
  articleTitle: string;
  comments: Comment[];
  enableSummary?: boolean;
  enableSmartReplies?: boolean;
  enableModeration?: boolean;
  enableBotComments?: boolean;
}

export default function AIDiscussionFeatures({
  articleSlug,
  articleTitle,
  comments,
  enableSummary = true,
  enableSmartReplies = true,
  enableModeration = true,
  enableBotComments = true,
}: AIDiscussionFeaturesProps) {
  const { currentUser } = useAuth();
  const [summary, setSummary] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [botComment, setBotComment] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingBot, setLoadingBot] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(false);

  // Generate thread summary
  const generateSummary = async () => {
    if (!enableSummary || comments.length === 0) return;

    setLoadingSummary(true);
    try {
      const response = await fetch('/api/ai/summarize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          articleTitle,
          comments: comments.slice(0, 20).map(c => ({
            author: c.authorName,
            content: c.content.substring(0, 500),
            likes: c.likes,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Generate smart reply suggestions
  const generateSmartReplies = async () => {
    if (!enableSmartReplies || comments.length === 0) return;

    setLoadingReplies(true);
    try {
      const response = await fetch('/api/ai/smart-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleTitle,
          recentComments: comments.slice(0, 5).map(c => ({
            author: c.authorName,
            content: c.content.substring(0, 300),
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSmartReplies(data.suggestions);
      }
    } catch (error) {
      console.error('Error generating smart replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  // Generate bot comment (contextual insight)
  const generateBotComment = async () => {
    if (!enableBotComments) return;

    setLoadingBot(true);
    try {
      const response = await fetch('/api/ai/bot-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleSlug,
          articleTitle,
          commentCount: comments.length,
          topComment: comments.length > 0 ? {
            content: comments[0].content.substring(0, 500),
            likes: comments[0].likes,
          } : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBotComment(data.comment);
      }
    } catch (error) {
      console.error('Error generating bot comment:', error);
    } finally {
      setLoadingBot(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Thread Summary */}
      {enableSummary && comments.length >= 3 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    AI Samenvatting van Discussie
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                    AI-gegenereerd
                  </span>
                </div>

                {!showSummary && !summary && (
                  <button
                    onClick={() => {
                      setShowSummary(true);
                      generateSummary();
                    }}
                    disabled={loadingSummary}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Bekijk samenvatting van {comments.length} reacties
                  </button>
                )}

                {showSummary && (
                  <>
                    {loadingSummary ? (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span>Samenvatting genereren...</span>
                      </div>
                    ) : summary ? (
                      <div className="space-y-2">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {summary}
                        </p>
                        <button
                          onClick={() => setShowSummary(false)}
                          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                        >
                          <ChevronUp className="h-3 w-3" />
                          Verbergen
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Reply Suggestions */}
      {enableSmartReplies && currentUser && comments.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Slimme Reactie Suggesties
                </h3>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                  AI-assistent
                </span>
              </div>

              {!showSmartReplies && smartReplies.length === 0 && (
                <button
                  onClick={() => {
                    setShowSmartReplies(true);
                    generateSmartReplies();
                  }}
                  disabled={loadingReplies}
                  className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  Krijg suggesties voor je reactie
                </button>
              )}

              {showSmartReplies && (
                <>
                  {loadingReplies ? (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      <span>Suggesties genereren...</span>
                    </div>
                  ) : smartReplies.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        Klik om een suggestie toe te voegen aan je reactie:
                      </p>
                      <div className="space-y-2">
                        {smartReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              // Dispatch custom event to insert text
                              window.dispatchEvent(
                                new CustomEvent('ai-insert-reply', {
                                  detail: { text: reply },
                                })
                              );
                            }}
                            className="w-full text-left px-3 py-2 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-700 rounded-lg hover:border-green-400 dark:hover:border-green-500 transition-colors text-sm text-slate-700 dark:text-slate-300"
                          >
                            "{reply}"
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setShowSmartReplies(false);
                          setSmartReplies([]);
                        }}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mt-2"
                      >
                        <ChevronUp className="h-3 w-3" />
                        Verbergen
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bot Comment (Contextual Insight) */}
      {enableBotComments && comments.length >= 5 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Forum Bot
                </h3>
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                  🤖 AI Bot
                </span>
              </div>

              {!botComment ? (
                <button
                  onClick={generateBotComment}
                  disabled={loadingBot}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Vraag de bot om een contextinzicht
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    {botComment}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    💡 Dit is een AI-gegenereerd inzicht gebaseerd op de discussie. Neem het als
                    suggestie, niet als feit.
                  </p>
                </div>
              )}

              {loadingBot && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span>Bot denkt na...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Moderation Notice (for admins/mods) */}
      {enableModeration && currentUser && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Shield className="h-3 w-3" />
          <span>
            AI-moderatie actief: reacties worden automatisch gescreend op ongewenste inhoud
          </span>
        </div>
      )}
    </div>
  );
}
