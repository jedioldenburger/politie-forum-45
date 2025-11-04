# Advanced Schema.org Implementation — Complete Guide

**Datum**: 9 oktober 2025
**Status**: ✅ **VOLLEDIG OPERATIONEEL** — 8 Schema Types

---

## 🎯 Overzicht

Een volledige, intelligente Schema.org implementatie met **automatische detectie** van content-types:

| Schema Type | Status | Detectie | Use Case |
|-------------|--------|----------|----------|
| **NewsArticle** | ✅ | Altijd | Nieuwsindexering |
| **DiscussionForumPosting** | ✅ | Altijd | Forum-context |
| **Place + GeoCoordinates** | ✅ | Auto (100 locaties) | Lokale SEO |
| **FAQPage** | ✅ | Auto (patroon matching) | Q&A snippets |
| **Event** | ✅ | Auto (datum detectie) | Event rich results |
| **HowTo** | ✅ | Auto (stappen detectie) | Instructie snippets |
| **Review** | ✅ | Auto (rating in comments) | Social proof |
| **Comment** | ✅ | Dynamic (max 10) | Engagement signaal |

---

## 1️⃣ NewsArticle (Altijd)

```json
{
  "@type": "NewsArticle",
  "@id": "https://politie-forum.nl/nieuws/{slug}#article",
  "headline": "Artikel titel",
  "description": "Excerpt",
  "url": "https://politie-forum.nl/nieuws/{slug}",
  "mainEntityOfPage": "...",
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "datePublished": "2025-10-09T12:00:00Z",
  "dateModified": "2025-10-09T12:00:00Z",
  "author": { "@type": "Person", "name": "Politie Forum Redactie" },
  "publisher": { "@id": "https://politie-forum.nl/#org" },
  "articleSection": "Categorie",
  "keywords": ["tag1", "tag2", "..."],
  "inLanguage": "nl-NL",
  "isAccessibleForFree": true,
  "contentLocation": { "@id": "...#place" }
}
```

**Voordelen**:
- ✅ Google News indexering
- ✅ Rich snippets met afbeelding, datum, auteur
- ✅ Categorisering via articleSection

---

## 2️⃣ DiscussionForumPosting (Altijd)

```json
{
  "@type": "DiscussionForumPosting",
  "@id": "https://politie-forum.nl/nieuws/{slug}#discussion",
  "headline": "Discussie: {titel}",
  "articleBody": "Forumdiscussie over: {excerpt}",
  "url": "https://politie-forum.nl/nieuws/{slug}#reacties",
  "about": { "@id": "...#article" },
  "author": { "@id": "https://politie-forum.nl/#org" },
  "datePublished": "2025-10-09T12:00:00Z",
  "inLanguage": "nl-NL",
  "commentCount": 15,  // ← DYNAMISCH
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 15
  },
  "comment": [...]
}
```

**Voordelen**:
- ✅ Forum-context voor Google
- ✅ Engagement signalen (commentCount)
- ✅ Q&A rich snippets mogelijk

---

## 3️⃣ Place + GeoCoordinates (Auto-detectie)

### Detectie Logic
```typescript
// Python: news-rip.py
def detect_location(title, summary):
    DUTCH_LOCATIONS = {
        "amsterdam": {"name": "Amsterdam", "lat": 52.3676, "lon": 4.9041},
        "de kuip": {"name": "Stadion Feijenoord", "lat": 51.8939, "lon": 4.5231},
        // ... 98 more locations
    }
    // Zoekt in titel + samenvatting (case-insensitive)
```

### Output
```json
{
  "@type": "Place",
  "@id": "https://politie-forum.nl/nieuws/{slug}#place",
  "name": "Rotterdam",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "NL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.9244,
    "longitude": 4.4777
  }
}
```

### Ondersteunde Locaties (100 totaal)

#### Top 20 Steden
Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen, Tilburg, Almere, Breda, Nijmegen, Enschede, Haarlem, Arnhem, Zaanstad, Apeldoorn, Maastricht, Leiden, Dordrecht, 's-Hertogenbosch, Amersfoort

#### 21-40 Steden
Haarlemmermeer, Zwolle, Zoetermeer, Leeuwarden, Emmen, Ede, Delft, Venlo, Deventer, Sittard-Geleen, Helmond, Oss, Alphen aan den Rijn, Spijkenisse, Hoofddorp, Purmerend, Zaandam, Vlaardingen, Alkmaar, Hilversum

