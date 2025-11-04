import { getLatestArticles, getServerCategories } from "@/lib/firebaseAdmin";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryClient from "./CategoryClient";

export const revalidate = 300; // ISR: rebuild every 5 minutes
export const dynamic = 'force-static';

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = [
    'advocaten-rechtbanken',
    'burgerparticipatie-wijkveiligheid',
    'community-cafe-off-topic',
    'criminaliteit-opsporing',
    'cybersecurity-digitale-veiligheid',
    'internationale-politie-europol',
    'publieke-veiligheid-maatschappij',
    'rechtspraak-beleid',
    'specialisaties-eenheden',
    'technologie-middelen',
  ];

  return categories.map((slug) => ({
    slug,
  }));
}

// Category data mapping
const CATEGORY_DATA: Record<string, { name: string; description: string; icon: string }> = {
  'advocaten-rechtbanken': {
    name: 'Advocaten & Rechtbanken',
    description: 'Discussies over advocaten, rechtbanken, en juridische procedures in het Nederlandse rechtssysteem.',
    icon: 'Gavel',
  },
  'burgerparticipatie-wijkveiligheid': {
    name: 'Burgerparticipatie & Wijkveiligheid',
    description: 'Buurtpreventie, burgerinitiatief en veiligheidssamenwerking in Nederlandse wijken.',
    icon: 'Users',
  },
  'community-cafe-off-topic': {
    name: 'Community Café (Off-Topic)',
    description: 'Algemene gesprekken, humor, en niet-politie gerelateerde onderwerpen.',
    icon: 'Coffee',
  },
  'criminaliteit-opsporing': {
    name: 'Criminaliteit & Opsporing',
    description: 'Misdaadnieuws, opsporingsmethoden, en forensisch onderzoek.',
    icon: 'AlertCircle',
  },
  'cybersecurity-digitale-veiligheid': {
    name: 'Cybersecurity & Digitale Veiligheid',
    description: 'Cybercrime, digitale opsporing, en online veiligheid.',
    icon: 'Shield',
  },
  'internationale-politie-europol': {
    name: 'Internationale Politie & Europol',
    description: 'Europese politiesamenwerking, Europol, Interpol en internationale misdaadbestrijding.',
    icon: 'Globe',
  },
  'publieke-veiligheid-maatschappij': {
    name: 'Publieke Veiligheid & Maatschappij',
    description: 'Veiligheidsbeleid, terreurbestrijding, en maatschappelijke veiligheidskwesties.',
    icon: 'Shield',
  },
  'rechtspraak-beleid': {
    name: 'Rechtspraak & Beleid',
    description: 'Wettelijke ontwikkelingen, politiebeleid, en rechtspraak.',
    icon: 'Scale',
  },
  'specialisaties-eenheden': {
    name: 'Specialisaties & Eenheden',
    description: 'Gespecialiseerde politie-eenheden zoals AT, DSI, en Hondenbrigade.',
    icon: 'Target',
  },
  'technologie-middelen': {
    name: 'Technologie & Middelen',
    description: 'Politietechnologie, uitrusting, voertuigen en technische innovaties.',
    icon: 'Cpu',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_DATA[slug];

  if (!category) {
    return {
      title: 'Categorie niet gevonden',
    };
  }

  return {
    title: `${category.name} - Politie Forum Nederland`,
    description: category.description,
    alternates: {
      canonical: `https://politie-forum.nl/categorie/${slug}`,
    },
    openGraph: {
      title: `${category.name} - Politie Forum Nederland`,
      description: category.description,
      url: `https://politie-forum.nl/categorie/${slug}`,
      type: 'website',
      siteName: 'Politie Forum Nederland',
      locale: 'nl_NL',
      images: [{
        url: 'https://politie-forum.nl/og/politie-forum-1200x630.png',
        width: 1200,
        height: 630,
        alt: `${category.name} - Politie Forum Nederland`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@politieforum',
      creator: '@politieforum',
      images: ['https://politie-forum.nl/og/politie-forum-1200x630.png'],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORY_DATA[slug];

  if (!category) {
    notFound();
  }

  // Fetch articles (for now, just get latest articles - can be filtered by category later)
  const articles = await getLatestArticles(20);
  const categories = await getServerCategories().catch(() => []);

  return <CategoryClient category={{ ...category, slug }} articles={articles} allCategories={categories} />;
}
