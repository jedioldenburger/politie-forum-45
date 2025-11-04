import type { Metadata } from 'next';
import CrimeMapClient from './CrimeMapClient';

export const metadata: Metadata = {
  title: 'Interactieve Kaart Nederland | Politie Forum Nederland',
  description: 'Interactieve kaart met nieuws en meldingen in Nederland. Bekijk actuele gebeurtenissen per regio op de kaart.',
  keywords: 'kaart nederland, politie nieuws, meldingen per regio, interactieve kaart, nieuws locaties',
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
