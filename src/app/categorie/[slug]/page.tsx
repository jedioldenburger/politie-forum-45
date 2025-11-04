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
    'binnenland',
    'burgerparticipatie-wijkveiligheid',
    'community-cafe-off-topic',
    'criminaliteit-opsporing',
    'cybersecurity-digitale-veiligheid',
    'internationale-politie-europol',
    'publieke-veiligheid-maatschappij',
    'rechtspraak-beleid',
    'specialisaties-eenheden',
    'technologie-middelen',
    'werving-sollicitatie',
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
  'binnenland': {
    name: 'Binnenland Nieuws',
    description: 'Actueel nieuws over politie, veiligheid en justitie in Nederland. Dagelijkse updates over binnenlandse ontwikkelingen.',
    icon: 'Newspaper',
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
  'werving-sollicitatie': {
    name: 'Werving & Sollicitatie',
    description: 'Alles over politie sollicitatie, assessment, werving en carrière bij de Nederlandse politie. Tips, ervaringen en begeleiding voor aspirant-agenten.',
    icon: 'Briefcase',
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

  // Category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    'werving-sollicitatie': [
      'politie sollicitatie', 'politie assessment', 'politie werving', 'sollicitatie politie tips',
      'politie assessment voorbereiding', 'politie assessment ervaring', 'aspirant politieagent',
      'politie carriere', 'politie vacatures', 'politie recruitment', 'politie sollicitatiegesprek',
      'politie sollicitatiebrief', 'politie motivatiebrief', 'politie assessment center',
      'politie fitness test', 'politie psychologische test', 'hoe word ik politieagent',
      'politie opleiding', 'politieacademie', 'politie stage', 'politie traineeship',
    ],
    'criminaliteit-opsporing': [
      'criminaliteit', 'misdaad', 'opsporing', 'recherche', 'forensisch onderzoek',
      'criminologie', 'misdaadnieuws', 'cold case', 'opsporingsmethoden', 'politieonderzoek',
      'forensische opsporing', 'technische recherche', 'dactyloscopie', 'DNA onderzoek',
      'getuigenverhoor', 'verdachte', 'aanhouding', 'inbeslagname', 'doorzoeken',
    ],
    'cybersecurity-digitale-veiligheid': [
      'cybercrime', 'digitale opsporing', 'online veiligheid', 'hackercrime', 'phishing',
      'cybersecurity', 'digitale forensica', 'cyberpolitie', 'online fraude', 'ransomware',
      'datalek', 'identiteitsfraude', 'dark web', 'digitale bewijsvoering', 'CSIRT',
    ],
    'advocaten-rechtbanken': [
      'advocaten', 'rechtbank', 'rechtszaak', 'juridisch', 'strafpleiter', 'verdediging',
      'rechtshulp', 'advocaat strafrecht', 'rechtbanken nederland', 'gerechtshof',
      'strafproces', 'hoger beroep', 'cassatie', 'rechtspraak', 'rechter',
    ],
    'binnenland': [
      'binnenland nieuws', 'nederland actueel', 'politie nieuws vandaag', 'veiligheid nederland',
      'justitie nieuws', 'breaking news nederland', 'dagelijks politie nieuws', 'actueel politie',
      'binnenlandse zaken', 'nederlandse politie', 'veiligheid actueel', 'criminaliteit nederland',
      'politie updates', 'nieuws vandaag', 'laatste nieuws politie',
    ],
    'rechtspraak-beleid': [
      'rechtspraak', 'politiebeleid', 'wetgeving', 'strafrecht', 'openbaar ministerie',
      'justitie', 'strafwetboek', 'politiewet', 'handhaving', 'rechtsstaat',
      'wet politiegegevens', 'opiumwet', 'wapenwet', 'verkeerswetgeving',
    ],
    'specialisaties-eenheden': [
      'arrestatieteam', 'DSI', 'recherche', 'mobiele eenheid', 'ME', 'AT',
      'hondenbrigade', 'marine politie', 'luchtvaart politie', 'spoorwegpolitie',
      'observatieteam', 'specialistische opsporing', 'technische recherche',
    ],
    'internationale-politie-europol': [
      'europol', 'interpol', 'internationale samenwerking', 'grensoverschrijdende criminaliteit',
      'europese politie', 'schengen', 'europees arrestatiebevel', 'internationale opsporing',
      'samenwerking politie', 'eurojust', 'frontex',
    ],
    'burgerparticipatie-wijkveiligheid': [
      'buurtpreventie', 'wijkveiligheid', 'burgernet', 'wijkagent', 'veilige buurt',
      'bewonersorganisatie', 'burgerinitiatief', 'sociale veiligheid', 'buurtbemiddeling',
      'veiligheidsoverleg', 'overlastbestrijding', 'buurtpreventieteam',
    ],
    'publieke-veiligheid-maatschappij': [
      'publieke veiligheid', 'openbare orde', 'terreurbestrijding', 'radicalisering',
      'veiligheidsbeleid', 'noodverordening', 'crisis management', 'NCTV',
      'terrorisme', 'veiligheidsrisico', 'dreigingsniveau', 'nationale veiligheid',
    ],
    'technologie-middelen': [
      'politietechnologie', 'politieuitrusting', 'bodycam', 'ANPR', 'politievoertuigen',
      'politie wapens', 'dienstwapen', 'peperspray', 'wapenstok', 'kogelwerend vest',
      'communicatiemiddelen', 'C2000', 'politiesystemen', 'BVH', 'opsporingssystemen',
    ],
    'community-cafe-off-topic': [
      'politie forum community', 'off topic', 'algemene discussie', 'politie humor',
      'politie cultuur', 'politie anekdotes', 'politie verhalen', 'vrije discussie',
    ],
  };

  return {
    title: `${category.name} - Politie Forum Nederland`,
    description: category.description,
    keywords: categoryKeywords[slug] || [],
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
