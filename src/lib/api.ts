// lib/api.ts - Server-side API functions for homepage
import { getLatestArticles } from "./firebaseAdmin";

/**
 * Fetch featured articles for homepage schema
 * Returns complete data for Forum Schema (ItemList + DiscussionForumPosting)
 */
export async function getFeaturedArticles(limit = 10) {
  try {
    const articles = await getLatestArticles(limit);

    // Return all fields needed for ForumThread schema
    return articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      author: a.author || 'Politie Forum Redactie',
      publishedAt: a.publishedAt,
      updatedAt: a.updatedAt,
      excerpt: a.excerpt,
      summary: a.summary,
      commentCount: a.commentCount || 0,
      viewCount: a.viewCount || 0,
    }));
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}
