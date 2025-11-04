import type { ArticleCategoryInfo } from "@/lib/articleCategory";
import { toISO, toLocalISO } from "@/lib/dates";
import type { Article as FirebaseArticle } from "@/lib/firebaseAdmin";

const BASE_URL = "https://politie-forum.nl";

interface ArticleJsonLdProps {
  article: FirebaseArticle;
  slug: string;
  categoryInfo: ArticleCategoryInfo;
  comments: Array<{
    id: string;
    content: string;
    authorName: string;
    createdAt: number;
  }>;
  relatedArticles?: Array<{
    slug: string;
    title: string;
  }>;
  breadcrumbSchema?: Record<string, any>;
}

export default function ArticleJsonLd({
  article,
  slug,
  categoryInfo,
  comments,
  relatedArticles = [],
  breadcrumbSchema,
}: ArticleJsonLdProps) {
  const articleUrl = `${BASE_URL}/nieuws/${slug}/`;
  const publishedTime = toLocalISO(article.publishedAt);
  const modifiedTime = toLocalISO(article.updatedAt || article.publishedAt);
  const keywords = article.tags?.length ? article.tags : ["politie", "nieuws", "Nederland"];

  // Calculate word count once (optional for validation)
  const calcWordCount = article.content
    ? article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length
    : 0;
  const readingMinutes = Math.max(1, Math.ceil(calcWordCount / 200));

  // Compact NewsArticle schema (2025 best practices - Google News/Discover essentials only)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt || article.title,
        url: articleUrl,
        mainEntityOfPage: { "@id": `${articleUrl}#webpage` },
        isPartOf: { "@id": "https://politie-forum.nl/#website" },
        // Minimal image array (Google News/Discover requirement)
        image: [`https://politie-forum.nl/api/og/${article.slug}.jpg`],
        datePublished: publishedTime,
        dateModified: modifiedTime,
        // Author by reference (defined in layout.tsx)
        author: { "@id": "https://politie-forum.nl/#p-oldenburger" },
        publisher: { "@id": "https://politie-forum.nl/#org" },
        articleSection: categoryInfo.articleSection,
        keywords,
        inLanguage: "nl-NL",
        isAccessibleForFree: true,
        // Optional: word count for validation (no ranking impact)
        ...(calcWordCount > 0 && {
          wordCount: calcWordCount,
          timeRequired: `PT${readingMinutes}M`,
        }),
        // Real-time interaction data only (no fake viewCount)
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/CommentAction",
            userInteractionCount: comments.length,
          },
        ],
        commentCount: comments.length,
        ...(comments.length > 0 && {
          comment: comments.slice(0, 10).map((comment, index) => {
            const sanitizedText = comment.content
              .replace(/<[^>]*>/g, " ")
              .replace(/[🎉💪👍✅🔥👏😊🤔💯🙌😎🚀]/g, "")
              .replace(/\*\*([^*]+)\*\*/g, "$1")
              .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
              .replace(/\s+/g, " ")
              .trim()
              .substring(0, 300);

            return {
              "@type": "Comment",
              "@id": `${articleUrl}#comment-${comment.id || index + 1}`,
              text: sanitizedText,
              datePublished: toISO(comment.createdAt),
              author: {
                "@type": "Person",
                name: comment.authorName || "Anoniem",
              },
            };
          }),
        }),
      },
      ...(eventDate
        ? [
            {
              "@type": "Event",
              "@id": `${articleUrl}#event`,
              name: article.title,
              description: article.excerpt || article.title,
              startDate: eventDate,
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
              location: {
                "@id": `${articleUrl}#place`,
              },
              organizer: {
                "@id": "https://politie-forum.nl/#org",
              },
              image: imageUrl,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
              },
            },
          ]
        : []),
      // HowTo schema (indien stappen gedetecteerd)
      ...(howToSteps.length > 0
        ? [
            {
              "@type": "HowTo",
              "@id": `${articleUrl}#howto`,
              name: article.title,
              description: article.excerpt || article.title,
              image: imageUrl,
              totalTime: "PT30M",
              step: howToSteps.map((step, index) => ({
                "@type": "HowToStep",
                position: index + 1,
                name: step,
                text: step,
                url: `${articleUrl}#stap-${index + 1}`,
              })),
            },
          ]
        : []),
      // Review/Rating schema (indien reviews gedetecteerd in comments)
      ...(reviews.length > 0
        ? [
            {
              "@type": "Article",
              "@id": `${articleUrl}#reviews`,
              about: {
                "@id": `${articleUrl}#article`,
              },
              review: reviews.map((review, index) => ({
                "@type": "Review",
                "@id": `${articleUrl}#review-${index + 1}`,
                author: {
                  "@type": "Person",
                  name: review.authorName || "Anoniem",
                },
                datePublished: toISO(review.createdAt),
                reviewBody: review.content.slice(0, 200),
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "4",
                  bestRating: "5",
                },
              })),
            },
          ]
        : []),
      // Minimal WebPage (only required fields)
      {
        "@type": "WebPage",
        "@id": `${articleUrl}#webpage`,
        url: articleUrl,
        isPartOf: { "@id": "https://politie-forum.nl/#website" },
        mainEntity: { "@id": `${articleUrl}#article` },
        inLanguage: "nl-NL",
      },
      // Related Articles (if available)
      ...(relatedArticles.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": `${articleUrl}#related`,
              name: "Gerelateerde Artikelen",
              numberOfItems: relatedArticles.length,
              itemListElement: relatedArticles.map((relatedArticle, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${BASE_URL}/nieuws/${relatedArticle.slug}/`,
                name: relatedArticle.title,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Export static method to get schema graph for consolidation
ArticleJsonLd.getSchemaGraph = async function getSchemaGraph(props: ArticleJsonLdProps) {
  const { article, slug, categoryInfo, comments, relatedArticles = [], breadcrumbSchema } = props;
  const articleUrl = `${BASE_URL}/nieuws/${slug}/`;
  const imageUrl = article.imageUrl || `${BASE_URL}/og/politie-forum-1200x630.png`;
  const publishedTime = toISO(article.publishedAt);
  const modifiedTime = toISO(article.updatedAt || article.publishedAt);
  const keywords = article.tags?.length ? article.tags : ["politie", "nieuws", "Nederland"];

  const locationName = article.location?.name || "Nederland";
  const hasGeoCoordinates = article.location?.latitude && article.location?.longitude;

  const detectFAQs = (content: string) => {
    const faqPattern = /(?:##\s*(?:Veelgestelde\s+vragen|FAQ|Vragen\s+en\s+antwoorden)[\s\S]*?)(?=##|$)/gi;
    const match = content.match(faqPattern);
    if (!match) return [];
    const qaPairs: Array<{ question: string; answer: string }> = [];
    const qaPattern = /\*\*([^*]+)\*\*\s*\n>?\s*"?([^"\n]+)/g;
    let qaMatch;
    while ((qaMatch = qaPattern.exec(match[0])) !== null) {
      qaPairs.push({ question: qaMatch[1].trim(), answer: qaMatch[2].trim() });
    }
    return qaPairs.slice(0, 5);
  };

  let faqs: Array<{ question: string; answer: string }> = [];
  if ((article as any).faq && Array.isArray((article as any).faq) && (article as any).faq.length > 0) {
    faqs = (article as any).faq;
  } else if (article.content) {
    faqs = detectFAQs(article.content);
  }

  const placeSchema = hasGeoCoordinates
    ? {
        "@type": "Place",
        "@id": `${articleUrl}#place`,
        name: locationName,
        address: {
          "@type": "PostalAddress",
          addressLocality: locationName,
          addressCountry: "NL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: article.location!.latitude,
          longitude: article.location!.longitude,
        },
      }
    : {
        "@type": "Place",
        "@id": `${articleUrl}#place`,
        name: locationName,
        address: {
          "@type": "PostalAddress",
          addressLocality: locationName,
          addressCountry: "NL",
        },
      };

  const sanitizeCommentText = (text: string): string => {
    return text
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/[🎉💪👍✅🔥👏😊🤔💯🙌😎🚀]/g, "") // Remove emoji
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "") // Remove image markdown ![alt](url)
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold **text**
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links [text](url)
      .replace(/[:_\-]{2,}/g, "") // Remove emoji artifacts like :_ or --
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 300);
  };

  // Build @graph array (without Organization/WebSite which come from layout)
  return [
    // BreadcrumbList (from page.tsx)
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    placeSchema,
    {
      "@type": "NewsArticle",
      "@id": `${articleUrl}#article`,
      // ✅ Core properties first for optimal Google parsing
      headline: article.title,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${articleUrl}#webpage`,
      },
      url: articleUrl,
      // Secondary descriptive properties
      alternativeHeadline: article.seo_title || article.title,
      description: article.excerpt || article.title,
      ...(article.content && {
        articleBody: article.content
          .replace(/<span class="sr-only"[^>]*>.*?<\/span>/gi, "")
          .replace(/<nav[^>]*>.*?<\/nav>/gi, "")
          .replace(/##\s*(Veelgestelde vragen|FAQ|Vragen en antwoorden)[\s\S]*$/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      }),
      ...(article.content && {
        wordCount: article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length,
      }),
      ...(article.content && {
        timeRequired: `PT${Math.max(1, Math.ceil(article.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length / 200))}M`,
      }),
      // Structural relationships
      isPartOf: { "@id": "https://politie-forum.nl/#website" },
      image: [
        {
          "@type": "ImageObject",
          "@id": `${articleUrl}#primaryimage`,
          url: `https://politie-forum.nl/api/og/${article.slug}.jpg`,
          contentUrl: `https://politie-forum.nl/api/og/${article.slug}.jpg`,
          width: 1200,
          height: 675,
          representativeOfPage: true,
          caption: article.title,
        },
        {
          "@type": "ImageObject",
          url: `https://politie-forum.nl/api/og/${article.slug}.jpg`,
          width: 1200,
          height: 630,
        },
      ],
      thumbnailUrl: `https://politie-forum.nl/api/og/${article.slug}.jpg`,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      ...(article.location?.name && {
        locationCreated: {
          "@type": "Place",
          "@id": `${articleUrl}#place`,
          name: article.location.name,
          ...(article.location.latitude && article.location.longitude && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: article.location.latitude,
              longitude: article.location.longitude,
            },
          }),
        },
      }),
      author: {
        "@type": "Person",
        "@id": "https://politie-forum.nl/#p-oldenburger",
        name: "Politie Forum Redactie",
        url: "https://politie-forum.nl/redactie/",
        jobTitle: "Hoofdredacteur",
        worksFor: { "@id": "https://politie-forum.nl/#org" },
      },
      editor: {
        "@id": "https://politie-forum.nl/#p-oldenburger",
      },
      publisher: { "@id": "https://politie-forum.nl/#org" },
      sourceOrganization: { "@id": "https://politie-forum.nl/#org" },
      copyrightHolder: { "@id": "https://politie-forum.nl/#org" },
      copyrightYear: new Date(article.publishedAt).getFullYear(),
      copyrightNotice: `© ${new Date().getFullYear()} Politie Forum Nederland. Alle rechten voorbehouden.`,
      publishingPrinciples: "https://politie-forum.nl/redactionele-principes/",
      ...(article.excerpt && {
        backstory: article.excerpt,
      }),
      articleSection: categoryInfo.articleSection,
      keywords,
      genre: categoryInfo.articleSection,
      inLanguage: "nl-NL",
      isAccessibleForFree: true,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["article h1", ".prose p:first-of-type"],
        xpath: ["/html/head/title", "/html/body//article//h1", "/html/body//article//p[1]"],
      },
      ...(hasGeoCoordinates && {
        contentLocation: { "@id": `${articleUrl}#place` },
      }),
      potentialAction: [
        {
          "@type": "ShareAction",
          name: "Deel dit artikel",
          target: {
            "@type": "EntryPoint",
            urlTemplate: articleUrl,
            actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
          },
        },
        {
          "@type": "CommentAction",
          name: "Reageer op dit artikel",
          target: { "@type": "EntryPoint", urlTemplate: `${articleUrl}#reacties` },
        },
      ],
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: comments.length,
        },
      ],
      ...(comments.length > 0 && {
        comment: comments.slice(0, 10).map((comment) => ({
          "@type": "Comment",
          "@id": `${articleUrl}#comment-${comment.id}`,
          text: sanitizeCommentText(comment.content),
          datePublished: toISO(comment.createdAt),
          author: {
            "@type": "Person",
            name: comment.authorName,
          },
        })),
      }),
    },
    {
      "@type": "WebPage",
      "@id": `${articleUrl}#webpage`,
      url: articleUrl,
      name: article.title,
      description: article.excerpt || article.title,
      isPartOf: { "@id": "https://politie-forum.nl/#website" },
      primaryImageOfPage: { "@id": `${articleUrl}#primaryimage` },
      datePublished: publishedTime,
      dateModified: modifiedTime,
      inLanguage: "nl-NL",
      mainEntity: { "@id": `${articleUrl}#article` },
    },
    // FAQPage as top-level object (Google's recommendation for better detection)
    ...(faqs.length > 0
      ? [
          {
            "@type": "FAQPage",
            "@id": `${articleUrl}#faq`,
            url: `${articleUrl}#faq`,
            name: `Veelgestelde vragen over ${article.title}`,
            inLanguage: "nl-NL", // ✅ Added for language clarity
            isPartOf: { "@id": `${articleUrl}#webpage` },
            mainEntity: faqs.map((faq, index) => ({
              "@type": "Question",
              "@id": `${articleUrl}#faq-${index + 1}`,
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
    ...(relatedArticles.length > 0
      ? [
          {
            "@type": "ItemList",
            "@id": `${articleUrl}#related`,
            name: "Gerelateerde Artikelen",
            description: "Meer artikelen over dit onderwerp",
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            numberOfItems: relatedArticles.length,
            itemListElement: relatedArticles.map((relatedArticle, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${BASE_URL}/nieuws/${relatedArticle.slug}/`,
              name: relatedArticle.title,
            })),
          },
        ]
      : []),
  ];
};
