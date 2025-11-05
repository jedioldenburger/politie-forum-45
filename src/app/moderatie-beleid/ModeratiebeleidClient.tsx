'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export function ModeratiebeleidClient() {
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
            '@id': 'https://politie-forum.nl/moderatie-beleid#webpage',
            url: 'https://politie-forum.nl/moderatie-beleid',
            name: 'Moderatiebeleid',
            description: 'Ons moderatiebeleid beschrijft hoe we content modereren, welke criteria we hanteren en hoe we transparantie waarborgen.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/moderatie-beleid#breadcrumb',
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
              <li className="text-gray-900 dark:text-gray-100">Moderatiebeleid</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Moderatiebeleid</h1>

            <p className="lead">
              Politie Forum Nederland streeft naar een veilige, respectvolle en constructieve online gemeenschap. Dit moderatiebeleid beschrijft hoe we content modereren, welke criteria we hanteren, het waarschuwingssysteem, appealprocedures en hoe we transparantie waarborgen in onze moderatiebeslissingen.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Moderatie Filosofie</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                We geloven in <strong>lichte moderatie met duidelijke grenzen</strong>. We grijpen alleen in bij schendingen van onze <Link href="/gebruikersregels" className="hover:underline">Gebruikersregels</Link>. Onze moderatoren zijn getraind om consistent, fair en transparant te handelen. We waarderen vrije meningsuiting, maar niet ten koste van veiligheid en respect.
              </p>
            </div>

            <section>
              <h2>1. Moderatie Criteria</h2>
              <p>
                Content wordt gemodereerd op basis van objectieve criteria die zijn vastgelegd in onze <Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link>. Moderatoren gebruiken deze criteria als leidraad voor hun beslissingen.
              </p>

              <h3>Primaire Moderatie Redenen</h3>
              <ul>
                <li><strong>Illegale content (Rood - Direct verwijderen):</strong> Kinderpornografie, drugshandel, terrorisme, geweldsincitatie</li>
                <li><strong>Beledigend (Oranje - Verwijderen + waarschuwing):</strong> Discriminatie, haatzaaien, persoonlijke aanvallen, intimidatie</li>
                <li><strong>Spam (Geel - Verwijderen):</strong> Reclame, herhaalde berichten, link spam</li>
                <li><strong>Privacy schending (Oranje - Direct verwijderen):</strong> Doxxing, delen persoonlijke gegevens zonder toestemming</li>
                <li><strong>Misleiding (Geel - Markeren/verwijderen):</strong> Nepnieuws, impersonatie, fraude</li>
                <li><strong>Off-topic (Groen - Verplaatsen):</strong> Niet relevant voor forumcategorie</li>
              </ul>

              <h3>Grijze Zones en Context</h3>
              <p>
                Niet alle situaties zijn zwart-wit. Moderatoren houden rekening met context:
              </p>
              <ul>
                <li><strong>Intentie:</strong> Was de schending opzettelijk of onbedoeld?</li>
                <li><strong>Geschiedenis:</strong> Is dit een eerste overtreding of herhaald gedrag?</li>
                <li><strong>Impact:</strong> Hoeveel schade heeft de content aangericht?</li>
                <li><strong>Discussiecontext:</strong> Was de toon gepast voor het onderwerp?</li>
                <li><strong>Culturele nuances:</strong> Rekening houden met verschillende achtergronden</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Moderatie Niet-Neutraliteit</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Moderatoren zijn mensen en kunnen onbewust vooroordelen hebben. We trainen onze moderators om bewust te zijn van bias en beslissingen te baseren op objectieve criteria. Als u vindt dat een beslissing unfair was, gebruik dan de <strong>appealprocedure</strong> (zie sectie 5).
                </p>
              </div>

              <h3>Automatische Filters</h3>
              <p>
                We gebruiken geautomatiseerde tools om duidelijke schendingen te detecteren:
              </p>
              <ul>
                <li><strong>Spam filters:</strong> Detecteren van commerciële spam en herhaalde berichten</li>
                <li><strong>Taalfilters:</strong> Flaggen van beledigende taal (maar menselijke review vereist)</li>
                <li><strong>Link checkers:</strong> Blokkeren van bekende malware/phishing domains</li>
                <li><strong>Image scanning:</strong> Detecteren van NSFW content en illegale media</li>
              </ul>
              <p>
                <strong>Let op:</strong> Geautomatiseerde tools kunnen false positives genereren. Alle automatische moderatie wordt periodiek door mensen gereviewd.
              </p>
            </section>

            <section>
              <h2>2. Moderatie Acties en Procedures</h2>
              <p>
                Afhankelijk van de ernst van de overtreding kunnen moderatoren verschillende acties ondernemen.
              </p>

              <h3>Mogelijke Moderatie Acties</h3>
              <ul>
                <li><strong>Waarschuwing:</strong> Privébericht naar gebruiker met uitleg van overtreding</li>
                <li><strong>Content bewerken:</strong> Minor aanpassingen (bijv. verwijderen beledigende woorden) met notificatie</li>
                <li><strong>Content verwijderen:</strong> Volledige verwijdering zonder herstel mogelijk</li>
                <li><strong>Thread sluiten:</strong> Geen nieuwe replies mogelijk, bestaande content blijft zichtbaar</li>
                <li><strong>Thread verplaatsen:</strong> Naar meer passende categorie</li>
                <li><strong>Tijdelijke ban:</strong> 7-30 dagen, afhankelijk van ernst</li>
                <li><strong>Permanente ban:</strong> Onmiddellijke en definitieve account-beëindiging</li>
              </ul>

              <h3>Procedure voor Content Verwijdering</h3>
              <p>
                Wanneer content wordt verwijderd:
              </p>
              <ol>
                <li><strong>Beoordeling:</strong> Moderator beoordeelt rapportage of detecteert schending proactief</li>
                <li><strong>Verificatie:</strong> Controle tegen gebruikersregels en moderatiecriteria</li>
                <li><strong>Actie:</strong> Content wordt verwijderd en actie wordt gelogd</li>
                <li><strong>Notificatie:</strong> Gebruiker ontvangt privébericht met:
                  <ul>
                    <li>Welke content werd verwijderd</li>
                    <li>Welke regel werd geschonden</li>
                    <li>Welke actie werd ondernomen (waarschuwing, ban, etc.)</li>
                    <li>Hoe te appelleren indien gewenst</li>
                  </ul>
                </li>
                <li><strong>Logging:</strong> Alle moderatieacties worden intern gelogd voor transparantie</li>
              </ol>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Uitzonderingen op Notificatie</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Bij zeer ernstige schendingen (illegale content, doxxing, ernstige bedreigingen) worden accounts direct en zonder waarschuwing gebanned. Notificaties kunnen worden uitgesteld indien er een lopend politie-onderzoek is.
                </p>
              </div>

              <h3>Ban Procedures</h3>
              <p>
                <strong>Tijdelijke Ban (7-30 dagen):</strong>
              </p>
              <ul>
                <li>Gebruiker kan niet inloggen gedurende ban-periode</li>
                <li>Email notificatie met reden en duur van ban</li>
                <li>Na afloop: automatische heractivering + laatste waarschuwing</li>
                <li>Herhaalde bans resulteren in langere duur of permanente ban</li>
              </ul>

              <p>
                <strong>Permanente Ban:</strong>
              </p>
              <ul>
                <li>Account wordt definitief gedeactiveerd</li>
                <li>IP-adres wordt geblokkeerd (kan worden omzeild via VPN, maar wordt gemonitord)</li>
                <li>Email en gebruikersnaam worden geblacklist</li>
                <li>Alle content van gebruiker wordt gereviewd voor verwijdering</li>
                <li>Mogelijk delen van gegevens met autoriteiten bij illegale activiteiten</li>
              </ul>
            </section>

            <section>
              <h2>3. Waarschuwingssysteem</h2>
              <p>
                Voor niet-ernstige overtredingen gebruiken we een <strong>three-strike systeem</strong> om gebruikers de kans te geven hun gedrag te verbeteren.
              </p>

              <h3>Hoe Het Systeem Werkt</h3>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 my-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Overtreding</th>
                    <th className="px-4 py-2 text-left">Actie</th>
                    <th className="px-4 py-2 text-left">Vervaltijd</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2">Eerste (Strike 1)</td>
                    <td className="px-4 py-2">Officiële waarschuwing + content verwijdering</td>
                    <td className="px-4 py-2">6 maanden</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Tweede (Strike 2)</td>
                    <td className="px-4 py-2">Tijdelijke ban 7 dagen</td>
                    <td className="px-4 py-2">6 maanden</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Derde (Strike 3)</td>
                    <td className="px-4 py-2">Tijdelijke ban 30 dagen + laatste kans</td>
                    <td className="px-4 py-2">12 maanden</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Vierde (Strike 4)</td>
                    <td className="px-4 py-2">Permanente ban</td>
                    <td className="px-4 py-2">N/A</td>
                  </tr>
                </tbody>
              </table>

              <h3>Verval van Waarschuwingen</h3>
              <p>
                Waarschuwingen vervallen automatisch als u zich aan de regels houdt:
              </p>
              <ul>
                <li>Strike 1 en 2 vervallen na <strong>6 maanden</strong> zonder nieuwe overtredingen</li>
                <li>Strike 3 vervalt na <strong>12 maanden</strong> zonder nieuwe overtredingen</li>
                <li>Na verval begint u opnieuw bij Strike 1 als toekomstige overtredingen plaatsvinden</li>
                <li>U kunt uw huidige strikes zien in uw profiel onder "Account Status"</li>
              </ul>

              <h3>Versnelde Escalatie</h3>
              <p>
                Voor ernstige overtredingen kunnen we strikes overslaan:
              </p>
              <ul>
                <li><strong>Doxxing:</strong> Direct Strike 4 (permanente ban)</li>
                <li><strong>Ernstige bedreigingen:</strong> Direct Strike 3 (30 dagen ban)</li>
                <li><strong>Gecoördineerde manipulatie:</strong> Direct Strike 4</li>
                <li><strong>Herhaling binnen 30 dagen:</strong> Volgende strike automatisch</li>
              </ul>
            </section>

            <section>
              <h2>4. Moderator Gedragscode</h2>
              <p>
                Onze moderators zijn vrijwilligers die de gemeenschap ondersteunen. Ze worden gehouden aan hoge standaarden van professionaliteit en integriteit.
              </p>

              <h3>Moderator Verplichtingen</h3>
              <ul>
                <li><strong>Neutraliteit:</strong> Beslissingen baseren op regels, niet persoonlijke voorkeuren</li>
                <li><strong>Consistentie:</strong> Vergelijkbare overtredingen krijgen vergelijkbare consequenties</li>
                <li><strong>Respect:</strong> Behandel alle gebruikers met respect, ook bij moderatie</li>
                <li><strong>Transparantie:</strong> Geef duidelijke uitleg bij moderatiebeslissingen</li>
                <li><strong>Vertrouwelijkheid:</strong> Deel geen privé-informatie van gebruikers</li>
                <li><strong>Onpartijdigheid:</strong> Modereer vrienden/familie net zo streng als anderen</li>
                <li><strong>Continue educatie:</strong> Blijf op de hoogte van nieuwe moderatietrends en best practices</li>
              </ul>

              <h3>Moderator Beperkingen</h3>
              <p>
                Moderatoren mogen <strong>niet</strong>:
              </p>
              <ul>
                <li>Hun eigen overtredingen negeren of verbergen</li>
                <li>Content modereren waarin ze persoonlijk betrokken zijn</li>
                <li>Moderatie gebruiken om persoonlijke conflicten op te lossen</li>
                <li>Moderatorbadges misbruiken voor intimidatie</li>
                <li>Inloggegevens delen of anderen toegang geven tot moderatietools</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Moderator Accountability</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  Moderators zijn onderworpen aan dezelfde regels als alle leden. Als een moderator de gedragscode schendt, kunnen ze hun moderatierechten verliezen en worden onderworpen aan dezelfde consequenties als gewone gebruikers. Rapporteer moderator misbruik via <a href="mailto:admin@politie-forum.nl" className="hover:underline">admin@politie-forum.nl</a>.
                </p>
              </div>

              <h3>Moderator Training</h3>
              <p>
                Nieuwe moderators ondergaan een uitgebreid trainingsprogramma:
              </p>
              <ul>
                <li><strong>Week 1-2:</strong> Lezen van alle beleidsdocumenten en richtlijnen</li>
                <li><strong>Week 3-4:</strong> Shadow moderation (observeren van ervaren moderators)</li>
                <li><strong>Week 5-6:</strong> Supervised moderation (beslissingen met feedback van senior moderators)</li>
                <li><strong>Week 7+:</strong> Independent moderation met periodieke reviews</li>
                <li><strong>Ongoing:</strong> Maandelijkse training sessies en case study discussies</li>
              </ul>
            </section>

            <section>
              <h2>5. Appealprocedure</h2>
              <p>
                Als u het niet eens bent met een moderatiebeslissing, heeft u het recht om in beroep te gaan. We nemen alle appeals serieus en behandelen ze zo objectief mogelijk.
              </p>

              <h3>Hoe Appelleren</h3>
              <ol>
                <li><strong>Binnen 14 dagen:</strong> Email naar <a href="mailto:moderatie@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">moderatie@politie-forum.nl</a></li>
                <li><strong>Vermeld in uw email:</strong>
                  <ul>
                    <li>Uw gebruikersnaam</li>
                    <li>Datum en tijd van de moderatieactie</li>
                    <li>Welke content werd gemodereerd (indien mogelijk, screenshot/link)</li>
                    <li>Waarom u vindt dat de beslissing onjuist was</li>
                    <li>Wat u verwacht als uitkomst (opheffing ban, teruggave content, etc.)</li>
                  </ul>
                </li>
                <li><strong>Review door andere moderator:</strong> Een moderator die <strong>niet</strong> betrokken was bij de originele beslissing zal uw appeal beoordelen</li>
                <li><strong>Beslissing binnen 7 werkdagen:</strong> U ontvangt een email met de uitkomst en onderbouwing</li>
              </ol>

              <h3>Mogelijke Appeal Uitkomsten</h3>
              <ul>
                <li><strong>Appeal toegewezen:</strong> Moderatieactie wordt teruggedraaid, waarschuwing/ban wordt verwijderd</li>
                <li><strong>Gedeeltelijk toegewezen:</strong> Bijvoorbeeld: ban van 30 dagen wordt verminderd naar 7 dagen</li>
                <li><strong>Appeal afgewezen:</strong> Originele beslissing blijft staan met uitgebreide onderbouwing</li>
                <li><strong>Escalatie naar senior moderator:</strong> Bij complexe cases kan een senior moderator ingeschakeld worden</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 Appeal Limieten</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  U kunt slechts <strong>één appeal indienen per moderatieactie</strong>. De appealbeslissing is definitief en bindend. Herhaaldelijk appelleren voor dezelfde actie wordt beschouwd als harassment van moderators en kan leiden tot extra consequenties.
                </p>
              </div>

              <h3>Wanneer Appeals Niet Mogelijk Zijn</h3>
              <p>
                In sommige gevallen zijn appeals niet mogelijk:
              </p>
              <ul>
                <li>Bans voor illegale content (kinderpornografie, terrorisme, drugshandel)</li>
                <li>Bans na 3+ eerdere succesvolle appeals</li>
                <li>Account circumvention (nieuwe accounts na ban)</li>
                <li>Juridische verplichtingen (gerechtelijk bevel, politie-onderzoek)</li>
              </ul>
            </section>

            <section>
              <h2>6. Transparantie en Rapportage</h2>
              <p>
                We geloven in transparantie over onze moderatiepraktijken. Dit bevordert vertrouwen en accountability.
              </p>

              <h3>Kwartaal Transparantierapporten</h3>
              <p>
                Elk kwartaal publiceren we een rapport met:
              </p>
              <ul>
                <li><strong>Moderatie statistieken:</strong>
                  <ul>
                    <li>Totaal aantal moderatieacties</li>
                    <li>Breakdown per type actie (waarschuwing, ban, content verwijdering)</li>
                    <li>Breakdown per overtreding type</li>
                    <li>Gemiddelde responstijd op rapportages</li>
                  </ul>
                </li>
                <li><strong>Appeal statistieken:</strong>
                  <ul>
                    <li>Aantal appeals ontvangen</li>
                    <li>Toegewezen vs. afgewezen appeals</li>
                    <li>Gemiddelde appeal behandeltijd</li>
                  </ul>
                </li>
                <li><strong>Community feedback:</strong>
                  <ul>
                    <li>Samenvatting van feedback over moderatie</li>
                    <li>Wijzigingen in beleid als reactie op feedback</li>
                  </ul>
                </li>
              </ul>

              <h3>Moderatie Logs</h3>
              <p>
                Alle moderatieacties worden intern gelogd:
              </p>
              <ul>
                <li>Datum en tijd van actie</li>
                <li>Welke moderator de actie ondernam</li>
                <li>Reden voor actie</li>
                <li>Content die werd gemodereerd (bewaard voor 90 dagen)</li>
                <li>Uitkomst van eventuele appeals</li>
              </ul>
              <p>
                Deze logs zijn beschikbaar voor audits en kunnen worden opgevraagd door gebruikers voor hun eigen moderatiegeschiedenis via een <a href="mailto:privacy@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">AVG/GDPR verzoek</a>.
              </p>

              <h3>Community Feedback</h3>
              <p>
                We waarderen feedback van de community:
              </p>
              <ul>
                <li><strong>Kwartaal surveys:</strong> Anonieme enquêtes over moderatie-ervaring</li>
                <li><strong>Feedback forum:</strong> Speciale categorie voor moderatie-feedback en suggesties</li>
                <li><strong>Moderator AMA's:</strong> Periodieke "Ask Me Anything" sessies met moderators</li>
                <li><strong>Beleid reviews:</strong> Jaarlijkse review van moderatiebeleid met community input</li>
              </ul>
            </section>

            <section>
              <h2>7. Speciale Moderatie Situaties</h2>
              <p>
                Sommige situaties vereisen speciale moderatie-aandacht en procedures.
              </p>

              <h3>Brigading en Gecoördineerde Aanvallen</h3>
              <p>
                Als we detecteren dat externe groepen het forum aanvallen:
              </p>
              <ul>
                <li>Temporele account creatie restricties</li>
                <li>Verhoogde moderatie alertheid</li>
                <li>Snellere ban procedures voor nieuwe accounts die participeren</li>
                <li>Mogelijke tijdelijke sluiting van affected threads/categorieën</li>
              </ul>

              <h3>Crisis Situaties</h3>
              <p>
                Bij terroristische aanslagen, natuurrampen of andere crisissen:
              </p>
              <ul>
                <li><strong>Snellere moderatie:</strong> 24/7 moderatie beschikbaarheid</li>
                <li><strong>Misinformatie controle:</strong> Extra alertheid op nepnieuws en geruchten</li>
                <li><strong>Emotionele support:</strong> Ruimte voor gemeenschap om te rouwen/reageren</li>
                <li><strong>Officiële informatie pinnen:</strong> Verified information van autoriteiten</li>
              </ul>

              <h3>Hoog-Profiel Discussies</h3>
              <p>
                Bij controversiële of emotioneel geladen onderwerpen:
              </p>
              <ul>
                <li>Preventieve waarschuwingen in threads</li>
                <li>Verhoogde moderator aanwezigheid</li>
                <li>Snellere interventie bij escalatie</li>
                <li>Mogelijke tijdelijke slow-mode (1 bericht per 5 minuten)</li>
              </ul>
            </section>

            <section>
              <h2>8. Contact en Vragen</h2>
              <p>
                Voor vragen over moderatie of om moderator gedrag te rapporteren:
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Moderatie vragen:</strong> <a href="mailto:moderatie@politie-forum.nl" className="hover:underline">moderatie@politie-forum.nl</a></p>
                  <p><strong>Appeals:</strong> <a href="mailto:moderatie@politie-forum.nl" className="hover:underline">moderatie@politie-forum.nl</a> (vermeld "APPEAL" in onderwerp)</p>
                  <p><strong>Moderator misbruik:</strong> <a href="mailto:admin@politie-forum.nl" className="hover:underline">admin@politie-forum.nl</a></p>
                  <p><strong>Algemeen:</strong> <a href="mailto:info@politie-forum.nl" className="hover:underline">info@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> +31 20 123 4567 (Maandag-Vrijdag, 09:00-17:00)</p>
                </div>
              </div>

              <h3>Gerelateerde Documenten</h3>
              <ul>
                <li><Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> - Community guidelines</li>
                <li><Link href="/forum-disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline">Forum Disclaimer</Link> - Juridische disclaimer</li>
                <li><Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacyverklaring</Link> - Gegevensbescherming</li>
                <li><Link href="/voorwaarden" className="text-primary-600 dark:text-primary-400 hover:underline">Algemene Voorwaarden</Link> - Servicevoorwaarden</li>
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
