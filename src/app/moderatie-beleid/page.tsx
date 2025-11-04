import { Metadata } from 'next';
import { ModeratiebeleidClient } from './ModeratiebeleidClient';

export const metadata: Metadata = {
  title: 'Moderatiebeleid | Politie Forum Nederland',
  description: 'Ons moderatiebeleid legt uit hoe we content modereren, welke criteria we hanteren, het waarschuwingssysteem, appealprocedures en transparantie in moderatie-beslissingen.',
  alternates: {
    canonical: 'https://politie-forum.nl/moderatie-beleid',
  },
  openGraph: {
    title: 'Moderatiebeleid | Politie Forum Nederland',
    description: 'Transparant moderatiebeleid - criteria, procedures, appeals en moderator gedragscode voor een veilige community.',
    url: 'https://politie-forum.nl/moderatie-beleid',
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

export default function ModeratiebeleidPage() {
  return <ModeratiebeleidClient />;
}
