export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/private/", "/zoeken"],
      },
    ],
    sitemap: "https://politie-forum.nl/sitemap.xml",
  };
}
