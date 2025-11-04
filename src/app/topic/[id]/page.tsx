"use client";

import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, Clock, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Topic {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
}

interface Post {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  likes: number;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (topicId) {
      loadTopic();
      loadPosts();
      updateViews();
    }
  }, [topicId]);

  async function loadTopic() {
    try {
      const { ref, get } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) {
        setError("Database niet beschikbaar");
        setLoading(false);
        return;
      }

      const topicRef = ref(database, `topics/${topicId}`);
      const snapshot = await get(topicRef);

      if (snapshot.exists()) {
        setTopic({ id: topicId, ...snapshot.val() });
      } else {
        setError("Topic niet gevonden");
      }
    } catch (err) {
      console.error("Error loading topic:", err);
      setError("Fout bij laden van topic");
    } finally {
      setLoading(false);
    }
  }

  async function loadPosts() {
    try {
      const { ref, get, query, orderByChild } = await import(
        "firebase/database"
      );
      const { database } = await import("@/lib/firebase");

      if (!database) return;

      const postsRef = ref(database, "posts");
      const postsQuery = query(postsRef, orderByChild("topicId"));
      const snapshot = await get(postsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const topicPosts = Object.entries(data)
          .filter(([_, post]: [string, any]) => post.topicId === topicId)
          .map(([id, post]: [string, any]) => ({ id, ...post }))
          .sort((a: any, b: any) => a.createdAt - b.createdAt);
        setPosts(topicPosts as Post[]);
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  }

  async function updateViews() {
    try {
      const { ref, get, update } = await import("firebase/database");
      const { database } = await import("@/lib/firebase");

      if (!database) return;

      const topicRef = ref(database, `topics/${topicId}`);
      const snapshot = await get(topicRef);

      if (snapshot.exists()) {
        const currentViews = snapshot.val().views || 0;
        await update(topicRef, { views: currentViews + 1 });
      }
    } catch (err) {
      console.error("Error updating views:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Laden...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Link
              href="/forum"
              className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar forum
        </Link>

        {/* Topic Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {topic.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(topic.createdAt, {
                addSuffix: true,
                locale: nl,
              })}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {topic.views} weergaven
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {topic.repliesCount} reacties
            </div>
            <div className="ml-auto">
              door <span className="font-medium">{topic.authorName}</span>
            </div>
          </div>
        </div>

        {/* Topic Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 leading-relaxed" />
                ),
                h1: ({ node, ...props }) => (
                  <h1 {...props} className="text-2xl font-bold mb-4 mt-6" />
                ),
                h2: ({ node, ...props }) => (
                  <h2 {...props} className="text-xl font-bold mb-3 mt-5" />
                ),
                h3: ({ node, ...props }) => (
                  <h3 {...props} className="text-lg font-bold mb-2 mt-4" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc list-inside mb-4" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal list-inside mb-4" />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    {...props}
                    className="border-l-4 border-primary-500 pl-4 italic my-4"
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm"
                  />
                ),
              }}
            >
              {topic.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Replies */}
        {posts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Reacties ({posts.length})
            </h2>
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {post.authorName}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDistanceToNow(post.createdAt, {
                          addSuffix: true,
                          locale: nl,
                        })}
                      </span>
                    </div>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
