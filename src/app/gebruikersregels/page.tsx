import { Metadata } from 'next';
import { GebruikersregelsClient } from './GebruikersregelsClient';

export const metadata: Metadata = {
  title: 'Gebruikersregels | Politie Forum Nederland',
  description: 'Onze gebruikersregels beschrijven acceptabel gedrag, verboden activiteiten, gevolgen van overtredingen en hoe u overtredingen kunt melden. Voor een veilige community.',
  alternates: {
    canonical: 'https://politie-forum.nl/gebruikersregels',
  },
  openGraph: {
    title: 'Gebruikersregels | Politie Forum Nederland',
    description: 'Onze gebruikersregels beschrijven acceptabel gedrag, verboden activiteiten en community standards voor een veilige online omgeving.',
    url: 'https://politie-forum.nl/gebruikersregels',
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

export default function GebruikersregelsPage() {
  return <GebruikersregelsClient />;
}
