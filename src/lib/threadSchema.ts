import { adminDb } from "@/lib/firebaseAdmin";

interface Comment {
  id: string;
  articleSlug: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  likes: number;
  likedBy?: string[];
  parentCommentId?: string | null;
}

interface ThreadSchemaData {
  "@context": string;
  "@type": string;
  "@id": string;
  url: string;
  headline: string;
  inLanguage: string;
  about: { "@id": string };
  isPartOf: { "@id": string };
  mainEntityOfPage: string;
  author: {
    "@type": string;
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified: string;
  commentCount: number;
  interactionStatistic: Array<{
    "@type": string;
    interactionType: string;
    userInteractionCount: number;
  }>;
  comment: Array<{
    "@type": string;
    "@id": string;
    url: string;
    dateCreated: string;
    text: string;
    author: {
      "@type": string;
      name: string;
    };
    parentItem: string;
    interactionStatistic?: {
      "@type": string;
      interactionType: string;
      userInteractionCount: number;
    };
  }>;
}

/**
 * Build DiscussionForumPosting JSON-LD schema for article discussion section
 *
 * This function:
 * 1. Fetches up to 10 most recent public comments from Firebase
 * 2. Sanitizes content (strips HTML, limits length)
 * 3. Builds proper @id references for nested replies
 * 4. Includes interaction statistics (likes, comment counts)
 * 5. Returns Schema.org compliant JSON-LD object
 *
 * @param slug - Article URL slug
 * @param articleTitle - Article headline
 * @param articleUrl - Full article URL
 * @returns ThreadSchemaData object ready for JSON-LD rendering
 */
export async function buildThreadSchema({
  slug,
  articleTitle,
  articleUrl,
}: {
  slug: string;
  articleTitle: string;
  articleUrl: string;
}): Promise<ThreadSchemaData> {
  const baseUrl = "https://politie-forum.nl";
  const discussionUrl = `${articleUrl}#reacties`;
  const discussionId = `${articleUrl}#discussion`;
  const articleId = `${articleUrl}#article`;

  // Fetch comments from Firebase (server-side with Admin SDK)
  let comments: Comment[] = [];
  let firstCommentDate: number | null = null;
  let lastCommentDate: number | null = null;

  try {
    const commentsRef = adminDb.ref("comments");
    const commentsQuery = commentsRef
      .orderByChild("articleSlug")
      .equalTo(slug);

    const snapshot = await commentsQuery.once("value");

    if (snapshot.exists()) {
      const commentsData: Comment[] = [];
      snapshot.forEach((child) => {
        commentsData.push({
          id: child.key || "",
          ...(child.val() as Omit<Comment, "id">),
        });
        return false; // Continue iteration
      });

      // Sort by creation date (newest first for schema, but track oldest for datePublished)
      commentsData.sort((a, b) => b.createdAt - a.createdAt);

      // Get date range
      if (commentsData.length > 0) {
        lastCommentDate = commentsData[0].createdAt; // Most recent
        firstCommentDate = commentsData[commentsData.length - 1].createdAt; // Oldest
      }

      // Limit to 10 for JSON-LD (SEO best practice)
      comments = commentsData.slice(0, 10);
    }
  } catch (error) {
    console.error("Error fetching comments for thread schema:", error);
  }

  // Sanitize comment text (strip HTML, limit length)
  const sanitizeCommentText = (text: string): string => {
    // Remove HTML tags
    let clean = text.replace(/<[^>]*>/g, "");
    // Remove excessive whitespace
    clean = clean.replace(/\s+/g, " ").trim();
    // Limit to 500 characters for JSON-LD
    if (clean.length > 500) {
      clean = clean.substring(0, 497) + "...";
    }
    return clean;
  };

  // Build comment schema array
  const commentSchemas = comments.map((comment) => {
    const commentSchema: ThreadSchemaData["comment"][0] = {
      "@type": "Comment",
      "@id": `${articleUrl}#comment-${comment.id}`,
      url: `${articleUrl}#comment-${comment.id}`,
      dateCreated: new Date(comment.createdAt).toISOString(),
      text: sanitizeCommentText(comment.content),
      author: {
        "@type": "Person",
        name: comment.authorName || "Anoniem",
      },
      // If it's a reply, link to parent comment; otherwise link to discussion
      parentItem: comment.parentCommentId
        ? `${articleUrl}#comment-${comment.parentCommentId}`
        : discussionId,
    };

    // Add like statistics if present
    if (comment.likes && comment.likes > 0) {
      commentSchema.interactionStatistic = {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/UpvoteAction",
        userInteractionCount: comment.likes,
      };
    }

    return commentSchema;
  });

  // Use current time if no comments exist yet
  const now = new Date().toISOString();
  const publishedDate = firstCommentDate
    ? new Date(firstCommentDate).toISOString()
    : now;
  const modifiedDate = lastCommentDate
    ? new Date(lastCommentDate).toISOString()
    : now;

  // Build complete thread schema
  const threadSchema: ThreadSchemaData = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "@id": discussionId,
    url: discussionUrl,
    headline: `Discussie: ${articleTitle}`,
    inLanguage: "nl-NL",

    // Link to the article being discussed
    about: { "@id": articleId },
    isPartOf: { "@id": `${baseUrl}/#website` },
    mainEntityOfPage: articleUrl,

    // Author is the forum/organization
    author: {
      "@type": "Organization",
      name: "Politie Forum Redactie",
      url: baseUrl,
    },

    // Dates
    datePublished: publishedDate,
    dateModified: modifiedDate,

    // Counts (must match what logged-out users see)
    commentCount: comments.length,

    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: comments.length,
      },
    ],

    // Comment array (up to 10)
    comment: commentSchemas,
  };

  return threadSchema;
}

/**
 * Build thread schema with total comment count (for accurate stats)
 * This variant fetches ALL comments to get accurate count, but still only
 * includes first 10 in the schema payload.
 */
export async function buildThreadSchemaWithCount({
  slug,
  articleTitle,
  articleUrl,
}: {
  slug: string;
  articleTitle: string;
  articleUrl: string;
}): Promise<ThreadSchemaData> {
  // First get the base schema with 10 comments
  const schema = await buildThreadSchema({ slug, articleTitle, articleUrl });

  // Then fetch total count separately
  try {
    const commentsRef = adminDb.ref("comments");
    const commentsQuery = commentsRef
      .orderByChild("articleSlug")
      .equalTo(slug);

    const snapshot = await commentsQuery.once("value");
    const totalCount = snapshot.exists() ? snapshot.numChildren() : 0;

    // Update counts in schema
    schema.commentCount = totalCount;
    schema.interactionStatistic[0].userInteractionCount = totalCount;
  } catch (error) {
    console.error("Error fetching total comment count:", error);
  }

  return schema;
}
