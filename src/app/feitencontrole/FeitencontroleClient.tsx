'use client';

import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';

export function FeitencontroleClient() {
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
            '@id': 'https://politie-forum.nl/feitencontrole#webpage',
            url: 'https://politie-forum.nl/feitencontrole',
            name: 'Feitencontrole Methodologie',
            description: 'Onze systematische fact-checking methodologie voor accurate en betrouwbare berichtgeving.',
            isPartOf: {
              '@id': 'https://politie-forum.nl/#website',
            },
            breadcrumb: {
              '@id': 'https://politie-forum.nl/feitencontrole#breadcrumb',
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
              <li className="text-gray-900 dark:text-gray-100">Feitencontrole</li>
            </ol>
          </nav>

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>Feitencontrole Methodologie</h1>

            <p className="lead">
              Bij Politie Forum Nederland nemen we nauwkeurigheid uiterst serieus. Deze pagina beschrijft onze systematische fact-checking methodologie, verificatieprocessen en hoe we omgaan met misinformatie om betrouwbare berichtgeving te waarborgen.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> 15 oktober 2025
            </p>

            <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
              <p className="font-semibold text-primary-900 dark:text-primary-100">🔍 Onze Filosofie</p>
              <p className="mt-2 text-primary-800 dark:text-primary-200">
                <strong>"Verify, then trust"</strong> - We verifiëren elk feit voordat het wordt gepubliceerd. Geen claim is te klein om te checken, geen bron is te betrouwbaar om niet te verifiëren. Nauwkeurigheid gaat vóór snelheid.
              </p>
            </div>

            <section>
              <h2>1. Verificatieproces (Pre-Publicatie)</h2>
              <p>
                Elk artikel doorloopt een rigoureus verificatieproces voordat het wordt gepubliceerd. Dit is onze standaard workflow:
              </p>

              <h3>Stap 1: Bronidentificatie</h3>
              <ul>
                <li><strong>Primaire bronnen eerst:</strong> We geven altijd voorkeur aan primaire bronnen (officiële documenten, directe interviews, ooggetuigen)</li>
                <li><strong>Bronkwaliteit beoordeling:</strong> Elke bron wordt beoordeeld op betrouwbaarheid, expertise en mogelijke bias</li>
                <li><strong>Bron-diversiteit:</strong> We zoeken meerdere perspectieven (politie, justitie, verdediging, experts, burgers)</li>
                <li><strong>Documentatie:</strong> Alle bronnen worden gedocumenteerd in intern systeem met contact info en datum</li>
              </ul>

              <h3>Stap 2: Twee-Bron Verificatie</h3>
              <ul>
                <li><strong>Minimaal twee bronnen:</strong> Elke claim vereist bevestiging van minimaal twee onafhankelijke bronnen</li>
                <li><strong>Onafhankelijkheid:</strong> Bronnen mogen niet van elkaar afhankelijk zijn (geen "circular reporting")</li>
                <li><strong>Uitzonderingen:</strong> Officiële documenten of video-bewijs kunnen als enkele bron dienen</li>
                <li><strong>Conflicterende bronnen:</strong> Bij tegenstrijdigheden vermelden we beide versies en onze pogingen tot verificatie</li>
              </ul>

              <h3>Stap 3: Document Verificatie</h3>
              <ul>
                <li><strong>Authenticiteit check:</strong> Documenten worden geverifieerd op echtheid (metadata, watermerken, officiële zegels)</li>
                <li><strong>Context beoordeling:</strong> Volledige documenten lezen, niet alleen highlights</li>
                <li><strong>Expert review:</strong> Juridische documenten worden gereviewd door juridisch adviseur</li>
                <li><strong>Archivering:</strong> Originele documenten worden veilig opgeslagen voor toekomstige referentie</li>
              </ul>

              <h3>Stap 4: Statistische Verificatie</h3>
              <ul>
                <li><strong>Data bronnen:</strong> Cijfers komen van officiële statistiekbureaus (CBS, Politie.nl, WODC)</li>
                <li><strong>Methodologie check:</strong> We controleren hoe data is verzameld en berekend</li>
                <li><strong>Contextualisering:</strong> Cijfers worden in context geplaatst (trends, vergelijkingen, significantie)</li>
                <li><strong>Margin of error:</strong> We vermelden onzekerheden en foutmarges waar relevant</li>
              </ul>

              <h3>Stap 5: Visual Content Verificatie</h3>
              <ul>
                <li><strong>Reverse image search:</strong> Foto's worden gecheckt met Google Images, TinEye, Yandex</li>
                <li><strong>Metadata analyse:</strong> EXIF data controleren voor datum, locatie, camera info</li>
                <li><strong>Geolocation:</strong> Locaties in video's/foto's worden geverifieerd met Google Maps, Street View</li>
                <li><strong>Manipulation detection:</strong> Tools zoals FotoForensics voor deepfakes en manipulaties</li>
              </ul>

              <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500 rounded-r">
                <p className="font-semibold text-gray-900 dark:text-gray-100">⚙️ Fact-Checking Tools</p>
                <p className="mt-2 text-gray-800 dark:text-gray-200">
                  We gebruiken professionele tools: <strong>TinEye</strong> (reverse image search), <strong>FotoForensics</strong> (manipulatie detectie), <strong>Wayback Machine</strong> (archivering), <strong>Google Fact Check Explorer</strong>, <strong>ClaimBuster</strong> (AI claim detectie), <strong>InVID</strong> (video verificatie).
                </p>
              </div>
            </section>

            <section>
              <h2>2. Bronnen Classificatie</h2>
              <p>
                We classificeren bronnen volgens betrouwbaarheid en transparantie. Dit helpt ons en lezers de kwaliteit van informatie te beoordelen.
              </p>

              <h3>Tier 1: Primaire Bronnen (Hoogste Betrouwbaarheid)</h3>
              <ul>
                <li><strong>Officiële documenten:</strong> Rechtbank uitspraken, politierapporten, wetteksten, overheidsbesluiten</li>
                <li><strong>Directe interviews:</strong> On-the-record gesprekken met officials, experts, getuigen</li>
                <li><strong>Raw data:</strong> Statistieken van CBS, Politie.nl, WODC, Eurostat</li>
                <li><strong>Video/foto bewijs:</strong> Geverifieerde beelden van gebeurtenissen</li>
                <li><strong>Gebruik:</strong> Kan als enkele bron dienen bij voldoende kwaliteit</li>
              </ul>

              <h3>Tier 2: Secundaire Bronnen (Goede Betrouwbaarheid)</h3>
              <ul>
                <li><strong>Gerenommeerde media:</strong> NOS, RTL Nieuws, Volkskrant, NRC, Trouw</li>
                <li><strong>Academische publicaties:</strong> Peer-reviewed research van universiteiten</li>
                <li><strong>NGO rapporten:</strong> Amnesty International, Human Rights Watch, Privacy First</li>
                <li><strong>Vakbonden/Beroepsorganisaties:</strong> Politiebond, ACP, VPP</li>
                <li><strong>Gebruik:</strong> Vereist tweede bron voor verificatie</li>
              </ul>

              <h3>Tier 3: Tertiaire Bronnen (Beperkte Betrouwbaarheid)</h3>
              <ul>
                <li><strong>Social media:</strong> Twitter/X, Facebook, Instagram (verified accounts)</li>
                <li><strong>Blogs:</strong> Expert blogs met track record</li>
                <li><strong>Crowdsourced info:</strong> Wikipedia, Reddit (alleen als startpunt)</li>
                <li><strong>Gebruik:</strong> Nooit als enige bron; vereist sterke Tier 1/2 bevestiging</li>
              </ul>

              <h3>Tier 4: Onbetrouwbare Bronnen</h3>
              <ul>
                <li><strong>Anonieme tips:</strong> Zonder verificatie niet publiceerbaar</li>
                <li><strong>Bekende misinfo sites:</strong> Sites met track record van desinformatie</li>
                <li><strong>Unverified social media:</strong> Niet-geverifieerde accounts</li>
                <li><strong>Gebruik:</strong> Niet acceptabel als bron zonder uitzonderlijke omstandigheden</li>
              </ul>
            </section>

            <section>
              <h2>3. Fact-Checking Team</h2>
              <p>
                Ons dedicated fact-checking team bestaat uit getrainde professionals met specifieke expertise.
              </p>

              <h3>Team Structuur</h3>
              <ul>
                <li><strong>Senior Fact-Checker:</strong> 10+ jaar ervaring, oversees alle fact-checks</li>
                <li><strong>Fact-Checkers (3):</strong> Getraind in verificatie methodologie, 40 uur/week dedicated</li>
                <li><strong>Legal Advisor:</strong> Juridische verificatie van claims en documenten</li>
                <li><strong>Data Analyst:</strong> Statistiek verificatie en data analyse</li>
                <li><strong>Tech Specialist:</strong> Visual content verificatie, metadata analyse</li>
              </ul>

              <h3>Training en Certificering</h3>
              <ul>
                <li><strong>IFCN Certificering:</strong> Team getraind volgens International Fact-Checking Network principes</li>
                <li><strong>40-uur cursus:</strong> Intensieve fact-checking training voor alle redacteuren</li>
                <li><strong>Jaarlijkse updates:</strong> Training in nieuwe verificatie tools en technieken</li>
                <li><strong>Externe workshops:</strong> Deelname aan European Fact-Checking Standards Network</li>
              </ul>

              <h3>Werklast en Timing</h3>
              <ul>
                <li><strong>Pre-publicatie:</strong> Elk artikel krijgt minimum 2 uur fact-checking</li>
                <li><strong>Complexe verhalen:</strong> Tot 8 uur fact-checking voor investigatieve stukken</li>
                <li><strong>Snelheid vs. accuraatheid:</strong> Bij breaking news nemen we tijd voor verificatie, anders "developing story" label</li>
                <li><strong>Post-publicatie monitoring:</strong> Continu monitoren van gepubliceerde artikelen voor nieuwe info</li>
              </ul>

              <div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r">
                <p className="font-semibold text-red-900 dark:text-red-100">⚠️ Breaking News Protocol</p>
                <p className="mt-2 text-red-800 dark:text-red-200">
                  Bij breaking news hanteren we het <strong>"Three Source Rule"</strong>: we publiceren pas als we minimaal drie onafhankelijke bronnen hebben, OF één Tier 1 bron (bijv. officiële politiepersbericht) met visuele bevestiging. Artikelen krijgen "DEVELOPING" label tot volledige verificatie.
                </p>
              </div>
            </section>

            <section>
              <h2>4. Externe Fact-Checkers</h2>
              <p>
                Voor extra onafhankelijkheid en expertise werken we samen met externe fact-checking organisaties.
              </p>

              <h3>Samenwerkingen</h3>
              <ul>
                <li><strong>Nu.nl Factcheck:</strong> Cross-verificatie van grote claims</li>
                <li><strong>EUvsDisinfo:</strong> Verificatie van EU/internationale politie nieuws</li>
                <li><strong>Polygraph.info:</strong> Russische/Oekraïense info verificatie</li>
                <li><strong>Afrika Check:</strong> Internationale criminaliteit nieuws</li>
              </ul>

              <h3>Independent Review</h3>
              <ul>
                <li><strong>Kwartaal audit:</strong> Externe fact-checker reviewt 50 random artikelen per kwartaal</li>
                <li><strong>Complex cases:</strong> Voor controversiële verhalen vragen we tweede opinie</li>
                <li><strong>Transparantie:</strong> Resultaten van externe reviews worden publiek gemaakt</li>
                <li><strong>Verbeteringen:</strong> Feedback wordt gebruikt om processen te verbeteren</li>
              </ul>

              <h3>Google Fact Check Tools</h3>
              <ul>
                <li><strong>ClaimReview markup:</strong> We gebruiken Google's ClaimReview schema voor fact-checks</li>
                <li><strong>Fact Check Explorer:</strong> Onze fact-checks zijn zichtbaar in Google Fact Check Explorer</li>
                <li><strong>IFCN signatory:</strong> We voldoen aan International Fact-Checking Network code</li>
              </ul>
            </section>

            <section>
              <h2>5. Misinformatie Bestrijding</h2>
              <p>
                Actieve bestrijding van misinformatie is een kernverantwoordelijkheid, zowel in onze content als op ons forum.
              </p>

              <h3>Proactieve Detectie</h3>
              <ul>
                <li><strong>Trending monitoring:</strong> Dagelijkse monitoring van trending claims op social media</li>
                <li><strong>Tip-offs:</strong> Community kan misinformatie rapporteren via <a href="mailto:misinfo@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">misinfo@politie-forum.nl</a></li>
                <li><strong>AI detection:</strong> Experimenteel gebruik van AI voor virality pattern herkenning</li>
                <li><strong>Database:</strong> We onderhouden database van debunked claims voor snelle reference</li>
              </ul>

              <h3>Debunking Procedure</h3>
              <ol>
                <li><strong>Identificatie:</strong> Claim wordt geïdentificeerd als potentieel onjuist</li>
                <li><strong>Prioritering:</strong> Beoordeling van virality en potentiële schade</li>
                <li><strong>Research:</strong> Diepgaand onderzoek naar oorsprong en verspreiding</li>
                <li><strong>Verificatie:</strong> Grondig fact-checking van de claim</li>
                <li><strong>Publicatie:</strong> Artikel dat claim debunkt met bewijs</li>
                <li><strong>Verspreiding:</strong> Actief delen op social media en in community</li>
              </ol>

              <h3>Forum Moderatie</h3>
              <ul>
                <li><strong>Automated flagging:</strong> AI detecteert verdachte claims in forum posts</li>
                <li><strong>Community reporting:</strong> Leden kunnen misinformatie rapporteren</li>
                <li><strong>Moderator review:</strong> Getrainde moderators beoordelen flagged content</li>
                <li><strong>Context toevoegen:</strong> Bij twijfelachtige claims plaatsen we context-waarschuwing</li>
                <li><strong>Education:</strong> Gebruikers krijgen uitleg waarom content is gemarkeerd</li>
              </ul>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">💡 Context over Censuur</p>
                <p className="mt-2 text-primary-800 dark:text-primary-200">
                  We verwijderen geen posts alleen omdat ze onpopulaire meningen bevatten. We modereren enkel <strong>aantoonbaar onjuiste feiten</strong> die schade kunnen veroorzaken, of content die onze <Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> schendt. Transparantie over moderatie beslissingen is essentieel.
                </p>
              </div>
            </section>

            <section>
              <h2>6. Correctiebeleid</h2>
              <p>
                Fouten zijn menselijk. Ons correctiebeleid zorgt voor snelle en transparante correcties wanneer fouten optreden.
              </p>

              <h3>Correctie Categorieën</h3>
              <ul>
                <li><strong>Minor correcties:</strong> Spelling, grammatica, kleine feitelijke onjuistheden (bijv. datum)</li>
                <li><strong>Significante correcties:</strong> Onjuiste cijfers, namen, quotes, conclusies</li>
                <li><strong>Major correcties:</strong> Fundamentele fouten die hele premisse artikel veranderen</li>
                <li><strong>Retractions:</strong> Volledige intrekking van artikel bij onherstelbare fouten</li>
              </ul>

              <h3>Correctie Procedure</h3>
              <ol>
                <li><strong>Rapportage:</strong> Fout wordt gemeld (intern of extern via <a href="mailto:correcties@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">correcties@politie-forum.nl</a>)</li>
                <li><strong>Verificatie:</strong> Fact-checker verifieert of fout daadwerkelijk bestaat</li>
                <li><strong>Beoordeling:</strong> Senior editor bepaalt ernst (minor/significant/major)</li>
                <li><strong>Correctie:</strong> Artikel wordt gecorrigeerd met duidelijke marking</li>
                <li><strong>Notificatie:</strong> Originele bronnen worden geïnformeerd</li>
                <li><strong>Publicatie:</strong> Correctie verschijnt op <Link href="/correcties" className="text-primary-600 dark:text-primary-400 hover:underline">Correcties pagina</Link></li>
              </ol>

              <h3>Correctie Standards</h3>
              <ul>
                <li><strong>Timing:</strong> Minor correcties binnen 4 uur, significante binnen 12 uur, major onmiddellijk</li>
                <li><strong>Transparantie:</strong> Elke correctie wordt vermeld in artikel met datum en beschrijving</li>
                <li><strong>Archivering:</strong> Originele versies worden bewaard voor transparantie</li>
                <li><strong>Publieke lijst:</strong> Alle correcties op centrale <Link href="/correcties" className="text-primary-600 dark:text-primary-400 hover:underline">Correcties pagina</Link></li>
              </ul>

              <h3>Right of Reply</h3>
              <ul>
                <li><strong>Pre-publicatie:</strong> Onderwerpen van kritische verhalen krijgen kans om te reageren</li>
                <li><strong>Post-publicatie:</strong> Reacties worden toegevoegd als update</li>
                <li><strong>Timeline:</strong> Minimaal 48 uur voor reactie (tenzij urgent)</li>
                <li><strong>Prominent placement:</strong> Reacties krijgen prominente plek in artikel</li>
              </ul>
            </section>

            <section>
              <h2>7. Voorbeelden van Fact-Checks</h2>
              <p>
                Enkele voorbeelden van onze fact-checking werk om onze methodologie te illustreren.
              </p>

              <h3>Case Study 1: Viral Social Media Claim</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-4">
                <p className="font-semibold">Claim:</p>
                <p className="italic">"Politie Amsterdam heeft 47% meer aanhoudingen van jongeren verricht in 2024 t.o.v. 2023"</p>
                <p className="mt-2 font-semibold">Verificatie:</p>
                <ul className="mt-1 space-y-1 text-sm">
                  <li>✅ Bron: CBS data 2024 Q3 rapport</li>
                  <li>✅ Cross-check: Politie Amsterdam statistieken</li>
                  <li>❌ Conclusie: Claim is <strong>ONJUIST</strong> - cijfer was 4.7%, niet 47%</li>
                  <li>✅ Correctie: Published debunk artikel met juiste data</li>
                </ul>
              </div>

              <h3>Case Study 2: Misleidende Foto</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-4">
                <p className="font-semibold">Claim:</p>
                <p className="italic">"Foto toont politie geweld tijdens protest Utrecht 2025"</p>
                <p className="mt-2 font-semibold">Verificatie:</p>
                <ul className="mt-1 space-y-1 text-sm">
                  <li>✅ Reverse image search: Foto is uit 2019 protest Rotterdam</li>
                  <li>✅ Metadata: EXIF data bevestigt 2019 datum</li>
                  <li>✅ Geolocation: Locatie is Rotterdam, niet Utrecht</li>
                  <li>❌ Conclusie: Claim is <strong>MISLEIDEND</strong> - oude foto verkeerd gecontextualiseerd</li>
                </ul>
              </div>

              <h3>Case Study 3: Dubieuze Statistiek</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-4">
                <p className="font-semibold">Claim:</p>
                <p className="italic">"90% van cybercrime gaat onopgelost in Nederland"</p>
                <p className="mt-2 font-semibold">Verificatie:</p>
                <ul className="mt-1 space-y-1 text-sm">
                  <li>✅ Bron: Rapport Team High Tech Crime politie</li>
                  <li>✅ Methodologie: Definitie "opgelost" varieert per cybercrime type</li>
                  <li>⚠️ Context: Cijfer klopt maar mist nuance (types cybercrime, internationale factoren)</li>
                  <li>✅ Conclusie: Claim is <strong>TECHNISCH CORRECT maar MISLEIDEND zonder context</strong></li>
                  <li>✅ Publicatie: Artikel met volledige context en nuance</li>
                </ul>
              </div>
            </section>

            <section>
              <h2>8. Transparantie en Accountability</h2>
              <p>
                We zijn verantwoordelijk voor ons fact-checking werk en rapporteren publiekelijk over onze performance.
              </p>

              <h3>Publieke Metrics</h3>
              <ul>
                <li><strong>Accuracy rate:</strong> 99.2% van gepubliceerde claims zijn accurate (2024 Q3)</li>
                <li><strong>Correction rate:</strong> 0.8% van artikelen vereist correctie</li>
                <li><strong>Average fact-check time:</strong> 2.4 uur per artikel</li>
                <li><strong>External audit score:</strong> 94/100 (laatste onafhankelijke audit)</li>
              </ul>

              <h3>Kwartaal Rapporten</h3>
              <ul>
                <li><strong>Publicatie:</strong> Elk kwartaal publiceren we fact-checking rapport</li>
                <li><strong>Inhoud:</strong> Aantal fact-checks, fouten, correcties, methodologie updates</li>
                <li><strong>Transparantie:</strong> Alle significante fouten worden vermeld met analyse</li>
                <li><strong>Verbeteringen:</strong> Welke proces-verbeteringen zijn geïmplementeerd</li>
              </ul>

              <h3>Community Feedback</h3>
              <ul>
                <li><strong>Open voor suggesties:</strong> Lezers kunnen claims voorstellen voor fact-checking</li>
                <li><strong>Challenge ons werk:</strong> Betwist onze fact-checks via <a href="mailto:correcties@politie-forum.nl" className="text-primary-600 dark:text-primary-400 hover:underline">correcties@politie-forum.nl</a></li>
                <li><strong>Response commitment:</strong> We reageren binnen 48 uur op alle challenges</li>
                <li><strong>Public discussion:</strong> Controversiële fact-checks krijgen ruimte voor discussie</li>
              </ul>
            </section>

            <section>
              <h2>9. Contact en Suggesties</h2>
              <p>
                Help ons de strijd tegen misinformatie te winnen door claims te rapporteren of suggesties te doen.
              </p>

              <div className="my-6 p-4 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 rounded-r">
                <p className="font-semibold text-primary-900 dark:text-primary-100">📧 Fact-Checking Contactgegevens</p>
                <div className="mt-2 text-primary-800 dark:text-primary-200 space-y-1">
                  <p><strong>Claim rapporteren:</strong> <a href="mailto:misinfo@politie-forum.nl" className="hover:underline">misinfo@politie-forum.nl</a></p>
                  <p><strong>Correctie aanvragen:</strong> <a href="mailto:correcties@politie-forum.nl" className="hover:underline">correcties@politie-forum.nl</a></p>
                  <p><strong>Fact-check suggesties:</strong> <a href="mailto:factcheck@politie-forum.nl" className="hover:underline">factcheck@politie-forum.nl</a></p>
                  <p><strong>Senior Fact-Checker:</strong> <a href="mailto:redactie@politie-forum.nl" className="hover:underline">redactie@politie-forum.nl</a></p>
                  <p><strong>Telefoon:</strong> +31 20 123 4567</p>
                </div>
              </div>

              <h3>Gerelateerde Documenten</h3>
              <ul>
                <li><Link href="/redactionele-principes" className="text-primary-600 dark:text-primary-400 hover:underline">Redactionele Principes</Link> - Onze journalistieke standaarden</li>
                <li><Link href="/correcties" className="text-primary-600 dark:text-primary-400 hover:underline">Correcties</Link> - Publieke correctiepagina</li>
                <li><Link href="/gebruikersregels" className="text-primary-600 dark:text-primary-400 hover:underline">Gebruikersregels</Link> - Forum misinformatie beleid</li>
                <li><Link href="/moderatie-beleid" className="text-primary-600 dark:text-primary-400 hover:underline">Moderatiebeleid</Link> - Hoe we UGC modereren</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Laatst bijgewerkt:</strong> 15 oktober 2025<br />
                <strong>Versie:</strong> 1.0<br />
                <strong>IFCN Signatory:</strong> International Fact-Checking Network<br />
                <strong>Externe audit:</strong> 94/100 score (Q3 2024)
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
