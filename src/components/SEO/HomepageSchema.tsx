"use client";

interface ArticleItem {
  slug: string;
  title: string;
}

interface CategoryItem {
  id: string;
  name: string;
  description?: string;
}

interface FAQItem {
  question: string;
  shortAnswer: string; // optimized 50–160 chars
  longAnswer: string;  // not used here, but preserved for potential future expansion
}

interface HomepageSchemaProps {
  articles: ArticleItem[];
  categories?: CategoryItem[];
  updatedAt?: string;
  faqData?: FAQItem[];
}

export default function HomepageSchema({ articles, categories = [], updatedAt, faqData = [] }: HomepageSchemaProps) {
  const baseUrl = "https://politie-forum.nl";

  const itemList = articles.slice(0, 10).map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${baseUrl}/nieuws/${a.slug}`,
    name: a.title,
  }));

  // Person schema for editorial team (E-E-A-T signal)
  const editorPerson = {
    "@type": "Person",
    "@id": `${baseUrl}/#editor`,
    name: "Politie Forum Redactie",
    jobTitle: "Hoofdredacteur",
    description: "Ervaren redactieteam gespecialiseerd in politie, veiligheid en justitiezaken met jarenlange expertise in Nederlandse criminaliteitsanalyse.",
    worksFor: { "@id": `${baseUrl}/#org` },
    knowsAbout: [
      "Nederlandse Politie",
      "Criminaliteitsanalyse",
      "Veiligheidszaken",
      "Justitie en Rechtspraak",
      "Politie Organisatie",
      "Misdaadpreventie",
    ],
    url: `${baseUrl}/over`,
    sameAs: [
      "https://x.com/politieforum",
      "https://linkedin.com/company/politie-forum",
    ],
  };

  // FAQPage schema (E-E-A-T + Knowledge Graph)
  const faqSchema = faqData.length > 0 ? {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.shortAnswer,
      },
    })),
  } : null;

  // Dynamic category collection pages
  const categoryPages = categories.slice(0, 8).map((c) => ({
    "@type": "CollectionPage",
    "@id": `${baseUrl}/categorie/${c.id}`,
    name: c.name,
    description: c.description || `Discussies in de categorie ${c.name}`,
    url: `${baseUrl}/categorie/${c.id}`,
    isPartOf: { "@id": `${baseUrl}/#website` },
    inLanguage: "nl-NL",
  }));

  const hasPart = [
    {
      "@type": "CollectionPage",
      "@id": `${baseUrl}/nieuws`,
      name: "Nieuws",
      url: `${baseUrl}/nieuws`,
      description: "Laatste politienieuws en actuele artikelen.",
      isPartOf: { "@id": `${baseUrl}/#website` },
      inLanguage: "nl-NL",
    },
    {
      "@type": "CollectionPage",
      "@id": `${baseUrl}/categorieen`,
      name: "Categorieën",
      url: `${baseUrl}/categorieen`,
      description: "Overzicht van discussies en thematische categorieën.",
      isPartOf: { "@id": `${baseUrl}/#website` },
      inLanguage: "nl-NL",
    },
    ...categoryPages,
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/over`,
      name: "Over",
      url: `${baseUrl}/over`,
      description: "Informatie over Politie Forum Nederland en haar missie.",
      isPartOf: { "@id": `${baseUrl}/#website` },
      inLanguage: "nl-NL",
    },
    {
      "@type": "WebPage",
      "@id": `${baseUrl}/contact`,
      name: "Contact",
      url: `${baseUrl}/contact`,
      description: "Neem contact op met de redactie van Politie Forum Nederland.",
      isPartOf: { "@id": `${baseUrl}/#website` },
      inLanguage: "nl-NL",
    },
  ];

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}/#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
    ],
  };

  const siteNavigation = {
    "@type": "SiteNavigationElement",
    "@id": `${baseUrl}/#nav`,
    name: ["Nieuws", "Categorieën", "Over", "Contact"],
    url: [
      `${baseUrl}/nieuws`,
      `${baseUrl}/categorieen`,
      `${baseUrl}/over`,
      `${baseUrl}/contact`,
    ],
  };

  // Homepage-specific schema only (Organization, WebSite, WebPage, BreadcrumbList, SiteNavigationElement in layout.tsx)
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#latest-articles`,
        name: "Laatste Artikelen",
        description: "Meest recente nieuwsartikelen op Politie Forum Nederland",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: itemList.length,
        itemListElement: itemList,
      },
      editorPerson,
      ...(faqSchema ? [faqSchema] : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
