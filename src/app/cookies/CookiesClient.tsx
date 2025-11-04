'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';

export function CookiesClient() {
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
            '@id': 'https://politie-forum.nl/cookies#webpage',
            url: 'https://politie-forum.nl/cookies',
            name: 'Cookiebeleid',
            description: 'Ons cookiebeleid legt uit welke cookies we gebruiken, waarom we ze gebruiken en hoe u uw voorkeuren kunt beheren.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/cookies#breadcrumb',
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
              <li className="text-gray-900 dark:text-gray-100">Cookiebeleid</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Cookiebeleid</h1>

            <p className="lead">
              Politie Forum Nederland ("wij", "ons", of "onze") gebruikt cookies en vergelijkbare technologieën om uw ervaring op onze website te verbeteren, functionaliteit te bieden en te analyseren hoe onze diensten worden gebruikt. Dit cookiebeleid legt uit wat cookies zijn, hoe we ze gebruiken en welke keuzes u heeft met betrekking tot cookies.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <section>
              <h2>1. Wat zijn Cookies?</h2>
              <p>
                Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden geplaatst wanneer u onze website bezoekt. Ze zijn breed gebruikt om websites te laten functioneren, of efficiënter te laten werken, en om rapportage-informatie te verstrekken aan de eigenaren van de site.
              </p>

              <h3>Soorten Cookies</h3>
              <p>Cookies kunnen worden geclassificeerd op basis van hun functie en levensduur:</p>
              <ul>
                <li><strong>Sessiecookies:</strong> Tijdelijke cookies die vervallen wanneer u uw browser sluit</li>
                <li><strong>Permanente cookies:</strong> Blijven op uw apparaat voor een bepaalde periode of tot u ze verwijdert</li>
                <li><strong>First-party cookies:</strong> Geplaatst door de website die u bezoekt</li>
                <li><strong>Third-party cookies:</strong> Geplaatst door externe diensten die op onze website worden gebruikt</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Technische Uitleg</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  Cookies bevatten meestal een unieke identificatiecode, de naam van de website waarvan de cookie afkomstig is, de levensduur van de cookie en een waarde (meestal een willekeurig gegenereerd uniek nummer). Deze informatie helpt websites u te herkennen bij terugkerende bezoeken.
                </p>
              </div>
            </section>

            <section>
              <h2>2. Welke Cookies Gebruiken Wij?</h2>
              <p>
                Wij gebruiken verschillende soorten cookies voor verschillende doeleinden om onze website te laten functioneren en uw ervaring te verbeteren. Hieronder vindt u een gedetailleerd overzicht van alle cookies die we gebruiken.
              </p>

              <h3>Noodzakelijke Cookies</h3>
              <p>
                Deze cookies zijn essentieel voor de werking van onze website. Ze stellen u in staat om te navigeren en basisfuncties te gebruiken. Zonder deze cookies kunnen bepaalde delen van de website niet goed functioneren.
              </p>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 my-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Cookie Naam</th>
                    <th className="px-4 py-2 text-left">Doel</th>
                    <th className="px-4 py-2 text-left">Levensduur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2"><code>session_id</code></td>
                    <td className="px-4 py-2">Behoudt uw sessie tijdens het bezoek</td>
                    <td className="px-4 py-2">Sessie</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>csrf_token</code></td>
                    <td className="px-4 py-2">Beveiligt formulieren tegen CSRF-aanvallen</td>
                    <td className="px-4 py-2">Sessie</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>auth_token</code></td>
                    <td className="px-4 py-2">Behoudt uw inlogstatus</td>
                    <td className="px-4 py-2">30 dagen</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2"><code>dark_mode</code></td>
                    <td className="px-4 py-2">Onthoudt uw thema voorkeur</td>
                    <td className="px-4 py-2">1 jaar</td>
                  </tr>
                </tbody>
              </table>

              <h3>Analytische Cookies</h3>
              <p>
                Deze cookies helpen ons te begrijpen hoe bezoekers omgaan met onze website door informatie anoniem te verzamelen en te rapporteren. We gebruiken deze gegevens om onze website te verbeteren.
              </p>
              <ul>
                <li><strong>Google Analytics (_ga, _gid):</strong> Meet hoe u de website gebruikt (pagina's bezocht, tijd op site, bounce rate)</li>
                <li><strong>Vercel Analytics:</strong> Verzamelt performance metrics (laadtijden, Core Web Vitals)</li>
                <li><strong>Firebase Analytics:</strong> Tracking van gebruikersinteracties en events</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Anonimisering</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Alle analytische gegevens worden geanonimiseerd. We kunnen geen individuele gebruikers identificeren via deze cookies. IP-adressen worden verkort (laatste octetten verwijderd) voordat ze worden opgeslagen, in overeenstemming met GDPR-richtlijnen.
                </p>
              </div>

              <h3>Functionele Cookies</h3>
              <p>
                Deze cookies maken verbeterde functionaliteit en personalisatie mogelijk, zoals het onthouden van uw voorkeuren en instellingen.
              </p>
              <ul>
                <li><strong>Taalvoorkeur:</strong> Onthoudt uw taalinstelling (Nederlands/Engels)</li>
                <li><strong>Weergave-opties:</strong> Bewaart voorkeuren voor forumweergave (lijst/grid)</li>
                <li><strong>Notificatie-instellingen:</strong> Onthoudt of u push-notificaties wilt ontvangen</li>
                <li><strong>Zoekgeschiedenis:</strong> Bewaart recente zoekopdrachten voor snelle toegang</li>
              </ul>

              <h3>Marketing Cookies</h3>
              <p>
                Deze cookies worden gebruikt om bezoekers te volgen op websites. Het doel is om advertenties weer te geven die relevant en aantrekkelijk zijn voor de individuele gebruiker.
              </p>

              <div className="my-6 p-4 bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 rounded-r">
                <p className="font-semibold text-accent-900 dark:text-accent-100">ℹ️ Opt-In Vereist</p>
                <p className="mt-2 text-accent-800 dark:text-accent-200">
                  Marketing cookies worden alleen geplaatst als u expliciet toestemming heeft gegeven via onze cookie banner. U kunt deze toestemming op elk moment intrekken via de cookie-instellingen onderaan deze pagina.
                </p>
              </div>

              <p>
                <strong>Let op:</strong> We gebruiken momenteel geen marketing cookies. Als we dit in de toekomst wel doen, zullen we dit beleid bijwerken en uw toestemming vragen.
              </p>
            </section>

            <section>
              <h2>3. Waarom Gebruiken Wij Cookies?</h2>
              <p>
                We gebruiken cookies voor verschillende belangrijke doeleinden die de functionaliteit en gebruikerservaring van onze website verbeteren.
              </p>

              <h3>Essentiële Functionaliteit</h3>
              <ul>
                <li><strong>Authenticatie:</strong> U ingelogd houden tijdens uw sessie</li>
                <li><strong>Beveiliging:</strong> Bescherming tegen CSRF en andere aanvallen</li>
                <li><strong>Sessie management:</strong> Behouden van winkelwagen, formuliergegevens tijdens browsing</li>
                <li><strong>Load balancing:</strong> Verdelen van verkeer over onze servers</li>
              </ul>

              <h3>Performance en Analytics</h3>
              <ul>
                <li><strong>Website optimalisatie:</strong> Meten van laadtijden en technische problemen</li>
                <li><strong>Gebruikersinzichten:</strong> Begrijpen welke content populair is</li>
                <li><strong>A/B testing:</strong> Testen van nieuwe features met een deel van bezoekers</li>
                <li><strong>Foutrapportage:</strong> Identificeren en oplossen van bugs</li>
              </ul>

              <h3>Personalisatie</h3>
              <ul>
                <li><strong>Voorkeuren:</strong> Onthouden van taal, thema (dark mode), lettergrootte</li>
                <li><strong>Content aanbevelingen:</strong> Suggereren van relevante artikelen en discussies</li>
                <li><strong>Notificaties:</strong> Beheren van meldingen voor nieuwe berichten en replies</li>
              </ul>
            </section>

            <section>
              <h2>4. Third-Party Cookies</h2>
              <p>
                Naast onze eigen cookies gebruiken we ook diensten van derden die cookies kunnen plaatsen. Deze externe partijen hebben hun eigen privacybeleid dat bepaalt hoe ze uw gegevens gebruiken.
              </p>

              <h3>Google Analytics</h3>
              <p>
                We gebruiken Google Analytics om te begrijpen hoe bezoekers onze website gebruiken. Google kan deze informatie gebruiken voor hun eigen doeleinden, zoals het verbeteren van hun diensten. U kunt Google Analytics uitschakelen met de <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h3>Firebase (Google)</h3>
              <p>
                Onze website gebruikt Firebase voor authenticatie, database en hosting. Firebase kan cookies plaatsen voor authenticatie en analytics. Zie het <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Firebase Privacy Policy</a> voor meer informatie.
              </p>

              <h3>Vercel</h3>
              <p>
                We hosten onze website op Vercel, dat analytics en performance monitoring cookies kan plaatsen. Zie het <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Vercel Privacy Policy</a> voor details.
              </p>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Belangrijke Informatie</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  We hebben <strong>geen controle</strong> over cookies die door derden worden geplaatst. Deze partijen kunnen uw browseactiviteiten volgen op verschillende websites. We raden u aan de privacyverklaringen van deze derden te lezen voor meer informatie over hoe ze cookies gebruiken.
                </p>
              </div>
            </section>

            <section>
              <h2>5. Uw Keuzes en Controle</h2>
              <p>
                U heeft verschillende opties om te bepalen welke cookies op uw apparaat worden geplaatst en hoe uw gegevens worden gebruikt.
              </p>

              <h3>Cookie Instellingen op Deze Website</h3>
              <p>
                Wanneer u onze website voor de eerste keer bezoekt, ziet u een cookie banner waarin u kunt kiezen welke cookies u wilt accepteren. U kunt op elk moment uw voorkeuren wijzigen:
              </p>
              <ul>
                <li>Klik op de "Cookie Instellingen" link onderaan elke pagina</li>
                <li>Selecteer of deselecteer de categorieën cookies die u wilt toestaan</li>
                <li>Klik op "Voorkeuren Opslaan" om uw keuzes te bevestigen</li>
              </ul>

              <h3>Browser Instellingen</h3>
              <p>
                De meeste webbrowsers accepteren standaard cookies, maar u kunt uw browser meestal zo instellen dat sommige of alle cookies worden geweigerd, of dat u een waarschuwing krijgt voordat een cookie wordt geplaatst. Raadpleeg de helpfunctie van uw browser voor meer informatie.
              </p>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Browser Instructies</p>
                <div className="mt-2 text-gray-800 dark:text-gray-200">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies</li>
                    <li><strong>Firefox:</strong> Opties → Privacy en beveiliging → Cookies</li>
                    <li><strong>Safari:</strong> Voorkeuren → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Instellingen → Privacy en services → Cookies</li>
                  </ul>
                </div>
              </div>

              <h3>Gevolgen van het Blokkeren van Cookies</h3>
              <p>
                Als u ervoor kiest om cookies te blokkeren of te verwijderen, werken sommige delen van onze website mogelijk niet correct:
              </p>
              <ul>
                <li>U kunt niet inloggen op uw account</li>
                <li>Uw voorkeuren (taal, thema) worden niet onthouden</li>
                <li>Sommige interactieve features functioneren mogelijk niet</li>
                <li>We kunnen de website niet optimaliseren voor uw ervaring</li>
              </ul>

              <p>
                <strong>Noodzakelijke cookies</strong> kunnen niet worden uitgeschakeld via onze cookie banner, omdat ze essentieel zijn voor de werking van de website. U kunt deze cookies wel blokkeren via uw browserinstellingen, maar dit kan de functionaliteit beperken.
              </p>
            </section>

            <section>
              <h2>6. Do Not Track (DNT)</h2>
              <p>
                "Do Not Track" (DNT) is een privacy voorkeur die gebruikers kunnen instellen in hun webbrowser. Wanneer een gebruiker DNT inschakelt, vraagt de browser websites die de gebruiker bezoekt om de gebruiker niet te volgen.
              </p>
              <p>
                <strong>Onze benadering:</strong> We respecteren DNT-signalen waar mogelijk. Wanneer we een DNT-signaal detecteren, schakelen we automatisch alle niet-essentiële tracking uit, inclusief analytische en marketing cookies. Noodzakelijke cookies blijven actief om de basisfunctionaliteit te waarborgen.
              </p>

              <h3>DNT Instellen in Uw Browser</h3>
              <ul>
                <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies → "Verzoek voor Niet volgen verzenden"</li>
                <li><strong>Firefox:</strong> Opties → Privacy en beveiliging → "Websites vertellen dat u niet gevolgd wilt worden"</li>
                <li><strong>Safari:</strong> Voorkeuren → Privacy → "Website tracking voorkomen"</li>
              </ul>
            </section>

            <section>
              <h2>7. Cookies en Privacy Wetgeving</h2>
              <p>
                Ons cookiegebruik voldoet aan de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de ePrivacy Richtlijn (Cookie Wet). Dit betekent:
              </p>

              <h3>GDPR Compliance</h3>
              <ul>
                <li><strong>Transparantie:</strong> We zijn duidelijk over welke cookies we gebruiken en waarom</li>
                <li><strong>Toestemming:</strong> We vragen uw expliciete toestemming voor niet-essentiële cookies</li>
                <li><strong>Controle:</strong> U kunt uw toestemming op elk moment intrekken</li>
                <li><strong>Minimale gegevens:</strong> We verzamelen alleen wat nodig is</li>
                <li><strong>Beveiliging:</strong> Cookiegegevens worden veilig opgeslagen en overgedragen</li>
              </ul>

              <h3>Uw Rechten</h3>
              <p>
                Onder de AVG heeft u de volgende rechten met betrekking tot uw persoonsgegevens (inclusief gegevens verzameld via cookies):
              </p>
              <ul>
                <li><strong>Recht op inzage:</strong> U kunt opvragen welke gegevens we over u hebben</li>
                <li><strong>Recht op rectificatie:</strong> U kunt incorrecte gegevens laten corrigeren</li>
                <li><strong>Recht op verwijdering:</strong> U kunt verzoeken om verwijdering van uw gegevens</li>
                <li><strong>Recht op beperking:</strong> U kunt de verwerking van uw gegevens beperken</li>
                <li><strong>Recht op overdraagbaarheid:</strong> U kunt uw gegevens in een gestructureerd formaat opvragen</li>
                <li><strong>Recht van bezwaar:</strong> U kunt bezwaar maken tegen bepaalde verwerkingen</li>
              </ul>

              <p>
                Voor het uitoefenen van deze rechten, zie onze <a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</a> of neem contact met ons op via <a href="mailto:privacy@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@politie-forum.nl</a>.
              </p>
            </section>

            <section>
              <h2>8. Wijzigingen in Dit Cookiebeleid</h2>
              <p>
                We kunnen dit cookiebeleid van tijd tot tijd bijwerken om veranderingen in ons gebruik van cookies of wijzigingen in de wet weer te geven.
              </p>

              <h3>Hoe Worden Wijzigingen Gecommuniceerd?</h3>
              <ul>
                <li>De "Laatst bijgewerkt" datum bovenaan dit document wordt aangepast</li>
                <li>Significante wijzigingen worden gecommuniceerd via een banner op de website</li>
                <li>Geregistreerde gebruikers ontvangen een email notificatie bij belangrijke updates</li>
                <li>We archiveren oude versies van dit beleid voor referentie</li>
              </ul>

              <p>
                We raden u aan dit cookiebeleid periodiek te herzien om op de hoogte te blijven van hoe we cookies gebruiken en beschermen. Uw voortgezette gebruik van de website na wijzigingen in dit beleid wordt beschouwd als acceptatie van die wijzigingen.
              </p>
            </section>

            <section>
              <h2>9. Contact en Vragen</h2>
              <p>
                Als u vragen of zorgen heeft over ons gebruik van cookies, neem dan contact met ons op:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Privacy:</strong> <a href="mailto:privacy@politie-forum.nl" className="hover:underline">privacy@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Redactie:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
                </div>
              </div>

              <p>
                We streven ernaar binnen 48 uur te reageren op alle privacy- en cookie-gerelateerde vragen. Voor urgente zaken kunt u bellen tijdens kantooruren.
              </p>

              <h3>Gerelateerde Pagina's</h3>
              <ul>
                <li><a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</a> - Ons volledige privacybeleid</li>
                <li><a href="/disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Disclaimer</a> - Gebruiksvoorwaarden</li>
                <li><a href="/voorwaarden" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Voorwaarden</a> - Servicevoorwaarden</li>
                <li><a href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</a> - Community guidelines</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Laatst bijgewerkt:</strong> 15 oktober 2025<br />
                <strong>Versie:</strong> 1.0<br />
                <strong>Volgende herziening:</strong> 15 januari 2026
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
