import type { Metadata } from 'next';
import { CookiesClient } from './CookiesClient';

export const metadata: Metadata = {
  title: 'Cookiebeleid | Politie Forum Nederland',
  description: 'Ons cookiebeleid legt uit welke cookies we gebruiken, waarom we ze gebruiken en hoe u uw voorkeuren kunt beheren. GDPR-compliant en transparant.',
  alternates: {
    canonical: 'https://politie-forum.nl/cookies',
  },
  openGraph: {
    title: 'Cookiebeleid | Politie Forum Nederland',
    description: 'Ons cookiebeleid legt uit welke cookies we gebruiken, waarom we ze gebruiken en hoe u uw voorkeuren kunt beheren. GDPR-compliant en transparant.',
    url: 'https://politie-forum.nl/cookies',
    siteName: 'Politie Forum Nederland',
    locale: 'nl_NL',
    type: 'website',
  },
  icons: [
    { url: '/police_badge_icon_16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/police_badge_icon_32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/police_badge_icon_512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};

export default function CookiesPage() {
  return <CookiesClient />;
}
