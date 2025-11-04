"use client";

import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function NieuwsDisclaimerClient() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://politie-forum.nl/nieuws-disclaimer#webpage",
    "url": "https://politie-forum.nl/nieuws-disclaimer",
    "name": "Nieuws & Media Disclaimer",
    "description": "Disclaimer voor nieuwsartikelen op Politie Forum Nederland: bronvermelding, AI-gebruik en redactionele principes.",
    "inLanguage": "nl-NL",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://politie-forum.nl/#website"
    },
    "about": {
      "@type": "Thing",
      "name": "Journalistieke Disclaimer"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://politie-forum.nl/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Nieuws Disclaimer",
          "item": "https://politie-forum.nl/nieuws-disclaimer"
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://politie-forum.nl/#organization"
    },
    "datePublished": "2025-10-15T00:00:00+02:00",
    "dateModified": "2025-10-15T00:00:00+02:00"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold text-primary-900 dark:text-white mb-6">
              Nieuws & Media Disclaimer
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Deze disclaimer is specifiek van toepassing op alle nieuwsartikelen,
              persberichten en mediapublicaties op Politie Forum Nederland. Lees
              deze voorwaarden zorgvuldig om te begrijpen hoe wij nieuws verzamelen,
              bewerken en publiceren.
            </p>

            <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 p-4 mb-8">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                <strong>Belangrijk:</strong> Politie Forum Nederland is een onafhankelijk
                nieuwsplatform. Wij zijn niet verbonden aan de Nederlandse politie,
                justitie of overheidsinstanties en publiceren nieuws vanuit journalistiek
                perspectief.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              1. Bronvermelding en Herkomst
            </h2>

            <p className="mb-4">
              Alle nieuwsartikelen op dit platform worden gebaseerd op openbare bronnen
              en officiële persberichten. Wij streven naar accurate nieuwsverslaggeving
              met duidelijke bronvermelding.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Bronnen en Verificatie
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Primaire bronnen:</strong> Politie.nl, officiële politie social
                media, OM (Openbaar Ministerie), rechtbanken
              </li>
              <li>
                <strong>Secundaire bronnen:</strong> ANP, NOS, NU.nl, regionale media,
                internationale nieuwsdiensten
              </li>
              <li>
                <strong>Verificatie:</strong> Alle nieuwsfeiten worden waar mogelijk
                geverifieerd via meerdere onafhankelijke bronnen
              </li>
              <li>
                <strong>Bronvermelding:</strong> Originele bron wordt altijd vermeld,
                tenzij dit de veiligheid van bronnen in gevaar brengt
              </li>
            </ul>

            <div className="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Nieuwstip doorgeven?</strong> Stuur een WhatsApp naar{" "}
                <a href="tel:+31648319167" className="hover:underline font-medium">
                  +31 6 48319167
                </a>
                . Anonieme tips welkom. Journalistieke bronbescherming gegarandeerd.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              2. AI-Ondersteunde Content en Bewerking
            </h2>

            <p className="mb-4">
              Wij maken gebruik van kunstmatige intelligentie (AI) om nieuwsartikelen
              te verwerken, samen te vatten en te optimaliseren voor leesbaarheid.
              Dit gebeurt altijd onder menselijke redactionele supervisie.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Hoe Wij AI Gebruiken
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Samenvatten:</strong> Lange persberichten worden compact
                samengevat voor snelle nieuwsconsumptie
              </li>
              <li>
                <strong>Herschrijven:</strong> Technische politietaal wordt
                herschreven naar begrijpelijk Nederlands
              </li>
              <li>
                <strong>Optimalisatie:</strong> SEO-optimalisatie en leesbaarheid
                worden verbeterd met AI-tools (Groq Llama models)
              </li>
              <li>
                <strong>Verificatie:</strong> AI genereert geen feiten; alle feiten
                komen uit geverifieerde bronnen
              </li>
              <li>
                <strong>Transparantie:</strong> AI-gegenereerde passages worden waar
                mogelijk gemarkeerd
              </li>
            </ul>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Onze AI-principes:</strong> Menselijke redactie heeft het
                laatste woord. AI is een hulpmiddel, geen vervanging voor
                journalistieke integriteit.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              3. Redactionele Principes
            </h2>

            <p className="mb-4">
              Onze nieuwsredactie hanteert strikte journalistieke principes voor
              objectieve, betrouwbare en evenwichtige berichtgeving over politie,
              justitie en criminaliteit in Nederland.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Kernprincipes
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Objectiviteit:</strong> Wij streven naar neutrale verslaggeving
                zonder politieke of commerciële beïnvloeding
              </li>
              <li>
                <strong>Privacy:</strong> Namen van verdachten worden alleen vermeld
                bij zwaar misdrijf of als dit al publiek is
              </li>
              <li>
                <strong>Slachtofferbescherming:</strong> Privacy van slachtoffers wordt
                altijd gerespecteerd
              </li>
              <li>
                <strong>Onschuldpresumptie:</strong> Verdachten zijn onschuldig tot het
                tegendeel bewezen is
              </li>
              <li>
                <strong>Correcties:</strong> Fouten worden transparant en snel gecorrigeerd
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              4. Correctiebeleid en Feitencontrole
            </h2>

            <p className="mb-4">
              Ondanks zorgvuldige verificatie kunnen er fouten optreden in onze
              nieuwsartikelen. Wij hanteren een transparant correctiebeleid om de
              kwaliteit en betrouwbaarheid van onze content te waarborgen.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Correctieprocedure
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Meldingen:</strong> Fouten kunnen gemeld worden via{" "}
                <a
                  href="mailto:info@politie-forum.nl"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  info@politie-forum.nl
                </a>
              </li>
              <li>
                <strong>Beoordeling:</strong> Elke melding wordt binnen 24 uur beoordeeld
                door de redactie
              </li>
              <li>
                <strong>Correctie:</strong> Geverifieerde fouten worden binnen 48 uur
                gecorrigeerd
              </li>
              <li>
                <strong>Transparantie:</strong> Significante correcties worden onderaan
                het artikel vermeld met datum
              </li>
              <li>
                <strong>Archief:</strong> Originele versies blijven beschikbaar voor
                transparantie
              </li>
            </ul>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Tip:</strong> Bekijk ons{" "}
                <Link
                  href="/feitencontrole"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Feitencontrole Proces
                </Link>{" "}
                voor meer informatie over hoe wij nieuws verifiëren.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              5. Auteursrecht en Citeren
            </h2>

            <p className="mb-4">
              Alle nieuwsartikelen op Politie Forum Nederland zijn auteursrechtelijk
              beschermd. Citeren mag binnen de grenzen van de Nederlandse
              Auteurswet (citaatrecht).
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Toegestaan Gebruik
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Citeren:</strong> Maximaal 150 woorden met bronvermelding en
                link naar origineel artikel
              </li>
              <li>
                <strong>Social media:</strong> Delen via social media buttons is
                toegestaan en aangemoedigd
              </li>
              <li>
                <strong>Educatief:</strong> Gebruik voor onderwijs en onderzoek met
                correcte bronvermelding
              </li>
              <li>
                <strong>Niet toegestaan:</strong> Volledig kopiëren, scraping,
                heruitgeven zonder toestemming
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              6. Advertenties en Sponsoring
            </h2>

            <p className="mb-4">
              Onze nieuwscontent is onafhankelijk van commerciële belangen. Wij
              hanteren strikte scheiding tussen redactionele content en eventuele
              advertenties of gesponsorde content.
            </p>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Gesponsorde content wordt altijd duidelijk gemarkeerd
              </li>
              <li>
                Adverteerders hebben geen invloed op redactionele beslissingen
              </li>
              <li>
                Native advertising volgt de richtlijnen van het Genootschap van
                Hoofdredacteuren
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              7. Archivering en Verwijdering
            </h2>

            <p className="mb-4">
              Nieuwsartikelen blijven online voor historisch archief en transparantie,
              tenzij er juridische redenen zijn voor verwijdering.
            </p>

            <p className="mb-4">
              In overeenstemming met het "recht om vergeten te worden" kunnen
              personen onder specifieke omstandigheden verzoeken tot verwijdering
              van persoonlijke gegevens uit nieuwsartikelen. Elk verzoek wordt
              individueel beoordeeld met afweging van privacybelangen tegen
              publiek belang en persvrijheid.
            </p>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Gerelateerde Documenten
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/redactionele-principes"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Redactionele Principes
                  </Link>{" "}
                  - Onze journalistieke richtlijnen
                </li>
                <li>
                  <Link
                    href="/feitencontrole"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Feitencontrole Proces
                  </Link>{" "}
                  - Hoe wij nieuws verifiëren
                </li>
                <li>
                  <Link
                    href="/correcties"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Correcties Overzicht
                  </Link>{" "}
                  - Alle gepubliceerde correcties
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Algemene Disclaimer
                  </Link>{" "}
                  - Algemene voorwaarden
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Laatste update:</strong> 15 oktober 2025
              </p>

              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1 text-sm">
                  <p><strong>Redactie:</strong> <a href="mailto:redactie@politie-forum.nl" className="hover:underline">redactie@politie-forum.nl</a></p>
                  <p><strong>Algemeen:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Hoofdredacteur:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
                </div>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
