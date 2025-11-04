// Main sitemap - Static website pages only (no news articles)
import { MetadataRoute } from "next";

export const revalidate = 86400; // Revalidate once per day

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://politie-forum.nl";
  const now = new Date();

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Core pages
    {
      url: `${baseUrl}/nieuws`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categorieen`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/crime-map-nederland`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/over`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/redactie`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profiel`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Legal pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/voorwaarden`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/toegankelijkheid`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/nieuws-disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/forum-disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gebruikersregels`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/moderatie-beleid`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // Editorial pages
    {
      url: `${baseUrl}/redactionele-principes`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/feitencontrole`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/correcties`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/eigendom`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Categories
    ...['advocaten-rechtbanken', 'binnenland', 'burgerparticipatie-wijkveiligheid', 
        'community-cafe-off-topic', 'criminaliteit-opsporing', 'cybersecurity-digitale-veiligheid',
        'internationale-politie-europol', 'publieke-veiligheid-maatschappij', 'rechtspraak-beleid',
        'specialisaties-eenheden', 'technologie-middelen', 'werving-sollicitatie'].map((slug) => ({
      url: `${baseUrl}/categorie/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Popular tags
    ...['politie', 'veiligheid', 'criminaliteit', 'nieuws', 'actueel', 'nederland',
        'rechtspraak', 'cybersecurity', 'opsporing', 'advocatuur'].map((slug) => ({
      url: `${baseUrl}/tag/${slug}`,
      lastModified: now,
      changeFrequency: slug === 'nieuws' || slug === 'actueel' ? "daily" as const : "weekly" as const,
      priority: 0.6,
    })),
  ];
}
