/**
 * Firebase News Data Module
 * Fetches news articles from Firebase Realtime Database
 * Works alongside static sample data in /src/data/news.ts
 */

import { get, ref } from "firebase/database";
import { database } from "./firebase";

export interface FirebaseNewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  featured: boolean;
  source?: string;
  sourceUrl?: string;
}

/**
 * Fetch all news articles from Firebase
 */
export async function getFirebaseNews(): Promise<FirebaseNewsArticle[]> {
  try {
    if (!database) {
      console.warn("Firebase database not initialized");
      return [];
    }

    const newsRef = ref(database, "news");
    const snapshot = await get(newsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const newsData = snapshot.val();
    const articles: FirebaseNewsArticle[] = [];

    Object.keys(newsData).forEach((key) => {
      articles.push({
        id: key,
        ...newsData[key],
      });
    });

    // Sort by publishedAt date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return articles;
  } catch (error) {
    console.error("Error fetching Firebase news:", error);
    return [];
  }
}

/**
 * Fetch a single news article by slug from Firebase
 */
export async function getFirebaseNewsBySlug(
  slug: string
): Promise<FirebaseNewsArticle | null> {
  try {
    if (!database) {
      console.warn("Firebase database not initialized");
      return null;
    }

    const newsRef = ref(database, `news/${slug}`);
    const snapshot = await get(newsRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: slug,
      ...snapshot.val(),
    };
  } catch (error) {
    console.error("Error fetching Firebase news by slug:", error);
    return null;
  }
}

/**
 * Fetch featured news articles from Firebase
 */
export async function getFeaturedFirebaseNews(): Promise<
  FirebaseNewsArticle[]
> {
  try {
    const allNews = await getFirebaseNews();
    return allNews.filter((article) => article.featured);
  } catch (error) {
    console.error("Error fetching featured Firebase news:", error);
    return [];
  }
}

/**
 * Fetch news articles by category from Firebase
 */
export async function getFirebaseNewsByCategory(
  category: string
): Promise<FirebaseNewsArticle[]> {
  try {
    const allNews = await getFirebaseNews();
    return allNews.filter((article) => article.category === category);
  } catch (error) {
    console.error("Error fetching Firebase news by category:", error);
    return [];
  }
}
