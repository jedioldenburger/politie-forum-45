/**
 * RSS 2.0 Feed for Politie Forum Nederland
 * Standard RSS feed for news aggregators and readers
 * Endpoint: https://politie-forum.nl/feed.xml
 */

import { getLatestArticles } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const articles = await getLatestArticles(50); // Last 50 articles

    const buildDate = new Date().toUTCString();
    const baseUrl = "https://politie-forum.nl";

    const rssItems = articles
      .map((article) => {
        const articleUrl = `${baseUrl}/nieuws/${article.slug}/`;
        const pubDate = new Date(article.publishedAt || Date.now()).toUTCString();
        
        // Clean description for RSS (no HTML tags)
        const description = (article.excerpt || "")
          .replace(/<[^>]*>/g, "")
          .trim();

        // Category mapping
        const category = article.category || "Politie Nieuws";

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category><![CDATA[${category}]]></category>
      ${article.author ? `<author>redactie@politie-forum.nl (${article.author})</author>` : ""}
      ${article.imageUrl ? `<enclosure url="${article.imageUrl}" type="image/jpeg" />` : ""}
      <source url="${baseUrl}/feed.xml">Politie Forum Nederland</source>
    </item>`;
      })
      .join("\n");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Politie Forum Nederland - Politie Nieuws Forum</title>
    <link>${baseUrl}/</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Het grootste nederlands politie forum met dagelijks politie nieuws, politie discussie en actuele updates over veiligheid, criminaliteit en justitie.</description>
    <language>nl-NL</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Politie Forum Nederland</title>
      <link>${baseUrl}/</link>
    </image>
    <copyright>© ${new Date().getFullYear()} Politie Forum Nederland</copyright>
    <managingEditor>redactie@politie-forum.nl (Politie Forum Redactie)</managingEditor>
    <webMaster>info@politie-forum.nl (Politie Forum Webmaster)</webMaster>
    <category>News</category>
    <category>Politics</category>
    <category>Society</category>
${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
