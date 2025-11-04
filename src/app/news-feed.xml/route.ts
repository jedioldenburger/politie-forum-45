/**
 * Google News Sitemap for Politie Forum Nederland
 * Optimized for Google News indexing with news-specific tags
 * Endpoint: https://politie-forum.nl/news-feed.xml
 */

import { getLatestArticles } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    // Google News only indexes articles from the last 2 days
    const articles = await getLatestArticles(100);
    
    // Filter to last 48 hours
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    const recentArticles = articles.filter(
      (article) => {
        const publishTime = article.publishedAt || Date.now();
        return new Date(publishTime).getTime() > twoDaysAgo;
      }
    );

    const baseUrl = "https://politie-forum.nl";

    const newsItems = recentArticles
      .map((article) => {
        const articleUrl = `${baseUrl}/nieuws/${article.slug}/`;
        const pubDate = new Date(article.publishedAt || Date.now()).toISOString();

        // Google News requires publication_date in ISO format
        const publicationDate = pubDate;

        // Clean title (no HTML)
        const title = article.title.replace(/<[^>]*>/g, "").trim();

        // Keywords from tags (max 10 for Google News)
        const keywords = (article.tags || [])
          .slice(0, 10)
          .join(", ");

        return `
  <url>
    <loc>${articleUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>Politie Forum Nederland</news:name>
        <news:language>nl</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title><![CDATA[${title}]]></news:title>
      ${keywords ? `<news:keywords><![CDATA[${keywords}]]></news:keywords>` : ""}
    </news:news>
    <lastmod>${pubDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`;
      })
      .join("\n");

    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;

    return new NextResponse(newsSitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating Google News feed:", error);
    return new NextResponse("Error generating Google News feed", { status: 500 });
  }
}
