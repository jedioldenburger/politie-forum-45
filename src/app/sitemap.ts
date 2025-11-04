import { adminFirestore } from "@/lib/firebaseAdmin";
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

  // Fetch all articles from Firestore
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const articlesSnapshot = await adminFirestore.collection("news").get();

    articlePages = articlesSnapshot.docs.map((doc) => {
      const data = doc.data();
      const publishedDate = data.publishedAt
        ? new Date(data.publishedAt)
        : new Date();

      return {
        url: `${baseUrl}/nieuws/${doc.id}`,
        lastModified: publishedDate,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  // Categories (10 pages)
  const categoryPages: MetadataRoute.Sitemap = [
    'advocaten-rechtbanken',
    'burgerparticipatie-wijkveiligheid',
    'community-cafe-off-topic',
    'criminaliteit-opsporing',
    'cybersecurity-digitale-veiligheid',
    'internationale-politie-europol',
    'publieke-veiligheid-maatschappij',
    'rechtspraak-beleid',
    'specialisaties-eenheden',
    'technologie-middelen'
  ].map((slug) => ({
    url: `${baseUrl}/categorie/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Tags (15 pages)
  const tagPages: MetadataRoute.Sitemap = [
    'politie',
    'veiligheid',
    'criminaliteit',
    'rechtspraak',
    'cybersecurity',
    'terrorisme',
    'fraude',
    'drugs',
    'geweld',
    'opsporing',
    'advocatuur',
    'openbaar-ministerie',
    'wijkveiligheid',
    'surveillance',
    'privacy'
  ].map((slug) => ({
    url: `${baseUrl}/tag/${slug}`,
    lastModified: new Date(),
    changeFrequency: slug === 'politie' || slug === 'veiligheid' || slug === 'criminaliteit' ? "daily" as const : "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...tagPages, ...articlePages];
}
