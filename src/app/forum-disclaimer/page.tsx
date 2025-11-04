import { Metadata } from 'next';
import { ForumDisclaimerClient } from './ForumDisclaimerClient';

export const metadata: Metadata = {
  title: 'Forum Disclaimer | Politie Forum Nederland',
  description: 'Onze forum disclaimer legt uit hoe we omgaan met user-generated content, moderatie, aansprakelijkheid en verantwoordelijkheden van leden. Transparant en duidelijk.',
  alternates: {
    canonical: 'https://politie-forum.nl/forum-disclaimer',
  },
  openGraph: {
    title: 'Forum Disclaimer | Politie Forum Nederland',
    description: 'Onze forum disclaimer legt uit hoe we omgaan met user-generated content, moderatie, aansprakelijkheid en verantwoordelijkheden van leden.',
    url: 'https://politie-forum.nl/forum-disclaimer',
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

export default function ForumDisclaimerPage() {
  return <ForumDisclaimerClient />;
}
