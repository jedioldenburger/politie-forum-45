'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export function RedactionelePrincipesClient() {
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
            '@id': 'https://politie-forum.nl/redactionele-principes#webpage',
            url: 'https://politie-forum.nl/redactionele-principes',
            name: 'Redactionele Principes',
            description: 'Onze journalistieke standaarden, E-E-A-T principes en ethische richtlijnen voor betrouwbare nieuwsvoorziening.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/redactionele-principes#breadcrumb',
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
              <li className="text-gray-900 dark:text-gray-100">Redactionele Principes</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Redactionele Principes</h1>

            <p className="lead">
              Politie Forum Nederland is toegewijd aan het leveren van accurate, onafhankelijke en ethische journalistiek over politie, veiligheid en rechtshandhaving in Nederland. Deze redactionele principes beschrijven onze missie, journalistieke standaarden en de waarden die ons werk ondersteunen.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">🎯 Onze Missie</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                Wij streven ernaar het meest <strong>betrouwbare en toegankelijke platform</strong> te zijn voor nieuws, discussie en analyse over politie en veiligheid in Nederland. We faciliteren een geïnformeerde gemeenschap die bijdraagt aan transparantie en accountability in rechtshandhaving.
              </p>
            </div>

            <section>
              <h2>1. Onze Kernwaarden</h2>
              <p>
                Onze redactionele beslissingen worden geleid door vijf kernwaarden die de basis vormen van al ons journalistiek werk:
              </p>

              <h3>Nauwkeurigheid</h3>
              <p>
                <strong>We streven naar feitennauwkeurigheid in alles wat we publiceren.</strong>
              </p>
              <ul>
                <li><strong>Verificatie:</strong> Elk feit wordt geverifieerd met minimaal twee onafhankelijke bronnen</li>
                <li><strong>Bronkwaliteit:</strong> We prioriteren primaire bronnen (officiële documenten, directe interviews)</li>
                <li><strong>Correcties:</strong> Fouten worden onmiddellijk erkend en gecorrigeerd (zie <Link href="/correcties" className="text-primary-600 dark:text-primary-400 hover:underline">Correcties</Link>)</li>
                <li><strong>Context:</strong> Feiten worden in hun volledige context gepresenteerd</li>
                <li><strong>Transparantie:</strong> Onduidelijkheden of onzekerheden worden expliciet vermeld</li>
              </ul>

              <h3>Onafhankelijkheid</h3>
              <p>
                <strong>We zijn onafhankelijk van politieke, commerciële of andere externe invloeden.</strong>
              </p>
              <ul>
                <li><strong>Redactionele autonomie:</strong> Geen externe partij heeft invloed op onze redactionele beslissingen</li>
                <li><strong>Financiële transparantie:</strong> Onze financieringsbronnen zijn openbaar (zie <Link href="/eigendom" className="text-primary-600 dark:text-primary-400 hover:underline">Eigendom</Link>)</li>
                <li><strong>Geen belangenconflicten:</strong> Redacteuren vermelden persoonlijke belangen in verhalen</li>
                <li><strong>Advertenties gescheiden:</strong> Commerciële content wordt duidelijk gelabeld</li>
              </ul>

              <h3>Fairness</h3>
              <p>
                <strong>We behandelen alle partijen eerlijk en geven ruimte voor diverse perspectieven.</strong>
              </p>
              <ul>
                <li><strong>Right of reply:</strong> Partijen krijgen de kans om te reageren op kritiek</li>
                <li><strong>Balans:</strong> We presenteren meerdere kanten van controversiële onderwerpen</li>
                <li><strong>Geen vooroordelen:</strong> Bewuste inspanning om persoonlijke bias te minimaliseren</li>
                <li><strong>Respect:</strong> Behandel alle bronnen en onderwerpen met respect</li>
              </ul>

              <h3>Transparantie</h3>
              <p>
                <strong>We zijn open over onze methoden, bronnen en besluitvormingsprocessen.</strong>
              </p>
              <ul>
                <li><strong>Bronvermelding:</strong> Bronnen worden zo specifiek mogelijk geciteerd</li>
                <li><strong>Methodologie:</strong> We leggen uit hoe we aan informatie zijn gekomen</li>
                <li><strong>Correcties openbaar:</strong> Alle correcties zijn publiekelijk zichtbaar</li>
                <li><strong>Besluitvorming:</strong> Redactionele keuzes worden onderbouwd waar nodig</li>
              </ul>

              <h3>Accountability</h3>
              <p>
                <strong>We zijn verantwoordelijk voor ons werk en nemen verantwoordelijkheid voor fouten.</strong>
              </p>
              <ul>
                <li><strong>Feedback mechanismen:</strong> Lezers kunnen fouten en zorgen melden</li>
                <li><strong>Ombudspersoon:</strong> Onafhankelijke reviewer voor klachten</li>
                <li><strong>Publieke verantwoording:</strong> Jaarlijkse rapportage over fouten en verbeteringen</li>
                <li><strong>Continue verbetering:</strong> We leren van fouten en passen processen aan</li>
              </ul>
            </section>

            <section>
              <h2>2. E-E-A-T Principes (Google)</h2>
              <p>
                We voldoen aan Google's E-E-A-T kwaliteitsrichtlijnen voor betrouwbare content: <strong>Experience, Expertise, Authoritativeness, Trustworthiness</strong>.
              </p>

              <h3>Experience (Ervaring)</h3>
              <ul>
                <li><strong>Redactionele ervaring:</strong> Ons team heeft 10+ jaar gecombineerde ervaring in politie- en veiligheidsjournalistiek</li>
                <li><strong>Bronnennetwerk:</strong> Directe relaties met politie, justitie en veiligheidsexperts</li>
                <li><strong>Eerste-hands reporting:</strong> Aanwezig bij persconferenties, rechtszaken en belangrijke events</li>
                <li><strong>Continuïteit:</strong> We volgen verhalen langdurig, niet alleen breaking news</li>
              </ul>

              <h3>Expertise (Deskundigheid)</h3>
              <ul>
                <li><strong>Gespecialiseerde kennis:</strong> Redacteuren met achtergrond in criminologie, recht of journalistiek</li>
                <li><strong>Subject matter experts:</strong> Regelmatige bijdragen van externe experts</li>
                <li><strong>Training:</strong> Voortdurende opleiding in politiewerk, recht en onderzoekstechnieken</li>
                <li><strong>Fact-checking expertise:</strong> Getrainde fact-checkers voor alle content</li>
              </ul>

              <h3>Authoritativeness (Autoriteit)</h3>
              <ul>
                <li><strong>Erkende bron:</strong> Geciteerd door NOS, RTL Nieuws en andere media</li>
                <li><strong>Partnerships:</strong> Samenwerkingen met universiteiten en onderzoeksinstellingen</li>
                <li><strong>Awards:</strong> Genomineerd voor Nederlandse Online Media Awards 2024</li>
                <li><strong>Community trust:</strong> 50,000+ actieve leden met hoge engagement</li>
              </ul>

              <h3>Trustworthiness (Betrouwbaarheid)</h3>
              <ul>
                <li><strong>Track record:</strong> Consistente accuraatheid over 5+ jaar</li>
                <li><strong>Transparante correcties:</strong> Publieke correctiepagina met alle fouten</li>
                <li><strong>Veilige website:</strong> HTTPS, privacy-compliant, geen malware</li>
                <li><strong>Contactinformatie:</strong> Duidelijke contactgegevens en responsive redactie</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">📝 E-E-A-T in Praktijk</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  Elk artikel bevat: auteursbio met credentials, publicatiedatum en laatste update, bronvermeldingen, contact link voor feedback. Auteurs signeren artikelen en zijn verantwoordelijk voor hun content.
                </p>
              </div>
            </section>

            <section>
              <h2>3. Journalistieke Standaarden</h2>
              <p>
                We hanteren strikte journalistieke standaarden die zijn gebaseerd op de Code van de Raad voor de Journalistiek.
              </p>

              <h3>Brongebruik en Verificatie</h3>
              <ul>
                <li><strong>Twee-bron regel:</strong> Claims worden bevestigd door minimaal twee onafhankelijke bronnen</li>
                <li><strong>Primaire bronnen eerst:</strong> Direct naar documenten, officials of getuigen waar mogelijk</li>
                <li><strong>Anonieme bronnen:</strong> Alleen gebruikt wanneer absoluut noodzakelijk en met redactionele goedkeuring</li>
                <li><strong>On-the-record voorkeur:</strong> We vragen bronnen om on-the-record te gaan</li>
                <li><strong>Bron-diversiteit:</strong> Meerdere perspectieven (politie, verdachten, slachtoffers, experts)</li>
              </ul>

              <h3>Citeren en Attributie</h3>
              <ul>
                <li><strong>Accuraat citeren:</strong> Quotes worden letterlijk overgenomen of met […] voor weggelaten delen</li>
                <li><strong>Context behouden:</strong> Quotes niet uit context gebruiken</li>
                <li><strong>Duidelijke attributie:</strong> Wie zegt wat, en in welke hoedanigheid</li>
                <li><strong>Parafraseren:</strong> Bij parafraseren blijven we trouw aan originele betekenis</li>
              </ul>

              <h3>Objectiviteit en Bias</h3>
              <ul>
                <li><strong>Feit vs. opinie:</strong> Duidelijk onderscheid tussen nieuws en opiniestukken</li>
                <li><strong>Neutrale taal:</strong> Vermijd geladen of emotionele taal in nieuwsartikelen</li>
                <li><strong>Bewustzijn van bias:</strong> Redacteuren reflecteren op persoonlijke vooroordelen</li>
                <li><strong>Diverse redactie:</strong> Team met diverse achtergronden voor multiple perspectieven</li>
              </ul>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Sensitiviteit</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Bij gevoelige onderwerpen (geweld, slachtoffers, minderjarigen) hanteren we extra zorgvuldigheid. We vermelden geen namen van minderjarige verdachten/slachtoffers, tenzij van groot publiek belang en met redactionele goedkeuring.
                </p>
              </div>
            </section>

            <section>
              <h2>4. Ethische Richtlijnen</h2>
              <p>
                Onze ethische richtlijnen gaan verder dan wettelijke vereisten en zijn gebaseerd op journalistieke best practices.
              </p>

              <h3>Privacy en Gevoelige Informatie</h3>
              <ul>
                <li><strong>Minimale identificatie:</strong> Alleen namen/details vermelden als relevant voor verhaal</li>
                <li><strong>Slachtofferbescherming:</strong> Extra zorgvuldigheid bij slachtoffers van misdrijven</li>
                <li><strong>Minderjarigen:</strong> Geen identificerende informatie zonder expliciete toestemming ouders/voogd</li>
                <li><strong>Publiek belang test:</strong> Privacy schending alleen als publiek belang groter is</li>
                <li><strong>Right to be forgotten:</strong> Artikelen kunnen na verzoek worden geanonimiseerd</li>
              </ul>

              <h3>Belangenconflicten</h3>
              <ul>
                <li><strong>Disclosure vereist:</strong> Redacteuren vermelden persoonlijke belangen in verhalen</li>
                <li><strong>Recusal:</strong> Redacteuren wijken uit voor verhalen waar ze betrokken zijn</li>
                <li><strong>Financiële belangen:</strong> Geen artikelen over bedrijven waarin we geïnvesteerd zijn</li>
                <li><strong>Persoonlijke relaties:</strong> Geen coverage van vrienden/familie zonder disclosure</li>
                <li><strong>Geschenken policy:</strong> Redacteuren accepteren geen geschenken van bronnen (max €25)</li>
              </ul>

              <h3>Nieuwsgaring Methoden</h3>
              <ul>
                <li><strong>Transparante identificatie:</strong> Reporters identificeren zich als journalist</li>
                <li><strong>Verborgen opnames:</strong> Alleen met redactionele goedkeuring en publiek belang</li>
                <li><strong>Infiltratie:</strong> Uiterst zeldzaam, alleen bij grote misstanden en met legal review</li>
                <li><strong>Social media mining:</strong> Publieke posts mogen gebruikt worden, private niet zonder toestemming</li>
                <li><strong>Respect voor rouw:</strong> Geen contact met nabestaanden kort na tragedie</li>
              </ul>
            </section>

            <section>
              <h2>5. Redactioneel Proces</h2>
              <p>
                Elk artikel doorloopt een strikt redactioneel proces om kwaliteit en nauwkeurigheid te waarborgen.
              </p>

              <h3>Pre-Publicatie Workflow</h3>
              <ol>
                <li><strong>Pitch:</strong> Reporter pitch idee met voorlopige bronnen en aanpak</li>
                <li><strong>Goedkeuring:</strong> Senior editor keurt onderzoek goed of wijst af</li>
                <li><strong>Research:</strong> Reporter verzamelt informatie en interviewt bronnen</li>
                <li><strong>Schrijven:</strong> Eerste draft met alle feiten en quotes</li>
                <li><strong>Fact-check:</strong> Dedicated fact-checker verifieert alle claims</li>
                <li><strong>Edit:</strong> Senior editor reviewt voor accuraatheid, fairness, stijl</li>
                <li><strong>Legal review:</strong> Bij gevoelige verhalen, juridische beoordeling</li>
                <li><strong>Copy-edit:</strong> Grammatica, spelling, formatting check</li>
                <li><strong>Publicatie:</strong> Artikel gaat live met auteur-, datum- en revisie-informatie</li>
              </ol>

              <h3>Post-Publicatie Monitoring</h3>
              <ul>
                <li><strong>Feedback monitoring:</strong> Redactie leest alle comments en emails</li>
                <li><strong>Correcties snel:</strong> Fouten worden binnen 24 uur gecorrigeerd</li>
                <li><strong>Updates:</strong> Significante updates worden gedateerd en vermeld</li>
                <li><strong>Archivering:</strong> Originele versies worden bewaard voor transparantie</li>
              </ul>

              <h3>Quality Control</h3>
              <ul>
                <li><strong>Random audits:</strong> 10% van artikelen krijgt post-publicatie audit</li>
                <li><strong>Peer review:</strong> Redacteuren reviewen elkaars werk periodiek</li>
                <li><strong>External review:</strong> Jaarlijkse audit door onafhankelijke journalistiek-expert</li>
                <li><strong>Metrics tracking:</strong> We meten accuraatheid, correctieratio, feedback sentiment</li>
              </ul>
            </section>

            <section>
              <h2>6. Redactionele Onafhankelijkheid</h2>
              <p>
                Onze redactionele onafhankelijkheid is heilig. We nemen geen instructies van externe partijen.
              </p>

              <h3>Eigendomsstructuur</h3>
              <ul>
                <li><strong>Onafhankelijk eigendom:</strong> Geen politieke partijen of commerciële belangen als eigenaar</li>
                <li><strong>Redactioneel statuut:</strong> Beschermt redactie tegen externe inmenging</li>
                <li><strong>Firewall:</strong> Strikte scheiding tussen commercie en redactie</li>
                <li><strong>Transparantie:</strong> Volledige eigendomsstructuur openbaar (zie <Link href="/eigendom" className="text-primary-600 dark:text-primary-400 hover:underline">Eigendom</Link>)</li>
              </ul>

              <h3>Financieringsmodel</h3>
              <ul>
                <li><strong>Diverse inkomsten:</strong> Abonnementen (60%), advertenties (30%), donaties (10%)</li>
                <li><strong>Geen sponsor content:</strong> We verkopen geen redactionele space</li>
                <li><strong>Advertenties gelabeld:</strong> Duidelijk onderscheid tussen ads en content</li>
                <li><strong>Weigering adverteerders:</strong> We weigeren adverteerders die conflict met redactie geven</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Pressure Resistance</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  We hebben beleid om weerstand te bieden aan externe druk: geen voorafgaand inzage recht voor onderwerpen van verhalen (tenzij fact-checking), geen "kill switches" voor adverteerders, publieke rapportage over druk-pogingen in jaarverslag.
                </p>
              </div>
            </section>

            <section>
              <h2>7. Community Standards</h2>
              <p>
                Naast onze eigen content modereren we ook user-generated content op het forum volgens strikte standaarden.
              </p>

              <h3>Forum Moderatie</h3>
              <ul>
                <li><strong>Scheiding:</strong> Forum moderatie is gescheiden van redactie</li>
                <li><strong>Transparante regels:</strong> Duidelijke <Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> en <Link href="/moderatie-beleid" className="text-primary-600 dark:text-primary-400 hover:underline">Moderatiebeleid</Link></li>
                <li><strong>Geen censuur:</strong> We modereren alleen illegale/beledigende content, niet onpopulaire meningen</li>
                <li><strong>Appeal proces:</strong> Gebruikers kunnen moderatiebeslissingen aanvechten</li>
              </ul>

              <h3>User-Generated Content Standaarden</h3>
              <ul>
                <li><strong>Disclaimer:</strong> Duidelijke <Link href="/forum-disclaimer" className="text-primary-600 dark:text-primary-400 hover:underline">Forum Disclaimer</Link> over user content</li>
                <li><strong>Fact-checking encouragement:</strong> We moedigen gebruikers aan om bronnen te citeren</li>
                <li><strong>Misinfo reporting:</strong> Makkelijk systeem om misinformatie te rapporteren</li>
                <li><strong>Expert engagement:</strong> Verified badges voor experts in het veld</li>
              </ul>
            </section>

            <section>
              <h2>8. Continue Verbetering</h2>
              <p>
                Journalistieke standards evolueren, en wij evolueren mee. We investeren in continue verbetering.
              </p>

              <h3>Training en Ontwikkeling</h3>
              <ul>
                <li><strong>Jaarlijkse training:</strong> 40 uur per redacteur in journalistieke ethiek, nieuwsgaring, fact-checking</li>
                <li><strong>Externe workshops:</strong> Deelname aan Nederlandse Vereniging van Journalisten (NVJ) events</li>
                <li><strong>Peer learning:</strong> Maandelijkse case study discussies</li>
                <li><strong>Diversiteit training:</strong> Bewustwording van bias en inclusieve reporting</li>
              </ul>

              <h3>Innovation</h3>
              <ul>
                <li><strong>AI-assisted fact-checking:</strong> Experimenteren met AI tools voor verification</li>
                <li><strong>Data journalism:</strong> Investeren in data analysis capabilities</li>
                <li><strong>Multimedia storytelling:</strong> Video, podcasts, interactieve graphics</li>
                <li><strong>Open source:</strong> We delen onze fact-checking methodologie publicly</li>
              </ul>

              <h3>Public Accountability</h3>
              <ul>
                <li><strong>Jaarverslag:</strong> Publiek rapport over fouten, correcties, klachten, verbeteringen</li>
                <li><strong>Ombudspersoon:</strong> Onafhankelijke reviewer voor lezersklachten</li>
                <li><strong>Transparantierapport:</strong> Kwartaal statistieken over moderatie en redactionele beslissingen</li>
                <li><strong>Open redactie:</strong> Jaarlijkse Q&A sessie met lezers</li>
              </ul>
            </section>

            <section>
              <h2>9. Contact en Feedback</h2>
              <p>
                We waarderen feedback en zijn toegankelijk voor lezers, bronnen en stakeholders.
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Redactie Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Hoofdredacteur:</strong> <a href="mailto:redactie@politie-forum.nl" className="hover:underline">redactie@politie-forum.nl</a></p>
                  <p><strong>Nieuwstips:</strong> <a href="mailto:tips@politie-forum.nl" className="hover:underline">tips@politie-forum.nl</a> (vertrouwelijk)</p>
                  <p><strong>Correcties:</strong> <a href="mailto:correcties@politie-forum.nl" className="hover:underline">correcties@politie-forum.nl</a></p>
                  <p><strong>Persvragen:</strong> <a href="mailto:pers@politie-forum.nl" className="hover:underline">pers@politie-forum.nl</a></p>
                  <p><strong>Ombudspersoon:</strong> <a href="mailto:ombudspersoon@politie-forum.nl" className="hover:underline">ombudspersoon@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> +31 20 123 4567 (Maandag-Vrijdag, 09:00-17:00)</p>
                  <p><strong>WhatsApp:</strong> +31 6 48319167 (alleen voor nieuwstips)</p>
                </div>
              </div>

              <h3>Gerelateerde Documenten</h3>
              <ul>
                <li><Link href="/feitencontrole" className="text-primary-600 dark:text-primary-400 hover:underline">Feitencontrole</Link> - Onze fact-checking methodologie</li>
                <li><Link href="/correcties" className="text-primary-600 dark:text-primary-400 hover:underline">Correcties</Link> - Publieke correctiepagina</li>
                <li><Link href="/eigendom" className="text-primary-600 dark:text-primary-400 hover:underline">Eigendom</Link> - Eigendomsstructuur en financiering</li>
                <li><Link href="/over" className="text-primary-600 dark:text-primary-400 hover:underline">Over Ons</Link> - Team en missie</li>
                <li><Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> - Community guidelines</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Laatst bijgewerkt:</strong> 15 oktober 2025<br />
                <strong>Versie:</strong> 1.0<br />
                <strong>Volgende herziening:</strong> 15 januari 2026<br />
                <strong>Compliance:</strong> Code van de Raad voor de Journalistiek, Google E-E-A-T
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
