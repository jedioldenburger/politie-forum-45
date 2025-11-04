export interface User {
  uid: string;
  email: string;
  displayName: string; // Full name (private, not shown publicly)
  nickname?: string; // Public nickname shown in comments/replies
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: number;
  role: "user" | "moderator" | "admin";
  posts: number;
  reputation: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicsCount: number;
  postsCount: number;
  order: number;
  createdAt: number;
}

export interface Topic {
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
  lastReply?: {
    userId: string;
    userName: string;
    timestamp: number;
  };
}

export interface Post {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  likes: number;
  likedBy?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: "reply" | "like" | "mention" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

export interface Comment {
  id: string;
  articleSlug: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  images?: string[]; // Array of base64 encoded images
  createdAt: number;
  updatedAt?: number;
  likes: number;
  likedBy?: { [uid: string]: boolean }; // Object structure: { userId: true }
  parentCommentId?: string;
}

export interface ArticleLocation {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Article {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: number;
  updatedAt?: number;
  imageUrl?: string;
  tags: string[];
  category: string;
  source?: string;
  sourceUrl?: string;
  location?: ArticleLocation;
  slug?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  featured?: boolean;
  faq?: Array<{question: string; answer: string}>;
}

// AI-Enhanced Article with semantic intelligence layer
export interface AIEnhancedArticle extends Article {
  // AI-generated summary (4-5 sentences, professional journalist style)
  aiSummary?: string;

  // Enhanced semantic tags (expanded from original tags)
  aiTags?: string[];

  // Named entity recognition results
  aiEntities?: {
    people: string[];           // Individuals mentioned
    organizations: string[];    // Companies, institutions
    locations: string[];        // Cities, landmarks
    keywords: string[];         // Key topics and themes
  };

  // Sentiment analysis with emotional context
  aiSentiment?: {
    sentiment: 'mixed' | 'positive' | 'negative' | 'neutral';
    score: number;              // 0-100 scale
    tone: string;               // e.g., 'concerned', 'hopeful', 'urgent'
    emotions: string[];         // e.g., ['outrage', 'solidarity', 'frustration']
  };

  // Quality and credibility metrics
  aiQuality?: {
    qualityScore: number;       // 0-100 (95-100 for high-quality news)
    readabilityScore: number;   // 0-100 (Flesch-Kincaid equivalent)
    credibilityScore: number;   // 0-100 (source authority + fact-checking)
    notes: string;              // Dutch explanation of scores
  };

  // Knowledge graph relationships
  knowledgeGraph?: {
    nodes: Array<{
      type: 'person' | 'organization' | 'location' | 'event' | 'concept';
      value: string;
      properties?: Record<string, any>;
    }>;
    relationships: Array<{
      from: { type: string; value: string };
      to: { type: string; value: string };
      relationType: 'affiliated_with' | 'located_in' | 'related_to' | 'mentions' | 'works_for';
    }>;
  };

  // Schema.org structured data (NewsArticle + FAQPage + Event + HowTo + Review + Comment)
  structuredData?: any;

  // Next-gen AI search engine meta tags
  seoMetaTags?: {
    trustwoAI: number;          // Trustworthiness score for AI engines
    readability: number;        // Content readability metric
    contentTone: string;        // Emotional tone for context-aware search
    sentiment: string;          // Overall sentiment classification
    semanticSignals?: {
      emotions: string[];       // Emotional signals
      keyTopics: string[];      // Primary topics
      primaryEntities: string[]; // Most important entities
    };
  };

  // Related articles query parameters (for cross-linking)
  relatedArticlesQuery?: {
    people: string[];
    organizations: string[];
    locations: string[];
    keywords: string[];
    sentiment: string;
  };

  // AI processing metadata
  aiVersion?: string;           // e.g., '1.0'
  aiModel?: string;             // e.g., 'llama-3.3-70b-versatile'
  aiProvider?: string;          // e.g., 'groq'
  optimizedAt?: string;         // ISO timestamp
  summarizedAt?: string;        // ISO timestamp
  keywords?: string[];          // Extracted keywords for search
}
