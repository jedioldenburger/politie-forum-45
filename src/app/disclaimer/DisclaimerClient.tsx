"use client";

import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function DisclaimerClient() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://politie-forum.nl/disclaimer#webpage",
    url: "https://politie-forum.nl/disclaimer",
    name: "Algemene Disclaimer",
    description:
      "Algemene disclaimer van Politie Forum Nederland over aansprakelijkheid, gebruikersinhoud, externe links en medisch/juridisch advies.",
    inLanguage: "nl-NL",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://politie-forum.nl/#website",
      url: "https://politie-forum.nl/",
      name: "Politie Forum Nederland",
    },
    about: {
      "@type": "Thing",
      name: "Juridische Disclaimer",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://politie-forum.nl/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Algemene Disclaimer",
          item: "https://politie-forum.nl/disclaimer",
        },
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://politie-forum.nl/#organization",
      name: "Politie Forum Nederland",
      url: "https://politie-forum.nl/",
    },
    datePublished: "2025-10-15T00:00:00+02:00",
    dateModified: "2025-10-15T00:00:00+02:00",
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
              Algemene Disclaimer
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              Deze disclaimer is van toepassing op alle informatie, diensten en
              functies die beschikbaar zijn via Politie Forum Nederland
              (politie-forum.nl). Door gebruik te maken van deze website gaat u
              akkoord met de onderstaande voorwaarden.
            </p>

            <div className="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-4 mb-8">
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                <strong>Belangrijk:</strong> Politie Forum Nederland is een
                onafhankelijk informatieplatform en discussieforum. Wij zijn niet
                gelieerd aan de Nederlandse politie of enige overheidsinstantie.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              1. Aansprakelijkheid voor Inhoud
            </h2>

            <p className="mb-4">
              Politie Forum Nederland streeft ernaar accurate en actuele
              informatie te verstrekken voor onze community van politie- en
              veiligheidsgeïnteresseerden. Wij investeren in zorgvuldige
              redactie en bronverificatie om betrouwbare content te bieden.
            </p>

            <p className="mb-4">
              Echter, wij kunnen geen garantie bieden voor de volledigheid,
              juistheid of geschiktheid van de gepubliceerde content. Alle
              informatie wordt aangeboden "zoals het is" zonder enige vorm van
              garantie. Gebruikers dienen zelf de juistheid van informatie te
              verifiëren voordat zij hierop handelen.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Beperkingen van Aansprakelijkheid
            </h3>

            <p className="mb-4">
              Wij zijn niet aansprakelijk voor enige directe of indirecte schade
              die voortvloeit uit:
            </p>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Het gebruik of onvermogen tot gebruik van deze website</li>
              <li>Eventuele onjuistheden of onvolledigheden in de informatie</li>
              <li>
                Handelingen of beslissingen genomen op basis van informatie van
                deze site
              </li>
              <li>Technische storingen, onderbrekingen of onbeschikbaarheid</li>
              <li>Verlies van data of beschadiging van apparatuur</li>
              <li>Schade door virussen, malware of andere schadelijke code</li>
            </ul>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Let op:</strong> Deze aansprakelijkheidsbeperking geldt
                voor zover wettelijk toegestaan. Aansprakelijkheid voor opzet of
                grove schuld kan niet worden uitgesloten.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              2. Gebruikersinhoud en Discussies
            </h2>

            <p className="mb-4">
              Politie Forum Nederland is een platform waar gebruikers informatie
              delen en discussiëren over politie-gerelateerde onderwerpen. Onze
              community bestaat uit professionals, studenten en geïnteresseerde
              burgers die hun ervaringen en kennis delen.
            </p>

            <p className="mb-4">
              De meningen en standpunten die door gebruikers worden geuit zijn hun
              eigen verantwoordelijkheid en vertegenwoordigen niet
              noodzakelijkerwijs de mening van Politie Forum Nederland. Wij bieden
              een platform voor vrije meningsuiting binnen de grenzen van de wet
              en fatsoensnormen.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Door Gebruikers Gegenereerde Content
            </h3>

            <p className="mb-4">
              Voor alle door gebruikers geplaatste berichten, reacties en andere
              content geldt:
            </p>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Auteurs zijn volledig verantwoordelijk voor hun eigen bijdragen
              </li>
              <li>
                Wij modereren actief, maar kunnen niet alle content vooraf
                controleren
              </li>
              <li>
                Meldingen van ongepaste content worden binnen 48 uur beoordeeld
              </li>
              <li>
                We behouden ons het recht voor om content te verwijderen of aan te
                passen
              </li>
              <li>
                Herhaling van overtredingen kan leiden tot account-opschorting
              </li>
            </ul>

            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Tip:</strong> Lees onze{" "}
                <Link
                  href="/forum-disclaimer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Forum Disclaimer
                </Link>{" "}
                voor specifieke voorwaarden over discussies en gebruikersinhoud.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              3. Geen Medisch of Juridisch Advies
            </h2>

            <p className="mb-4">
              De informatie op deze website is uitsluitend bedoeld voor algemene
              informatieve doeleinden en educatie over politie, justitie en
              veiligheid. Niets op deze website mag worden beschouwd als
              professioneel advies of vervanging voor gekwalificeerde
              dienstverlening.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Geen Vervanging voor Professionele Hulp
            </h3>

            <p className="mb-4">
              De content op dit platform is expliciet geen vervanging voor:
            </p>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                <strong>Medisch advies:</strong> Professioneel medisch advies,
                diagnose of behandeling
              </li>
              <li>
                <strong>Juridisch advies:</strong> Juridisch advies, rechtsbijstand
                of procesvertegenwoordiging
              </li>
              <li>
                <strong>Financieel advies:</strong> Financieel of fiscaal advies
                van gecertificeerde adviseurs
              </li>
              <li>
                <strong>Officiële procedures:</strong> Officiële
                politieprocedures, instructies of beleidsrichtlijnen
              </li>
              <li>
                <strong>Psychologische hulp:</strong> Professionele
                traumaverwerking of mentale gezondheidszorg
              </li>
            </ul>

            <div className="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>In noodsituaties:</strong> Bel altijd 112 voor acute hulp.
                Voor niet-spoedeisende zaken: 0900-8844. Bij juridische vragen:
                raadpleeg een advocaat. Gebruik dit forum nooit als vervanging
                voor officiële hulpdiensten of professionals.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              4. Externe Links en Verwijzingen
            </h2>

            <p className="mb-4">
              Onze website bevat links naar externe websites die niet onder onze
              controle staan. Deze links worden aangeboden als service aan onze
              gebruikers om aanvullende informatie of bronnen te bieden.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Verantwoordelijkheid Externe Content
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Wij zijn niet verantwoordelijk voor de inhoud van externe websites
              </li>
              <li>
                Een link impliceert geen goedkeuring of aanbeveling van onze kant
              </li>
              <li>Gebruikers bezoeken externe links op eigen risico</li>
              <li>
                Privacy en voorwaarden van externe sites zijn hun eigen
                verantwoordelijkheid
              </li>
              <li>
                Verbroken of onjuiste links kunnen gemeld worden via ons
                contactformulier
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              5. Intellectueel Eigendom
            </h2>

            <p className="mb-4">
              Alle content op Politie Forum Nederland, inclusief maar niet beperkt
              tot teksten, afbeeldingen, logo's en software, is eigendom van
              Politie Forum Nederland of haar licentiegevers en wordt beschermd
              door auteursrecht en andere intellectuele eigendomswetten.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Toegestaan Gebruik
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Persoonlijk, niet-commercieel gebruik van content is toegestaan
              </li>
              <li>
                Citeren met bronvermelding is toegestaan binnen redelijke grenzen
              </li>
              <li>
                Commercieel gebruik vereist voorafgaande schriftelijke toestemming
              </li>
              <li>
                Het kopiëren of distribueren van volledige artikelen is niet
                toegestaan zonder toestemming
              </li>
            </ul>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Citeren?</strong> Maximaal 150 woorden met volledige
                bronvermelding en link naar origineel artikel. Voor uitgebreid
                gebruik: neem contact op via info@politie-forum.nl
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              6. AI-Gegenereerde Content
            </h2>

            <p className="mb-4">
              Sommige artikelen en samenvattingen op deze website kunnen
              gedeeltelijk of volledig worden gegenereerd met behulp van
              kunstmatige intelligentie (AI). Wij zijn transparant over het
              gebruik van AI-technologie in onze content-creatie.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              AI-Gebruik en Kwaliteitsbewaking
            </h3>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Duidelijk gemarkeerd als AI-gegenereerd waar van toepassing
              </li>
              <li>
                Geverifieerd en geredigeerd door onze redactie voor juistheid
              </li>
              <li>
                Aangeboden zonder garantie op absolute volledigheid of
                nauwkeurigheid
              </li>
              <li>Regelmatig geëvalueerd en bijgewerkt indien nodig</li>
              <li>
                AI gebruikt als hulpmiddel, niet als vervanging voor menselijke
                redactie
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300 mt-8 mb-4">
              7. Wijzigingen in Disclaimer
            </h2>

            <p className="mb-4">
              Deze algemene voorwaarden en disclaimer kunnen van tijd tot tijd
              worden aangepast om nieuwe juridische vereisten, technologische
              ontwikkelingen of platformveranderingen te weerspiegelen.
            </p>

            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mt-6 mb-3">
              Update Beleid
            </h3>

            <p className="mb-4">
              Wij behouden ons het recht voor om deze disclaimer op elk moment te
              wijzigen zonder voorafgaande kennisgeving. Wijzigingen worden van
              kracht zodra ze op de website worden gepubliceerd. Het is uw
              verantwoordelijkheid om deze disclaimer regelmatig te controleren op
              updates.
            </p>

            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>
                Significante wijzigingen worden vermeld met update-datum onderaan
              </li>
              <li>
                Voortgezet gebruik na wijzigingen impliceert acceptatie van nieuwe
                voorwaarden
              </li>
              <li>
                Bij fundamentele wijzigingen kan een pop-up melding worden getoond
              </li>
            </ul>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Gerelateerde Documenten
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/nieuws-disclaimer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Nieuws & Media Disclaimer
                  </Link>{" "}
                  - Specifieke voorwaarden voor nieuwsartikelen
                </li>
                <li>
                  <Link
                    href="/forum-disclaimer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Forum Disclaimer
                  </Link>{" "}
                  - Voorwaarden voor discussies en gebruikersinhoud
                </li>
                <li>
                  <Link
                    href="/gebruikersregels"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Gebruikersregels
                  </Link>{" "}
                  - Community richtlijnen en gedragscode
                </li>
                <li>
                  <Link
                    href="/moderatie-beleid"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Moderatie Beleid
                  </Link>{" "}
                  - Hoe wij modereren en handhaven
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  - Hoe wij omgaan met uw gegevens
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
                  <p><strong>Email:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Redactie:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
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
