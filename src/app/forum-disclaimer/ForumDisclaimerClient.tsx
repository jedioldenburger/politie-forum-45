'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export function ForumDisclaimerClient() {
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
            '@id': 'https://politie-forum.nl/forum-disclaimer#webpage',
            url: 'https://politie-forum.nl/forum-disclaimer',
            name: 'Forum Disclaimer',
            description: 'Onze forum disclaimer legt uit hoe we omgaan met user-generated content, moderatie en aansprakelijkheid.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/forum-disclaimer#breadcrumb',
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
              <li><Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">Home</Link></li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 dark:text-gray-100">Forum Disclaimer</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Forum Disclaimer</h1>

            <p className="lead">
              Politie Forum Nederland biedt een platform waar gebruikers informatie kunnen delen, discussiëren en ervaringen kunnen uitwisselen over politie, veiligheid en gerelateerde onderwerpen. Deze forum disclaimer beschrijft de voorwaarden, aansprakelijkheden en verantwoordelijkheden die van toepassing zijn op het gebruik van onze forumdiensten.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <section>
              <h2>1. User-Generated Content</h2>
              <p>
                Het forum bevat content die door gebruikers is aangemaakt ("User-Generated Content" of "UGC"). Deze content vertegenwoordigt de meningen, overtuigingen en ervaringen van individuele gebruikers en niet noodzakelijk die van Politie Forum Nederland.
              </p>

              <h3>Verantwoordelijkheid voor Content</h3>
              <p>
                Gebruikers zijn volledig verantwoordelijk voor de content die ze plaatsen op het forum. Dit omvat:
              </p>
              <ul>
                <li><strong>Tekstuele berichten:</strong> Posts, reacties, en privéberichten</li>
                <li><strong>Media uploads:</strong> Afbeeldingen, video's, en andere bestanden</li>
                <li><strong>Links:</strong> URL's naar externe websites of bronnen</li>
                <li><strong>Profielinformatie:</strong> Biografie, avatar, en publieke gegevens</li>
              </ul>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Belangrijke Waarschuwing</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Door content te plaatsen op ons forum bevestigt u dat u het auteursrecht bezit of toestemming heeft van de rechthebbende(n) om deze content te delen. U bent aansprakelijk voor eventuele schade die voortvloeit uit inbreuk op intellectueel eigendom of andere rechten.
                </p>
              </div>

              <h3>Content Verificatie</h3>
              <p>
                Politie Forum Nederland <strong>verifieert niet</strong> de juistheid, volledigheid of betrouwbaarheid van user-generated content. Hoewel we streven naar een constructieve en informatieve discussie-omgeving, kunnen we niet garanderen dat alle content accuraat of actueel is.
              </p>
              <ul>
                <li>We controleren niet proactief alle berichten voordat ze worden gepubliceerd</li>
                <li>Moderatie vindt plaats op basis van gebruikersrapporten en periodieke controles</li>
                <li>Verwijdering van content betekent niet dat we aansprakelijkheid erkennen voor de oorspronkelijke publicatie</li>
              </ul>

              <h3>Intellectueel Eigendom</h3>
              <p>
                Door content te plaatsen op ons forum verleent u Politie Forum Nederland een niet-exclusieve, wereldwijde, royaltyvrije licentie om deze content te gebruiken, reproduceren, wijzigen en distribueren binnen het kader van onze dienstverlening. U behoudt alle eigendomsrechten op uw content.
              </p>
            </section>

            <section>
              <h2>2. Aansprakelijkheid en Disclaimer</h2>
              <p>
                Politie Forum Nederland wijst uitdrukkelijk alle aansprakelijkheid af voor schade die voortvloeit uit het gebruik van het forum of de daarin gedeelde informatie.
              </p>

              <h3>Geen Professioneel Advies</h3>
              <p>
                Content op het forum is bedoeld voor informatieve en discussie doeleinden en mag <strong>niet</strong> worden beschouwd als:
              </p>
              <ul>
                <li><strong>Juridisch advies:</strong> Raadpleeg een erkende advocaat voor juridische kwesties</li>
                <li><strong>Medisch advies:</strong> Raadpleeg een erkende zorgverlener voor medische kwesties</li>
                <li><strong>Financieel advies:</strong> Raadpleeg een erkende financieel adviseur voor financiële kwesties</li>
                <li><strong>Officiële politie-instructies:</strong> Volg altijd de officiële richtlijnen van uw lokale politie</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Disclaimer Scope</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  Deze disclaimer is van toepassing op alle content op het forum, inclusief maar niet beperkt tot: discussiethreads, reacties, privéberichten, profielinformatie, en door gebruikers geüploade media. Het gebruik van informatie van het forum is geheel op eigen risico.
                </p>
              </div>

              <h3>Externe Links</h3>
              <p>
                Het forum kan links bevatten naar externe websites die niet door ons worden beheerd. We zijn niet verantwoordelijk voor de content, privacybeleid of praktijken van deze externe sites. Het bezoeken van externe links is op eigen risico.
              </p>
              <ul>
                <li>We onderzoeken niet alle gelinkte websites</li>
                <li>Een link betekent geen endorsement van de externe website</li>
                <li>We kunnen niet garanderen dat externe links altijd functioneel zijn</li>
                <li>Gebruikers moeten zelf de betrouwbaarheid van externe bronnen beoordelen</li>
              </ul>

              <h3>Beperking van Aansprakelijkheid</h3>
              <p>
                Voor zover wettelijk toegestaan, zijn Politie Forum Nederland, haar eigenaren, medewerkers, en partners niet aansprakelijk voor:
              </p>
              <ul>
                <li>Directe, indirecte, incidentele of gevolgschade voortvloeiend uit forumgebruik</li>
                <li>Verlies van data, omzet of goodwill</li>
                <li>Onderbreking van diensten of technische problemen</li>
                <li>Fouten, onjuistheden of weglatingen in user-generated content</li>
                <li>Ongeautoriseerde toegang tot of wijziging van uw gegevens</li>
              </ul>
            </section>

            <section>
              <h2>3. Moderatiebeleid</h2>
              <p>
                Om een veilige en constructieve omgeving te behouden, hanteren we een actief moderatiebeleid. Moderatoren hebben het recht om content te bewerken, verplaatsen of verwijderen die in strijd is met onze richtlijnen.
              </p>

              <h3>Moderatie Criteria</h3>
              <p>
                Content kan worden gemodereerd als deze:
              </p>
              <ul>
                <li><strong>Illegaal is:</strong> Incitatie tot geweld, kinderpornografie, fraude, stalking</li>
                <li><strong>Beledigend is:</strong> Discriminatie, haatzaaien, persoonlijke aanvallen</li>
                <li><strong>Spam bevat:</strong> Reclame, herhaalde berichten, irrelevante links</li>
                <li><strong>Privacy schendt:</strong> Delen van persoonlijke gegevens zonder toestemming</li>
                <li><strong>Off-topic is:</strong> Niet gerelateerd aan forumcategorie of discussie</li>
                <li><strong>Misleidend is:</strong> Nepnieuws, impersonatie, valse claims</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Moderatie Proces</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Moderatie vindt plaats door menselijke moderatoren en geautomatiseerde filters. Beslissingen zijn gebaseerd op onze <Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> en <Link href="/moderatie-beleid" className="text-primary-600 dark:text-primary-400 hover:underline">Moderatiebeleid</Link>. U heeft het recht om bezwaar te maken tegen moderatiebeslissingen via onze appealprocedure.
                </p>
              </div>

              <h3>Moderator Discretie</h3>
              <p>
                Moderatoren hebben de discretie om:
              </p>
              <ul>
                <li>Berichten te bewerken om in overeenstemming te zijn met richtlijnen (met notificatie aan gebruiker)</li>
                <li>Threads te sluiten als discussies uit de hand lopen of off-topic raken</li>
                <li>Gebruikers tijdelijk of permanent te verbannen bij herhaalde overtredingen</li>
                <li>Content te verplaatsen naar meer passende categorieën</li>
                <li>Waarschuwingen uit te geven aan gebruikers</li>
              </ul>

              <h3>Geen Garantie van Moderatie</h3>
              <p>
                Hoewel we ons best doen om onze richtlijnen te handhaven, kunnen we niet garanderen dat alle ongepaste content onmiddellijk wordt verwijderd. Moderatie is een voortdurend proces en is afhankelijk van:
              </p>
              <ul>
                <li>Gebruikersrapportages (gebruik de "Rapporteer" knop)</li>
                <li>Beschikbaarheid van moderatoren</li>
                <li>Complexiteit van de situatie</li>
              </ul>
            </section>

            <section>
              <h2>4. Gebruikersverantwoordelijkheden</h2>
              <p>
                Als lid van Politie Forum Nederland heeft u bepaalde verantwoordelijkheden om bij te dragen aan een positieve gemeenschap.
              </p>

              <h3>Verplichtingen van Gebruikers</h3>
              <ul>
                <li><strong>Naleving van regels:</strong> Lees en volg onze <Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link></li>
                <li><strong>Respectvolle communicatie:</strong> Behandel andere leden met respect, zelfs bij meningsverschillen</li>
                <li><strong>Accurate informatie:</strong> Deel alleen informatie waarvan u de juistheid redelijkerwijs kunt verifiëren</li>
                <li><strong>Privacy bescherming:</strong> Deel geen persoonlijke gegevens van anderen zonder toestemming</li>
                <li><strong>Auteursrecht:</strong> Deel alleen content waarvoor u rechten heeft of toestemming heeft verkregen</li>
                <li><strong>Rapportage:</strong> Rapporteer ongepaste content aan moderatoren</li>
              </ul>

              <h3>Account Beveiliging</h3>
              <p>
                U bent verantwoordelijk voor het beveiligen van uw account:
              </p>
              <ul>
                <li>Gebruik een sterk, uniek wachtwoord</li>
                <li>Deel uw inloggegevens met niemand</li>
                <li>Log uit op gedeelde computers</li>
                <li>Meld verdachte activiteiten onmiddellijk</li>
                <li>U bent aansprakelijk voor alle activiteiten onder uw account</li>
              </ul>

              <h3>Gevolgen van Niet-Naleving</h3>
              <p>
                Overtreding van deze disclaimer of onze gebruikersregels kan resulteren in:
              </p>
              <ul>
                <li><strong>Waarschuwing:</strong> Eerste overtreding resulteert meestal in een waarschuwing</li>
                <li><strong>Tijdelijke ban:</strong> 7-30 dagen voor herhaalde of ernstige overtredingen</li>
                <li><strong>Permanente ban:</strong> Bij zeer ernstige of herhaalde overtredingen na meerdere waarschuwingen</li>
                <li><strong>Content verwijdering:</strong> Ongepaste content wordt verwijderd zonder kennisgeving</li>
                <li><strong>Juridische stappen:</strong> Bij illegale activiteiten kunnen we samenwerken met autoriteiten</li>
              </ul>
            </section>

            <section>
              <h2>5. Privacy en Gegevensverwerking</h2>
              <p>
                Het gebruik van het forum omvat de verwerking van persoonlijke gegevens. Voor details, zie ons volledige <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacybeleid</Link>.
              </p>

              <h3>Publieke Zichtbaarheid</h3>
              <p>
                Alle content die u plaatst op het forum is <strong>openbaar zichtbaar</strong>, tenzij anders aangegeven:
              </p>
              <ul>
                <li>Posts en reacties zijn zichtbaar voor alle bezoekers (ook niet-ingelogde gebruikers)</li>
                <li>Uw gebruikersnaam en avatar zijn openbaar</li>
                <li>Privéberichten zijn alleen zichtbaar voor verzender en ontvanger</li>
                <li>Profielinformatie kan door andere leden worden bekeken (afhankelijk van uw privacy-instellingen)</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Privacy Tip</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  Deel nooit persoonlijke identificeerbare informatie (adres, telefoonnummer, rijksregisternummer, bankgegevens) op het openbare forum. Gebruik privéberichten voor gevoelige informatie, maar wees voorzichtig met wie u deze informatie deelt.
                </p>
              </div>

              <h3>Gegevensretentie</h3>
              <p>
                Forum content wordt bewaard zolang uw account actief is. Bij het verwijderen van uw account:
              </p>
              <ul>
                <li>Persoonlijke gegevens worden verwijderd binnen 30 dagen</li>
                <li>Posts kunnen anoniem worden bewaard voor discussie-continuïteit</li>
                <li>U kunt verzoeken om volledige verwijdering (inclusief posts) via <a href="mailto:privacy@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@politie-forum.nl</a></li>
              </ul>

              <h3>Cookies en Tracking</h3>
              <p>
                Het forum gebruikt cookies voor functionaliteit en analytics. Zie ons <Link href="/cookies" className="text-primary-600 dark:text-primary-400 hover:underline">Cookiebeleid</Link> voor details.
              </p>
            </section>

            <section>
              <h2>6. Wijzigingen in Deze Disclaimer</h2>
              <p>
                Politie Forum Nederland behoudt zich het recht voor om deze forum disclaimer op elk moment te wijzigen zonder voorafgaande kennisgeving.
              </p>

              <h3>Kennisgeving van Wijzigingen</h3>
              <ul>
                <li>Significante wijzigingen worden aangekondigd via een banner op de website</li>
                <li>Geregistreerde gebruikers ontvangen een email notificatie bij belangrijke updates</li>
                <li>De "Laatst bijgewerkt" datum bovenaan dit document wordt aangepast</li>
                <li>Oude versies worden gearchiveerd voor referentie</li>
              </ul>

              <h3>Acceptatie van Wijzigingen</h3>
              <p>
                Uw voortgezette gebruik van het forum na publicatie van wijzigingen wordt beschouwd als acceptatie van de nieuwe voorwaarden. Als u niet akkoord gaat met de wijzigingen, dient u het gebruik van het forum te staken en uw account te verwijderen.
              </p>
            </section>

            <section>
              <h2>7. Toepasselijk Recht en Geschillen</h2>
              <p>
                Deze forum disclaimer wordt beheerst door Nederlands recht. Alle geschillen voortvloeiend uit of verband houdend met het gebruik van het forum zullen worden voorgelegd aan de bevoegde rechtbank in Nederland.
              </p>

              <h3>Geschillenregeling</h3>
              <p>
                Bij geschillen streven we eerst naar een minnelijke oplossing:
              </p>
              <ul>
                <li><strong>Stap 1:</strong> Neem contact op met ons via <a href="mailto:info@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">info@politie-forum.nl</a></li>
                <li><strong>Stap 2:</strong> We reageren binnen 5 werkdagen met een voorgestelde oplossing</li>
                <li><strong>Stap 3:</strong> Als geen overeenstemming wordt bereikt, kan mediation worden voorgesteld</li>
                <li><strong>Stap 4:</strong> Juridische procedures zijn het laatste redmiddel</li>
              </ul>

              <h3>Separabiliteitsclausule</h3>
              <p>
                Als een bepaling van deze disclaimer ongeldig of niet-afdwingbaar wordt verklaard, blijven de overige bepalingen volledig van kracht.
              </p>
            </section>

            <section>
              <h2>8. Contact en Vragen</h2>
              <p>
                Voor vragen over deze forum disclaimer of om overtredingen te melden, neem contact met ons op:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Algemeen:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Moderatie:</strong> <a href="mailto:moderatie@politie-forum.nl" className="hover:underline">moderatie@politie-forum.nl</a></p>
                  <p><strong>Juridisch:</strong> <a href="mailto:legal@politie-forum.nl" className="hover:underline">legal@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> <a href="tel:+31648319167" className="hover:underline">+31 6 48319167</a></p>
                  <p><strong>Post:</strong> Politie Forum Nederland<br />Sint Olofssteeg 4<br />1012AK Amsterdam<br />Netherlands</p>
                  <p className="mt-2"><strong>Publisher:</strong> <a href="https://digestpaper.com" target="_blank" rel="noopener noreferrer" className="hover:underline">DigestPaper.com</a></p>
                  <p><strong>Redactie:</strong> <a href="https://www.linkedin.com/in/jedioldenburger/" target="_blank" rel="noopener noreferrer" className="hover:underline">P. Oldenburger</a></p>
                </div>
              </div>

              <h3>Rapporteer Overtredingen</h3>
              <p>
                Als u content tegenkomt die deze disclaimer schendt:
              </p>
              <ul>
                <li>Gebruik de "Rapporteer" knop onder het bericht</li>
                <li>Selecteer de reden voor rapportage</li>
                <li>Geef optioneel extra context</li>
                <li>Onze moderatoren zullen de rapportage binnen 24 uur beoordelen</li>
              </ul>

              <h3>Gerelateerde Documenten</h3>
              <ul>
                <li><Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> - Community guidelines</li>
                <li><Link href="/moderatie-beleid" className="text-primary-600 dark:text-primary-400 hover:underline">Moderatiebeleid</Link> - Moderatie procedures</li>
                <li><Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</Link> - Gegevensbescherming</li>
                <li><Link href="/voorwaarden" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Voorwaarden</Link> - Servicevoorwaarden</li>
                <li><Link href="/disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Disclaimer</Link> - Website disclaimer</li>
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