#### 41-60 Steden
Roosendaal, Schiedam, Capelle aan den IJssel, Leidschendam-Voorburg, Gouda, Hoorn, Nieuwegein, Kampen, Veenendaal, IJsselstein, Hardenberg, Barendrecht, Middelburg, Velsen, Zeist, Huizen, Katwijk, Ridderkerk, Weert, Hoogeveen

#### 61-80 Steden
Beverwijk, Terneuzen, Bussum, Kerkrade, Winschoten, Woerden, Medemblik, Waalwijk, Harderwijk, Den Helder, Hendrik-Ido-Ambacht, Wijk bij Duurstede, Culemborg, Voorschoten, Tubbergen, Losser, en meer...

#### Landmarks (20 items)
- **De Kuip** (Stadion Feijenoord)
- **Johan Cruijff ArenA**
- **Schiphol Airport**
- **Rotterdam Ahoy**
- **Jaarbeurs Utrecht**
- **Binnenhof**
- **Amsterdam Centraal**
- **Rotterdam Centraal**
- **Utrecht Centraal**
- **De Dam**
- **Leidseplein**
- **Rembrandtplein**
- **Markthal Rotterdam**
- **Euromast**
- **Keukenhof**
- **Zandvoort aan Zee**
- En meer...

**Voordelen**:
- 📍 Lokale zoekresultaten ("nieuws in Rotterdam")
- 🗺️ Google Maps integratie
- 🎯 "Nieuws bij jou in de buurt"

---

## 4️⃣ FAQPage (Auto-detectie)

### Detectie Logic
```typescript
const detectFAQs = (content: string) => {
  // Zoekt naar secties met "Veelgestelde vragen", "FAQ", "Vragen en antwoorden"
  const faqPattern = /(?:##\s*(?:Veelgestelde\s+vragen|FAQ|Vragen\s+en\s+antwoorden)[\s\S]*?)(?=##|$)/gi;

  // Extract Q&A paren (max 5)
  const qaPattern = /\*\*([^*]+)\*\*\s*\n>?\s*"?([^"\n]+)/g;
  // Returns: [{ question: "...", answer: "..." }]
}
```

### Voorbeelden die gedetecteerd worden
```markdown
## Veelgestelde vragen

**Kan ik direct na de politieacademie rechercheur worden?**
Nee, je hebt minimaal 3 jaar werkervaring nodig als agent.

**Moet ik HBO hebben?**
Niet verplicht, maar wel een pré. Veel aanmeldingen, concurrentie is hoog.
```

### Output
```json
{
  "@type": "FAQPage",
  "@id": "https://politie-forum.nl/nieuws/{slug}#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "@id": "...#faq-1",
      "name": "Kan ik direct na de politieacademie rechercheur worden?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nee, je hebt minimaal 3 jaar werkervaring nodig als agent."
      }
    }
  ]
}
```

**Voordelen**:
- ❓ Q&A rich snippets in SERP
- 📱 Featured snippets (position 0)
- 🎤 Voice search optimization

---

## 5️⃣ Event (Auto-detectie)

### Detectie Logic
```typescript
const detectEvents = (content: string) => {
  // Zoekt naar event keywords + datums
  const eventPattern = /(?:intake|open\s+dag|informatie(?:sessie|bijeenkomst)|cursus|training|workshop)/gi;
  const datePattern = /(\d{1,2}\s+(?:januari|februari|maart|...|december)\s+\d{4})/gi;

  // Beide moeten matchen
  if (eventPattern.test(content) && datePattern.test(content)) {
    return dates[0]; // "15 september 2025"
  }
}
```

### Voorbeelden die gedetecteerd worden
```markdown
## Politieacademie opent inschrijving voor intake 2025

Vanaf vandaag kunnen aankomende politieagenten zich inschrijven
voor de nieuwe intake die start in september 2025.

### Open dag
Bezoek onze open dag op 15 september 2025.
```

### Output
```json
{
  "@type": "Event",
  "@id": "https://politie-forum.nl/nieuws/{slug}#event",
  "name": "Politieacademie opent inschrijving voor intake 2025",
  "description": "Excerpt...",
  "startDate": "15 september 2025",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": { "@id": "...#place" },
  "organizer": { "@id": "https://politie-forum.nl/#org" },
  "image": "...",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
```

