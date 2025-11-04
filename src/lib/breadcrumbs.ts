/**
 * Breadcrumb Generator for Politie Forum Nederland
 *
 * Generates dynamic BreadcrumbList JSON-LD schema for pages
 * Based on current route and page context
 *
 * @version 1.0
 * @date October 14, 2025
 */

const BASE_URL = "https://politie-forum.nl";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList schema for a given page
 */
export function generateBreadcrumbs(items: BreadcrumbItem[]): Record<string, any> {
  // Always start with Home
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", url: `${BASE_URL}/` },
    ...items,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${BASE_URL}/#breadcrumb`,
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

/**
 * Generate breadcrumbs for article/news pages
 */
export function generateArticleBreadcrumbs(
  category: { displayName: string; path: string; slug?: string } | string,
  title: string,
  slug: string
): Record<string, any> {
  const categoryInfo =
    typeof category === "string"
      ? {
          displayName: category,
          path: `/nieuws/${encodeURIComponent(
            category.toLowerCase().replace(/\s+/g, "-")
          )}/`,
        }
      : category;

  const categoryPath = categoryInfo.path.startsWith("/")
    ? categoryInfo.path
    : `/${categoryInfo.path}`;

  return generateBreadcrumbs([
    { name: "Nieuws", url: `${BASE_URL}/nieuws/` },
    {
      name: categoryInfo.displayName,
      url: `${BASE_URL}${categoryPath}`,
    },
    { name: title, url: `${BASE_URL}/nieuws/${slug}/` },
  ]);
}

/**
 * Generate breadcrumbs for category pages
 */
export function generateCategoryBreadcrumbs(
  categoryName: string,
  categorySlug: string
): Record<string, any> {
  return generateBreadcrumbs([
    { name: "Categorieën", url: `${BASE_URL}/categorieen` },
    { name: categoryName, url: `${BASE_URL}/categorie/${categorySlug}` },
  ]);
}

/**
 * Generate breadcrumbs for topic pages
 */
export function generateTopicBreadcrumbs(
  categoryName: string,
  categorySlug: string,
  topicTitle: string,
  topicId: string
): Record<string, any> {
  return generateBreadcrumbs([
    { name: "Forum", url: `${BASE_URL}/` },
    { name: categoryName, url: `${BASE_URL}/categorie/${categorySlug}` },
    { name: topicTitle, url: `${BASE_URL}/topic/${topicId}` },
  ]);
}

/**
 * Generate breadcrumbs for static pages
 */
export function generateStaticPageBreadcrumbs(
  pageName: string,
  pageSlug: string
): Record<string, any> {
  return generateBreadcrumbs([
    { name: pageName, url: `${BASE_URL}/${pageSlug}` },
  ]);
}
