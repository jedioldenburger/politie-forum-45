// lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

/**
 * 🔥 Initialize Firebase Admin SDK
 * For Vercel: Uses FIREBASE_SERVICE_ACCOUNT_KEY env var (base64 encoded JSON)
 * For local: Uses GOOGLE_APPLICATION_CREDENTIALS (file path to secretkey.json)
 * Automatically connects to local emulators if running in dev mode.
 */
if (!admin.apps.length) {
  try {
    let credential;

    // Vercel/Production: Use individual env vars for Firebase Admin SDK
    if (
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    ) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        universe_domain: "googleapis.com"
      };

      credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
      console.log("✅ Firebase Admin initialized using environment variables (Vercel)");
    }
    // Fallback: Try service account JSON from env var (base64 or raw JSON)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const envVar = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT || '';
        let serviceAccount;

        // Try parsing as base64 first
        try {
          serviceAccount = JSON.parse(
            Buffer.from(envVar, 'base64').toString('utf-8')
          );
          console.log("✅ Parsed base64-encoded service account");
        } catch (base64Error) {
          // If base64 fails, try parsing as raw JSON string
          serviceAccount = JSON.parse(envVar);
          console.log("✅ Parsed raw JSON service account");
        }

        credential = admin.credential.cert(serviceAccount);
        console.log("✅ Firebase Admin initialized using JSON env variable");
      } catch (parseError) {
        console.error("❌ Failed to parse Firebase service account from env var:", parseError);
        throw parseError;
      }
    }
    // Local development: Use GOOGLE_APPLICATION_CREDENTIALS file path
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = admin.credential.applicationDefault();
      console.log("✅ Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS (local)");
    }
    // No credentials found
    else {
      throw new Error(
        '❌ No Firebase credentials found. Please set:\n' +
        '  - FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL (Vercel)\n' +
        '  - OR FIREBASE_SERVICE_ACCOUNT_KEY (base64-encoded JSON)\n' +
        '  - OR GOOGLE_APPLICATION_CREDENTIALS (file path for local dev)'
      );
    }

    admin.initializeApp({
      credential,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
    console.log("✅ Firebase Admin SDK ready");

    // 🔧 Optional: connect to local emulators during development (only if explicitly enabled)
    if (process.env.USE_FIREBASE_EMULATOR === "true" && process.env.NODE_ENV === "development") {
      const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080";
      const databaseHost = process.env.FIREBASE_DATABASE_EMULATOR_HOST || "localhost:9000";

      // Firestore emulator
      admin.firestore().settings({
        host: firestoreHost,
        ssl: false,
      });

      // Realtime Database emulator
      admin.database().useEmulator("localhost", 9000);

      console.log(`🧪 Connected to Firebase emulators:
        Firestore → ${firestoreHost}
        Realtime DB → ${databaseHost}`);
    } else {
      console.log("🌐 Connected to production Firebase");
    }
  } catch (error) {
    console.error("❌ Firebase Admin initialization failed:", error);
  }
}

export const adminDb = admin.database();
export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();
export default admin;

