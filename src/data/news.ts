/**
 * Sample news articles for Politie Forum Nederland
 * These serve as initial content and examples
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  featured: boolean;
  faq?: FAQItem[]; // FAQ data for structured content
}

export const sampleNews: NewsArticle[] = [
  {
    id: "news1",
    slug: "politieacademie-intake-2025-inschrijving-geopend",
    title: "Politieacademie opent inschrijving voor intake 2025",
    excerpt:
      "Vanaf vandaag kunnen aankomende politieagenten zich inschrijven voor de nieuwe intake die start in september 2025. De politieacademie verwacht ruim 2.000 nieuwe studenten.",
    content: `
# Politieacademie opent inschrijving voor intake 2025

De Politieacademie heeft vandaag de inschrijving geopend voor de nieuwe intake die in september 2025 van start gaat. Dit is goed nieuws voor iedereen die droomt van een carrière bij de politie.

## Meer plekken beschikbaar

Dit jaar zijn er meer plekken beschikbaar dan in voorgaande jaren. De politie verwacht ongeveer 2.000 nieuwe studenten te kunnen verwelkomen, verdeeld over verschillende locaties in Nederland.

### Wat is er nieuw?

- **Vernieuwde curriculum**: Het opleidingsprogramma is gemoderniseerd met meer aandacht voor digitale vaardigheden en community policing
- **Flexibele studievormen**: Naast de reguliere opleiding komen er ook meer mogelijkheden voor zij-instroom
- **Mentorprogramma**: Elke student krijgt een ervaren agent als mentor toegewezen

## Toelatingsvoorwaarden

Om toegelaten te worden tot de politieacademie moet je voldoen aan de volgende eisen:

1. **Minimaal MBO niveau 4** diploma of HBO werk- en denkniveau
2. **Leeftijd**: Tussen 18 en 35 jaar (uitzonderingen mogelijk)
3. **Medische keuring**: Goede fysieke en mentale gezondheid
4. **Screening**: Uitgebreide antecedentenonderzoek (VOG)
5. **Assessment**: Succesvol doorlopen van het selectieassessment

## Het selectieproces

Het selectieproces bestaat uit verschillende stappen:

### Fase 1: Online sollicitatie
Je dient je motivatiebrief en CV in via de website van de politie.

### Fase 2: Assessment
Als je wordt uitgenodigd, doorloop je een dag vol met testen:
- Intelligentietest
- Persoonlijkheidstest
- Fysieke test (conditie)
- Rollenspellen
- Gesprek met psycholoog

### Fase 3: Medische keuring
Een uitgebreide medische keuring om te controleren of je fysiek en mentaal geschikt bent.

### Fase 4: Screening
Achtergrondonderzoek en veiligheidsscreening (deze kan enkele maanden duren).

## Nieuwe specialisaties

Voor het eerst biedt de politieacademie ook directe doorstroommogelijkheden naar specialisaties zoals:

- Cybercrime specialist
- Jeugdagent
- Conflictbemiddeling
- Wijkagent plus

## Tips voor aankomende sollicitanten

**Bereid je voor**: Het assessment is intensief. Oefen met online tests en houd je conditie op peil.

**Wees authentiek**: De psychologen zien meteen door nepgedrag heen. Wees gewoon jezelf.

**Doe onderzoek**: Zorg dat je weet waar je aan begint. Praat met politieagenten, bezoek open dagen.

**Netwerk**: Volg politie-gerelateerde social media, word lid van dit forum en stel vragen!

## Inschrijven

Je kunt je inschrijven via [politie.nl/werken-bij](https://www.politie.nl/werken-bij). De inschrijving sluit op 1 mei 2025.

## Meer informatie

- **Open dagen**: Check de website voor open dagen bij de verschillende academielocaties
- **Voorlichtingsbijeenkomsten**: Gratis online en fysieke informatiesessies
- **WhatsApp service**: Stel je vragen via de politie recruitment WhatsApp

**Succes aan alle aankomende aspiranten! Deel je ervaringen hier op het forum.**

---

*Heb je vragen over de sollicitatieprocedure? Start een topic in de categorie "Sollicitatie & Selectie"!*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-10-01T09:00:00+02:00",
    updatedAt: "2025-10-01T09:00:00+02:00",
    category: "Opleiding",
    tags: ["politieacademie", "intake", "sollicitatie", "opleiding", "2025"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: true,
  },
  {
    id: "news2",
    slug: "cao-akkoord-politie-loonsverhoging-vijf-procent",
    title: "Politievakbonden bereiken akkoord: 5% loonsverhoging in 2025",
    excerpt:
      "Na maanden van onderhandelen hebben de politievakbonden en het ministerie van Justitie een akkoord bereikt over een substantiële loonsverhoging voor alle politiemedewerkers.",
    content: `
# Politievakbonden bereiken akkoord: 5% loonsverhoging in 2025

Goed nieuws voor alle politiemedewerkers! De politievakbonden ACP, NPB en VMHP hebben een akkoord bereikt met het ministerie van Justitie en Veiligheid over een nieuwe CAO. De belangrijkste afspraak: een loonsverhoging van 5% per 1 januari 2025.

## De belangrijkste punten

### Salaris
- **5% loonsverhoging** per 1 januari 2025
- **Extra toeslag** van 2% voor medewerkers met meer dan 10 jaar dienst
- **Stageverhoging** blijft gehandhaafd

### Arbeidsvoorwaarden
- **Minder onregelmatige diensten** voor agenten boven de 55 jaar
- **Extra ADV-dagen**: 2 extra dagen verlof per jaar
- **Thuiswerkvergoeding**: Structurele regeling voor ondersteunend personeel

### Werkdruk
- **1.000 extra formatieplaatsen** komend jaar
- **Verbeterde roosters** met meer voorspelbaarheid
- **Mentale ondersteuning**: Uitbreiding van coaching en begeleiding

## Reacties vakbonden

**Gerrit van de Kamp (voorzitter ACP)**:
> "Dit is een mooi resultaat na intensieve onderhandelingen. De 5% loonsverhoging is een erkenning van het harde werk van onze collega's. We hadden graag meer gezien, maar dit is een realistisch en gedragen akkoord."

**Jan Struijs (NPB)**:
> "Eindelijk erkenning voor de zware belasting die onze mensen dagelijks ervaren. De extra formatieplaatsen zijn cruciaal om de werkdruk te verlagen."

## Wat betekent dit voor jou?

### Voorbeeld: Agent schaal 7, trede 5
- **Huidig salaris**: €3.200 bruto per maand
- **Nieuw salaris**: €3.360 bruto per maand (+€160)
- **Per jaar**: €1.920 extra bruto

### Voorbeeld: Senior agent schaal 8, trede 8 (>10 jaar dienst)
- **Huidig salaris**: €3.800 bruto per maand
- **Nieuw salaris**: €4.066 bruto per maand (+€266)
- **Per jaar**: €3.192 extra bruto

## Timeline

- **1 november 2024**: Definitieve ondertekening CAO
- **1 december 2024**: Publicatie nieuwe salarisschalen
- **1 januari 2025**: Ingangsdatum nieuwe salarissen
- **Januari 2025**: Eerste uitbetaling nieuwe salaris

## Extra voordelen

Naast de loonsverhoging zijn er ook afspraken gemaakt over:

### Duurzame inzetbaarheid
- Budget voor persoonlijke ontwikkeling verhoogd naar €1.500 per jaar
- Mogelijkheid tot sabbatical na 15 jaar dienst
- Sportabonnement volledig vergoed

### Pensioen
- Behoud van goede pensioenregeling
- Extra aandacht voor vroegpensioenregeling zware beroepen

### Werk-privé balans
- Flexibeler roosteren waar mogelijk
- Minimaal 2 achtereenvolgende vrije weekenden per maand
- Betere opvang bij bijzondere omstandigheden (mantelzorg, etc.)

## Kritische geluiden

Niet iedereen is even enthousiast. Enkele jonge agenten geven aan dat ze meer hadden verwacht gezien de inflatie en de toegenomen werkdruk. Ook zijn er kritische noten over de beperkte verbetering van de onregelmatigheidstoeslag.

**Mohammed A. (29, wijkagent)**:
> "5% is prima, maar het compenseert nauwelijks de gestegen kosten. En de roosters blijven moordend, vooral voor jonge collega's."

## Wat nu?

Het akkoord moet nog worden goedgekeurd door de leden van de vakbonden. De stemming vindt plaats in november. Op basis van eerdere akkoorden wordt een ruime meerderheid verwacht.

## Discussie op het forum

Wat vind jij van dit akkoord? Is 5% genoeg? Discussieer mee in de topic ["CAO Akkoord 2025 - jouw mening"](#) in de categorie Vakbonden & Rechten.

---

*Dit artikel wordt bijgewerkt zodra er meer informatie beschikbaar is.*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-28T14:30:00+02:00",
    updatedAt: "2025-09-29T10:15:00+02:00",
    category: "Arbeidsvoorwaarden",
    tags: ["cao", "salaris", "vakbond", "arbeidsvoorwaarden", "loonsverhoging"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: true,
  },
  {
    id: "news3",
    slug: "nieuwe-bodycams-live-streaming-politie",
    title:
      "Politie krijgt nieuwe generatie bodycams met live-streaming functie",
    excerpt:
      "De Nederlandse politie gaat dit jaar starten met de uitrol van geavanceerde bodycams die real-time beelden kunnen streamen naar de meldkamer. Dit moet de veiligheid en effectiviteit vergroten.",
    content: `
# Politie krijgt nieuwe generatie bodycams met live-streaming functie

De Nederlandse politie introduceert een nieuwe generatie bodycams die veel meer kunnen dan alleen opnemen. De camera's beschikken over live-streaming mogelijkheden, gezichtsherkenning en automatische incident-detectie.

## Wat is er nieuw?

De nieuwe bodycams van fabrikant Motorola Solutions zijn een grote stap voorwaarts ten opzichte van de huidige generatie:

### Live streaming
- **Real-time beelden** naar de meldkamer
- Meldkamer kan direct meekijken bij risicovolle situaties
- Betere ondersteuning en besluitvorming op afstand

### AI-functionaliteit
- **Automatische opname** bij detectie van geschreeuw, geweld of schoten
- **Gezichtsherkenning** voor opsporing (met strikte privacy-waarborgen)
- **Kentekenherkenning** voor gestolen voertuigen

### Verbeterde hardware
- **Langere batterijduur**: 12 uur continu gebruik
- **Betere beeldkwaliteit**: 4K video met nachtzicht
- **Robuuster**: Waterdicht en valbestendig

## Waarom deze upgrade?

### Veiligheid agenten
Met live-streaming kunnen collega's op de meldkamer direct meekijken als een agent in een gevaarlijke situatie terechtkomt. Dit zorgt voor snellere ondersteuning.

**Hans Janssen, teamchef meldkamer Rotterdam**:
> "We kunnen nu direct zien wat er aan de hand is. Dat scheelt kostbare seconden en kan levens redden."

### Bewijsmateriaal
De hogere beeldkwaliteit en automatische opnamefunctie zorgen voor beter bewijsmateriaal in strafzaken.

### De-escalatie
Uit onderzoek blijkt dat mensen zich vaak beter gedragen als ze weten dat er wordt gefilmd. De bodycam werkt dus preventief.

## Privacy zorgen

De invoering van deze geavanceerde camera's roept ook vragen op over privacy:

### Wat wordt opgenomen?
- Niet alles wordt continu opgenomen
- Agenten bepalen zelf wanneer ze de camera inschakelen
- Bij automatische detectie krijgt de agent een melding

### Hoe lang worden beelden bewaard?
- Standaard: 4 weken
- Bij strafzaken: volgens wettelijke bewaartermijnen
- Niet-relevante beelden worden automatisch verwijderd

### Gezichtsherkenning controversieel
Het gebruik van gezichtsherkenning is het meest omstreden aspect:

**Bits of Freedom (privacyorganisatie)**:
> "We maken ons zorgen over de massale surveillance die deze technologie mogelijk maakt. Er moeten strenge waarborgen komen."

**Politie**:
> "De gezichtsherkenning wordt alleen gebruikt voor opsporing van vermiste personen en zware criminelen. Alle gebruik wordt gelogd en gecontroleerd."

## Uitrol planning

De nieuwe bodycams worden gefaseerd ingevoerd:

### Fase 1 (Q1 2025): Pilotregio's
- Rotterdam
- Amsterdam
- Den Haag
- 500 camera's in totaal

### Fase 2 (Q2-Q3 2025): Uitbreiding
- Alle grote steden
- ME-eenheden
- 2.000 extra camera's

### Fase 3 (Q4 2025 - Q1 2026): Landelijke dekking
- Alle basiseenheden
- Totaal 10.000 camera's

## Kosten

De totale investering bedraagt €25 miljoen:
- €15 miljoen voor de camera's zelf
- €5 miljoen voor infrastructuur en software
- €5 miljoen voor training en implementatie

## Training verplicht

Alle agenten die een bodycam krijgen moeten een verplichte training volgen:

### Techniek
- Hoe werkt de camera?
- Wanneer activeer je hem?
- Troubleshooting

### Privacy & wetgeving
- Wat mag wel en niet?
- AVG-richtlijnen
- Omgang met privébeelden

### Tactiek
- Hoe beïnvloedt de camera je optreden?
- Communicatie met burgers over opnames
- De-escalatie technieken

## Reacties van agenten

De reacties uit het veld zijn overwegend positief:

**Sarah de Vries, wijkagent Utrecht**:
> "Eindelijk een bodycam die écht werkt. De batterij van de oude ging vaak leeg op het verkeerde moment. En het live-streaming geeft een veilig gevoel."

**Ahmed K., ME-er**:
> "Bij grootschalige ongeregeldheden is het super handig dat de commandant kan meekijken. Zo kan hij beter inschatten waar versterking nodig is."

Maar er is ook scepsis:

**Anonieme agent**:
> "Ik ben bang dat we straks continu in de gaten worden gehouden. Elke actie wordt beoordeeld. Dat geeft druk."

## Vergelijking met buitenland

Nederland loopt niet voorop maar ook zeker niet achter:

### Verenigd Koninkrijk
- Grootste gebruiker bodycams Europa
- Alle frontline officers verplicht
- Bewezen afname geweld tegen agenten (-30%)

### Verenigde Staten
- Verplicht in meeste grote steden
- Veel discussie over privacy
- Mixed resultaten in onderzoek

### Duitsland
- Beperkt gebruik, vooral in grote steden
- Strenge privacy-wetgeving
- Alleen bij risicovolle situaties

## Toekomst

De politie denkt al na over verdere innovaties:

- Integratie met drones
- Automatische transcriptie van gesprekken
- Augmented reality in de camera
- Directe koppeling met databases

## Meediscussiëren?

Wat vind jij van deze nieuwe bodycams? Te ver gaan qua privacy of een noodzakelijke innovatie? Deel je mening in de categorie "Techniek & Middelen"!

---

*Bronnen: Politie.nl, Nu.nl, NOS, Bits of Freedom*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-25T11:00:00+02:00",
    updatedAt: "2025-09-25T16:30:00+02:00",
    category: "Technologie",
    tags: ["bodycam", "technologie", "innovatie", "privacy", "veiligheid"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: false,
  },
  {
    id: "news4",
    slug: "sollicitatie-tips-politie-assessment-center",
    title: "10 Tips voor een succesvol politie assessment center",
    excerpt:
      "Het assessment center is voor veel kandidaten het span nendste onderdeel van de sollicitatieprocedure. Met deze tips van ervaren politiemedewerkers vergroot je je kansen op succes.",
    content: `
# 10 Tips voor een succesvol politie assessment center

Het assessment center is een cruciale stap in het sollicitatieproces bij de politie. Hier worden je vaardigheden, persoonlijkheid en geschiktheid voor het politievak grondig getest. Met deze 10 praktische tips vergroot je je slaagkans aanzienlijk.

## 1. Bereid je grondig voor

Goede voorbereiding is essentieel. Begin minstens 6 weken van tevoren:

- Bestudeer de website van de politie
- Lees over kernwaarden en competenties
- Volg het nieuws over politie en veiligheid
- Praat met politieagenten over hun werk

## 2. Train je fysieke conditie

De fysieke test is zwaarder dan veel mensen denken:

- Start 8-12 weken vooraf met trainen
- Focus op cardio, kracht én lenigheid
- Oefen specifiek de testonderdelen (shuttle run, push-ups, pull-ups)
- Zorg dat je uitgerust bent op de testdag

## 3. Oefen met rollenspellen

Rollenspellen zijn vaak het moeilijkste onderdeel:

- Vraag vrienden of familie om te oefenen
- Speel verschillende scenario's na (agressieve burger, slachtoffer, verdachte)
- Let op je lichaamstaal en stemgebruik
- Blijf rustig onder druk

## 4. Wees authentiek

De assessoren zien direct door nepgedrag:

- Probeer niet iemand anders te zijn
- Toon je echte motivatie voor het politievak
- Wees eerlijk over je sterke én zwakke punten
- Laat je persoonlijkheid zien

## 5. Beheers de kunst van actief luisteren

Cruciaal voor politiewerk:

- Laat de ander uitpraten
- Stel verduidelijkende vragen
- Vat samen wat je hebt gehoord
- Toon empathie

## 6. Werk goed samen in groepsopdrachten

Teamwork wordt nauwkeurig beoordeeld:

- Neem initiatief, maar wees niet dominant
- Luister naar ideeën van anderen
- Draag constructief bij aan discussies
- Help teamleden waar nodig

## 7. Toon probleemoplossend vermogen

Laat zien dat je kunt nadenken en handelen:

- Analyseer de situatie kalm
- Weeg verschillende opties af
- Maak weloverwogen keuzes
- Leg je redenering uit

## 8. Beheers stressmanagement

Je wordt bewust onder druk gezet:

- Adem rustig en diep bij stress
- Neem even de tijd om na te denken
- Focus op oplossingen, niet op problemen
- Gebruik humor op gepaste momenten

## 9. Stel intelligente vragen

Aan het einde krijg je vaak vragen te stellen:

- Bereid 3-5 goede vragen voor
- Vraag naar dagelijkse praktijk en cultuur
- Informeer naar doorgroeimogelijkheden
- Vermijd vragen over salaris of vakantiedagen

## 10. Zorg goed voor jezelf

De dag ervoor en op de dag zelf:

- Slaap minstens 8 uur
- Eet een gezond ontbijt
- Vermijd alcohol en cafeïne overdaad
- Kom 15 minuten te vroeg
- Draag nette, professionele kleding

## Extra tips van succesvolle kandidaten

**Lisa (27, net aangenomen)**:
> "Ik heb veel geoefend met vrienden. Dat hielp enorm bij de rollenspellen. En blijf jezelf - dat voelen ze direct aan."

**Mohammed (24, aspirant)**:
> "De fysieke test valt niet mee. Ik ben 3 maanden intensief gaan sporten en dat maakte het verschil."

## Veelgemaakte fouten

Vermijd deze klassieke blunders:

- Te laat komen
- Slechte voorbereiding
- Arrogant overkomen
- Niet kunnen motiveren waarom je bij de politie wilt
- Slechte conditie
- Onprofessionele kleding

## Na het assessment

Ook na afloop zijn er belangrijke punten:

- Wees geduldig met de uitslag (kan 2-4 weken duren)
- Vraag om feedback, ook bij afwijzing
- Gebruik de ervaring voor je ontwikkeling
- Bij afwijzing: vraag wanneer je opnieuw kunt solliciteren

## Conclusie

Met goede voorbereiding, authenticiteit en de juiste mindset maak je een goede kans op het assessment center. Geloof in jezelf en laat zien waarom jij bij de politie hoort!

**Succes!**

---

*Vragen over het assessment? Stel ze in de categorie "Sollicitatie & Selectie"!*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-22T10:00:00+02:00",
    updatedAt: "2025-09-22T10:00:00+02:00",
    category: "Sollicitatie & Selectie",
    tags: ["sollicitatie", "assessment", "tips", "voorbereiding", "selectie"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: true,
  },
  {
    id: "news5",
    slug: "werken-als-wijkagent-ervaringen-en-uitdagingen",
    title: "Werken als wijkagent: 'Elke dag is anders'",
    excerpt:
      "Wijkagenten vormen de schakel tussen burger en politie. We spraken met drie wijkagenten over hun werk, de uitdagingen en waarom zij elke dag met plezier naar hun wijk gaan.",
    content: `
# Werken als wijkagent: 'Elke dag is anders'

De wijkagent is het gezicht van de politie in de buurt. Dicht bij de mensen, altijd zichtbaar en vaak het eerste aanspreekpunt. Maar hoe is het om wijkagent te zijn? We spraken met drie ervaren wijkagenten.

## De rol van een wijkagent

Een wijkagent heeft een breed takenpakket:

### Preventie en Handhaving
- Surveillance lopen of fietsen
- Toezicht bij scholen en evenementen
- Handhaven van openbare orde

### Contact met buurt
- Spreekuren houden
- Samenwerken met buurtbewoners
- Netwerk opbouwen met ondernemers en scholen

### Probleemoplossing
- Bemiddelen bij burenruzies
- Aanpakken van overlast
- Signaleren van problemen

## Portret 1: Sarah - Wijkagent in Utrecht

**Sarah de Vries (32)** is al 6 jaar wijkagent in de Utrechtse wijk Overvecht.

**Waarom koos je voor wijkagent?**

> "Ik wilde impact maken. Als wijkagent ben je geen nummer, mensen kennen je. Je bouwt echt relaties op en ziet het verschil dat je maakt."

**Wat is het mooiste aan je werk?**

> "De waardering. Laatst kwam een oude mevrouw naar me toe die ik geholpen had met een oplichtingszaak. Ze had koekjes gebakken en was zo dankbaar. Dat soort momenten maken alles goed."

**En de uitdagingen?**

> "De administratie! Je bent veel tijd kwijt aan rapportages. En soms voelt het alsof je achter de feiten aanloopt bij de jeugdproblematiek. Daar zou ik graag meer tijd voor hebben."

## Portret 2: Ahmed - Wijkagent in Rotterdam

**Ahmed Karim (28)** werkt sinds 3 jaar als wijkagent in Rotterdam-Zuid.

**Hoe is het om wijkagent te zijn in een 'moeilijke' wijk?**

> "Rotterdam-Zuid heeft een bepaald imago, maar ik zie vooral veerkracht en samenhorigheid. Ja, er zijn uitdagingen, maar de meeste mensen willen gewoon veilig wonen en leven."

**Wat is het verschil met surveillance?**

> "Als surveillant ben je meer reactief - je gaat van melding naar melding. Als wijkagent werk je structureel aan problemen. Je kent de wijk, de mensen, de geschiedenis. Dat maakt je effectiever."

**Advies voor aankomende wijkagenten?**

> "Wees zichtbaar, benaderbaar en eerlijk. Mensen prikken direct door bullshit heen. En leer de taal en cultuur van je wijk kennen - dat helpt enorm."

## Portret 3: Jan - Wijkagent op het platteland

**Jan Bakker (45)** is wijkagent in een kleine gemeente in Friesland, met 5.000 inwoners verspreid over meerdere dorpen.

**Wat is het verschil tussen stad en platteland?**

> "Hier ken je werkelijk iedereen. Dat heeft voor- en nadelen. Voordeel: veel vertrouwen en informatie. Nadeel: je privacy is beperkt. Ik kan niet eens anoniem boodschappen doen!"

**Wat doe je als wijkagent op het platteland?**

> "Van alles. Van het helpen zoeken naar een vermiste hond tot bemiddelen bij erfeniskwesties. Er is minder criminaliteit, maar meer preventie en sociale betrokkenheid. En bij de jaarlijkse kermis sta ik gewoon mee te barbecueën."

**Mis je de actie van de stad?**

> "Soms wel. Maar de rust en de verbondenheid met de gemeenschap zijn onbetaalbaar. Ik ga hier niet meer weg."

## De uitdagingen van wijkagenten

Alle drie noemen vergelijkbare uitdagingen:

### 1. Werkdruk
Te veel taken, te weinig tijd. Administratie vreet uren.

### 2. Verwachtingen
Burgers verwachten dat je er altijd bent, maar je hebt ook andere taken.

### 3. Emotionele belasting
Je ziet veel ellende en moet professioneel blijven.

### 4. Beperkte middelen
Niet altijd de steun of capaciteit om problemen écht op te lossen.

## De voordelen

Maar er zijn ook veel positieve kanten:

### 1. Autonomie
Je bepaalt grotendeels zelf je werkdag en prioriteiten.

### 2. Variatie
Geen dag is hetzelfde. Van burenruzie tot inbraakgolf.

### 3. Impact
Je maakt direct verschil in de levens van mensen.

### 4. Waardering
Veel respect en dankbaarheid van burgers.

### 5. Netwerk
Je bouwt een waardevol netwerk op in je wijk.

## Hoe word je wijkagent?

### Voorwaarden
- Minimaal 2 jaar ervaring als politieagent
- Afgeronde basis politieopleiding
- Goede sociale en communicatieve vaardigheden

### Opleiding
- Specialisatie wijkagent (4 maanden)
- Gebiedsgericht werken
- Mediationvaardigheden
- Netwerkanalyse

### Competenties
- Zelfstandig kunnen werken
- Netwerken en samenwerken
- Probleemoplossend vermogen
- Culturele sensitiviteit
- Stressbestendigheid

## Carrièreperspectief

Als wijkagent kun je doorgroeien naar:

- Coördinator wijkagenten
- Wijkteamchef
- Community policing specialist
- Projectleider veiligheid

## Tips van de wijkagenten

**Sarah**: "Begin met een goede rondgang door je wijk. Maak kennis met alle stakeholders: scholen, moskeeën, kerken, buurthuizen, ondernemers."

**Ahmed**: "Wees eerlijk over wat je wel en niet kunt. Overpromise under-deliver werkt niet in dit vak."

**Jan**: "Ga met een open blik je wijk in. Laat je vooroordelen thuis en ontdek de wijk zoals die echt is."

## Conclusie

Wijkagent zijn is een veelzijdige en betekenisvolle baan. Het vraagt veerkracht, empathie en doorzettingsvermogen, maar geeft ook veel voldoening.

**Interesse in wijkagent worden? Bespreek het in ons forum!**

---

*Deel je eigen ervaringen als wijkagent of stel vragen in de categorie "Werken bij de Politie"*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-20T09:30:00+02:00",
    updatedAt: "2025-09-20T09:30:00+02:00",
    category: "Werken bij de Politie",
    tags: [
      "wijkagent",
      "ervaringen",
      "dagelijks werk",
      "carriѐre",
      "community policing",
    ],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: false,
  },
  {
    id: "news6",
    slug: "recherche-opleiding-hoe-word-je-rechercheur",
    title: "Hoe word je rechercheur? Alles over de opleiding en carrière",
    excerpt:
      "Rechercheur worden is de droom van veel politieagenten. Maar hoe word je rechercheur en wat komt er bij kijken? Een complete gids voor ambitieuze agenten.",
    content: `
# Hoe word je rechercheur? Alles over de opleiding en carrière

Rechercheur zijn staat hoog op het verlanglijstje van veel politieagenten. Het onderzoeken van misdrijven, het oplossen van zaken en het brengen van daders voor de rechter - het is spannend en uitdagend werk. Maar hoe word je eigenlijk rechercheur?

## Voorwaarden

Om te starten met de rechercheopleiding moet je voldoen aan de volgende eisen:

### Basisvereisten
- **Minimaal 3 jaar werkervaring** als politieagent
- **Afgeronde basis politieopleiding** (BOA of HBO)
- **Goede beoordeling** van je leidinggevende
- **Gemotiveerde sollicitatie**

### Persoonlijke eigenschappen
- Analytisch denkvermogen
- Stressbestendigheid
- Communicatieve vaardigheden
- Doorzettingsvermogen
- Teamspeler

## De rechercheopleiding

De opleiding tot rechercheur duurt ongeveer **2 jaar** en bestaat uit theorie en praktijk:

### Fase 1: Basisopleiding (6 maanden)
- Opsporingsmethoden
- Verhoor technieken
- Strafrecht en strafprocesrecht
- Tactisch opsporen
- Forensisch onderzoek (basis)

### Fase 2: Werkplekleren (12 maanden)
- Stage bij rechercheteam
- Begeleiding door ervaren rechercheur
- Deelname aan echte onderzoeken
- Groeiende verantwoordelijkheid

### Fase 3: Specialisatie (6 maanden)
- Keuze uit verschillende specialismen:
  - Zeden
  - Vermogen
  - Economische criminaliteit
  - Moordzaken
  - Cybercrime
  - Georganiseerde misdaad

## Verschillende soorten rechercheurs

Er zijn verschillende specialismen binnen de recherche:

### Generalist rechercheur
- Onderzoekt diverse misdrijven
- Breed inzetbaar
- Vaak bij lokale rechercheteams

### Zeden rechercheur
- Onderzoekt zedendelicten
- Mentaal zeer zwaar werk
- Extra psychologische begeleiding
- Speciale training in verhoor kwetsbare slachtoffers

### Economische rechercheur
- Fraudezaken en witwassen
- Veel financiële analyse
- Vaak internationale samenwerking

### Technisch rechercheur
- Sporenonderzoek
- Forensisch werk
- Samenwerking met NFI

### Cyber rechercheur
- Digitale misdrijven
- Hacken, fraude, kinderporno
- Veel technische kennis vereist

## Een dag uit het leven van een rechercheur

**Tom (34), rechercheur vermogen Rotterdam**, vertelt over zijn werkdag:

> "Gistertochtend startte ik met teamoverleg. We bespraken de voortgang van lopende zaken. Ik werk momenteel aan een inbraakserie in Zuid. Na het overleg ben ik op kantoor gebleven om camerabeelden te analyseren. Saai werk, maar zo vind je patronen."

> "Middag hadden we een arrestatie gepland. Een verdachte van gewapende overval. Spannend moment - je weet nooit hoe iemand reageert. Gelukkig verliep het rustig."

> "De rest van de middag heb ik gebruikt voor het verhoren van de verdachte. Dat is een kunst. Je moet de balans vinden tussen vriendelijk en assertief. Na 3 uur hadden we een bekentenis."

> "Avond moest ik nog doorwerken voor het proces-verbaal. Heel veel schrijfwerk. Dat is het minder sexy deel van het vak, maar wel cruciaal voor een goede zaak."

## Werkdruk en stress

Rechercheur zijn is mentaal zwaar:

### Hoge werkdruk
- Veel lopende zaken tegelijk
- Deadlines en tijdsdruk
- Overwerken is regel, niet uitzondering

### Emotionele belasting
- Confrontatie met slachtoffers
- Gewelddadige beelden en situaties
- Frustratie bij onopgeloste zaken

### Onregelmatige diensten
- Nachtdiensten en weekenden
- Bereikbaarheid buiten werktijd
- Impact op privéleven

## Begeleiding en ondersteuning

De politie biedt verschillende vormen van ondersteuning:

- Maandelijks intervisie met collega's
- Toegang tot psycholoog
- Coaching door ervaren rechercheur
- Stressmanagement training

## Salaris en arbeidsvoorwaarden

Rechercheurs verdienen meer dan basis politieagenten:

### Salarisschaal
- **Schaal 9-10** (afhankelijk van ervaring)
- **Startsalaris**: circa €3.500 bruto per maand
- **Na 10 jaar**: circa €4.500 bruto per maand

### Toeslagen
- Onregelmatigheidstoeslag
- Overwerktoeslag
- Bereikbaarheidstoeslag

### Extra voordelen
- Studiebudget voor doorontwikkeling
- Betaalde cursussen en congressen
- Mogelijkheid tot detachering

## Doorgroeimogelijkheden

Als rechercheur kun je verder doorgroeien:

### Binnen de recherche
- Coördinerend rechercheur
- Teamchef recherche
- Hoofdrechercheur
- Tactisch specialist

### Buiten de recherche
- Tactisch adviseur
- Operationeel expert
- Docent politieacademie
- Management functies

## Veelgestelde vragen

**Kan ik direct na de politieacademie rechercheur worden?**
Nee, je hebt minimaal 3 jaar werkervaring nodig als agent.

**Moet ik HBO hebben?**
Niet verplicht, maar wel een pré. Veel aanmeldingen, concurrentie is hoog.

**Hoe zwaar is de opleiding?**
Pittig! Veel te leren, hoge eisen. Uitval is ongeveer 15%.

**Kan ik parttime rechercheur zijn?**
In principe wel, maar in praktijk lastig door werkdruk en bereikbaarheid.

**Is er veel concurrentie?**
Ja, meer gegadigden dan plekken. Goede motivatie en prestaties zijn cruciaal.

## Tips van rechercheurs

**Lisa, rechercheur zeden**:
> "Weet waar je aan begint. Zedenzaken zijn mentaal heel zwaar. Je moet sterk in je schoenen staan en een goed sociaal netwerk hebben."

**Mohammed, rechercheur cybercrime**:
> "Blijf jezelf ontwikkelen. Cybercrime verandert constant. Als je niet bijleert, ben je binnen no-time achterhaald."

**Karin, teamchef recherche**:
> "Rechercheur zijn is meer dan een baan, het is een passie. Als je het puur voor het geld of de status doet, hou je het niet vol."

## Conclusie

Rechercheur worden vraagt toewijding, doorzettingsvermogen en de juiste competenties. Het is geen makkelijke baan, maar wel een ontzettend interessante en betekenisvolle. Je maakt echt het verschil in het oplossen van misdrijven en het recht laten zegevieren.

**Droom jij van een carrière bij de recherche? Deel je ambities en vragen op het forum!**

---

*Meer weten? Ga naar de categorie "Specialisaties" voor discussies over recherche en andere specialismen!*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-18T14:00:00+02:00",
    updatedAt: "2025-09-18T14:00:00+02:00",
    category: "Specialisaties",
    tags: [
      "recherche",
      "opleiding",
      "carrière",
      "specialisatie",
      "rechercheur worden",
    ],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: false,
  },
  {
    id: "news7",
    slug: "algemene-discussie-toekomst-politie-nederland",
    title: "De toekomst van politiewerk: 5 trends die alles veranderen",
    excerpt:
      "Hoe ziet politiewerk er over 10 jaar uit? Technologie, maatschappelijke veranderingen en nieuwe bedreigingen dwingen de politie tot innovatie. Een blik op de toekomst.",
    content: `
# De toekomst van politiewerk: 5 trends die alles veranderen

Politiewerk is altijd in beweging. Maatschappelijke ontwikkelingen, technologische innovaties en nieuwe vormen van criminaliteit vragen om een politie die meebeweegt. Hoe ziet de politie van de toekomst eruit?

## Trend 1: Kunstmatige Intelligentie en Big Data

AI en data-analyse gaan een steeds belangrijkere rol spelen:

### Predictive Policing
- Algoritmes voorspellen waar criminaliteit gaat plaatsvinden
- Efficiëntere inzet van capaciteit
- Maar: zorgen over vooringenomenheid en privacy

### Gezichtsherkenning
- Opsporing van verdachten en vermiste personen
- Crowd management bij evenementen
- Discussie over massasurveillance

### Automatische analyse
- Doorzoeken van grote hoeveelheden data
- Patronen herkennen in criminele netwerken
- Snellere oplossing van zaken

**Expert mening - Prof. dr. Jan Pieters, hoogleraar Criminologie**:
> "AI kan de politie effectiever maken, maar we moeten waakzaam blijven voor bias in algoritmes en het beschermen van privacy."

## Trend 2: Cybercrime neemt toe

Criminaliteit verplaatst zich online:

### Nieuwe bedreigingen
- Ransomware aanvallen op bedrijven
- Cryptocurrency fraude
- Online kindermisbruik
- Identity theft

### Meer cyberagenten nodig
- Huidige capaciteit is onvoldoende
- Concurrentie met bedrijfsleven om IT-talent
- Nieuwe opleidingsprogramma's nodig

### Internationale samenwerking
- Criminaliteit kent geen grenzen
- Samenwerking met Europol en Interpol
- Complexe juridische vraagstukken

## Trend 3: Community Policing 2.0

Politie wordt nog meer onderdeel van de wijk:

### Preventie centraal
- Minder repressie, meer preventie
- Samenwerking met gemeente, scholen, zorg
- Multidisciplinaire aanpak

### Sociale media
- Direct contact met burgers via Twitter, Instagram
- Burgernet via WhatsApp
- Live Q&A's met wijkagent

### Co-creatie
- Burgers denken mee over veiligheid
- Buurtpreventie apps
- Meldingen via eigen kanalen

**Wijkagent Sarah over de toekomst**:
> "Ik zie steeds meer dat mijn rol verschuift van handhaven naar verbinden. Ik ben geen politieagent meer, maar een netwerkcoördinator veiligheid."

## Trend 4: Drones en Robots

Technologie ondersteunt of vervangt agenten:

### Drones
- Surveillance bij evenementen
- Opsporing van vermiste personen
- 3D scannen van TVO's (plaats delict)

### Robots
- Ontmantelen van explosieven
- Gevaarlijke arrestaties
- Patrouilleren in risicogebieden

### Zelfrijdende voertuigen
- Geautomatiseerde surveillance
- Efficiënter gebruik van capaciteit
- 24/7 beschikbaarheid

**Zorgen over dehumanisering**:
> "We moeten oppassen dat we niet te ver doorschieten. Politiewerk draait om menselijk contact. Robots kunnen agenten ondersteunen, maar niet vervangen." - Vakbondsman Jan Struijs

## Trend 5: Diversiteit en Inclusie

De politie moet de samenleving weerspiegelen:

### Meer diversiteit nodig
- Meer vrouwen (nu 32%, doel 40%)
- Meer agenten met migratieachtergrond
- LHBTQ+ inclusie
- Neurologische diversiteit

### Waarom belangrijk?
- Beter contact met alle bevolkingsgroepen
- Vermindert vooroordelen
- Bredere perspectievenen betere beslissingen

### Actieplan diversiteit
- Gerichte werving
- Mentorprogramma's
- Diversiteitstraining voor alle medewerkers
- Meten en bijsturen

## Uitdagingen voor de toekomst

Met alle innovatie komen ook uitdagingen:

### Capaciteitstekort
- Vergrijzing politiekorps
- Moeilijk werving nieuwe agenten
- Hoge werkdruk

### Technologische kloof
- Oudere agenten moeten mee
- Constante bijscholing nodig
- Investeringen in IT

### Maatschappelijk vertrouwen
- Incidenten zoals George Floyd effect
- Transparantie en verantwoording
- Body cams en toezicht

### Budget
- Innovaties kosten geld
- Politieke prioriteiten
- Efficiëntie vs kwaliteit

## Wat betekent dit voor jou?

Als (aankomend) politieagent is het belangrijk om:

### 1. Blijf leren
Technologie en werkwijzen veranderen constant. Investeer in jezelf.

### 2. Wees flexibel
De baan van over 10 jaar ziet er anders uit. Sta open voor verandering.

### 3. Ontwikkel digitale vaardigheden
Ook als wijkagent heb je straks basale IT-kennis nodig.

### 4. Houd mensenkennis centraal
Wat er ook verandert, empathie en communicatie blijven cruciaal.

## Experts aan het woord

**Korpschef Henk van Essen**:
> "De politie van 2035 is data-gedreven, divers en dicht bij de burger. We combineren hightech met high touch."

**Dr. Lisa de Vries, toekomstonderzoeker**:
> "Politiewerk wordt complexer. Agenten moeten straks sociaal werker, IT-specialist en bemiddelaar tegelijk zijn. Dat vraagt om andere opleidingen en ondersteuning."

## Jouw mening telt

Hoe zie jij de toekomst van politiewerk? Wat zijn volgens jou de belangrijkste ontwikkelingen? Waar maken we ons te druk of juist te weinig zorgen over?

**Discussieer mee in de categorie "Algemeen"!**

## Conclusie

De politie staat voor grote veranderingen. Technologie biedt kansen, maar brengt ook risico's met zich mee. Eén ding is zeker: de agent van de toekomst moet flexibel, technisch vaardig en menselijk blijven.

De toekomst is nu al begonnen. Ben jij er klaar voor?

---

*Bronnen: Politieacademie, Ministerie van J&V, Europol Future Crime Report 2025*
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-15T11:00:00+02:00",
    updatedAt: "2025-09-15T16:00:00+02:00",
    category: "Algemeen",
    tags: ["toekomst", "innovatie", "AI", "technologie", "trends", "discussie"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: true,
  },
  {
    id: "news8",
    slug: "mentale-gezondheid-politie-burn-out-preventie",
    title: "Mentale gezondheid bij politie: 'Het is oké om hulp te vragen'",
    excerpt:
      "Steeds meer politieagenten kampen met stress en burn-out. De politie zet in op preventie en begeleiding. Vier agenten delen openhartig hun ervaringen.",
    content: `
# Mentale gezondheid bij politie: 'Het is oké om hulp te vragen'

Politiewerk is mentaal zwaar. Agenten worden dagelijks geconfronteerd met geweld, verdriet en ellende. Steeds meer politiemensen erkennen dat dit zijn tol eist. De politie breekt het taboe rond mentale gezondheid.

## De cijfers

Recent onderzoek toont een zorgwekkend beeld:

- **23%** van agenten ervaart burn-out klachten
- **31%** heeft last van stress gerelateerde problemen
- **12%** heeft ooit overwogen te stoppen vanwege mentale druk
- **Verzuim** door mentale problemen is gestegen met 15%

## Vier persoonlijke verhalen

### Lisa (32) - Wijkagent met burn-out

> "Twee jaar geleden stortte ik in. Ik kon letterlijk niet meer uit bed komen. Het werk had alle energie uit me gezogen. De druppel was een zaak waarbij een kind was mishandeld. Ik kon er niet mee omgaan."

> "Nu, na therapie en aangepast werk, gaat het beter. Maar ik heb geleerd grenzen te stellen. Het is niet zwak om hulp te vragen - het is juist moedig."

### Mohammed (38) - PTSS na schietincident

> "Na een schietincident waarbij mijn collega gewond raakte, ontwikkelde ik PTSS. Flashbacks, slapeloosheid, schrikreacties. Ik schaamde me. Dacht dat ik moest doorbijten."

> "Mijn vrouw drong aan op hulp. Beste beslissing ever. EMDR therapie heeft me enorm geholpen. Ik ben weer volledig operationeel, maar wel bewuster van mijn kwetsbaarheid."

### Karin (45) - Compassion fatigue

> "Na 20 jaar bij zeden had ik compassion fatigue. Ik voelde... niets meer. Geen empathie, geen emotie. Gevaarlijk in dit werk."

> "Ik ben overgeplaatst en heb coaching gehad. Nu werk ik bij de meldkamer. Minder direct contact met slachtoffers, maar ik kan nog wel mijn bijdrage leveren."

### Tom (29) - Angst en paniekaanvallen

> "Tijdens nachtdiensten kreeg ik paniekaanvallen. Hartkloppingen, hyperventilatie. Angstig om alleen op pad te gaan. Niemand wist het - ik verborg het."

> "Een oudere collega merkte het toch. Hij had zelf ook met angst te maken gehad. Hij hielp me om hulp te zoeken. Nu, na medicatie en therapie, gaat het veel beter."

## Waarom is politiewerk mentaal zwaar?

### Confrontatie met trauma
- Geweld en dood
- Kindermisbruik en huiselijk geweld
- Ernstige ongevallen

### Emotionele belasting
- Slachtoffers en nabestaanden
- Machteloosheid bij onopgeloste zaken
- Secundaire traumatisering

### Werkdruk
- Te veel werk, te weinig tijd
- Onregelmatige diensten
- Overwerken als norm

### Organisatiecultuur
- Stoer doen, niet zeuren
- Taboe op kwetsbaarheid
- Weinig waardering

## Wat doet de politie?

De politie erkent het probleem en heeft een actieplan:

### Preventie
- **Jaarlijkse screening** op mentale gezondheid
- **Stress management training** voor alle agenten
- **Peer support** programma's
- **Mindfulness** en relaxatie workshops

### Vroege signalering
- Leidinggevenden trainen in herkennen signalen
- Collegiale zorgsysteem
- Laagdrempelige hulp via intranet

### Behandeling
- Bedrijfspsycholoog binnen 24 uur beschikbaar
- Gratis traumatherapie (EMDR, CGT)
- Mogelijkheid tot aangepast werk
- Begeleiding bij re-integratie

### Cultuurverandering
- Campagne "Het is oké om niet oké te zijn"
- Ervaringsverhalen van collega's
- Training in mentale veerkracht
- Leidinggevenden als rolmodel

## Signalen om alert op te zijn

Herken je deze signalen bij jezelf of collega's?

### Fysiek
- Chronische vermoeidheid
- Slaapproblemen
- Hoofdpijn of maagklachten
- Verhoogd ziekteverzuim

### Emotioneel
- Prikkelbaarheid
- Emotionele afstomping
- Angst of somberheid
- Schuldgevoelens

### Gedrag
- Sociaal isolement
- Verminderde prestaties
- Cynisme
- Verhoogd alcohol/middelengebruik

### Cognitief
- Concentratieproblemen
- Besluiteloosheid
- Geheugenproblemen
- Obsessieve gedachten

## Wat kun je zelf doen?

### 1. Erken het probleem
Ontkennen helpt niet. Accepteer dat je het moeilijk hebt.

### 2. Praat erover
Met partner, vrienden, collega's of professional.

### 3. Zoek hulp
Bedrijfsarts, psycholoog, of specifieke traumatherapeut.

### 4. Zorg voor balans
Work-life balance, hobby's, sport, sociale contacten.

### 5. Grenzen stellen
Leer nee zeggen, neem pauzes, gun jezelf rust.

### 6. Fysieke gezondheid
Sport, gezond eten, voldoende slaap.

## Hulp zoeken: hoe en waar?

### Binnen de politie
- **Bedrijfsarts**: Via leidinggevende of direct
- **Psycholoog**: Kosteloze toegang via werk
- **Peer support**: Collega's met ervaring
- **Vertrouwenspersoon**: Anoniem advies

### Buiten de politie
- **Huisarts**: Eerste aanspreekpunt
- **GGZ**: Gespecialiseerde hulp
- **ARQ Centrum 45**: Expertise in trauma
- **Slachtofferhulp**: Ook voor hulpverleners

### Online
- **Politie intranet**: Info en zelfhulp tools
- **Mind Korps**: Programma voor veerkracht
- **Peer support app**: Contact met ervaringsdeskundigen

## Boodschap aan collega's

**Van korpschef Henk van Essen**:
> "Ik wil dat elke agent weet: het is sterker om hulp te vragen dan om door te modderen. Mentale gezondheid is net zo belangrijk als fysieke gezondheid. We staan achter je."

**Van vertrouwensarts dr. Peters**:
> "Te veel agenten wachten te lang. Hoe eerder je hulp zoekt, hoe sneller je herstelt. Schaamte is de grootste vijand."

## Taboe doorbreken

Steeds meer agenten delen openlijk hun ervaringen op social media en binnen de organisatie. Dit helpt het taboe te doorbreken.

### Tips voor collega's
- Vraag hoe het echt gaat
- Luister zonder oordeel
- Moedig aan hulp te zoeken
- Bied concrete ondersteuning
- Volg het op

### Tips voor leidinggevenden
- Toon interesse in welzijn
- Bespreekbaar maken in team
- Herken signalen vroeg
- Faciliteer hulp
- Blijf betrokken

## Conclusie

Mentale gezondheid is geen luxe, het is een noodzaak. Politiewerk is zwaar en het is normaal dat dit impact heeft. Wat niet normaal is, is om te blijven lijden in stilte.

**Hulp zoeken is geen teken van zwakte, maar van kracht.**

**Herken je jezelf in dit artikel? Praat erover. Met collega's, vrienden, of professionals. Je staat er niet alleen voor.**

---

*Hulp nodig? Ga naar de categorie "Off Topic" voor peer support en ervaringen delen, of neem direct contact op met de bedrijfsarts.*

**Hulplijnen**:
- 113 Zelfmoordpreventie: 0800-0113
- Korps24: interne hulplijn politie
- Mind Korps: mindkorps.politie.nl
    `,
    author: "Redactie Politie Forum",
    publishedAt: "2025-09-12T10:00:00+02:00",
    updatedAt: "2025-09-12T10:00:00+02:00",
    category: "Off Topic",
    tags: ["mentale gezondheid", "burn-out", "PTSS", "welzijn", "hulp"],
    imageUrl: "/og/politie-forum-1200x630.png",
    featured: false,
  },
];

// Helper function to get all news articles (sample data only - use for static generation)
export function getAllNews(): NewsArticle[] {
  return sampleNews.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Helper function to get news by slug (sample data only - use for static generation)
export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return sampleNews.find((article) => article.slug === slug);
}

// Helper function to get featured news (sample data only)
export function getFeaturedNews(): NewsArticle[] {
  return sampleNews.filter((article) => article.featured);
}

// Helper function to get news by category (sample data only)
export function getNewsByCategory(category: string): NewsArticle[] {
  return sampleNews.filter((article) => article.category === category);
}

/**
 * Combined function to get all news from both static and Firebase
 * Use this in client components to get the complete news list
 */
