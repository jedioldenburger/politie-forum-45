// src/lib/firebase.ts

import type { Article, CommentData, FirebaseArticle } from "@/types/article";
import type { FirebaseApp } from "firebase/app";
import { getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence, type Auth } from "firebase/auth";
import {
    equalTo,
    get,
    getDatabase,
    limitToLast,
    orderByChild,
    query,
    ref,
    type Database,
} from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// -----------------------------------------------------------------------------
// 🔹 Client-safe Firebase configuration
// -----------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// -----------------------------------------------------------------------------
// 🧠 Lazy Initialize Firebase - only when needed
// -----------------------------------------------------------------------------
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let database: Database | undefined;
let storage: FirebaseStorage | undefined;

function initFirebase() {
  if (typeof window === "undefined" || !firebaseConfig.apiKey) return;

  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }

  if (!auth && app) {
    auth = getAuth(app);
    // Set Firebase Auth to use local persistence
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Firebase Auth persistence error:", error);
    });
  }

  if (!database && app) {
    database = getDatabase(app);
    // Force WebSocket connection
    // @ts-ignore - Firebase internal API
    (database as any)['INTERNAL']?.forceWebSockets?.();
  }

  if (!storage && app) {
    storage = getStorage(app);
  }
}

// Lazy getters - only initialize when accessed
function getAuthInstance(): Auth {
  if (!auth) initFirebase();
  if (!auth) throw new Error("Firebase auth not initialized");
  return auth;
}

function getDatabaseInstance(): Database {
  if (!database) initFirebase();
  if (!database) throw new Error("Firebase database not initialized");
  return database;
}

function getStorageInstance(): FirebaseStorage {
  if (!storage) initFirebase();
  if (!storage) throw new Error("Firebase storage not initialized");
  return storage;
}

// Export getters instead of direct instances
export { getAuthInstance as auth, getDatabaseInstance as database, getStorageInstance as storage };
export default app;

// -----------------------------------------------------------------------------
// � Public Data Access Helpers (read-only Firebase operations)
// -----------------------------------------------------------------------------

export async function getFirebaseCommentCount(slug: string): Promise<number> {
  const db = getDatabaseInstance();
  if (!db) return 0;
  try {
    const commentsRef = ref(db, "comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("articleSlug"),
      equalTo(slug)
    );
    const snapshot = await get(commentsQuery);
    return snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
  } catch (error) {
    console.error(`Error fetching comment count for "${slug}":`, error);
    return 0;
  }
}

export async function getComments(
  slug: string,
  parentId?: string | null
): Promise<CommentData[]> {
  const db = getDatabaseInstance();
  if (!db) return [];
  try {
    const commentsRef = ref(db, "comments");
    const commentsQuery = query(
      commentsRef,
      orderByChild("articleSlug"),
      equalTo(slug)
    );
    const snapshot = await get(commentsQuery);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    const allComments: CommentData[] = Object.entries(data).map(
      ([id, val]: [string, any]) => ({
        id,
        ...val,
      })
    );
    return parentId
      ? allComments.filter((c) => c.parentId === parentId)
      : allComments;
  } catch (error) {
    console.error(`Error fetching comments for "${slug}":`, error);
    return [];
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  const db = getDatabaseInstance();
  if (!db) return null;
  try {
    const articleRef = ref(db, `news/${slug}`);
    const snapshot = await get(articleRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.val() as FirebaseArticle;
    return {
      slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || data.content?.substring(0, 160),
      image: data.imageUrl,
      author: data.author || "Politie Forum Redactie",
      category: data.category || "Nieuws",
      tags: data.tags || [],
      sourceUrl: data.sourceUrl,
      source: data.source,
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      datePublished: new Date(data.publishedAt).toISOString(),
      dateModified: new Date(
        data.updatedAt || data.publishedAt
      ).toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching article "${slug}":`, error);
    return null;
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const db = getDatabaseInstance();
  if (!db) return [];
  try {
    const newsRef = ref(db, "news");
    const snapshot = await get(newsRef);
    return snapshot.exists() ? Object.keys(snapshot.val()) : [];
  } catch (error) {
    console.error("Error fetching article slugs:", error);
    return [];
  }
}

export async function getAllArticles(limit?: number): Promise<Article[]> {
  const db = getDatabaseInstance();
  if (!db) return [];
  try {
    const newsRef = ref(db, "news");
    const newsQuery = limit ? query(newsRef, limitToLast(limit)) : newsRef;
    const snapshot = await get(newsQuery);
    if (!snapshot.exists()) return [];
    const newsData = snapshot.val();
    const articles = Object.entries(newsData).map(([slug, data]: [string, any]) => {
      const a = data as FirebaseArticle;
      return {
        slug,
        title: a.title,
        content: a.content,
        excerpt: a.excerpt || a.content?.substring(0, 160),
        image: a.imageUrl,
        author: a.author || "Politie Forum Redactie",
        category: a.category || "Nieuws",
        tags: a.tags || [],
        sourceUrl: a.sourceUrl,
        source: a.source,
        publishedAt: a.publishedAt,
        updatedAt: a.updatedAt,
        datePublished: new Date(a.publishedAt).toISOString(),
        dateModified: new Date(
          a.updatedAt || a.publishedAt
        ).toISOString(),
      } as Article;
    });
    return articles.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  } catch (error) {
    console.error("Error fetching all articles:", error);
    return [];
  }
}
