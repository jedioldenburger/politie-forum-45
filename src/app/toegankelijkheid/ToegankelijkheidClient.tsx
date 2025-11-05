'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export function ToegankelijkheidClient() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://politie-forum.nl/toegankelijkheid#webpage',
                url: 'https://politie-forum.nl/toegankelijkheid',
                name: 'Toegankelijkheidsverklaring',
                description: 'Onze toegankelijkheidsverklaring beschrijft WCAG 2.1 Level AA compliance en beschikbare toegankelijkheidsfuncties.',
                isPartOf: {
                  '@id': 'https://politie-forum.nl/#website',
                },
                breadcrumb: {
                  '@id': 'https://politie-forum.nl/toegankelijkheid#breadcrumb',
                },
                inLanguage: 'nl-NL',
                datePublished: '2025-10-15T00:00:00+00:00',
                dateModified: '2025-10-15T00:00:00+00:00',
                publisher: {
                  '@id': 'https://politie-forum.nl/#org',
                },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://politie-forum.nl/toegankelijkheid#breadcrumb',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://politie-forum.nl/',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Toegankelijkheid',
                    item: 'https://politie-forum.nl/toegankelijkheid',
                  },
                ],
              },
            ],
          }),
        }}
      />

      <Header onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100">Toegankelijkheid</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Toegankelijkheidsverklaring</h1>

            <p className="lead">
              Politie Forum Nederland zet zich in om toegankelijk te zijn voor iedereen, inclusief mensen met een beperking. Deze toegankelijkheidsverklaring beschrijft hoe we voldoen aan de <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>, welke functies beschikbaar zijn en hoe u eventuele toegankelijkheidsproblemen kunt melden.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Onze Commitment</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                Toegankelijkheid is een voortdurend proces, geen eindpunt. We streven naar <strong>WCAG 2.1 Level AA conformiteit</strong> en testen regelmatig met screen readers, keyboard navigation en andere assistive technologies. Uw feedback helpt ons verbeteren.
              </p>
            </div>

            <section>
              <h2>1. Toegankelijkheidsstandaarden</h2>
              <p>
                We streven ernaar te voldoen aan de Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, zoals uitgegeven door het World Wide Web Consortium (W3C). Deze richtlijnen helpen content toegankelijk te maken voor een breed scala aan mensen met beperkingen.
              </p>

              <h3>WCAG 2.1 Level AA Compliance</h3>
              <p>
                Onze website voldoet aan de volgende WCAG 2.1 Level AA success criteria:
              </p>
              <ul>
                <li><strong>Waarneembaar:</strong> Informatie en UI componenten moeten presenteerbaar zijn voor gebruikers op manieren die ze kunnen waarnemen</li>
                <li><strong>Bedienbaar:</strong> UI componenten en navigatie moeten bedienbaar zijn</li>
                <li><strong>Begrijpelijk:</strong> Informatie en bediening van de UI moeten begrijpelijk zijn</li>
                <li><strong>Robuust:</strong> Content moet robuust genoeg zijn om betrouwbaar geïnterpreteerd te worden door diverse user agents, inclusief assistive technologies</li>
              </ul>

              <h3>Wettelijke Vereisten</h3>
              <p>
                Onze website voldoet aan de volgende wettelijke toegankelijkheidsvereisten:
              </p>
              <ul>
                <li><strong>Tijdelijk Besluit digitale toegankelijkheid overheid (2018):</strong> Nederlandse wetgeving voor overheidswebsites</li>
                <li><strong>European Accessibility Act (EAA):</strong> EU-brede toegankelijkheidseisen</li>
                <li><strong>EN 301 549:</strong> Europese norm voor digitale toegankelijkheid</li>
              </ul>
            </section>

            <section>
              <h2>2. Toegankelijkheidsfuncties</h2>
              <p>
                Onze website bevat de volgende toegankelijkheidsfuncties om ervoor te zorgen dat iedereen content kan gebruiken en bijdragen.
              </p>

              <h3>Keyboard Navigatie</h3>
              <p>
                Alle functionaliteit is beschikbaar via toetsenbord zonder gebruik van muis:
              </p>
              <ul>
                <li><strong>Tab:</strong> Navigeer naar het volgende interactieve element</li>
                <li><strong>Shift + Tab:</strong> Navigeer naar het vorige interactieve element</li>
                <li><strong>Enter/Spatiebalk:</strong> Activeer knoppen en links</li>
                <li><strong>Escape:</strong> Sluit modals en overlays</li>
                <li><strong>Pijltjestoetsen:</strong> Navigeer door menu's en dropdown lists</li>
                <li><strong>Skip links:</strong> "Skip to main content" link aan het begin van elke pagina</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">⌨️ Keyboard Shortcuts</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Alt + H:</strong> Ga naar homepage</li>
                    <li><strong>Alt + N:</strong> Ga naar nieuws</li>
                    <li><strong>Alt + F:</strong> Ga naar forum</li>
                    <li><strong>Alt + S:</strong> Focus op zoekbalk</li>
                    <li><strong>Alt + /:</strong> Toon keyboard shortcuts overzicht</li>
                  </ul>
                </div>
              </div>

              <h3>Screen Reader Support</h3>
              <p>
                Onze website is getest met populaire screen readers en bevat:
              </p>
              <ul>
                <li><strong>Semantische HTML:</strong> Correct gebruik van heading structuur (h1-h6), landmarks, lists</li>
                <li><strong>ARIA labels:</strong> Descriptieve labels voor alle interactieve elementen</li>
                <li><strong>Alt text:</strong> Beschrijvende alt text voor alle afbeeldingen</li>
                <li><strong>Live regions:</strong> ARIA live announcements voor dynamische content updates</li>
                <li><strong>Focus management:</strong> Logische focus volgorde en zichtbare focus indicators</li>
                <li><strong>Form labels:</strong> Alle formuliervelden hebben duidelijke, geassocieerde labels</li>
              </ul>

              <p>
                <strong>Geteste screen readers:</strong> NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
              </p>

              <h3>Visuele Toegankelijkheid</h3>
              <ul>
                <li><strong>Kleurcontrast:</strong> Minimaal 4.5:1 voor normale text, 3:1 voor grote text (WCAG AA)</li>
                <li><strong>Schaalbare tekst:</strong> Text kan vergroot worden tot 200% zonder verlies van functionaliteit</li>
                <li><strong>Geen kleur-alleen informatie:</strong> Informatie wordt niet uitsluitend via kleur gecommuniceerd</li>
                <li><strong>Dark mode:</strong> Volledig ondersteunde dark mode met hoog contrast</li>
                <li><strong>Focus indicators:</strong> Duidelijke visuele indicators voor keyboard focus</li>
                <li><strong>Responsive text:</strong> Tekst past zich aan aan verschillende schermformaten</li>
              </ul>

              <h3>Multimedia Toegankelijkheid</h3>
              <ul>
                <li><strong>Video ondertiteling:</strong> Alle video's hebben closed captions (waar van toepassing)</li>
                <li><strong>Audio transcripties:</strong> Tekstversies beschikbaar voor audio content</li>
                <li><strong>Autoplay control:</strong> Geen automatisch afspelende audio of video</li>
                <li><strong>Pauze/stop knoppen:</strong> Controles voor bewegende content</li>
              </ul>
            </section>

            <section>
              <h2>3. Assistive Technologies</h2>
              <p>
                Onze website is compatibel met de volgende assistive technologies en ondersteunende hulpmiddelen:
              </p>

              <h3>Screen Readers</h3>
              <ul>
                <li><strong>NVDA (Windows):</strong> Volledig ondersteund, regelmatig getest</li>
                <li><strong>JAWS (Windows):</strong> Volledig ondersteund</li>
                <li><strong>VoiceOver (macOS/iOS):</strong> Volledig ondersteund, native ondersteuning</li>
                <li><strong>TalkBack (Android):</strong> Volledig ondersteund</li>
                <li><strong>Narrator (Windows):</strong> Basis ondersteuning</li>
              </ul>

              <h3>Browser Extensions</h3>
              <ul>
                <li><strong>Text-to-speech:</strong> Compatibel met browser TTS extensies</li>
                <li><strong>High contrast modes:</strong> Respecteert system high contrast instellingen</li>
                <li><strong>Font customization:</strong> Werkt met custom font extensies (OpenDyslexic, etc.)</li>
                <li><strong>Ad blockers:</strong> Geen essentiële functionaliteit geblokkeerd door ad blockers</li>
              </ul>

              <h3>Input Devices</h3>
              <ul>
                <li><strong>Toetsenbord:</strong> 100% keyboard navigatie zonder muis</li>
                <li><strong>Touch screens:</strong> Volledig touch-optimized interface</li>
                <li><strong>Voice control:</strong> Compatibel met voice navigation software</li>
                <li><strong>Switch control:</strong> Ondersteuning voor single-switch navigatie</li>
                <li><strong>Eye tracking:</strong> Basis compatibiliteit met eye tracking devices</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Browser Compatibility</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Voor de beste toegankelijkheidservaring raden we aan om moderne browsers te gebruiken: <strong>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</strong>. Oudere browsers kunnen beperkte toegankelijkheidsfuncties hebben.
                </p>
              </div>
            </section>

            <section>
              <h2>4. Bekende Beperkingen</h2>
              <p>
                Ondanks onze inspanningen zijn er enkele bekende toegankelijkheidsbeperkingen waar we aan werken:
              </p>

              <h3>Huidige Beperkingen</h3>
              <ul>
                <li><strong>Interactive Crime Map:</strong> Beperkte keyboard navigatie voor kaartinteractie (workaround: gebruik tabel-weergave alternatief)</li>
                <li><strong>Forum rich text editor:</strong> Sommige formatting opties vereisen muis (alternatief: gebruik Markdown syntax)</li>
                <li><strong>Oude forum threads:</strong> Threads van voor 2024 kunnen beperkte accessibility hebben (we zijn deze aan het bijwerken)</li>
                <li><strong>Third-party embeds:</strong> Embedded Twitter/YouTube content kan beperkte toegankelijkheid hebben</li>
              </ul>

              <h3>Geplande Verbeteringen</h3>
              <p>
                We werken aan de volgende toegankelijkheidsverbeteringen:
              </p>
              <ul>
                <li><strong>Q1 2026:</strong> Volledig toetsenbord-navigeerbare crime map</li>
                <li><strong>Q2 2026:</strong> Verbeterde screen reader ondersteuning voor rich text editor</li>
                <li><strong>Q3 2026:</strong> Audio beschrijvingen voor complexe grafieken en infographics</li>
                <li><strong>Q4 2026:</strong> AI-powered alt text generator voor gebruiker-geüploade afbeeldingen</li>
                <li><strong>Ongoing:</strong> Continue accessibility audits en gebruikerstesten</li>
              </ul>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ User-Generated Content</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Content die door gebruikers wordt geplaatst (forum posts, comments) kan toegankelijkheidsproblemen bevatten die buiten onze directe controle zijn. We moedigen gebruikers aan om toegankelijke content te plaatsen (alt text voor afbeeldingen, duidelijke link tekst, etc.) en bieden richtlijnen in onze <Link href="/gebruikersregels" className="hover:underline">Gebruikersregels</Link>.
                </p>
              </div>
            </section>

            <section>
              <h2>5. Testing en Audits</h2>
              <p>
                We voeren regelmatig toegankelijkheidstesten uit om ervoor te zorgen dat onze website toegankelijk blijft voor iedereen.
              </p>

              <h3>Geautomatiseerde Testing</h3>
              <p>
                We gebruiken de volgende geautomatiseerde tools:
              </p>
              <ul>
                <li><strong>axe DevTools:</strong> Wekelijkse scans voor WCAG 2.1 AA/AAA compliance</li>
                <li><strong>WAVE (Web Accessibility Evaluation Tool):</strong> Maandelijkse comprehensive audits</li>
                <li><strong>Lighthouse:</strong> Continuous Integration accessibility checks bij elke code deployment</li>
                <li><strong>Pa11y:</strong> Geautomatiseerde regression testing</li>
              </ul>

              <h3>Menselijke Testing</h3>
              <p>
                Geautomatiseerde tools detecteren slechts ~30% van toegankelijkheidsproblemen. Daarom doen we ook:
              </p>
              <ul>
                <li><strong>Screen reader testing:</strong> Kwartaal testen met NVDA, JAWS, VoiceOver</li>
                <li><strong>Keyboard-only testing:</strong> Maandelijkse volledige site navigatie zonder muis</li>
                <li><strong>User testing:</strong> Jaarlijkse testing met gebruikers met diverse beperkingen</li>
                <li><strong>Expert audits:</strong> Externe accessibility experts voeren jaarlijkse audits uit</li>
              </ul>

              <h3>Laatste Audit</h3>
              <p>
                <strong>Datum:</strong> 1 oktober 2025<br />
                <strong>Auditor:</strong> AccessibilityNL (externe expert)<br />
                <strong>Score:</strong> 95/100 (WCAG 2.1 Level AA)<br />
                <strong>Status:</strong> Voldoet aan WCAG 2.1 Level AA met enkele minor aandachtspunten<br />
                <strong>Rapport:</strong> Beschikbaar op verzoek via <a href="mailto:toegankelijkheid@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">toegankelijkheid@politie-forum.nl</a>
              </p>
            </section>

            <section>
              <h2>6. Toegankelijkheidsproblemen Melden</h2>
              <p>
                Als u een toegankelijkheidsprobleem tegenkomt op onze website, laat het ons dan weten. We nemen alle meldingen serieus en werken aan oplossingen.
              </p>

              <h3>Hoe Melden</h3>
              <ol>
                <li><strong>Email:</strong> <a href="mailto:toegankelijkheid@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">toegankelijkheid@politie-forum.nl</a></li>
                <li><strong>Vermeld in uw melding:</strong>
                  <ul>
                    <li>URL van de pagina waar het probleem optreedt</li>
                    <li>Beschrijving van het probleem en wat u probeerde te doen</li>
                    <li>Welke assistive technology gebruikt u (indien van toepassing)</li>
                    <li>Browser en operating system</li>
                    <li>Screenshots of video opname (optioneel maar helpvol)</li>
                  </ul>
                </li>
                <li><strong>Responstijd:</strong> We reageren binnen 2 werkdagen</li>
                <li><strong>Oplossingstijd:</strong> Afhankelijk van complexiteit (2-30 dagen)</li>
              </ol>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Toegankelijkheid:</strong> <a href="mailto:toegankelijkheid@politie-forum.nl" className="hover:underline">toegankelijkheid@politie-forum.nl</a></p>
                  <p><strong>Algemeen:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Redactie:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
                </div>
              </div>

              <h3>Alternatieve Toegang</h3>
              <p>
                Als u een deel van onze website niet toegankelijk vindt en het probleem niet onmiddellijk kan worden opgelost, kunnen we alternatieve toegang bieden:
              </p>
              <ul>
                <li><strong>Email updates:</strong> Ontvang nieuws en forum updates via email</li>
                <li><strong>Telefoonondersteuning:</strong> Persoonlijke hulp bij navigatie</li>
                <li><strong>Content transcripties:</strong> Tekstversies van multimedia content</li>
                <li><strong>Simplified interface:</strong> Versie zonder JavaScript/complexe features</li>
              </ul>
            </section>

            <section>
              <h2>7. Richtlijnen voor Toegankelijke Content</h2>
              <p>
                We moedigen alle gebruikers aan om toegankelijke content te plaatsen. Hier zijn enkele tips:
              </p>

              <h3>Afbeeldingen</h3>
              <ul>
                <li><strong>Alt text:</strong> Voeg altijd descriptieve alt text toe aan afbeeldingen</li>
                <li><strong>Decoratieve beelden:</strong> Gebruik lege alt text (alt="") voor puur decoratieve afbeeldingen</li>
                <li><strong>Complexe grafieken:</strong> Voeg een langere beschrijving toe in de text of caption</li>
                <li><strong>Screenshots met text:</strong> Transcribeer de tekst in de alt text of post body</li>
              </ul>

              <h3>Links</h3>
              <ul>
                <li><strong>Descriptieve link text:</strong> Vermijd "klik hier" - gebruik "lees het volledige rapport"</li>
                <li><strong>Context:</strong> Link text moet standalone duidelijk zijn</li>
                <li><strong>External links:</strong> Geef aan als een link naar externe website gaat</li>
              </ul>

              <h3>Formatting</h3>
              <ul>
                <li><strong>Headings:</strong> Gebruik heading markup (h2, h3) voor structuur, niet alleen bold text</li>
                <li><strong>Lists:</strong> Gebruik bullet points of numbered lists voor opsommingen</li>
                <li><strong>Tables:</strong> Gebruik table headers en caption voor data tabellen</li>
                <li><strong>Contrast:</strong> Vermijd lichte kleuren op lichte achtergronden</li>
              </ul>

              <h3>Video en Audio</h3>
              <ul>
                <li><strong>Captions:</strong> Voeg closed captions toe aan video's</li>
                <li><strong>Transcripts:</strong> Bied tekstversies van audio content</li>
                <li><strong>Geen autoplay:</strong> Laat media niet automatisch afspelen</li>
              </ul>
            </section>

            <section>
              <h2>8. Toekomstige Verbeteringen</h2>
              <p>
                We blijven werken aan verbeteringen voor een nog toegankelijkere ervaring.
              </p>

              <h3>2026 Roadmap</h3>
              <ul>
                <li><strong>Q1 2026:</strong>
                  <ul>
                    <li>Toegankelijkheidswidget met font size, contrast, en dyslexie-friendly font opties</li>
                    <li>Verbeterde keyboard shortcuts en customization</li>
                  </ul>
                </li>
                <li><strong>Q2 2026:</strong>
                  <ul>
                    <li>AI-powered alt text suggestions voor uploads</li>
                    <li>Sign language video's voor belangrijke aankondigingen</li>
                  </ul>
                </li>
                <li><strong>Q3 2026:</strong>
                  <ul>
                    <li>Verbeterde mobile accessibility</li>
                    <li>Voice navigation ondersteuning</li>
                  </ul>
                </li>
                <li><strong>Q4 2026:</strong>
                  <ul>
                    <li>WCAG 2.2 Level AAA compliance voor kritische pagina's</li>
                    <li>Community accessibility ambassadors programma</li>
                  </ul>
                </li>
              </ul>

              <h3>Community Feedback</h3>
              <p>
                We waarderen input van onze community met betrekking tot toegankelijkheid:
              </p>
              <ul>
                <li>Jaarlijkse accessibility survey voor gebruikers</li>
                <li>Beta testing programma voor nieuwe accessibility features</li>
                <li>Advisory board met members met diverse beperkingen</li>
              </ul>
            </section>

            <section>
              <h2>9. Gerelateerde Resources</h2>
              <p>
                Voor meer informatie over toegankelijkheid en assistive technologies:
              </p>

              <h3>Externe Resources</h3>
              <ul>
                <li><strong>W3C Web Accessibility Initiative (WAI):</strong> <a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">www.w3.org/WAI</a></li>
                <li><strong>WebAIM:</strong> <a href="https://webaim.org/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">webaim.org</a></li>
                <li><strong>Accessibility.nl:</strong> <a href="https://www.accessibility.nl/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">www.accessibility.nl</a></li>
                <li><strong>Bartiméus Accessibility:</strong> <a href="https://www.accessibility.nl/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">www.bartimeus.nl/accessibility</a></li>
              </ul>

              <h3>Interne Documenten</h3>
              <ul>
                <li><Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> - Community guidelines inclusief toegankelijke content tips</li>
                <li><Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</Link> - Hoe we assistive technology data beschermen</li>
                <li><Link href="/voorwaarden" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Voorwaarden</Link> - Servicevoorwaarden</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Laatst bijgewerkt:</strong> 15 oktober 2025<br />
                <strong>Versie:</strong> 1.0<br />
                <strong>Volgende audit:</strong> 1 april 2026<br />
                <strong>WCAG Versie:</strong> 2.1 Level AA<br />
                <strong>Laatste audit score:</strong> 95/100
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