// ────────────────────────────────────────────────
// TYPES
// ────────────────────────────────────────────────
export type ArticleLocation = {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type AdminFirebaseArticle = {
  title: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  tags?: string[];
  source?: string;
  publishedAt: number | string;
  updatedAt?: number | string;
  featured?: boolean;
  location?: ArticleLocation;
  faq?: FAQItem[];
};

export type Article = {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  image?: string;
  author?: string;
  category?: string;
  tags?: string[];
  source?: string;
  publishedAt?: number | string;
  updatedAt?: number | string;
  datePublished?: string;
  dateModified?: string;
  featured?: boolean;
  location?: ArticleLocation;
  faq?: FAQItem[];
};

// ────────────────────────────────────────────────
// HTML SANITIZATION
// ────────────────────────────────────────────────
function cleanHTMLStructure(html: string): string {
  if (!html) return html;
  return html
    .replace(/<p>\s*(<h[1-6][^>]*>.*?<\/h[1-6]>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<h[1-6][^>]*>)/gi, "$1")
    .replace(/(<\/h[1-6]>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*<p>/gi, "<p>")
    .replace(/<\/p>\s*<\/p>/gi, "</p>")
    .replace(/<h4([^>]*)>/gi, "<h3$1>")
    .replace(/<\/h4>/gi, "</h3>")
    .replace(/<h3([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h3>/gi, "</h2>");
}

// ────────────────────────────────────────────────
// ARTICLE MAPPER
// ────────────────────────────────────────────────
function mapAdminToArticle(slug: string, a: AdminFirebaseArticle): Article {
  const toISO = (v?: number | string) =>
    typeof v === "number"
      ? new Date(v).toISOString()
      : v
      ? new Date(v).toISOString()
      : undefined;

  return {
    slug,
    title: a.title,
    content: a.content ? cleanHTMLStructure(a.content) : a.content,
    excerpt: a.excerpt || a.content?.slice(0, 160),
    image: a.imageUrl,
    author: a.author || "Politie Forum Redactie",
    category: a.category || "Nieuws",
    tags: a.tags || [],
    sourceUrl: a.sourceUrl,
    source: a.source,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    datePublished: toISO(a.publishedAt),
    dateModified: toISO(a.updatedAt ?? a.publishedAt),
    featured: a.featured ?? false,
    location: a.location,
    faq: a.faq || [],
  };
}

// ────────────────────────────────────────────────
// FIRESTORE ARTICLE QUERIES (OPTIMIZED FOR SPEED)
// ────────────────────────────────────────────────

// In-memory cache DISABLED - always fetch fresh data from Firestore
// This ensures deleted articles don't show on homepage
export async function getLatestArticles(limit = 3): Promise<Article[]> {
  try {
    console.log(`[getLatestArticles] Fetching from /ai_news (AI-enhanced) with fallback to /news`);

    // Try AI-enhanced collection first
    let snapshot = await adminFirestore
      .collection("ai_news")
      .orderBy("publishedAt", "desc")
      .limit(limit)
      .get();

    // Fallback to original /news collection if ai_news is empty
    if (snapshot.empty) {
      console.log("[getLatestArticles] /ai_news empty, falling back to /news");
      snapshot = await adminFirestore
        .collection("news")
        .orderBy("publishedAt", "desc")
        .limit(limit)
        .get();
    }

    console.log(`[getLatestArticles] Query successful. Snapshot.size=${snapshot.size}`);

    if (snapshot.empty) {
      console.warn("[getLatestArticles] No articles found in either collection");
      return [];
    }

    const articles = snapshot.docs.map((doc) => {
      const data = doc.data() as AdminFirebaseArticle;
      return mapAdminToArticle(doc.id, data);
    });

    // 🛡️ QUALITY GATE: Filter out low-credibility articles
    const qualityFiltered = articles.filter((article: any) => {
      // If article has AI quality metrics, enforce minimum credibility
      if (article.aiQuality?.credibilityScore !== undefined) {
        const credibility = article.aiQuality.credibilityScore;

        // Flag for editorial review if score < 60
        if (credibility < 60) {
          console.warn(`[QUALITY GATE] Article "${article.title}" flagged for review (credibility: ${credibility})`);

          // In production, send to editorial queue (Firestore /editorial_review_queue)
          // For now, just filter out
          return false;
        }
      }
      return true; // Keep high-quality or non-AI articles
    });

    console.log(`[getLatestArticles] Returning ${qualityFiltered.length} AI-enhanced articles (${articles.length - qualityFiltered.length} filtered by quality gate)`);

    return qualityFiltered.slice(0, limit);
  } catch (e: any) {
    console.error("[getLatestArticles] ERROR:", e);
    return [];
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    // Prioritize AI-enhanced articles, fallback to original
    let snapshot = await adminFirestore.collection("ai_news").get();
    if (snapshot.empty) {
      snapshot = await adminFirestore.collection("news").get();
    }
    return snapshot.empty ? [] : snapshot.docs.map((doc) => doc.id);
  } catch (e) {
    console.error("Error getAllArticleSlugs:", e);
    return [];
  }
}

export async function getServerArticle(slug: string): Promise<Article | null> {
  try {
    // Try AI-enhanced version first
    let doc = await adminFirestore.collection("ai_news").doc(slug).get();

    // Fallback to original /news if not found
    if (!doc.exists) {
      console.log(`[getServerArticle] ${slug} not in /ai_news, trying /news`);
      doc = await adminFirestore.collection("news").doc(slug).get();
    }

    if (!doc.exists) return null;
    return mapAdminToArticle(slug, doc.data() as AdminFirebaseArticle);
  } catch (e) {
    console.error("Error getServerArticle:", e);
    return null;
  }
}

export async function getServerArticles(): Promise<Article[]> {
  try {
    // Prioritize AI-enhanced collection
    let snapshot = await adminFirestore.collection("ai_news").get();
    if (snapshot.empty) {
      console.log("[getServerArticles] /ai_news empty, using /news");
      snapshot = await adminFirestore.collection("news").get();
    }

    if (snapshot.empty) return [];

    const items = snapshot.docs.map((doc) =>
      mapAdminToArticle(doc.id, doc.data() as AdminFirebaseArticle)
    );

    // 🛡️ QUALITY GATE: Filter low-credibility articles
    const qualityFiltered = items.filter((article: any) => {
      if (article.aiQuality?.credibilityScore !== undefined) {
        if (article.aiQuality.credibilityScore < 60) {
          console.warn(`[QUALITY GATE] Filtering "${article.title}" (credibility: ${article.aiQuality.credibilityScore})`);
          return false;
        }
      }
      return true;
    });

    return qualityFiltered.sort((a, b) => {
      const aa =
        typeof a.publishedAt === "number"
          ? a.publishedAt
          : a.publishedAt
          ? Date.parse(a.publishedAt)
          : 0;
      const bb =
        typeof b.publishedAt === "number"
          ? b.publishedAt
          : b.publishedAt
          ? Date.parse(b.publishedAt)
          : 0;
      return (bb as number) - (aa as number);
    });
  } catch (e) {
    console.error("Error getServerArticles:", e);
    return [];
  }
}

export async function getRelatedArticles(
  currentSlug: string,
  category?: string,
  tags?: string[],
  limit = 5
): Promise<Article[]> {
  try {
    // Use AI-enhanced collection for better semantic matching
    let snapshot = await adminFirestore
      .collection("ai_news")
      .orderBy("publishedAt", "desc")
      .limit(20)
      .get();

    // Fallback to /news if ai_news is empty
    if (snapshot.empty) {
      snapshot = await adminFirestore
        .collection("news")
        .orderBy("publishedAt", "desc")
        .limit(20)
        .get();
    }

    if (snapshot.empty) return [];

    const articles = snapshot.docs
      .map((doc) => mapAdminToArticle(doc.id, doc.data() as AdminFirebaseArticle))
      .filter((a) => a.slug !== currentSlug);

    const scored = articles.map((a) => {
      let score = 0;
      if (category && a.category === category) score += 3;
      if (tags && a.tags)
        score += tags.filter((t) => a.tags?.includes(t)).length;
      const daysOld = a.publishedAt
        ? (Date.now() -
            (typeof a.publishedAt === "number"
              ? a.publishedAt
              : Date.parse(a.publishedAt))) /
          (1000 * 60 * 60 * 24)
        : 999;
      if (daysOld < 7) score += 2;
      else if (daysOld < 30) score += 1;
      return { a, score };
    });

    return scored
      .sort((x, y) => y.score - x.score)
      .slice(0, limit)
      .map((s) => s.a);
  } catch (e) {
    console.error("Error getRelatedArticles:", e);
    return [];
  }
}

// ────────────────────────────────────────────────
// REALTIME DATABASE: CATEGORIES & COMMENTS
// ────────────────────────────────────────────────
import type { Category, Comment } from "./types";

export async function getServerCategories(): Promise<Category[]> {
  try {
    const snap = await adminDb.ref("categories").once("value");
    if (!snap.exists()) return [];
    const val = snap.val() as Record<string, Omit<Category, "id">>;
    return Object.entries(val).map(([id, data]) => ({ id, ...data }));
  } catch (e) {
    console.error("Error getServerCategories:", e);
    return [];
  }
}

export async function getServerArticleComments(
  articleSlug: string
): Promise<Comment[]> {
  try {
    const snap = await adminDb
      .ref("comments")
      .orderByChild("articleSlug")
      .equalTo(articleSlug)
      .once("value");
    if (!snap.exists()) return [];
    const val = snap.val() as Record<string, Omit<Comment, "id">>;
    const comments = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    return comments.sort((a, b) => a.createdAt - b.createdAt);
  } catch (e) {
    console.error("Error getServerArticleComments:", e);
    return [];
  }
}

export async function getServerArticleCommentCount(
  articleSlug: string
): Promise<number> {
  try {
    const comments = await getServerArticleComments(articleSlug);
    return comments.length;
  } catch (e) {
    console.error("Error getServerArticleCommentCount:", e);
    return 0;
  }
}

export async function getFirstCommentsForArticles(
  slugs: string[]
): Promise<Record<string, Comment | undefined>> {
  const result: Record<string, Comment | undefined> = {};
  if (!slugs.length) return result;
  try {
    const snap = await adminDb.ref("comments").once("value");
    if (!snap.exists()) return result;
    const val = snap.val() as Record<string, Omit<Comment, "id">>;
    slugs.forEach((s) => (result[s] = undefined));
    Object.entries(val).forEach(([id, data]) => {
      const slug = (data as any).articleSlug;
      if (!slug || !(slug in result)) return;
      const current = result[slug];
      if (!current || data.createdAt < current.createdAt)
        result[slug] = { id, ...(data as any) } as Comment;
    });
    return result;
  } catch (e) {
    console.error("Error getFirstCommentsForArticles:", e);
    return result;
  }
}

export async function getMostCommentedArticles(limit = 3): Promise<Article[]> {
  try {
    const commentsSnap = await adminDb.ref("comments").once("value");
    if (!commentsSnap.exists()) return getLatestArticles(limit);

    const commentsVal = commentsSnap.val() as Record<string, any>;

    const commentCounts: Record<string, number> = {};
    Object.values(commentsVal).forEach((comment) => {
      const slug = comment.articleSlug;
      if (slug) {
        commentCounts[slug] = (commentCounts[slug] || 0) + 1;
      }
    });

    const sortedSlugs = Object.entries(commentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([slug]) => slug);

    if (sortedSlugs.length === 0) return getLatestArticles(limit);

    const articles: Article[] = [];
    for (const slug of sortedSlugs) {
      const article = await getServerArticle(slug);
      if (article) articles.push(article);
    }

    return articles;
  } catch (e) {
    console.error("Error getMostCommentedArticles:", e);
    return getLatestArticles(limit);
  }
}

/**
 * Get a forum topic by ID (server-side)
 */
export async function getServerTopic(topicId: string): Promise<any | null> {
  try {
    const snapshot = await adminDb.ref(`topics/${topicId}`).once('value');
    if (!snapshot.exists()) {
      return null;
    }
    return {
      id: topicId,
      ...snapshot.val(),
    };
  } catch (e) {
    console.error(`Error getServerTopic(${topicId}):`, e);
    return null;
  }
}

/**
 * Get all posts for a forum topic (server-side)
 */
export async function getServerTopicPosts(topicId: string): Promise<any[]> {
  try {
    const snapshot = await adminDb.ref('posts').orderByChild('topicId').equalTo(topicId).once('value');
    if (!snapshot.exists()) {
      return [];
    }
    const posts: any[] = [];
    snapshot.forEach((child) => {
      posts.push({
        id: child.key!,
        ...child.val(),
      });
    });
    return posts.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  } catch (e) {
    console.error(`Error getServerTopicPosts(${topicId}):`, e);
    return [];
  }
}
