/**
 * RSS Feed Integration for Politie.nl
 * Fetches and parses RSS feed from https://rss.politie.nl/rss/algemeen/ab/algemeen.xml
 */

import Parser from "rss-parser";

// Dynamic import for Firebase to support both client and server
let database: any = null;

async function getDatabase() {
  if (database) return database;

  // Check if we're on the server (Node.js)
  if (typeof window === "undefined") {
    // Server-side: use Firebase Admin SDK
    try {
      const admin = await import("firebase-admin");

      // Use environment variable for credentials (Vercel-compatible)
      let serviceAccount;
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
        const envVar = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT || '';

        try {
          // Try base64 first
          serviceAccount = JSON.parse(Buffer.from(envVar, 'base64').toString('utf-8'));
        } catch {
          // Fallback to raw JSON
          serviceAccount = JSON.parse(envVar);
        }
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Local dev: use file path
        const serviceAccountModule = await import(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        serviceAccount = JSON.parse(JSON.stringify(serviceAccountModule.default || serviceAccountModule));
      } else {
        throw new Error('No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_KEY env var.');
      }

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as any),
          databaseURL:
            "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
        });
      }

      database = admin.database();
      return database;
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
      return null;
    }
  } else {
    // Client-side: use regular Firebase
    const { database: db } = await import("./firebase");
    database = db;
    return database;
  }
}

export interface RSSFeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories?: string[];
  isoDate?: string;
  creator?: string;
  enclosure?: {
    url: string;
    type?: string;
    length?: number;
  };
}

export interface RSSFeedData {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  items: RSSFeedItem[];
  lastFetched: number;
}

const RSS_FEED_URL = "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml";
const RSS_CACHE_PATH = "rss/politie-feed";

/**
 * Fetch and parse RSS feed from Politie.nl
 */
export async function fetchPolitieRSSFeed(): Promise<RSSFeedData | null> {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ["description", "content"],
          ["content:encoded", "contentEncoded"],
        ],
      },
    });

    console.log("Fetching RSS feed from:", RSS_FEED_URL);

    // Timeout protection: 15s max for external RSS fetch
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('RSS fetch timeout')), 15000)
    );

    const feed = await Promise.race([
      parser.parseURL(RSS_FEED_URL),
      timeoutPromise
    ]);

    const feedData: RSSFeedData = {
      title: feed.title || "Politie Nieuws",
      description: feed.description || "",
      link: feed.link || "",
      lastBuildDate: feed.lastBuildDate || new Date().toISOString(),
      items: feed.items.map((item) => ({
        id: item.guid || item.link || generateId(),
        title: item.title || "Geen titel",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        content:
          (item as any).contentEncoded ||
          item.content ||
          item.description ||
          "",
        contentSnippet: item.contentSnippet || "",
        guid: item.guid || item.link || "",
        categories: item.categories || [],
        isoDate: item.isoDate,
        creator: item.creator,
        enclosure: item.enclosure,
      })),
      lastFetched: Date.now(),
    };

    console.log(
      `Successfully fetched ${feedData.items.length} items from RSS feed`
    );
    return feedData;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return null;
  }
}

/**
 * Remove undefined values from objects (Firebase doesn't accept undefined)
 */
function cleanForFirebase(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirebase(item)).filter(item => item !== null);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirebase(value);
      }
    }
    return cleaned;
  }

  return obj;
}

/**
 * Save RSS feed data to Firebase
 */
export async function saveRSSFeedToFirebase(
  feedData: RSSFeedData
): Promise<boolean> {
  try {
    const db = await getDatabase();
    if (!db) {
      console.error("Database not initialized");
      return false;
    }

    // Clean data to remove undefined values
    const cleanedData = cleanForFirebase(feedData);

    // Server-side (Admin SDK)
    if (typeof window === "undefined") {
      const feedRef = db.ref(RSS_CACHE_PATH);
      await feedRef.set(cleanedData);
    } else {
      // Client-side
      const { ref, set } = await import("firebase/database");
      const feedRef = ref(db, RSS_CACHE_PATH);
      await set(feedRef, cleanedData);
    }

    console.log("RSS feed data saved to Firebase");
    return true;
  } catch (error) {
    console.error("Error saving RSS feed to Firebase:", error);
    return false;
  }
}

