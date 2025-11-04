/**
 * JsonLdArticleWithDiscussion Component
 *
 * Generates comprehensive JSON-LD structured data for news articles with:
 * - NewsArticle schema (Google News eligible)
 * - BreadcrumbList schema (rich snippets in search results)
 * - DiscussionForumPosting schema (forum recognition with live comment count)
 *
 * @example
 * ```tsx
 * <JsonLdArticleWithDiscussion
 *   headline="Twee DNA-matches in cold case"
 *   description="Politie vindt nieuwe aanwijzingen..."
 *   datePublished="2025-10-08T14:30:00+02:00"
 *   dateModified="2025-10-08T15:45:00+02:00"
 *   slug="twee-dna-matches-cold-case-vermoorde-sekswerker"
 *   image="https://politie-forum.nl/og/article-image.png"
 *   commentCount={42}
 * />
 * ```
 */

interface JsonLdArticleWithDiscussionProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  slug: string;
  image?: string;
  commentCount?: number;
  category?: string;
  keywords?: string;
  articleBody?: string;
  wordCount?: number;
}

export default function JsonLdArticleWithDiscussion({
  headline,
  description,
  datePublished,
  dateModified,
  slug,
  image,
  commentCount = 0,
  category = "Nieuws",
  keywords = "politie, nieuws, Nederland",
  articleBody,
  wordCount,
}: JsonLdArticleWithDiscussionProps) {
  const baseUrl = "https://politie-forum.nl";
  const articleUrl = `${baseUrl}/nieuws/${slug}`;
  const discussionUrl = `${articleUrl}#comments`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Politie Forum Nederland",
        alternateName: "Politie-Forum.nl",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          "@id": `${baseUrl}/#logo`,
          url: `${baseUrl}/logo.png`,
          contentUrl: `${baseUrl}/logo.png`,
          width: 1024,
          height: 1024,
          caption: "Politie Forum Nederland Logo",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sint Olofssteeg 4",
          postalCode: "1012AK",
          addressLocality: "Amsterdam",
          addressCountry: "NL",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+31648319167",
          email: "info@politie-forum.nl",
          contactType: "customer service",
          availableLanguage: "Dutch",
        },
        email: "info@politie-forum.nl",
        telephone: "+31648319167",
        sameAs: [
          "https://x.com/politieforum",
          "https://facebook.com/politieforum",
          "https://instagram.com/politieforum",
          "https://politie-nl.nl",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Nieuws",
            item: `${baseUrl}/nieuws`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: headline,
            item: articleUrl,
          },
        ],
      },
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        headline,
        description,
        ...(articleBody && { articleBody }),
        ...(wordCount && { wordCount }),
        image: {
          "@type": "ImageObject",
          url: image || `${baseUrl}/og/politie-forum-1200x630.png`,
          width: 1200,
          height: 630,
        },
        thumbnailUrl: image || `${baseUrl}/og/politie-forum-1200x630.png`,
        author: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          name: "Politie Forum Nederland",
        },
        publisher: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
        datePublished,
        dateModified,
        inLanguage: "nl-NL",
        articleSection: category,
        keywords,
        genre: category.includes("/") ? category : `Nieuws / ${category}`,
        isAccessibleForFree: true,
        copyrightHolder: {
          "@id": `${baseUrl}/#organization`,
        },
        copyrightYear: "2025",
        discussionUrl,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["article h1", "article .prose"],
        },
      },
      {
        "@type": "DiscussionForumPosting",
        "@id": `${discussionUrl}#discussion`,
        headline: `Discussie over: ${headline}`,
        discussionUrl,
        about: description,
        commentCount,
        datePublished,
        publisher: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
        },
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: commentCount,
        },
        potentialAction: {
          "@type": "CommentAction",
          name: "Plaats een reactie",
          target: `${articleUrl}#reacties`,
        },
      },
      {
        "@type": "WebPage",
        "@id": articleUrl,
        url: articleUrl,
        name: `${headline} — Politie Forum Nederland`,
        description,
        publisher: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: "nl-NL",
        breadcrumb: {
          "@id": `${articleUrl}#breadcrumb`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: image || `${baseUrl}/og/politie-forum-1200x630.png`,
        },
        datePublished,
        dateModified,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          name: "Politie Forum Nederland",
          url: baseUrl,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