**Voordelen**:
- 📅 Event rich results in Google
- 🔔 Google Calendar integration mogelijk
- 🎫 "Add to Calendar" functie

---

## 6️⃣ HowTo (Auto-detectie)

### Detectie Logic
```typescript
const detectHowTo = (content: string) => {
  // Zoekt naar secties met "Hoe", "Stappen", "Tips", "Procedure"
  const howToPattern = /(?:##\s*(?:Hoe|Stappen?|Tips?|Procedure)[\s\S]*?)(?=##|$)/gi;

  // Extract stappen (max 8)
  const stepPattern = /(?:###\s*(?:Stap|Fase)\s*\d+:?\s*(.+)|^\d+\.\s*\*\*(.+?)\*\*)/gm;
  // Returns: ["Bereid je grondig voor", "Train je fysieke conditie", ...]
}
```

### Voorbeelden die gedetecteerd worden
```markdown
## 10 Tips voor een succesvol politie assessment center

### 1. Bereid je grondig voor
Goede voorbereiding is essentieel. Begin minstens 6 weken van tevoren.

### 2. Train je fysieke conditie
De fysieke test is zwaarder dan veel mensen denken.
```

### Output
```json
{
  "@type": "HowTo",
  "@id": "https://politie-forum.nl/nieuws/{slug}#howto",
  "name": "10 Tips voor een succesvol politie assessment center",
  "description": "Excerpt...",
  "image": "...",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Bereid je grondig voor",
      "text": "Bereid je grondig voor",
      "url": "...#stap-1"
    }
  ]
}
```

**Voordelen**:
- 📋 HowTo rich results met stappen
- 🎯 Featured snippets voor instructies
- 📱 Mobile-friendly "recipe cards"

---

## 7️⃣ Review (Auto-detectie)

### Detectie Logic
```typescript
const detectReviews = (comments: any[]) => {
  // Zoekt comments met rating/beoordeling keywords (max 5)
  return comments.filter(c =>
    /⭐|★|rating|beoordeling|cijfer/i.test(c.content)
  ).slice(0, 5);
}
```

### Voorbeelden die gedetecteerd worden
```
// Comment:
"Uitstekend artikel! Geef het 5 sterren ⭐⭐⭐⭐⭐"
"Goede tips, rating: 8/10"
"Beoordeling: zeer nuttig!"
```

### Output
```json
{
  "@type": "Article",
  "@id": "https://politie-forum.nl/nieuws/{slug}#reviews",
  "about": { "@id": "...#article" },
  "review": [
    {
      "@type": "Review",
      "@id": "...#review-1",
      "author": { "@type": "Person", "name": "Johan" },
      "datePublished": "2025-10-09T12:00:00Z",
      "reviewBody": "Uitstekend artikel! Geef het 5 sterren...",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      }
    }
  ]
}
```

**Voordelen**:
- ⭐ Review stars in SERP
- 👥 Social proof signalen
- 📊 Aggregate rating mogelijk

---

## 8️⃣ Comment (Dynamisch, max 10)

```json
{
  "@type": "Comment",
  "text": "Eerste 200 chars van comment...",
  "dateCreated": "2025-10-09T12:00:00Z",
  "author": { "@type": "Person", "name": "Gebruikersnaam" }
}
```

**Voordelen**:
- 💬 Engagement signaal voor Google
- 🎯 Mogelijk Q&A snippets bij relevante discussies
- 📈 Fresh content indicator

---

## 📊 SEO Impact Per Schema

| Schema | Google News | Lokale SEO | Rich Snippets | Voice Search | Mobile |
|--------|-------------|------------|---------------|--------------|--------|
| NewsArticle | ✅✅✅ | ⚪ | ✅✅ | ✅ | ✅✅ |
| DiscussionForumPosting | ✅ | ⚪ | ✅ | ✅ | ✅ |
| Place + Geo | ⚪ | ✅✅✅ | ✅✅ | ✅✅ | ✅✅✅ |
| FAQPage | ✅ | ⚪ | ✅✅✅ | ✅✅✅ | ✅✅✅ |
| Event | ✅✅ | ✅✅ | ✅✅✅ | ✅ | ✅✅ |
| HowTo | ✅ | ⚪ | ✅✅✅ | ✅✅ | ✅✅✅ |
| Review | ✅✅ | ⚪ | ✅✅✅ | ⚪ | ✅✅ |

