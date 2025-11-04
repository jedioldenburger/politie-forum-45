// Optimized for Google, Bing, Google News, and Google Discover
// Updated: 2025-11-04
export default function robots() {
  return {
    rules: [
      // Google News crawler - highest priority, zero crawl delay
      {
        userAgent: "Googlebot-News",
        allow: ["/nieuws/", "/news-sitemap.xml"],
        disallow: ["/api/", "/admin/"],
        crawlDelay: 0,
      },
      // Google general crawler
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      // Google Image crawler (for Google Discover)
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      // Bingbot (Microsoft search)
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 0,
      },
      // All other crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login/", "/register/", "/zoeken"],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      "https://politie-forum.nl/sitemap.xml",
      "https://politie-forum.nl/news-sitemap.xml",
    ],
    host: "https://politie-forum.nl",
  };
}
