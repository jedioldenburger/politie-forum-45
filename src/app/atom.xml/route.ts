/**
 * Atom 1.0 Feed for Politie Forum Nederland
 * Modern Atom feed format for news aggregators
 * Endpoint: https://politie-forum.nl/atom.xml
 */

import { getLatestArticles } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const articles = await getLatestArticles(50); // Last 50 articles

    const updated = new Date().toISOString();
    const baseUrl = "https://politie-forum.nl";

    const atomEntries = articles
      .map((article) => {
        const articleUrl = `${baseUrl}/nieuws/${article.slug}/`;
        const published = new Date(article.publishedAt || Date.now()).toISOString();
        const updated = article.updatedAt
          ? new Date(article.updatedAt).toISOString()
          : published;

        // Clean summary for Atom (no HTML tags)
        const summary = (article.excerpt || "")
          .replace(/<[^>]*>/g, "")
          .trim();

        // Clean content (preserve some HTML for Atom)
        const content = (article.content || article.excerpt || "")
          .replace(/<script[^>]*>.*?<\/script>/gi, "")
          .trim();

        return `
  <entry>
    <title type="html"><![CDATA[${article.title}]]></title>
    <link href="${articleUrl}" rel="alternate" type="text/html" />
    <id>${articleUrl}</id>
    <published>${published}</published>
    <updated>${updated}</updated>
    <author>
      <name>${article.author || "Politie Forum Redactie"}</name>
      <email>redactie@politie-forum.nl</email>
    </author>
    <summary type="text"><![CDATA[${summary}]]></summary>
    <content type="html"><![CDATA[${content}]]></content>
    ${article.category ? `<category term="${article.category}" />` : ""}
    ${article.tags?.map((tag) => `<category term="${tag}" />`).join("\n    ") || ""}
  </entry>`;
      })
      .join("\n");

    const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="nl-NL">
  <title>Politie Forum Nederland - Politie Nieuws Forum</title>
  <link href="${baseUrl}/" rel="alternate" type="text/html" />
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml" />
  <id>${baseUrl}/</id>
  <updated>${updated}</updated>
  <subtitle>Het grootste nederlands politie forum met dagelijks politie nieuws, politie discussie en actuele updates over veiligheid, criminaliteit en justitie.</subtitle>
  <rights>© ${new Date().getFullYear()} Politie Forum Nederland. Alle rechten voorbehouden.</rights>
  <generator uri="https://politie-forum.nl/" version="1.0">Politie Forum Nederland</generator>
  <author>
    <name>Politie Forum Redactie</name>
    <email>redactie@politie-forum.nl</email>
    <uri>${baseUrl}/redactie/</uri>
  </author>
  <icon>${baseUrl}/favicon.ico</icon>
  <logo>${baseUrl}/logo.png</logo>
${atomEntries}
</feed>`;

    return new NextResponse(atomFeed, {
      headers: {
        "Content-Type": "application/atom+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating Atom feed:", error);
    return new NextResponse("Error generating Atom feed", { status: 500 });
  }
}
