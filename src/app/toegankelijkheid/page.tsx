import { Metadata } from 'next';
import { ToegankelijkheidClient } from './ToegankelijkheidClient';

export const metadata: Metadata = {
  title: 'Toegankelijkheidsverklaring | Politie Forum Nederland',
  description: 'Onze toegankelijkheidsverklaring beschrijft hoe we WCAG 2.1 Level AA naleven, welke toegankelijkheidsfuncties beschikbaar zijn en hoe u problemen kunt melden.',
  alternates: {
    canonical: 'https://politie-forum.nl/toegankelijkheid',
  },
  openGraph: {
    title: 'Toegankelijkheidsverklaring | Politie Forum Nederland',
    description: 'WCAG 2.1 Level AA compliant - keyboard navigation, screen reader support, en toegankelijkheidsfeatures voor iedereen.',
    url: 'https://politie-forum.nl/toegankelijkheid',
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

export default function ToegankelijkheidPage() {
  return <ToegankelijkheidClient />;
}
