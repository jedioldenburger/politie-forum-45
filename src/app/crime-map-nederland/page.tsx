import type { Metadata } from 'next';
import CrimeMapClient from './CrimeMapClient';

export const metadata: Metadata = {
  title: 'Interactieve Crime Map Nederland | Misdaadkaart & Criminaliteit per Regio',
  description: 'Unieke interactieve Crime Map van Nederland. Bekijk criminaliteit, misdaad en politieacties per regio. Real-time misdaaddata, trends en hotspots op de misdaadkaart.',
  keywords: [
    // Primary keywords
    'crime map nederland', 'misdaadkaart nederland', 'criminaliteit kaart', 'misdaad kaart',
    'interactieve crime map', 'nederlandse crime map', 'crime mapping nederland',
    // Crime types
    'criminaliteit per regio', 'misdaad per stad', 'inbraak kaart', 'geweld kaart',
    'drugsoverlast kaart', 'diefstal kaart', 'woninginbraak per wijk', 'autodiefstal kaart',
    // Location-specific
    'criminaliteit amsterdam', 'criminaliteit rotterdam', 'criminaliteit den haag',
    'criminaliteit utrecht', 'misdaad per provincie', 'regionale criminaliteit',
    // Features
    'interactieve kaart nederland', 'politie meldingen kaart', 'politie acties kaart',
    'crime hotspots', 'misdaad trends', 'criminaliteitsdata', 'veiligheidscijfers',
    // Analysis
    'criminaliteitsanalyse', 'misdaadstatistieken', 'veiligheidsindex', 'crime data',
    'wijkveiligheid kaart', 'buurt veiligheid', 'veilige wijken', 'onveilige gebieden',
    // Real-time
    'actuele meldingen', 'real-time crime', 'live crime map', 'politie updates kaart',
    'recente incidenten', 'criminaliteit vandaag', 'politie interventies',
    // Unique value
    'unieke crime map', 'enige misdaadkaart nederland', 'politie forum crime map',
    'visualisatie criminaliteit', 'kaart misdaad nederland', 'crime mapping tool',
  ],
  alternates: {
    canonical: 'https://politie-forum.nl/crime-map-nederland',
  },
  openGraph: {
    title: 'Interactieve Kaart Nederland | Politie Forum Nederland',
    description: 'Interactieve kaart met nieuws en meldingen in Nederland per regio',
    type: 'website',
    url: 'https://politie-forum.nl/crime-map-nederland',
  },
};

export default function CrimeMapPage() {
  return <CrimeMapClient />;
}
