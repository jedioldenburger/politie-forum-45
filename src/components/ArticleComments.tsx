'use client';

import { useAuth } from '@/contexts/AuthContext';
import { database as getDatabaseInstance } from '@/lib/firebase';
import { equalTo, get, onValue, orderByChild, push, query, ref, set, update } from 'firebase/database';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Helper to get database instance
const getDb = () => {
  if (typeof window === 'undefined') return null; // SSR guard

  try {
    // Ensure we're calling it as a function
    const dbGetter = getDatabaseInstance;
    if (typeof dbGetter !== 'function') {
      console.error('getDatabaseInstance is not a function, it is:', typeof dbGetter);
      return null;
    }

    const db = dbGetter();

    // Validate it's actually a Database instance
    if (db && typeof db === 'object' && '_checkNotDeleted' in db) {
      return db;
    }

    console.warn('getDatabaseInstance() returned invalid object:', typeof db, db);
    return null;
  } catch (error) {
    console.error('Failed to get database instance:', error);
    return null;
  }
};

interface Comment {
  id: string;
  articleSlug: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy?: string[];
  parentId?: string | null; // For nested replies
}

interface ArticleCommentsProps {
  articleSlug: string;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60_000) return 'Zojuist';
  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000);
    return `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'} geleden`;
  }
  if (diff < 86_400_000) {
    const hours = Math.floor(diff / 3_600_000);
    return `${hours} uur geleden`;
  }
  if (diff < 604_800_000) {
    const days = Math.floor(diff / 86_400_000);
    return `${days} ${days === 1 ? 'dag' : 'dagen'} geleden`;
  }

  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Badge configuration
