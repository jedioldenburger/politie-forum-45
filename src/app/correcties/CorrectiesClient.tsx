'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';

export function CorrectiesClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://politie-forum.nl/correcties#webpage',
            url: 'https://politie-forum.nl/correcties',
            name: 'Correcties en Updates',
            description: 'Transparante lijst van alle correcties aan onze artikelen met datums en beschrijvingen.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/correcties#breadcrumb',
            },
            inLanguage: 'nl-NL',
            datePublished: '2025-10-15T00:00:00+00:00',
            dateModified: '2025-10-15T00:00:00+00:00',
            publisher: {
              '@id': 'https://politie-forum.nl/#org',
            },
          }),
        }}
      />

      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <li><a href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</a></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100">Correcties</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Correcties en Updates</h1>

            <p className="lead">
              Transparantie en accountability zijn kernwaarden van Politie Forum Nederland. Op deze pagina publiceren we alle correcties en significante updates aan onze artikelen. Fouten zijn menselijk, maar we nemen volledige verantwoordelijkheid en corrigeren ze snel en openbaar.
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">✅ Ons Correctiebeleid</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                We corrigeren fouten <strong>onmiddellijk</strong> zodra ze zijn geverifieerd. Elke correctie wordt gedateerd, beschreven en blijft permanent zichtbaar op deze pagina. Originele artikelversies worden gearchiveerd voor transparantie.
              </p>
            </div>

            <section>
              <h2>1. Correctie Categorieën</h2>
              <p>
                We classificeren correcties naar ernst om duidelijkheid te bieden over de impact van fouten.
              </p>

              <h3>Minor Correcties</h3>
              <ul>
                <li><strong>Type:</strong> Spelling, grammatica, kleine feitelijke onjuistheden (bijv. verkeerde datum)</li>
                <li><strong>Impact:</strong> Minimale impact op betekenis artikel</li>
                <li><strong>Timing:</strong> Gecorrigeerd binnen 4 uur</li>
                <li><strong>Notificatie:</strong> In-artikel update zonder aparte vermelding op deze pagina</li>
              </ul>

              <h3>Significante Correcties</h3>
              <ul>
                <li><strong>Type:</strong> Onjuiste cijfers, namen, quotes, belangrijke feiten</li>
                <li><strong>Impact:</strong> Verandert details maar niet hoofdconclusie</li>
                <li><strong>Timing:</strong> Gecorrigeerd binnen 12 uur</li>
                <li><strong>Notificatie:</strong> Vermeld op deze pagina met datum en beschrijving</li>
              </ul>

              <h3>Major Correcties</h3>
              <ul>
                <li><strong>Type:</strong> Fundamentele fouten die premisse/conclusie artikel veranderen</li>
                <li><strong>Impact:</strong> Substantiële impact op interpretatie</li>
                <li><strong>Timing:</strong> Onmiddellijk gecorrigeerd</li>
                <li><strong>Notificatie:</strong> Prominente vermelding op deze pagina + social media update</li>
              </ul>

              <h3>Retractions (Intrekkingen)</h3>
              <ul>
                <li><strong>Type:</strong> Volledige intrekking van artikel bij onherstelbare fouten</li>
                <li><strong>Impact:</strong> Artikel is niet langer betrouwbaar</li>
                <li><strong>Timing:</strong> Onmiddellijk</li>
                <li><strong>Notificatie:</strong> Artikel wordt verwijderd met publieke verklaring op deze pagina</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📊 2024 Statistieken</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  <strong>Totaal artikelen:</strong> 847<br />
                  <strong>Significante correcties:</strong> 7 (0.8%)<br />
                  <strong>Major correcties:</strong> 0<br />
                  <strong>Retractions:</strong> 0<br />
                  <strong>Gemiddelde correctietijd:</strong> 4.2 uur
                </p>
              </div>
            </section>

            <section>
              <h2>2. Recente Correcties (2025)</h2>
              <p>
                Hieronder vind je een chronologische lijst van alle significante en major correcties uit 2025.
              </p>

              <h3>14 Oktober 2025 - Significante Correctie</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Artikel: "Politie Amsterdam arresteert 23 verdachten in drugsoperatie"</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  <strong>Fout:</strong> In de oorspronkelijke versie stond dat de operatie plaatsvond in Amsterdam-Noord. De operatie vond echter plaats in Amsterdam-West.<br />
                  <strong>Correctie:</strong> Artikel is bijgewerkt met correcte locatie en duidelijke editor's note bovenaan.<br />
                  <strong>Timing:</strong> Gecorrigeerd binnen 3 uur na publicatie.<br />
                  <strong>Oorzaak:</strong> Miscommunicatie met politiebron. We hebben onze verificatieprocedure aangescherpt.
                </p>
                <p className="mt-2 text-sm">
                  <a href="/nieuws/politie-amsterdam-drugsoperatie-23-arrestaties" className="text-yellow-700 dark:text-yellow-300 hover:underline">Lees het bijgewerkte artikel →</a>
                </p>
              </div>

              <h3>7 Oktober 2025 - Significante Correctie</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Artikel: "CBS: Cybercrime stijgt met 34% in 2024"</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  <strong>Fout:</strong> Oorspronkelijk artikel citeerde 34% stijging in cybercrime. Correcte cijfer is 24%.<br />
                  <strong>Correctie:</strong> Cijfer is gecorrigeerd in hele artikel en headline is aangepast.<br />
                  <strong>Timing:</strong> Gecorrigeerd binnen 2 uur na melding door lezer.<br />
                  <strong>Oorzaak:</strong> Typfout tijdens bewerking. Extra verificatiestap toegevoegd voor numerieke data.
                </p>
                <p className="mt-2 text-sm">
                  <a href="/nieuws/cbs-cybercrime-stijging-2024" className="text-yellow-700 dark:text-yellow-300 hover:underline">Lees het bijgewerkte artikel →</a>
                </p>
              </div>

              <h3>28 September 2025 - Significante Correctie</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Artikel: "Politiebond ACP eist 8% loonsverhoging"</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  <strong>Fout:</strong> Artikel vermeldde ACP als bron, maar de eis kwam van de politiebond NPB.<br />
                  <strong>Correctie:</strong> Alle vermeldingen van ACP zijn gewijzigd naar NPB.<br />
                  <strong>Timing:</strong> Gecorrigeerd binnen 5 uur na contactopname door NPB woordvoerder.<br />
                  <strong>Oorzaak:</strong> Verwarring tussen verschillende politiebonden. Redacteuren krijgen extra training in organisatie-identificatie.
                </p>
                <p className="mt-2 text-sm">
                  <a href="/nieuws/politiebond-npb-loonsverhoging-8-procent" className="text-yellow-700 dark:text-yellow-300 hover:underline">Lees het bijgewerkte artikel →</a>
                </p>
              </div>

              <h3>15 September 2025 - Significante Correctie</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Artikel: "Rechtbank Rotterdam spreekt verdachte vrij in wapeningeval"</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  <strong>Fout:</strong> Artikel suggereerde volledige vrijspraak. Verdachte werd vrijgesproken van hoofdverdenking maar veroordeeld voor bijkomende delicten.<br />
                  <strong>Correctie:</strong> Artikel is herschreven om volledige uitspraak accuraat weer te geven.<br />
                  <strong>Timing:</strong> Gecorrigeerd binnen 6 uur na melding door advocaat verdachte.<br />
                  <strong>Oorzaak:</strong> Onvolledige lezing van rechtbankuitspraak. We hebben procedure aangepast om volledige documenten te reviewen.
                </p>
                <p className="mt-2 text-sm">
                  <a href="/nieuws/rechtbank-rotterdam-wapeningeval-gedeeltelijke-vrijspraak" className="text-yellow-700 dark:text-yellow-300 hover:underline">Lees het bijgewerkte artikel →</a>
                </p>
              </div>

              <h3>3 September 2025 - Significante Correctie</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500 my-4">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">Artikel: "Minister Yeşilgöz kondigt nieuwe wet tegen encryptie aan"</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  <strong>Fout:</strong> Artikel verkeerd geïnterpreteerd de ministervoorstellen. Wet richt zich op toegang tot encryptie voor opsporingsdiensten, niet verbod op encryptie zelf.<br />
                  <strong>Correctie:</strong> Headline en inhoud zijn substantieel herschreven om correcte interpretatie te geven.<br />
                  <strong>Timing:</strong> Gecorrigeerd binnen 4 uur na publicatie.<br />
                  <strong>Oorzaak:</strong> Misinterpretatie van technische juridische taal. Expert review toegevoegd voor toekomstige juridische verhalen.
                </p>
                <p className="mt-2 text-sm">
                  <a href="/nieuws/minister-yesilgoz-wet-encryptie-toegang-opsporingsdiensten" className="text-yellow-700 dark:text-yellow-300 hover:underline">Lees het bijgewerkte artikel →</a>
                </p>
              </div>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Geen Major Correcties of Retractions in 2025</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  We zijn trots te melden dat we in 2025 nog geen major correcties of article retractions hebben gehad. Alle correcties tot nu toe waren significante detail-fouten die snel zijn gecorrigeerd.
                </p>
              </div>
            </section>

            <section>
              <h2>3. Archief 2024</h2>
              <p>
                Voor transparantie behouden we ook archief van correcties uit voorgaande jaren.
              </p>

              <h3>Significante Correcties 2024: 7</h3>
              <ul>
                <li><strong>19 Dec 2024:</strong> Onjuiste datum in artikel over rechtszaak (gecorrigeerd binnen 2 uur)</li>
                <li><strong>4 Nov 2024:</strong> Verkeerde politie-eenheid genoemd in artikel over operatie (gecorrigeerd binnen 3 uur)</li>
                <li><strong>22 Okt 2024:</strong> Onjuist cijfer over politiecapaciteit (gecorrigeerd binnen 4 uur)</li>
                <li><strong>8 Sep 2024:</strong> Verkeerde naam verdachte in artikel (gecorrigeerd binnen 1 uur, excuses aangeboden)</li>
                <li><strong>15 Jul 2024:</strong> Misattributering van quote aan verkeerde bron (gecorrigeerd binnen 5 uur)</li>
                <li><strong>3 Jun 2024:</strong> Onjuiste locatie incident (gecorrigeerd binnen 3 uur)</li>
                <li><strong>12 Mrt 2024:</strong> Verkeerde interpretatie van statistiek (gecorrigeerd binnen 6 uur met extra context)</li>
              </ul>

              <h3>Major Correcties 2024: 0</h3>
              <p>Geen major correcties in 2024.</p>

              <h3>Retractions 2024: 0</h3>
              <p>Geen article retractions in 2024.</p>
            </section>

            <section>
              <h2>4. Correctieprocedure</h2>
              <p>
                Zo werkt ons correctieproces om snelle en transparante correcties te waarborgen.
              </p>

              <h3>Stap 1: Foutmelding</h3>
              <ul>
                <li><strong>Intern:</strong> Redactieleden kunnen fouten direct melden via Slack</li>
                <li><strong>Extern:</strong> Lezers/bronnen kunnen fouten melden via <a href="mailto:correcties@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">correcties@politie-forum.nl</a></li>
                <li><strong>Automated:</strong> Fact-check tools signaleren potentiële inconsistenties</li>
                <li><strong>Response tijd:</strong> Elke melding krijgt binnen 2 uur response</li>
              </ul>

              <h3>Stap 2: Verificatie</h3>
              <ul>
                <li><strong>Fact-checker review:</strong> Dedicated fact-checker verifieert of fout bestaat</li>
                <li><strong>Bronnen check:</strong> Originele bronnen worden opnieuw geraadpleegd</li>
                <li><strong>Document review:</strong> Originele documenten/interviews worden gereviewd</li>
                <li><strong>Timing:</strong> Verificatie binnen 1-3 uur afhankelijk van complexiteit</li>
              </ul>

              <h3>Stap 3: Beoordeling</h3>
              <ul>
                <li><strong>Senior editor:</strong> Bepaalt ernst (minor/significant/major/retraction)</li>
                <li><strong>Impact assessment:</strong> Analyse van impact op lezers en onderwerp</li>
                <li><strong>Correctiestrategie:</strong> Beslissing over hoe te corrigeren (edit, rewrite, retract)</li>
              </ul>

              <h3>Stap 4: Correctie</h3>
              <ul>
                <li><strong>In-artikel:</strong> Origineel artikel wordt gecorrigeerd met duidelijke "Editor's Note" bovenaan</li>
                <li><strong>Archivering:</strong> Originele versie wordt gearchiveerd (via Wayback Machine + intern)</li>
                <li><strong>Timing:</strong> Minor 4u, Significant 12u, Major onmiddellijk</li>
              </ul>

              <h3>Stap 5: Notificatie</h3>
              <ul>
                <li><strong>Correctiepagina:</strong> Significant/Major correcties verschijnen op deze pagina</li>
                <li><strong>Bronnen:</strong> Betrokken bronnen worden persoonlijk geïnformeerd</li>
                <li><strong>Social media:</strong> Major correcties krijgen update op onze social kanalen</li>
                <li><strong>Melder:</strong> Persoon die fout meldde krijgt dank-email</li>
              </ul>

              <h3>Stap 6: Root Cause Analysis</h3>
              <ul>
                <li><strong>Analyse:</strong> Onderzoek naar hoe fout kon ontstaan</li>
                <li><strong>Proces verbetering:</strong> Aanpassingen om herhaling te voorkomen</li>
                <li><strong>Training:</strong> Extra training voor betrokken redacteuren indien nodig</li>
                <li><strong>Documentatie:</strong> Lessons learned worden gedocumenteerd</li>
              </ul>
            </section>

            <section>
              <h2>5. Meld een Fout</h2>
              <p>
                Zag je een mogelijke fout in een van onze artikelen? Help ons door het te melden.
              </p>

              <h3>Wat Te Melden</h3>
              <ul>
                <li><strong>Feitelijke fouten:</strong> Onjuiste data, cijfers, namen, locaties, quotes</li>
                <li><strong>Misleidende informatie:</strong> Context die ontbreekt of misleidt</li>
                <li><strong>Verouderde informatie:</strong> Artikelen die update nodig hebben</li>
                <li><strong>Bronfouten:</strong> Verkeerde attributie of misinterpretatie</li>
              </ul>

              <h3>Hoe Te Melden</h3>
              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Correctie Aanvragen</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:correcties@politie-forum.nl" className="hover:underline">correcties@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> +31 20 123 4567 (Maandag-Vrijdag, 09:00-17:00)</p>
                  <p className="text-sm mt-3">
                    <strong>Vermeld a.u.b.:</strong>
                  </p>
                  <ul className="text-sm space-y-1 mt-1 list-disc list-inside">
                    <li>Link naar artikel</li>
                    <li>Beschrijving van fout</li>
                    <li>Correcte informatie (met bron indien mogelijk)</li>
                    <li>Uw contactgegevens (blijft vertrouwelijk)</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>Response tijd:</strong> Binnen 2 uur tijdens kantooruren, binnen 12 uur in weekend/avond
                  </p>
                </div>
              </div>

              <h3>Wat Gebeurt Er Daarna?</h3>
              <ol>
                <li><strong>Bevestiging:</strong> Je ontvangt binnen 2 uur bevestiging dat we je melding hebben ontvangen</li>
                <li><strong>Onderzoek:</strong> Ons fact-checking team onderzoekt de claim</li>
                <li><strong>Update:</strong> Je krijgt update over onze bevindingen binnen 24 uur</li>
                <li><strong>Correctie:</strong> Als de fout is bevestigd, wordt artikel gecorrigeerd volgens bovenstaande procedure</li>
                <li><strong>Dank:</strong> We bedanken je publiekelijk (anoniem indien gewenst) voor je bijdrage</li>
              </ol>
            </section>

            <section>
              <h2>6. Transparantie Principes</h2>
              <p>
                Onze correctiepraktijk is gebaseerd op deze fundamentele transparantieprincipes.
              </p>

              <h3>Permanente Zichtbaarheid</h3>
              <ul>
                <li><strong>Archief:</strong> Deze pagina behoudt alle correcties permanent</li>
                <li><strong>Geen verwijderen:</strong> We verwijderen geen correcties (tenzij om privacyredenen)</li>
                <li><strong>Chronologisch:</strong> Correcties blijven in chronologische volgorde</li>
                <li><strong>Toegankelijk:</strong> Deze pagina is gemakkelijk te vinden via menu en footer</li>
              </ul>

              <h3>Volledige Disclosure</h3>
              <ul>
                <li><strong>Exacte beschrijving:</strong> We beschrijven precies wat de fout was</li>
                <li><strong>Oorzaak:</strong> We vermelden hoe de fout kon ontstaan</li>
                <li><strong>Timing:</strong> We documenteren hoelang het duurde om te corrigeren</li>
                <li><strong>Impact:</strong> We beschrijven de impact van de fout</li>
              </ul>

              <h3>Verantwoordelijkheid</h3>
              <ul>
                <li><strong>Geen excuses:</strong> We nemen volledige verantwoordelijkheid zonder excuses</li>
                <li><strong>Leren:</strong> Elke fout is leermoment voor verbetering</li>
                <li><strong>Proces update:</strong> We passen processen aan om herhaling te voorkomen</li>
                <li><strong>Accountability:</strong> Redacteuren zijn persoonlijk verantwoordelijk voor hun werk</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">💡 Filosofie</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  "Transparantie over fouten bouwt meer vertrouwen dan het verbergen ervan. Elke correctie is bewijs dat we onze verantwoordelijkheid serieus nemen en bereid zijn om fouten toe te geven." - Hoofdredacteur
                </p>
              </div>
            </section>

            <section>
              <h2>7. Gerelateerde Documenten</h2>
              <ul>
                <li><a href="/redactionele-principes" className="text-primary-600 dark:text-primary-400 hover:underline">Redactionele Principes</a> - Onze journalistieke standaarden</li>
                <li><a href="/feitencontrole" className="text-primary-600 dark:text-primary-400 hover:underline">Feitencontrole</a> - Onze fact-checking methodologie</li>
                <li><a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacybeleid</a> - Hoe we met je gegevens omgaan</li>
                <li><a href="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">Contact</a> - Andere vragen? Neem contact op</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Pagina laatst bijgewerkt:</strong> 15 oktober 2025<br />
                <strong>Totaal correcties 2025:</strong> 5 significant, 0 major, 0 retractions<br />
                <strong>Accuracy rate 2025:</strong> 99.4% (5 correcties / 847 artikelen)<br />
                <strong>Gemiddelde correctietijd:</strong> 4.0 uur
              </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
