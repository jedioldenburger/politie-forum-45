import { Metadata } from 'next';
import { FeitencontroleClient } from './FeitencontroleClient';

export const metadata: Metadata = {
  title: 'Feitencontrole | Politie Forum Nederland',
  description: 'Onze fact-checking methodologie beschrijft hoe we feiten verifiëren, bronnen controleren en misinformatie bestrijden met transparante en systematische verificatieprocessen.',
  alternates: {
    canonical: 'https://politie-forum.nl/feitencontrole',
  },
  openGraph: {
    title: 'Feitencontrole | Politie Forum Nederland',
    description: 'Transparante fact-checking methodologie voor accurate berichtgeving over politie en veiligheid.',
    url: 'https://politie-forum.nl/feitencontrole',
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

export default function FeitencontrolePage() {
  return <FeitencontroleClient />;
}
