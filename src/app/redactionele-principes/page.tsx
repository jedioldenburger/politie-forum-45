import { Metadata } from 'next';
import { RedactionelePrincipesClient } from './RedactionelePrincipesClient';

export const metadata: Metadata = {
  title: 'Redactionele Principes | Politie Forum Nederland',
  description: 'Onze redactionele principes beschrijven onze journalistieke standaarden, E-E-A-T compliance, onafhankelijkheid, transparantie en ethische richtlijnen voor nieuwsgaring en publicatie.',
  alternates: {
    canonical: 'https://politie-forum.nl/redactionele-principes',
  },
  openGraph: {
    title: 'Redactionele Principes | Politie Forum Nederland',
    description: 'Onze missie, journalistieke standaarden en E-E-A-T principes voor betrouwbare nieuwsvoorziening over politie en veiligheid.',
    url: 'https://politie-forum.nl/redactionele-principes',
    siteName: 'Politie Forum Nederland',
    locale: 'nl_NL',
    type: 'website',
  },
  icons: [
    { rel: 'icon', url: '/police_badge_icon_16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'icon', url: '/police_badge_icon_32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', url: '/police_badge_icon_512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};

export default function RedactionelePrincipesPage() {
  return <RedactionelePrincipesClient />;
}