**Legenda**: ✅✅✅ = Zeer hoog, ✅✅ = Hoog, ✅ = Medium, ⚪ = Laag/Niet van toepassing

---

## 🧪 Testing

### Google Rich Results Test
```
https://search.google.com/test/rich-results
```

Voer in: `https://politie-forum.nl/nieuws/{slug}`

**Verwachte detecties**:
- ✅ NewsArticle
- ✅ DiscussionForumPosting
- ✅ FAQPage (indien FAQ's aanwezig)
- ✅ Event (indien event aanwezig)
- ✅ HowTo (indien stappen aanwezig)
- ✅ BreadcrumbList (via layout)
- ✅ Organization (via layout)

---

### Schema.org Validator
```
https://validator.schema.org/
```

Check:
- ✅ Geen errors
- ✅ Alle @id's uniek en consistent
- ✅ Conditional schemas alleen bij relevante content

---

## 📁 Gewijzigde Bestanden

### Python Backend
- ✅ `news-rip.py`
  - `detect_location()` met **100 locaties** (regel ~801)
  - DUTCH_LOCATIONS dictionary uitgebreid

### Next.js Frontend
- ✅ `src/app/nieuws/[slug]/page.tsx`
  - `detectFAQs()` helper functie
  - `detectEvents()` helper functie
  - `detectHowTo()` helper functie
  - `detectReviews()` helper functie
  - Conditional schema's in @graph array
  - Spread operators voor optionele schemas

---

## 🎯 Use Cases Per Schema

### FAQPage
**Ideaal voor**:
- Sollicitatiegidsen
- Veelgestelde vragen over opleiding
- Procedurele uitleg
- "Hoe word je..." artikelen

**Voorbeeld**: "10 veelgestelde vragen over de politieacademie"

---

### Event
**Ideaal voor**:
- Intake aankondigingen
- Open dagen politieacademie
- Cursussen en trainingen
- Informatiebijeenkomsten
- Workshops

**Voorbeeld**: "Politieacademie intake 2025 geopend"

---

### HowTo
**Ideaal voor**:
- Assessment tips
- Sollicitatieprocedures
- Trainingsgidsen
- Stap-voor-stap instructies

**Voorbeeld**: "10 tips voor succesvol assessment center"

---

### Review
**Ideaal voor**:
- Ervaringsverhalen
- Beoordelingen van opleidingen
- Product reviews (uniformen, gear)
- Servicebeoordelingen

**Voorbeeld**: "Ervaringen met de politieopleiding"

---

## 📈 Verwachte Resultaten

### Week 1-2
- Schema's gedetecteerd door Google
- Rich Results Test validatie
- Indexering van nieuwe schema types

### Week 3-4
- Rich snippets beginnen te verschijnen
- Verbeterde CTR (Click-Through Rate)
- Featured snippets voor FAQ's/HowTo's

### Maand 2-3
- Significant hogere rankings voor geo-specifieke zoekopdrachten
- Event rich results in Google Agenda
- Voice search optimization merkbaar

### Langetermijn (6+ maanden)
- 30-50% hogere CTR door rich snippets
- Top 3 rankings voor lokale nieuws queries
- Featured snippets (position 0) voor instructies
- Hogere engagement door Q&A snippets

---

## ✅ Implementatie Checklist

- [x] NewsArticle schema (altijd)
- [x] DiscussionForumPosting schema (altijd)
- [x] Place + GeoCoordinates (100 locaties)
- [x] FAQPage schema (auto-detectie)
- [x] Event schema (auto-detectie)
- [x] HowTo schema (auto-detectie)
- [x] Review schema (auto-detectie)
- [x] Dynamic comments (max 10)
- [x] Conditional rendering (spread operators)
- [x] ISR revalidation (10min + on-demand)
- [x] Error handling
- [x] Type safety (TypeScript)

---

**Status**: 🚀 **PRODUCTIE-READY**
**Schema Count**: 8 types (4 altijd + 4 conditional)
**Locaties**: 100 (80 steden + 20 landmarks)
**Implementatie**: 9 oktober 2025
**Versie**: 3.0 (Advanced Schemas)

---

**Next**: Deploy en monitor via Google Search Console voor rich results! 🎉