const BADGE_CONFIG: Record<string, { label: string; emoji: string; className: string }> = {
  firstComment: { label: 'Nieuw lid', emoji: '💬', className: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' },
  communityStar: { label: 'Top Reactie', emoji: '⭐', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' },
  activeMember: { label: 'Actief Lid', emoji: '🔥', className: 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' },
  helpfulContributor: { label: 'Nuttig', emoji: '💡', className: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' },
  earlyAdopter: { label: 'Early Bird', emoji: '🐦', className: 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200' },
};

async function getUserBadges(uid: string): Promise<string[]> {
  const db = getDb();
  if (!db || !uid) return [];
  try {
    const snap = await get(ref(db, `users/${uid}/badges`));
    return snap.exists() ? Object.keys(snap.val()) : [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
}

export async function addBadge(uid: string, badgeKey: string) {
  const db = getDb();
  if (!db) return;
  const badgeRef = ref(db, `users/${uid}/badges/${badgeKey}`);
  await update(badgeRef, { earnedAt: Date.now() });
}

export default function ArticleComments({ articleSlug }: ArticleCommentsProps) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [userBadges, setUserBadges] = useState<{ [uid: string]: string[] }>({});

  useEffect(() => {
    const db = getDb();
    if (!db) {
      console.error('Firebase database not initialized');
      return;
    }

    const commentsQuery = query(
      ref(db, 'comments'),
      orderByChild('articleSlug'),
      equalTo(articleSlug)
    );

    const unsubscribe = onValue(commentsQuery, (snapshot) => {
      const nextComments: Comment[] = [];
      snapshot.forEach((child) => {
        nextComments.push({
          id: child.key || '',
          ...(child.val() as Omit<Comment, 'id'>),
        });
      });

      nextComments.sort((a, b) => b.createdAt - a.createdAt);
      setComments(nextComments);
    });

    return () => unsubscribe();
  }, [articleSlug]);

  // Load badges for all comment authors
  useEffect(() => {
    async function loadBadges() {
      const badgeMap: { [uid: string]: string[] } = {};
      const uniqueUserIds = new Set(comments.map(c => c.authorId).filter(Boolean));

      for (const uid of uniqueUserIds) {
        if (!badgeMap[uid]) {
          badgeMap[uid] = await getUserBadges(uid);
        }
      }

      setUserBadges(badgeMap);
    }

    if (comments.length > 0) {
      loadBadges();
    }
  }, [comments]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const db = getDb();
    if (!db) {
      console.error('Firebase database not initialized');
      return;
    }

    if (!currentUser) {
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      const newCommentRef = push(ref(db, 'comments'));
      await set(newCommentRef, {
        articleSlug,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anoniem',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || '',
        content: trimmed,
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        parentId: null, // Top-level comment
      });

      // Award firstComment badge if this is their first comment
      const userCommentsRef = ref(db, 'comments');
      const userCommentsQuery = query(userCommentsRef, orderByChild('authorId'), equalTo(currentUser.uid));
      const userCommentsSnap = await get(userCommentsQuery);
      const userCommentCount = userCommentsSnap.exists() ? Object.keys(userCommentsSnap.val()).length : 0;

      if (userCommentCount === 1) {
        await addBadge(currentUser.uid, 'firstComment');
      }

      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Er is een fout opgetreden bij het plaatsen van je reactie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    const db = getDb();
    if (!db) {
      console.error('Firebase database not initialized');
      return;
    }

    if (!currentUser) {
      return;
    }

    const trimmed = replyText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      const newCommentRef = push(ref(db, 'comments'));
      await set(newCommentRef, {
        articleSlug,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anoniem',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || '',
        content: trimmed,
        createdAt: Date.now(),
        likes: 0,
        likedBy: [],
        parentId, // Reply to parent comment
      });

      // Award firstComment badge if this is their first comment
      const userCommentsRef = ref(db, 'comments');
      const userCommentsQuery = query(userCommentsRef, orderByChild('authorId'), equalTo(currentUser.uid));
      const userCommentsSnap = await get(userCommentsQuery);
      const userCommentCount = userCommentsSnap.exists() ? Object.keys(userCommentsSnap.val()).length : 0;

      if (userCommentCount === 1) {
        await addBadge(currentUser.uid, 'firstComment');
      }

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Er is een fout opgetreden bij het plaatsen van je antwoord.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!currentUser) {
      alert('Log in om deze reactie te liken.');
      return;
    }

    const db = getDb();
    if (!db) {
      console.error('Firebase database not initialized');
      return;
    }

    try {
      const commentRef = ref(db, `comments/${commentId}`);
      const snapshot = await get(commentRef);

      if (!snapshot.exists()) return;

      const comment = snapshot.val() as Comment;
      const likedBy = comment.likedBy || [];
      const hasLiked = likedBy.includes(currentUser.uid);

      if (hasLiked) {
        // Unlike: remove user and decrement count
        const updatedLikedBy = likedBy.filter(uid => uid !== currentUser.uid);
        await update(commentRef, {
          likes: Math.max(0, (comment.likes || 0) - 1),
          likedBy: updatedLikedBy,
        });
      } else {
        // Like: add user and increment count
        await update(commentRef, {
          likes: (comment.likes || 0) + 1,
          likedBy: [...likedBy, currentUser.uid],
        });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('Er is een fout opgetreden bij het liken van deze reactie.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Reacties
        <span className="text-base font-normal text-slate-500 dark:text-slate-400">
          ({comments.length})
        </span>
      </h2>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="commentText" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Plaats een reactie
            </label>
            <textarea
              id="commentText"
              rows={4}
              required
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Deel je mening..."
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {isSubmitting ? 'Plaatsen...' : 'Plaats reactie'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 via-accent-50 to-primary-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-primary-900/20 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-4 rounded-xl shadow-lg">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Meepraten in de discussie?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Log in om een reactie te plaatsen en mee te discussiëren.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Account aanmaken
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <svg className="h-16 w-16 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium">Nog geen reacties</p>
          <p className="text-sm mt-1">
            Wees de eerste om te reageren op dit artikel!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.filter(c => !c.parentId).map((comment) => {
            const displayName = comment.authorName || comment.authorEmail || 'Anoniem';
            const initial = displayName.charAt(0).toUpperCase();
            const replies = comments.filter(c => c.parentId === comment.id);

            return (
              <div key={comment.id} className="space-y-3">
                {/* Main Comment */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {comment.authorPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={comment.authorPhoto}
                          alt={displayName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                          {initial}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {displayName}
                        </span>

                        {/* User Badges */}
                        {userBadges[comment.authorId]?.map((badgeKey) => {
                          const badge = BADGE_CONFIG[badgeKey];
                          if (!badge) return null;
                          return (
                            <span
                              key={badgeKey}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}
                              title={badge.label}
                            >
                              <span>{badge.emoji}</span>
                              <span>{badge.label}</span>
                            </span>
                          );
                        })}

                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTimestamp(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3">
                        {comment.content}
                      </p>

                      {/* Like and Reply Buttons */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(comment.id)}
                          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                            comment.likedBy?.includes(currentUser?.uid || '')
                              ? 'text-accent-600 dark:text-accent-400'
                              : 'text-slate-500 hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400'
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill={comment.likedBy?.includes(currentUser?.uid || '') ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {comment.likes || 0}
                        </button>

                        {currentUser && (
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {replyingTo === comment.id ? 'Annuleren' : 'Reageren'}
                          </button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && currentUser && (
                        <div className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Schrijf een antwoord..."
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                            >
                              Annuleren
                            </button>
                            <button
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyText.trim() || isSubmitting}
                              className="px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Plaats antwoord
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-12 space-y-3 border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                    {replies.map((reply) => {
                      const replyDisplayName = reply.authorName || reply.authorEmail || 'Anoniem';
                      const replyInitial = replyDisplayName.charAt(0).toUpperCase();

                      return (
                        <div
                          key={reply.id}
                          className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {reply.authorPhoto ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={reply.authorPhoto}
                                  alt={replyDisplayName}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-accent-600 text-white flex items-center justify-center font-semibold text-sm">
                                  {replyInitial}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-1.5 mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                  {replyDisplayName}
                                </span>

                                {/* User Badges for Replies */}
                                {userBadges[reply.authorId]?.map((badgeKey) => {
                                  const badge = BADGE_CONFIG[badgeKey];
                                  if (!badge) return null;
                                  return (
                                    <span
                                      key={badgeKey}
                                      className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${badge.className}`}
                                      title={badge.label}
                                    >
                                      <span>{badge.emoji}</span>
                                      <span>{badge.label}</span>
                                    </span>
                                  );
                                })}

                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTimestamp(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words text-sm mb-2">
                                {reply.content}
                              </p>

                              {/* Like Button for Nested Replies */}
                              <button
                                onClick={() => handleLike(reply.id)}
                                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                  reply.likedBy?.includes(currentUser?.uid || '')
                                    ? 'text-accent-600 dark:text-accent-400'
                                    : 'text-slate-500 hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400'
                                }`}
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill={reply.likedBy?.includes(currentUser?.uid || '') ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                {reply.likes || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
