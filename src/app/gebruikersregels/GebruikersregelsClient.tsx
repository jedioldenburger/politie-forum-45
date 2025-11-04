'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';

export function GebruikersregelsClient() {
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
            '@id': 'https://politie-forum.nl/gebruikersregels#webpage',
            url: 'https://politie-forum.nl/gebruikersregels',
            name: 'Gebruikersregels',
            description: 'Community guidelines voor Politie Forum Nederland - acceptabel gedrag, verboden activiteiten en consequenties.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/gebruikersregels#breadcrumb',
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
              <li className="text-gray-900 dark:text-gray-100">Gebruikersregels</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Gebruikersregels</h1>

            <p className="lead">
              Welkom bij Politie Forum Nederland! Om een veilige, respectvolle en constructieve gemeenschap te waarborgen, verwachten we dat alle leden zich houden aan deze gebruikersregels. Deze regels zijn van toepassing op alle interacties op ons platform, inclusief posts, reacties, privéberichten en profielinformatie.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Belangrijk Principe</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                Behandel anderen zoals u zelf behandeld wilt worden. Respectvolle communicatie, zelfs bij meningsverschillen, is de basis van onze gemeenschap. We waarderen diverse perspectieven, maar vereisen dat alle discussies constructief en beleefd blijven.
              </p>
            </div>

            <section>
              <h2>1. Acceptabel Gedrag</h2>
              <p>
                We moedigen de volgende gedragingen aan om een positieve gemeenschap te creëren:
              </p>

              <h3>Constructieve Bijdragen</h3>
              <ul>
                <li><strong>Relevante content:</strong> Plaats berichten die bijdragen aan de discussie en relevant zijn voor de forumcategorie</li>
                <li><strong>Bronvermelding:</strong> Vermeld bronnen bij het citeren van artikelen, statistieken of claims</li>
                <li><strong>Genuanceerde discussie:</strong> Erken dat complexe onderwerpen vaak meerdere perspectieven hebben</li>
                <li><strong>Hulpvaardigheid:</strong> Help nieuwe leden en beantwoord vragen constructief</li>
                <li><strong>Kennisdeling:</strong> Deel uw expertise en ervaringen op een toegankelijke manier</li>
              </ul>

              <h3>Respectvolle Communicatie</h3>
              <ul>
                <li><strong>Beleefdheid:</strong> Gebruik respectvolle taal, ook bij onenigheid</li>
                <li><strong>Luisteren:</strong> Lees berichten volledig voordat u reageert</li>
                <li><strong>Empathie:</strong> Probeer het perspectief van anderen te begrijpen</li>
                <li><strong>Constructieve kritiek:</strong> Kritiseer ideeën, niet personen</li>
                <li><strong>Genuanceerde toon:</strong> Vermijd absolute uitspraken en laat ruimte voor dialoog</li>
              </ul>

              <h3>Transparantie en Integriteit</h3>
              <ul>
                <li><strong>Eerlijkheid:</strong> Wees eerlijk over uw kennis en beperkingen</li>
                <li><strong>Correcties:</strong> Geef toe als u een fout heeft gemaakt en corrigeer deze</li>
                <li><strong>Belangenverstrengeling:</strong> Vermeld als u een persoonlijk belang heeft in een discussie</li>
                <li><strong>Authenticiteit:</strong> Wees uzelf en gebruik geen nepidentiteiten</li>
              </ul>
            </section>

            <section>
              <h2>2. Verboden Activiteiten</h2>
              <p>
                De volgende gedragingen zijn <strong>niet toegestaan</strong> en kunnen leiden tot waarschuwingen, tijdelijke of permanente bans:
              </p>

              <h3>Illegale Content</h3>
              <ul>
                <li><strong>Illegale activiteiten:</strong> Promotie of organisatie van illegale activiteiten</li>
                <li><strong>Kinderpornografie:</strong> Absoluut verboden, wordt direct gemeld aan autoriteiten</li>
                <li><strong>Auteursrechtschending:</strong> Delen van volledig gekopieerde artikelen of piraterij-links</li>
                <li><strong>Drugs:</strong> Instructies voor productie, verkoop of aankoop van illegale drugs</li>
                <li><strong>Terrorisme:</strong> Verheerlijking of promotie van terroristische activiteiten</li>
                <li><strong>Hacking:</strong> Delen van malware, exploits of instructies voor illegale hacking</li>
              </ul>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Juridische Consequenties</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Illegale content wordt onmiddellijk verwijderd en gerapporteerd aan de bevoegde autoriteiten. IP-adressen en accountinformatie kunnen worden gedeeld met politie en justitie indien nodig. Schending van deze regels kan leiden tot strafrechtelijke vervolging.
                </p>
              </div>

              <h3>Beledigende Content</h3>
              <ul>
                <li><strong>Discriminatie:</strong> Haatzaaien of discriminatie op basis van ras, religie, geslacht, seksuele geaardheid, handicap, nationaliteit of leeftijd</li>
                <li><strong>Persoonlijke aanvallen:</strong> Beledigingen, scheldpartijen of ad hominem argumenten</li>
                <li><strong>Intimidatie:</strong> Pesten, stalking of andere vormen van intimidatie</li>
                <li><strong>Bedreiging:</strong> Dreigementen met geweld of andere schade</li>
                <li><strong>Harassment:</strong> Herhaaldelijk ongewenst contact na verzoek te stoppen</li>
                <li><strong>Doxxing:</strong> Delen van persoonlijke informatie zonder toestemming</li>
              </ul>

              <h3>Spam en Misbruik</h3>
              <ul>
                <li><strong>Commerciële spam:</strong> Ongevraagde reclame of promotie van producten/diensten</li>
                <li><strong>Herhaalde berichten:</strong> Meerdere keren hetzelfde bericht plaatsen</li>
                <li><strong>Off-topic spam:</strong> Irrelevante berichten in discussiethreads</li>
                <li><strong>Link spam:</strong> Massaal plaatsen van links naar externe websites</li>
                <li><strong>Bot-gedrag:</strong> Geautomatiseerde posting zonder toestemming</li>
                <li><strong>Forum flooding:</strong> Overmatig veel berichten plaatsen in korte tijd</li>
              </ul>

              <h3>Misleiding en Fraude</h3>
              <ul>
                <li><strong>Nepnieuws:</strong> Opzettelijk delen van verifieerbaar valse informatie</li>
                <li><strong>Impersonatie:</strong> Voordoen als een andere persoon of organisatie</li>
                <li><strong>Scams:</strong> Frauduleuze schema's of phishing pogingen</li>
                <li><strong>Manipulatie:</strong> Vote brigading, sockpuppet accounts of andere manipulatie</li>
                <li><strong>Plagiaat:</strong> Voordoen alsof content van anderen uw eigen werk is</li>
              </ul>

              <h3>Platform Misbruik</h3>
              <ul>
                <li><strong>Account circumvention:</strong> Nieuwe accounts aanmaken na een ban</li>
                <li><strong>Exploits:</strong> Misbruik maken van technische bugs of kwetsbaarheden</li>
                <li><strong>Moderator impersonatie:</strong> Voordoen als moderator of admin</li>
                <li><strong>False reporting:</strong> Kwaadaardig rapporteren van legitieme content</li>
              </ul>
            </section>

            <section>
              <h2>3. Gevolgen van Overtredingen</h2>
              <p>
                We hanteren een gelaagd systeem van consequenties, afhankelijk van de ernst en frequentie van overtredingen:
              </p>

              <h3>Waarschuwingssysteem</h3>
              <p>
                Voor minder ernstige overtredingen gebruiken we een <strong>three-strike systeem</strong>:
              </p>
              <ul>
                <li><strong>Eerste overtreding:</strong> Officiële waarschuwing via privébericht + verwijdering van content</li>
                <li><strong>Tweede overtreding:</strong> Tijdelijke ban van 7 dagen</li>
                <li><strong>Derde overtreding:</strong> Tijdelijke ban van 30 dagen</li>
                <li><strong>Vierde overtreding:</strong> Permanente ban</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Waarschuwingen Vervallen</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Waarschuwingen vervallen na 6 maanden zonder nieuwe overtredingen. Na vervaldatum begint u opnieuw bij waarschuwing 1 als toekomstige overtredingen plaatsvinden. Dit moedigt verbeterd gedrag aan zonder permanente consequenties voor éénmalige fouten.
                </p>
              </div>

              <h3>Directe Bans (Zonder Waarschuwing)</h3>
              <p>
                Voor zeer ernstige overtredingen kunnen we direct overgaan tot een ban:
              </p>
              <ul>
                <li><strong>Illegale content:</strong> Kinderpornografie, terrorisme, drugshandel → <strong>Permanente ban + melding autoriteiten</strong></li>
                <li><strong>Doxxing:</strong> Delen van persoonlijke gegevens zonder toestemming → <strong>Permanente ban</strong></li>
                <li><strong>Ernstige bedreigingen:</strong> Dreigementen met geweld → <strong>30 dagen tot permanente ban</strong></li>
                <li><strong>Account circumvention:</strong> Nieuwe accounts na ban → <strong>Permanente ban alle accounts</strong></li>
                <li><strong>Gecoördineerde manipulatie:</strong> Vote brigading, bot networks → <strong>Permanente ban</strong></li>
              </ul>

              <h3>Content Moderatie</h3>
              <p>
                Afhankelijk van de overtreding kunnen we:
              </p>
              <ul>
                <li><strong>Bewerken:</strong> Minor overtredingen (taalgebruik) met notificatie aan gebruiker</li>
                <li><strong>Verwijderen:</strong> Substantiële overtredingen zonder mogelijkheid tot herstel</li>
                <li><strong>Verplaatsen:</strong> Off-topic content naar juiste categorie</li>
                <li><strong>Sluiten:</strong> Threads die uit de hand lopen of hun doel hebben vervuld</li>
                <li><strong>Archiveren:</strong> Oude threads voor historisch overzicht zonder nieuwe replies</li>
              </ul>

              <h3>Appealprocedure</h3>
              <p>
                Als u het niet eens bent met een moderatiebeslissing:
              </p>
              <ul>
                <li><strong>Stap 1:</strong> Email naar <a href="mailto:moderatie@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">moderatie@politie-forum.nl</a> binnen 14 dagen</li>
                <li><strong>Stap 2:</strong> Vermeld uw gebruikersnaam, datum van moderatie, en reden voor bezwaar</li>
                <li><strong>Stap 3:</strong> Een andere moderator (niet de oorspronkelijke) zal uw appeal beoordelen</li>
                <li><strong>Stap 4:</strong> Beslissing wordt binnen 7 werkdagen gecommuniceerd</li>
                <li><strong>Definitief:</strong> De appealbeslissing is definitief en bindend</li>
              </ul>
            </section>

            <section>
              <h2>4. Specifieke Forum Etiquette</h2>
              <p>
                Naast de formele regels hanteren we informele etiquette voor een prettige gebruikerservaring:
              </p>

              <h3>Posting Best Practices</h3>
              <ul>
                <li><strong>Duidelijke titels:</strong> Gebruik beschrijvende titels die de inhoud samenvatten</li>
                <li><strong>Zoek eerst:</strong> Controleer of uw vraag al is beantwoord voordat u een nieuw topic aanmaakt</li>
                <li><strong>Juiste categorie:</strong> Plaats topics in de meest relevante categorie</li>
                <li><strong>Formatting:</strong> Gebruik paragrafen, opsommingen en witruimte voor leesbaarheid</li>
                <li><strong>Spoiler tags:</strong> Gebruik spoiler tags voor gevoelige content of lange citaten</li>
                <li><strong>Quote relevant:</strong> Quote alleen relevante delen, niet hele berichten</li>
              </ul>

              <h3>Discussie Etiquette</h3>
              <ul>
                <li><strong>Blijf on-topic:</strong> Houd discussies relevant voor het originele onderwerp</li>
                <li><strong>Vermijd necroposting:</strong> Plaats geen replies in zeer oude threads (6+ maanden) tenzij substantieel relevante nieuwe informatie</li>
                <li><strong>Geen threadjacking:</strong> Start geen zijdiscussies; maak een nieuw topic</li>
                <li><strong>Constructief disagreement:</strong> "Ik ben het oneens omdat..." is beter dan "Je hebt ongelijk"</li>
                <li><strong>Vermijd CAPS:</strong> HOOFDLETTERS WORDEN ERVAREN ALS SCHREEUWEN</li>
                <li><strong>Emoji's met mate:</strong> Teveel emoji's 🎉🔥💪👍✅ maken berichten moeilijk leesbaar</li>
              </ul>

              <h3>Privéberichten</h3>
              <ul>
                <li><strong>Respecteer grenzen:</strong> Als iemand niet wil reageren, stuur geen herhaalde berichten</li>
                <li><strong>Geen spam:</strong> Gebruik privéberichten niet voor ongevraagde promotie</li>
                <li><strong>Rapporteer misbruik:</strong> Beledigende privéberichten kunnen worden gerapporteerd</li>
                <li><strong>Discretie:</strong> Deel geen privéberichten publiekelijk zonder toestemming</li>
              </ul>
            </section>

            <section>
              <h2>5. Rapportage en Meldingen</h2>
              <p>
                Help ons de community veilig te houden door overtredingen te rapporteren. Uw rapportages zijn anoniem en worden serieus genomen.
              </p>

              <h3>Hoe Rapporteren</h3>
              <ul>
                <li><strong>Gebruik de "Rapporteer" knop:</strong> Beschikbaar onder elk bericht</li>
                <li><strong>Selecteer een reden:</strong> Spam, belediging, off-topic, illegaal, etc.</li>
                <li><strong>Geef context:</strong> Optioneel: voeg extra informatie toe om moderatoren te helpen</li>
                <li><strong>Wacht op actie:</strong> Moderatoren beoordelen rapportages binnen 24 uur</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Wanneer Rapporteren</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  Rapporteer alleen echte overtredingen. Meningsverschillen of content waarmee u het niet eens bent, zijn <strong>geen</strong> geldige redenen om te rapporteren. False reporting kan leiden tot consequenties voor uw eigen account.
                </p>
              </div>

              <h3>Urgente Situaties</h3>
              <p>
                Voor zeer urgente situaties (dreigementen met geweld, kinderpornografie):
              </p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:urgent@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">urgent@politie-forum.nl</a> (24/7 gemonitord)</li>
                <li><strong>Telefoonnummer:</strong> +31 20 123 4567 (tijdens kantooruren)</li>
                <li><strong>Politie:</strong> Bij directe dreiging, bel 112 of 0900-8844</li>
              </ul>

              <h3>Transparantie Rapportage</h3>
              <p>
                We publiceren elk kwartaal een transparantierapport met:
              </p>
              <ul>
                <li>Aantal rapportages ontvangen en afgehandeld</li>
                <li>Type overtredingen en acties ondernomen</li>
                <li>Gemiddelde responstijd moderatie</li>
                <li>Appeals en hun resultaten</li>
              </ul>
            </section>

            <section>
              <h2>6. Accountbeheer</h2>
              <p>
                Uw account is uw verantwoordelijkheid. Zorg voor veilig gebruik en beheer.
              </p>

              <h3>Account Beveiliging</h3>
              <ul>
                <li><strong>Sterk wachtwoord:</strong> Minimaal 12 tekens, mix van letters, cijfers en symbolen</li>
                <li><strong>Uniek wachtwoord:</strong> Gebruik niet hetzelfde wachtwoord als andere websites</li>
                <li><strong>Twee-factor authenticatie:</strong> Schakel 2FA in voor extra beveiliging (beschikbaar in profiel-instellingen)</li>
                <li><strong>Deel geen inloggegevens:</strong> Nooit, ook niet met moderatoren of admins</li>
                <li><strong>Log uit op gedeelde apparaten:</strong> Altijd uitloggen op openbare of gedeelde computers</li>
              </ul>

              <h3>Account Aansprakelijkheid</h3>
              <p>
                U bent verantwoordelijk voor alle activiteiten onder uw account:
              </p>
              <ul>
                <li>Als iemand anders toegang krijgt tot uw account en overtredingen plaatst, bent u aansprakelijk</li>
                <li>Meld onmiddellijk als u denkt dat uw account is gecompromitteerd</li>
                <li>We kunnen accounts bevriezen tijdens onderzoek naar verdachte activiteiten</li>
              </ul>

              <h3>Account Verwijdering</h3>
              <p>
                U kunt uw account op elk moment verwijderen:
              </p>
              <ul>
                <li><strong>Profiel-instellingen:</strong> "Account verwijderen" knop</li>
                <li><strong>Bevestiging:</strong> Moet worden bevestigd via email</li>
                <li><strong>Data retentie:</strong> Persoonlijke gegevens verwijderd binnen 30 dagen</li>
                <li><strong>Posts:</strong> Posts kunnen anoniem bewaard blijven voor discussie-continuïteit</li>
                <li><strong>Volledig verwijderen:</strong> Email naar <a href="mailto:privacy@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@politie-forum.nl</a> voor complete verwijdering</li>
              </ul>
            </section>

            <section>
              <h2>7. Wijzigingen in Deze Regels</h2>
              <p>
                We kunnen deze gebruikersregels wijzigen om aan te passen aan nieuwe situaties of feedback van de gemeenschap.
              </p>

              <h3>Kennisgeving van Wijzigingen</h3>
              <ul>
                <li>Significante wijzigingen worden aangekondigd via een banner op de website</li>
                <li>Geregistreerde leden ontvangen een email notificatie</li>
                <li>De "Laatst bijgewerkt" datum wordt aangepast</li>
                <li>Oude versies worden gearchiveerd voor referentie</li>
              </ul>

              <h3>Community Input</h3>
              <p>
                We waarderen feedback van de gemeenschap:
              </p>
              <ul>
                <li>Suggesties voor regelwijzigingen kunnen worden ingediend via <a href="mailto:feedback@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">feedback@politie-forum.nl</a></li>
                <li>Periodiek houden we community polls over beleidswijzigingen</li>
                <li>Transparantie: we leggen uit waarom regels worden gewijzigd</li>
              </ul>
            </section>

            <section>
              <h2>8. Contact en Vragen</h2>
              <p>
                Voor vragen over deze gebruikersregels of om gedrag te melden:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Algemeen:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Moderatie:</strong> <a href="mailto:moderatie@politie-forum.nl" className="hover:underline">moderatie@politie-forum.nl</a></p>
                  <p><strong>Urgent:</strong> <a href="mailto:urgent@politie-forum.nl" className="hover:underline">urgent@politie-forum.nl</a></p>
                  <p><strong>Feedback:</strong> <a href="mailto:feedback@politie-forum.nl" className="hover:underline">feedback@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> +31 20 123 4567 (Maandag-Vrijdag, 09:00-17:00)</p>
                </div>
              </div>

              <h3>Gerelateerde Documenten</h3>
              <ul>
                <li><a href="/moderatie-beleid" className="text-primary-600 dark:text-primary-400 hover:underline">Moderatiebeleid</a> - Moderatie procedures</li>
                <li><a href="/forum-disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline">Forum Disclaimer</a> - Juridische disclaimer</li>
                <li><a href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</a> - Gegevensbescherming</li>
                <li><a href="/voorwaarden" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Voorwaarden</a> - Servicevoorwaarden</li>
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
