/**
 * Article & Comment Type Definitions
 *
 * TypeScript interfaces for type-safe article management,
 * Firebase integration, and SEO metadata generation.
 */

/**
 * Represents a single news article from Firebase or CMS
 */
export interface Article {
  /** URL-friendly article identifier */
  slug: string;

  /** Article headline/title */
  title: string;

  /** Short excerpt/summary (160-200 chars recommended) */
  excerpt: string;

  /** Full article content (HTML formatted) */
  content: string;

  /** Featured image URL (optional, falls back to default OG image) */
  image?: string;

  /** ISO 8601 date string of publication */
  datePublished: string;

  /** ISO 8601 date string of last modification */
  dateModified: string;

  /** Article author name (defaults to "Politie Forum Redactie") */
  author?: string;

  /** Article category (e.g., "Nieuws", "Politiek", "Criminaliteit") */
  category?: string;

  /** Array of tags/keywords */
  tags?: string[];

  /** Source URL (for RSS-imported articles) */
  sourceUrl?: string;

  /** Source name (e.g., "Politie.nl", "NU.nl") */
  source?: string;

  /** Firebase timestamp (milliseconds since epoch) */
  publishedAt?: number;

  /** Firebase timestamp for updates */
  updatedAt?: number;

  /** View count */
  views?: number;
}

/**
 * Represents a comment or reply from Firebase Realtime Database
 */
export interface CommentData {
  /** Unique comment ID (Firebase key) */
  id: string;

  /** Article slug this comment belongs to */
  articleSlug: string;

  /** User ID of comment author */
  authorId: string;

  /** Display name of comment author */
  authorName: string;

  /** Email of comment author */
  authorEmail: string;

  /** Profile photo URL (optional) */
  authorPhotoURL?: string;

  /** Comment text content */
  content: string;

  /** Timestamp in milliseconds since epoch */
  createdAt: number;

  /** Number of likes/upvotes */
  likes?: number;

  /** Object mapping user IDs to like status (e.g., { userId: true }) */
  likedBy?: { [uid: string]: boolean };

  /** Parent comment ID (null for top-level comments) */
  parentId?: string | null;
}

/**
 * Firebase article structure (matches news-rip.py output)
 */
export interface FirebaseArticle {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: number;
  updatedAt?: number;
  imageUrl?: string;
  tags: string[];
  category: string;
  source: string;
  sourceUrl: string;
  slug?: string;
}

/**
 * Metadata configuration for generateMetadata()
 */
export interface ArticleMetadata {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  category: string;
  tags: string[];
}
