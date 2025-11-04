// app/forum/[slug]/page.tsx (Server Component - Forum Discussion Thread)
// This is a DISCUSSION page, not a duplicate of the news article
// Shows summary + link to full article + focuses on comments
import { toISO } from "@/lib/dates";
import { getServerArticle, getServerArticleComments } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ForumDiscussionClient from "./ForumDiscussionClient";

const BASE_URL = "https://politie-forum.nl";

// ISR Configuration - automatically rebuild pages every 10 minutes
export const revalidate = 600; // 10 minutes

// Allow dynamic params (for on-demand ISR generation)
export const dynamicParams = true;

// Generate static params for existing articles
export async function generateStaticParams() {
  try {
    const { getAllArticleSlugs } = await import("@/lib/firebaseAdmin");
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      return {
        title: "Discussie niet gevonden | Politie Forum Nederland",
        description: "De gevraagde discussie kon niet worden gevonden.",
      };
    }

    const discussionUrl = `${BASE_URL}/forum/${slug}/`;
    const newsArticleUrl = `${BASE_URL}/nieuws/${slug}/`;
    const ogImageUrl = `${BASE_URL}/api/og/${slug}.jpg`;

    const publishedTime = toISO(article.publishedAt);
    const modifiedTime = toISO(article.updatedAt || article.publishedAt);

    // Make it clear this is a DISCUSSION page, not the article itself
    // Truncate to fit ≤65 chars total (template adds 26 chars, "Discussie: " = 11 chars, leaving 28 for title)
    const truncatedTitle = article.title.length > 28
      ? article.title.slice(0, 25).trim() + '...'
      : article.title;
    const title = `Discussie: ${truncatedTitle}`;

    // Shorten description to ≤160 chars
    const baseDesc = article.excerpt?.substring(0, 100) || article.title.substring(0, 100);
    const description = `Discussieer over: ${baseDesc}. Reageer en lees het artikel.`;

    return {
      title,
      description,
      alternates: {
        canonical: discussionUrl,
        languages: {
          'nl-NL': discussionUrl,
          'x-default': discussionUrl,
        },
      },
      authors: [{ name: "Politie Forum Community" }],
      openGraph: {
        url: discussionUrl,
        type: "article", // Article type for discussion threads
        title,
        description,
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        images: [ogImageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Fout | Politie Forum Nederland",
      description: "Er is een fout opgetreden.",
    };
  }
}

export default async function ForumArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const article = await getServerArticle(slug);

    if (!article) {
      notFound();
    }

    const comments = await getServerArticleComments(slug);
    const newsArticleUrl = `${BASE_URL}/nieuws/${slug}/`;
    const discussionUrl = `${BASE_URL}/forum/${slug}/`;
    const ogImageUrl = `${BASE_URL}/api/og/${slug}.jpg`;

    // Generate proper 300-word summary from content
    const generateSummary = (content: string | undefined, excerpt: string | undefined) => {
      // Try excerpt first
      if (excerpt && excerpt.length > 100) {
        const words = excerpt.split(/\s+/);
        if (words.length <= 300) return excerpt;
        return words.slice(0, 300).join(' ') + '...';
      }

      // Fallback to content
      if (!content) return 'Lees het volledige artikel voor meer informatie.';

      // Strip HTML tags and get clean text
      const cleanText = content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const words = cleanText.split(/\s+/);
      if (words.length <= 300) return cleanText;

      return words.slice(0, 300).join(' ') + '...';
    };

    const summary = generateSummary(article.content, article.excerpt);

    // Generate DiscussionForumPosting schema (page-specific only, layout graph stays in layout.tsx)
    const discussionSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DiscussionForumPosting",
          "@id": `${discussionUrl}#posting`,
          "url": discussionUrl,
          "headline": `Discussie: ${article.title}`,
          "text": `Discussieer over het artikel: ${article.title}. Lees het volledige nieuwsartikel en reageer hieronder.`,
          "image": {
            "@type": "ImageObject",
            "url": ogImageUrl,
            "width": 1200,
            "height": 630,
          },
          "inLanguage": "nl-NL",
          "datePublished": toISO(article.publishedAt),
          "dateModified": toISO(article.updatedAt || article.publishedAt),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": discussionUrl,
          },
          "isPartOf": {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
          },
          "author": {
            "@type": "Organization",
            "name": "Politie Forum Redactie",
            "url": `${BASE_URL}/redactie/`,
          },
          "publisher": {
            "@type": "Organization",
            "name": "Politie Forum Nederland",
            "url": BASE_URL,
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/logo.svg`,
            },
          },
          "about": {
            "@type": "NewsArticle",
            "@id": `${newsArticleUrl}#article`,
            "url": newsArticleUrl,
            "headline": article.title,
            "image": ogImageUrl,
            "author": {
              "@type": "Organization",
              "name": "Politie Forum Redactie",
              "url": `${BASE_URL}/redactie/`,
            },
          },
          "commentCount": comments.length,
          "interactionStatistic": [
            {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/CommentAction",
              "userInteractionCount": comments.length,
            },
          ],
          "comment": comments.slice(0, 25).map((c: any) => ({
            "@type": "Comment",
            "@id": `${discussionUrl}#comment-${c.id}`,
            "text": c.content?.substring(0, 300) || "",
            "dateCreated": toISO(c.createdAt),
            "author": {
              "@type": "Person",
              "name": c.authorName || "Anoniem",
            },
          })),
          "discussionUrl": discussionUrl,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(discussionSchema, null, 0) }}
        />
        <ForumDiscussionClient
          article={{ ...article, summary }}
          slug={slug}
          newsArticleUrl={newsArticleUrl}
          comments={comments}
        />
      </>
    );
  } catch (error) {
    console.error("Error rendering forum article:", error);
    notFound();
  }
}
