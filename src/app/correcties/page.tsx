import { Metadata } from 'next';
import { CorrectiesClient } from './CorrectiesClient';

export const metadata: Metadata = {
  title: 'Correcties | Politie Forum Nederland',
  description: 'Transparante lijst van alle correcties en updates aan onze artikelen. We nemen verantwoordelijkheid voor fouten en corrigeren ze snel en openbaar.',
  alternates: {
    canonical: 'https://politie-forum.nl/correcties',
  },
  openGraph: {
    title: 'Correcties | Politie Forum Nederland',
    description: 'Transparante correctiepagina met alle fouten en updates aan onze journalistieke content.',
    url: 'https://politie-forum.nl/correcties',
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

export default function CorrectiesPage() {
  return <CorrectiesClient />;
}