export async function getAllNewsWithFirebase(): Promise<NewsArticle[]> {
  try {
    // Import dynamically to avoid server-side issues
    const { getFirebaseNews } = await import("@/lib/firebaseNews");
    const firebaseNews = await getFirebaseNews();

    // Combine and sort
    const allNews = [
      ...sampleNews,
      ...firebaseNews.map((article) => ({
        ...article,
        // Ensure compatibility with NewsArticle interface
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        category: article.category,
        tags: article.tags,
        imageUrl: article.imageUrl,
        featured: article.featured,
      })),
    ];

    // Remove duplicates by slug
    const uniqueNews = allNews.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.slug === article.slug)
    );

    return uniqueNews.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching combined news:", error);
    return getAllNews(); // Fallback to static news
  }
}

/**
 * Combined function to get news by slug from both static and Firebase
 * Use this in client components
 */
export async function getNewsBySlugWithFirebase(
  slug: string
): Promise<NewsArticle | undefined> {
  try {
    // Check static first
    const staticArticle = getNewsBySlug(slug);
    if (staticArticle) return staticArticle;

    // Check Firebase with extended timeout for initial connection
    const { getFirebaseNewsBySlug } = await import("@/lib/firebaseNews");

    // Add 15 second timeout (Firebase needs time to initialize connection)
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Firebase timeout")), 15000)
    );

    const firebaseArticle = await Promise.race([
      getFirebaseNewsBySlug(slug),
      timeoutPromise,
    ]);

    if (firebaseArticle) {
      return {
        id: firebaseArticle.id,
        slug: firebaseArticle.slug,
        title: firebaseArticle.title,
        excerpt: firebaseArticle.excerpt,
        content: firebaseArticle.content,
        author: firebaseArticle.author,
        publishedAt: firebaseArticle.publishedAt,
        updatedAt: firebaseArticle.updatedAt,
        category: firebaseArticle.category,
        tags: firebaseArticle.tags,
        imageUrl: firebaseArticle.imageUrl,
        featured: firebaseArticle.featured,
      };
    }

    return undefined;
  } catch (error) {
    console.error("Error fetching news by slug:", error);
    return getNewsBySlug(slug); // Fallback to static
  }
}
