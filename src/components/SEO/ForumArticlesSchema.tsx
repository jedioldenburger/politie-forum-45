// src/components/SEO/ForumArticlesSchema.tsx
// Schema voor "Populaire Forum Artikelen" met DiscussionForumPosting (niet NewsArticle)
// Conform Google's Forum Rich Results specificatie

interface ForumArticle {
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  featured?: boolean;
  datePublished?: string;
  commentCount?: number;
}

interface ForumArticlesSchemaProps {
  articles: ForumArticle[];
}

export default function ForumArticlesSchema({ articles }: ForumArticlesSchemaProps) {
  if (!articles || articles.length === 0) return null;

  const baseUrl = "https://politie-forum.nl";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/#popular-discussions`,
    name: "Populaire Forum Artikelen",
    "description": "Meest gelezen en besproken forumthreads over politie, criminaliteit en veiligheid in Nederland",
    "itemListOrder": "https://schema.org/ItemListOrderDescending",
    "numberOfItems": Math.min(articles.length, 3),
    "itemListElement": articles.slice(0, 3).map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "DiscussionForumPosting",
        "@id": `${baseUrl}/nieuws/${article.slug}`,
        "url": `${baseUrl}/nieuws/${article.slug}`,
        "headline": article.title,
        "text": article.excerpt || article.title,
        "datePublished": article.datePublished || new Date().toISOString(),
        "dateModified": article.datePublished || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": article.author || "Politie Forum Redactie",
          "url": `${baseUrl}/redactie`,
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${baseUrl}/#org`,
          "name": "Politie Forum Nederland",
          "url": `${baseUrl}/`,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.svg`,
            "width": 512,
            "height": 512,
          },
        },
        "interactionStatistic": [
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/CommentAction",
            "userInteractionCount": article.commentCount || 0,
          },
          {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ViewAction",
            "userInteractionCount": 0, // Future: implement view tracking
          },
        ],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${baseUrl}/#webpage`,
        },
        "inLanguage": "nl-NL",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
