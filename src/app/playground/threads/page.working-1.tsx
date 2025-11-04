"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import {
    ArrowLeft,
    Code,
    Copy,
    Database,
    Download,
    MessageSquare,
    RefreshCw,
    ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy?: { [uid: string]: boolean };
  parentCommentId?: string;
  replies?: Comment[]; // Nested replies
}

const PLAYGROUND_ARTICLE_SLUG = "playground-threaded-demo";

export default function ThreadsPlayground() {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [useLiveData, setUseLiveData] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load comments from Firebase or use sample data
  useEffect(() => {
    if (useLiveData) {
      loadCommentsFromFirebase();
    } else {
      loadSampleData();
    }
  }, [useLiveData]);

  async function loadCommentsFromFirebase() {
    try {
      setLoading(true);
      const { ref, get, query, orderByChild } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        console.warn("Firebase not initialized, using sample data");
        loadSampleData();
        return;
      }

      const commentsRef = ref(database, "comments");
      const commentsQuery = query(commentsRef, orderByChild("articleSlug"));
      const snapshot = await get(commentsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const allComments = Object.keys(data)
          .filter((key) => data[key].articleSlug === PLAYGROUND_ARTICLE_SLUG)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a: any, b: any) => a.createdAt - b.createdAt);

        // Build nested structure
        const nested = buildNestedComments(allComments);
        setComments(nested);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  }

  function loadSampleData() {
    const sampleComments: Comment[] = [
      {
        id: "sample1",
        authorId: "user1",
        authorName: "Jedi Xcom",
        authorPhotoURL:
          "https://lh3.googleusercontent.com/a/ACg8ocLjCLqEzVw2hCUqsLgZR5f3F0miP1MB3LXYPKucExn7LAbngpfA=s96-c",
        content: "Dit is een top-level comment met nested replies (SAMPLE DATA)",
        createdAt: Date.now() - 1000 * 60 * 15,
        likes: 3,
        replies: [
          {
            id: "sample2",
            authorId: "user2",
            authorName: "Agent Smith",
            content: "Eerste nested reply - diepte niveau 1",
            createdAt: Date.now() - 1000 * 60 * 10,
            likes: 1,
            parentCommentId: "sample1",
            replies: [
              {
                id: "sample3",
                authorId: "user1",
                authorName: "Jedi Xcom",
                content: "Nested reply op niveau 2 - kan oneindig diep!",
                createdAt: Date.now() - 1000 * 60 * 5,
                likes: 2,
                parentCommentId: "sample2",
              },
            ],
          },
          {
            id: "sample4",
            authorId: "user3",
            authorName: "Moderator",
            content: "Nog een reply op niveau 1",
            createdAt: Date.now() - 1000 * 60 * 3,
            likes: 0,
            parentCommentId: "sample1",
          },
        ],
      },
      {
        id: "sample5",
        authorId: "user2",
        authorName: "Agent Smith",
        content: "Tweede top-level comment zonder replies (SAMPLE DATA)",
        createdAt: Date.now() - 1000 * 60 * 20,
        likes: 1,
      },
    ];

    setComments(sampleComments);
    setLoading(false);
  }

  function buildNestedComments(flatComments: any[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create all comment objects
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build the tree
    flatComments.forEach((comment) => {
      const commentObj = commentMap.get(comment.id)!;
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentObj);
        } else {
          rootComments.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const { ref, push, set } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        alert("Firebase not initialized");
        return;
      }

      const commentsRef = ref(database, "comments");
      const newCommentRef = push(commentsRef);

      await set(newCommentRef, {
        articleSlug: PLAYGROUND_ARTICLE_SLUG,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || "Anonymous",
        authorPhotoURL: currentUser.photoURL || "",
        content: newComment,
        createdAt: Date.now(),
        likes: 0,
        likedBy: {},
      });

      setNewComment("");
      loadCommentsFromFirebase();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Error creating comment: " + error);
    }
  }

  async function handleSubmitReply(parentId: string) {
    if (!replyText.trim() || !currentUser) return;

    try {
      const { ref, push, set } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        alert("Firebase not initialized");
        return;
      }

      const commentsRef = ref(database, "comments");
      const newReplyRef = push(commentsRef);

      await set(newReplyRef, {
        articleSlug: PLAYGROUND_ARTICLE_SLUG,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email || "Anonymous",
        authorPhotoURL: currentUser.photoURL || "",
        content: replyText,
        createdAt: Date.now(),
        likes: 0,
        likedBy: {},
        parentCommentId: parentId,
      });

      setReplyText("");
      setReplyingTo(null);
      loadCommentsFromFirebase();
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Error creating reply: " + error);
    }
  }

  async function handleLikeComment(commentId: string) {
    if (!currentUser) {
      alert("Je moet ingelogd zijn om te liken");
      return;
    }

    try {
      const { ref, get, update } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) return;

      const commentRef = ref(database, `comments/${commentId}`);
      const snapshot = await get(commentRef);

      if (snapshot.exists()) {
        const comment = snapshot.val();
        const likedBy = comment.likedBy || {};
        const hasLiked = likedBy[currentUser.uid];

        if (hasLiked) {
          // Unlike
          delete likedBy[currentUser.uid];
          await update(commentRef, {
            likes: Math.max(0, (comment.likes || 0) - 1),
            likedBy,
          });
        } else {
          // Like
          likedBy[currentUser.uid] = true;
          await update(commentRef, {
            likes: (comment.likes || 0) + 1,
            likedBy,
          });
        }

        loadCommentsFromFirebase();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  }

  // Render a single comment and its nested replies
  const renderComment = (comment: Comment, depth: number = 0) => {
    const isNested = depth > 0;
    const avatarSize = isNested ? "h-8 w-8" : "h-10 w-10";
    const textSize = isNested ? "text-sm" : "text-base";
    const isLiked = comment.likedBy?.[currentUser?.uid || ""];

    return (
      <div key={comment.id} className="space-y-3">
        {/* Comment Card */}
        <div
          className={`bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 ${
            isNested ? "text-sm" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                alt={comment.authorName}
                className={`${avatarSize} rounded-full object-cover`}
                src={
                  comment.authorPhotoURL ||
                  "https://ui-avatars.com/api/?name=" + comment.authorName
                }
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span
                  className={`font-semibold text-slate-900 dark:text-white ${
                    isNested ? "text-sm" : ""
                  }`}
                >
                  {comment.authorName}
                </span>
                {comment.authorId === currentUser?.uid && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 ${
                      isNested ? "text-[10px]" : "text-xs"
                    }`}
                    title="Jij"
                  >
                    <span>👤</span>
                    <span>Jij</span>
                  </span>
                )}
                <span
                  className={`text-slate-500 dark:text-slate-400 ${
                    isNested ? "text-xs" : "text-sm"
                  }`}
                >
                  {formatDistanceToNow(comment.createdAt, {
                    addSuffix: true,
                    locale: nl,
                  })}
                </span>
              </div>

              {/* Content */}
              <p
                className={`text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words mb-3 ${textSize}`}
              >
                {comment.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={!currentUser}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    isNested ? "text-xs" : "text-sm"
                  } ${
                    isLiked
                      ? "text-accent-600 dark:text-accent-400"
                      : "text-slate-500 hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ThumbsUp
                    className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  {comment.likes || 0}
                </button>
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id
                    )
                  }
                  disabled={!currentUser}
                  className={`inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors ${
                    isNested ? "text-xs" : "text-sm"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <MessageSquare className={isNested ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  Reageren
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && currentUser && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder={`Reageer op ${comment.authorName}...`}
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Plaats reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Annuleren
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-12 space-y-3 border-l-2 border-primary-200 dark:border-primary-800 pl-4">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const exportHTML = () => {
    const html = document.querySelector(".comments-container")?.outerHTML || "";
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "threaded-comments.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHTML = () => {
    const html = document.querySelector(".comments-container")?.outerHTML || "";
    navigator.clipboard.writeText(html);
    alert("HTML copied to clipboard!");
  };

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
        <Link href="/playground" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold mb-4">
          <ArrowLeft className="h-4 w-4" />
          Terug naar Playground
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          🧵 Threaded Replies Demo
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Test onbeperkt geneste comments met visuele hiërarchie
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Code className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span className="font-semibold text-slate-900 dark:text-white">Controls & Export</span>
          </div>
          <div className="flex gap-2">
            <button onClick={copyHTML} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-semibold text-sm transition-colors">
              <Copy className="h-4 w-4" />
              Copy HTML
            </button>
            <button onClick={exportHTML} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm transition-colors">
              <Download className="h-4 w-4" />
              Download HTML
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Data Source:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setUseLiveData(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${useLiveData ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
            >
              🔴 Live Firebase
            </button>
            <button
              onClick={() => setUseLiveData(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!useLiveData ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
            >
              📋 Sample Data
            </button>
          </div>
          <button
            onClick={() => useLiveData ? loadCommentsFromFirebase() : loadSampleData()}
            className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="comments-container bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          Reacties
          <span className="text-base font-normal text-slate-500 dark:text-slate-400">({comments.length})</span>
        </h3>

        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <label htmlFor="commentText" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Plaats een reactie
              </label>
              <textarea
                id="commentText"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                required
                placeholder="Deel je mening..."
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="h-5 w-5" />
              Plaats reactie
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Je moet ingelogd zijn om reacties te plaatsen. Klik op "Inloggen" in de header.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">Laden...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400 mb-2">Nog geen reacties</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {useLiveData ? "Plaats de eerste reactie!" : "Schakel naar Live Firebase om reacties te plaatsen"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">💡 Implementation Notes</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• <strong>Onbeperkte diepte</strong>: Recursieve rendering van nested replies</li>
          <li>• <strong>Visuele hiërarchie</strong>: Kleinere avatars/text bij diepere nesting</li>
          <li>• <strong>Firebase structuur</strong>: Gebruik <code>parentCommentId</code> field</li>
          <li>• <strong>Performance</strong>: Overweeg virtualisatie bij &gt;100 comments</li>
        </ul>
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
