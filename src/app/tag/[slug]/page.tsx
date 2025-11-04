import { Metadata } from "next";
import { notFound } from "next/navigation";
import TagClient from "./TagClient";

export const revalidate = 300; // ISR: rebuild every 5 minutes
export const dynamic = 'force-static';

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = [
    'actueel',
    'nederland',
    'nieuws',
    'politie',
    'veiligheid',
    'criminaliteit',
    'opsporing',
    'rechtspraak',
    'cybercrime',
    'verkeer',
  ];

  return tags.map((slug) => ({
    slug,
  }));
}

// Tag data mapping
const TAG_DATA: Record<string, { name: string; description: string }> = {
  'actueel': {
    name: 'Actueel',
    description: 'De meest actuele nieuwsberichten en discussies over politie, veiligheid en justitie in Nederland.',
  },
  'nederland': {
    name: 'Nederland',
    description: 'Nieuws en discussies specifiek gericht op politie en veiligheid in Nederland.',
  },
  'nieuws': {
    name: 'Nieuws',
    description: 'Alle nieuwsartikelen over politie, criminaliteit, rechtspraak en veiligheid.',
  },
  'politie': {
    name: 'Politie',
    description: 'Alles over de Nederlandse politie: nieuws, discussies, carrière en ontwikkelingen.',
  },
  'veiligheid': {
    name: 'Veiligheid',
    description: 'Discussies en nieuws over publieke veiligheid, criminaliteitspreventie en handhaving.',
  },
  'criminaliteit': {
    name: 'Criminaliteit',
    description: 'Misdaadnieuws, opsporingsresultaten en discussies over criminele ontwikkelingen.',
  },
  'opsporing': {
    name: 'Opsporing',
    description: 'Opsporingsmethoden, recherche-onderzoeken en forensische ontwikkelingen.',
  },
  'rechtspraak': {
    name: 'Rechtspraak',
    description: 'Juridische uitspraken, rechtszaken en ontwikkelingen in de Nederlandse rechtspraak.',
  },
  'cybercrime': {
    name: 'Cybercrime',
    description: 'Digitale criminaliteit, cybersecurity en online opsporingsmethoden.',
  },
  'verkeer': {
    name: 'Verkeer',
    description: 'Verkeershandhaving, verkeersveiligheid en verkeerscriminaliteit.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = TAG_DATA[slug];

  if (!tag) {
    return {
      title: 'Tag niet gevonden',
    };
  }

  return {
    title: `Tag: ${tag.name} | Politie Forum Nederland`,
    description: tag.description,
    keywords: [
      tag.name.toLowerCase(),
      `${tag.name.toLowerCase()} politie`,
      `${tag.name.toLowerCase()} forum`,
      `${tag.name.toLowerCase()} nieuws`,
      `${tag.name.toLowerCase()} discussie`,
      'politie forum',
      'veiligheid',
      'justitie',
    ],
    alternates: {
      canonical: `https://politie-forum.nl/tag/${slug}`,
    },
    openGraph: {
      url: `https://politie-forum.nl/tag/${slug}`,
      type: 'website',
      siteName: 'Politie Forum Nederland',
      locale: 'nl_NL',
      title: `Tag: ${tag.name} | Politie Forum Nederland`,
      description: tag.description,
    },
    other: {
      "og:updated_time": new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@politieforum',
      creator: '@politieforum',
      title: `Tag: ${tag.name}`,
      description: tag.description,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = TAG_DATA[slug];

  if (!tag) {
    notFound();
  }

  return <TagClient tag={tag} slug={slug} />;
}
