import { MetadataRoute } from "next";

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://politie-forum.nl";

  // Static pages - Core (12 pages)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nieuws`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categorieen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/crime-map-nederland`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/redactie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/leden`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profiel`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.2,
    },
    // Legal & Privacy (9 pages)
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/voorwaarden`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/nieuws-disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/forum-disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gebruikersregels`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/moderatie-beleid`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/toegankelijkheid`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Journalistiek (3 pages)
    {
      url: `${baseUrl}/redactionele-principes`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/feitencontrole`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/correcties`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Bedrijfsinformatie (2 pages)
    {
      url: `${baseUrl}/over`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/eigendom`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Contact (3 pages)
    {
      url: `${baseUrl}/tips`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Categories (12 pages)
  const categoryPages: MetadataRoute.Sitemap = [
    'advocaten-rechtbanken',
    'binnenland',
    'burgerparticipatie-wijkveiligheid',
    'community-cafe-off-topic',
    'criminaliteit-opsporing',
    'cybersecurity-digitale-veiligheid',
    'internationale-politie-europol',
    'politiewerk-carriere',
    'publieke-veiligheid-maatschappij',
    'rechtspraak-beleid',
    'specialisaties-eenheden',
    'technologie-middelen',
    'werving-sollicitatie',
  ].map((slug) => ({
    url: `${baseUrl}/categorie/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Tags (18 pages) - All tags from generateStaticParams
  const tagPages: MetadataRoute.Sitemap = [
    'actueel',
    'nederland',
    'nieuws',
    'politie',
    'veiligheid',
    'criminaliteit',
    'opsporing',
    'rechtspraak',
    'cybercrime',
    'cybersecurity',
    'verkeer',
    'privacy',
    'advocatuur',
    'drugs',
    'openbaar-ministerie',
    'geweld',
    'terrorisme',
    'wijkveiligheid',
  ].map((slug) => ({
    url: `${baseUrl}/tag/${slug}`,
    lastModified: new Date(),
    changeFrequency: ['politie', 'veiligheid', 'criminaliteit', 'actueel', 'nieuws'].includes(slug) 
      ? "daily" as const 
      : "weekly" as const,
    priority: 0.6,
  }));

  // NOTE: Article URLs (/nieuws/[slug]) are NOT included here
  // They are served via /news-sitemap.xml for Google News optimization
  
  return [...staticPages, ...categoryPages, ...tagPages];
}
