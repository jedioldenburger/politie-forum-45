// src/components/SchemaRenderer.tsx
// Universal Schema.org JSON-LD renderer for all page types
// Automatically detects route and generates appropriate structured data

import { buildSchema, SchemaContext } from '@/lib/schemaBuilder';
import { logValidationResults, validateSchema } from '@/lib/validateSchema';

interface SchemaRendererProps {
  pathname: string;
  content?: any;
  validate?: boolean; // Enable validation in development
}

export default function SchemaRenderer({
  pathname,
  content,
  validate = process.env.NODE_ENV === 'development'
}: SchemaRendererProps) {
  const context: SchemaContext = {
    pathname,
    content,
    baseUrl: 'https://politie-forum.nl',
  };

  const schema = buildSchema(context);

  // Validate in development mode
  if (validate && process.env.NODE_ENV === 'development') {
    const validationResult = validateSchema(schema);
    logValidationResults(validationResult, pathname);

    // Log the generated schema for debugging
    if (process.env.DEBUG_SCHEMA) {
      console.log('📋 Generated Schema:', JSON.stringify(schema, null, 2));
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0), // Minified for production
      }}
    />
  );
}

// ============================================================================
// CONVENIENCE EXPORTS FOR SPECIFIC PAGE TYPES
// ============================================================================

interface NewsSchemaProps {
  article: {
    title: string;
    summary?: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    image?: string;
    content?: string;
    category?: string;
    keywords?: string;
    tags?: string[];
  };
  slug: string;
}

export function NewsSchema({ article, slug }: NewsSchemaProps) {
  return (
    <SchemaRenderer
      pathname={`/nieuws/${slug}`}
      content={{
        title: article.title,
        summary: article.summary,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: article.author,
        image: article.image,
        content: article.content,
        category: article.category,
        keywords: article.keywords,
        tags: article.tags,
      }}
    />
  );
}

interface ForumSchemaProps {
  thread: {
    title: string;
    content: string;
    author: string;
    authorId?: string;
    datePublished: string;
    commentCount?: number;
    viewCount?: number;
    comments?: any[];
  };
  topicId: string;
}

export function ForumSchema({ thread, topicId }: ForumSchemaProps) {
  return (
    <SchemaRenderer
      pathname={`/forum/topic/${topicId}`}
      content={{
        title: thread.title,
        content: thread.content,
        author: thread.author,
        authorId: thread.authorId,
        datePublished: thread.datePublished,
        commentCount: thread.commentCount,
        viewCount: thread.viewCount,
        comments: thread.comments,
      }}
    />
  );
}

interface ProfileSchemaProps {
  user: {
    username: string;
    name?: string;
    bio?: string;
    avatar?: string;
    userId?: string;
    stats?: {
      posts?: number;
      comments?: number;
    };
  };
}

export function ProfileSchema({ user }: ProfileSchemaProps) {
  return (
    <SchemaRenderer
      pathname={`/user/${user.username}`}
      content={{
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        userId: user.userId,
        stats: user.stats,
      }}
    />
  );
}
