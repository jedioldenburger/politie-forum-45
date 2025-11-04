// Google News Sitemap - Article pages only
// Compliant with Google News Publisher Center requirements
import { adminFirestore } from "@/lib/firebaseAdmin";

export const revalidate = 600; // Revalidate every 10 minutes for fresh news

export async function GET() {
  const baseUrl = "https://politie-forum.nl";

  try {
    // Fetch all published articles from Firestore
    const articlesSnapshot = await adminFirestore
      .collection("news")
      .orderBy("publishedAt", "desc")
      .limit(1000) // Google News accepts max 1000 articles
      .get();

    const articles = articlesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const publishedDate = data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : new Date().toISOString();

      return {
        loc: `${baseUrl}/nieuws/${doc.id}`,
        lastmod: publishedDate,
        changefreq: "daily",
        priority: 0.9,
        // Google News specific fields
        news: {
          publication: {
            name: "Politie Forum Nederland",
            language: "nl",
          },
          publication_date: publishedDate,
          title: data.title || "Politie Nieuws",
        },
      };
    });

    // Generate Google News Sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (article) => `  <url>
    <loc>${article.loc}</loc>
    <lastmod>${article.lastmod}</lastmod>
    <changefreq>${article.changefreq}</changefreq>
    <priority>${article.priority}</priority>
    <news:news>
      <news:publication>
        <news:name>${article.news.publication.name}</news:name>
        <news:language>${article.news.publication.language}</news:language>
      </news:publication>
      <news:publication_date>${article.news.publication_date}</news:publication_date>
      <news:title>${escapeXml(article.news.title)}</news:title>
    </news:news>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        "X-Robots-Tag": "noindex", // Don't index the sitemap itself
      },
    });
  } catch (error) {
    console.error("Error generating news sitemap:", error);

    // Return empty sitemap on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
      }
    );
  }
}

// XML escape helper
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
