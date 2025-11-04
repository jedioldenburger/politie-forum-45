/**
 * Creative Work Series Schema Generator
 * For article collections, news series, and content categories
 *
 * @version 1.0
 * @date October 14, 2025
 */

const BASE_URL = "https://politie-forum.nl";

export interface SeriesArticle {
  slug: string;
  title: string;
  publishedAt?: string;
}

/**
 * Generate CreativeWorkSeries for article collections
 */
export function generateCreativeWorkSeries(
  seriesName: string,
  seriesDescription: string,
  articles: SeriesArticle[],
  category?: string
): Record<string, any> {
  const seriesId = category
    ? `${BASE_URL}/categorie/${category}#series`
    : `${BASE_URL}/#article-series`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    "@id": seriesId,
    "name": seriesName,
    "description": seriesDescription,
    "inLanguage": "nl-NL",
    "publisher": { "@id": `${BASE_URL}/#org` },
    "hasPart": articles.map((article) => ({
      "@type": "NewsArticle",
      "@id": `${BASE_URL}/nieuws/${article.slug}`,
      "headline": article.title,
      "url": `${BASE_URL}/nieuws/${article.slug}`,
      ...(article.publishedAt && { "datePublished": article.publishedAt }),
    })),
  };
}

/**
 * Generate CollectionPage schema for category pages
 */
export function generateCollectionPage(
  categoryName: string,
  categorySlug: string,
  description: string,
  articles: SeriesArticle[]
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/categorie/${categorySlug}`,
    "url": `${BASE_URL}/categorie/${categorySlug}`,
    "name": categoryName,
    "description": description,
    "inLanguage": "nl-NL",
    "isPartOf": { "@id": `${BASE_URL}/#website` },
    "mainEntity": {
      "@type": "ItemList",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": articles.length,
      "itemListElement": articles.map((article, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "NewsArticle",
          "@id": `${BASE_URL}/nieuws/${article.slug}`,
          "headline": article.title,
          "url": `${BASE_URL}/nieuws/${article.slug}`,
        },
      })),
    },
  };
}