/**
 * Get cached RSS feed data from Firebase
 */
export async function getCachedRSSFeed(): Promise<RSSFeedData | null> {
  try {
    const db = await getDatabase();
    if (!db) {
      console.error("Database not initialized");
      return null;
    }

    // Server-side (Admin SDK)
    if (typeof window === "undefined") {
      const feedRef = db.ref(RSS_CACHE_PATH);
      const snapshot = await feedRef.once("value");

      if (snapshot.exists()) {
        const data = snapshot.val() as RSSFeedData;
        console.log("Retrieved cached RSS feed from Firebase");
        return data;
      }
    } else {
      // Client-side
      const { ref, get } = await import("firebase/database");
      const feedRef = ref(db, RSS_CACHE_PATH);
      const snapshot = await get(feedRef);

      if (snapshot.exists()) {
        const data = snapshot.val() as RSSFeedData;
        console.log("Retrieved cached RSS feed from Firebase");
        return data;
      }
    }

    console.log("No cached RSS feed found");
    return null;
  } catch (error) {
    console.error("Error getting cached RSS feed:", error);
    return null;
  }
}

/**
 * Fetch and cache RSS feed (combines fetch and save)
 */
export async function updateRSSFeedCache(): Promise<RSSFeedData | null> {
  const feedData = await fetchPolitieRSSFeed();

  if (feedData) {
    await saveRSSFeedToFirebase(feedData);
    return feedData;
  }

  return null;
}

/**
 * Get RSS feed with automatic refresh if stale (older than 1 hour)
 */
export async function getRSSFeed(
  forceRefresh: boolean = false
): Promise<RSSFeedData | null> {
  if (forceRefresh) {
    return await updateRSSFeedCache();
  }

  const cached = await getCachedRSSFeed();

  // Check if cache is stale (older than 1 hour)
  if (cached) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (cached.lastFetched > oneHourAgo) {
      console.log("Using cached RSS feed (still fresh)");
      return cached;
    }
    console.log("Cached RSS feed is stale, fetching new data...");
  }

  return await updateRSSFeedCache();
}

/**
 * Convert RSS item to news article format
 */
export function convertRSSItemToNewsArticle(item: RSSFeedItem) {
  // Extract slug from title
  const slug = item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Create excerpt from content snippet
  const excerpt = item.contentSnippet
    ? item.contentSnippet.substring(0, 200).trim() + "..."
    : "";

  return {
    id: item.id,
    slug: `politie-${slug}`,
    title: item.title,
    excerpt: excerpt,
    content: item.content || item.contentSnippet || "",
    author: item.creator || "Politie Nederland",
    publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    updatedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    category: item.categories?.[0] || "Algemeen Nieuws",
    tags: item.categories || ["politie", "nieuws"],
    imageUrl: item.enclosure?.url || undefined,
    featured: false,
    source: "politie-rss",
    sourceUrl: item.link,
  };
}

/**
 * Import RSS feed items as news articles to Firebase
 */
export async function importRSSFeedAsNews(limit?: number): Promise<number> {
  try {
    const feedData = await getRSSFeed();
    if (!feedData) {
      console.log("No RSS feed data available");
      return 0;
    }

    const db = await getDatabase();
    if (!db) {
      console.error("Database not initialized");
      return 0;
    }

    const items = limit ? feedData.items.slice(0, limit) : feedData.items;

    let imported = 0;

    // Server-side (Admin SDK)
    if (typeof window === "undefined") {
      for (const item of items) {
        const article = convertRSSItemToNewsArticle(item);
        const newsRef = db.ref("news").push();
        await newsRef.set(article);
        imported++;
      }
    } else {
      // Client-side
      const { ref, push, set } = await import("firebase/database");
      const newsRef = ref(db, "news");

      for (const item of items) {
        const article = convertRSSItemToNewsArticle(item);
        const articleRef = push(newsRef);
        await set(articleRef, article);
        imported++;
      }
    }

    console.log(`Imported ${imported} RSS items as news articles`);
    return imported;
  } catch (error) {
    console.error("Error importing RSS feed as news:", error);
    return 0;
  }
}

// Helper function to generate unique ID
function generateId(): string {
  return `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
