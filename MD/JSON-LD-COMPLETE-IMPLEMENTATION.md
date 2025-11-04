# Complete JSON-LD Implementatie — Politie Forum Nederland

**Datum**: 9 oktober 2025
**Status**: ✅ **VOLLEDIG OPERATIONEEL**

---

## 🎯 Wat is geïmplementeerd?

Een volledig dynamische JSON-LD implementatie die **per artikel automatisch** het volgende genereert:

### ✅ 1. NewsArticle Schema
```json
{
  "@type": "NewsArticle",
  "@id": "https://politie-forum.nl/nieuws/{slug}#article",
  "headline": "Artikel titel (dynamisch)",
  "description": "Excerpt uit artikel",
  "url": "https://politie-forum.nl/nieuws/{slug}",
  "mainEntityOfPage": "...",
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "datePublished": "2025-10-09T00:35:06.416Z",
  "dateModified": "2025-10-09T00:35:06.416Z",
  "author": { "@type": "Person", "name": "Politie Forum Redactie" },
  "publisher": { "@id": "https://politie-forum.nl/#org" },
  "articleSection": "Binnenland",
  "keywords": ["Gooiincident", "Feyenoord", "..."],
  "inLanguage": "nl-NL",
  "isAccessibleForFree": true,
  "contentLocation": { "@id": "...#place" }
}
```

---

### ✅ 2. DiscussionForumPosting Schema (met ECHTE comments)
```json
{
  "@type": "DiscussionForumPosting",
  "@id": "https://politie-forum.nl/nieuws/{slug}#discussion",
  "headline": "Discussie: {artikel titel}",
  "articleBody": "Forumdiscussie over: {excerpt}",
  "url": "https://politie-forum.nl/nieuws/{slug}#reacties",
  "about": { "@id": "...#article" },
  "author": { "@id": "https://politie-forum.nl/#org" },
  "datePublished": "2025-10-09T00:35:06.416Z",
  "inLanguage": "nl-NL",
  "commentCount": 2,  // ← DYNAMISCH uit Firebase
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 2  // ← DYNAMISCH
  },
  "comment": [
    {
      "@type": "Comment",
      "text": "Eerste 200 chars van comment...",
      "dateCreated": "2025-10-09T08:00:00+01:00",
      "author": { "@type": "Person", "name": "Johan" }
    }
    // ... max 10 comments
  ]
}
```

---

### ✅ 3. Place + GeoCoordinates (automatische detectie)
```json
{
  "@type": "Place",
  "@id": "https://politie-forum.nl/nieuws/{slug}#place",
  "name": "Stadion Feijenoord (De Kuip)",  // ← AUTO-GEDETECTEERD
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rotterdam",
    "addressCountry": "NL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.8939,  // ← AUTO-GEDETECTEERD
    "longitude": 4.5231
  }
}
```

**Gedetecteerde locaties** (20+):
- Amsterdam (52.3676, 4.9041)
- Rotterdam (51.9244, 4.4777)
- Den Haag (52.0705, 4.3007)
- Utrecht (52.0907, 5.1214)
- Eindhoven (51.4416, 5.4697)
- Groningen (53.2194, 6.5665)
- Tilburg (51.5555, 5.0913)
- Almere (52.3508, 5.2647)
- Breda (51.5719, 4.7683)
- Nijmegen (51.8126, 5.8372)
- Enschede (52.2215, 6.8937)
- Haarlem (52.3874, 4.6462)
- Arnhem (51.9851, 5.8987)
- Zaanstad (52.4389, 4.8258)
- Apeldoorn (52.2112, 5.9699)
- **De Kuip** (51.8939, 4.5231) ⚽
- **Schiphol** (52.3105, 4.7683) ✈️
- Maastricht (50.8514, 5.6909)
- Leiden (52.1601, 4.4970)
- Dordrecht (51.8133, 4.6900)

---

## 🔄 Volledige Data Flow

### 1. Python News Ripper scraped artikel
```python
# news-rip.py
def detect_location(title, summary):
    # Zoekt automatisch naar steden in titel/samenvatting
    for key, data in DUTCH_LOCATIONS.items():
        if key in search_text.lower():
            return data  # {"name": "Rotterdam", "lat": 51.9244, "lon": 4.4777}
    return {"name": "Nederland", "lat": None, "lon": None}

# Sla op in Firebase met geo-data
firebase_article = {
    "title": "...",
    "content": "...",
    "location": detect_location(title, summary)  # ← GEO-DATA
}
news_ref.child(slug).set(firebase_article)
```

---

### 2. Next.js haalt artikel + comments op
```typescript
// src/app/nieuws/[slug]/page.tsx (Server Component)

// Haal artikel op uit Firebase
const article = await getServerArticle(slug);

// Haal comments op uit Firebase (server-side)
const { getServerArticleComments } = await import("@/lib/firebaseAdmin");
const comments = await getServerArticleComments(slug);

// Geo-data uit artikel
const locationName = article.location?.name || "Nederland";
const hasGeoCoordinates = article.location?.latitude && article.location?.longitude;
```

---

### 3. JSON-LD wordt dynamisch gegenereerd
```typescript
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Place met dynamische geo-data
    {
      "@type": "Place",
      "@id": `${articleUrl}#place`,
      "name": locationName,
      "geo": hasGeoCoordinates ? {
        "@type": "GeoCoordinates",
        "latitude": article.location!.latitude,
        "longitude": article.location!.longitude
      } : undefined
    },
    // NewsArticle
    {
      "@type": "NewsArticle",
      "contentLocation": { "@id": `${articleUrl}#place` }
      // ...
    },
    // DiscussionForumPosting met ECHTE comments
    {
      "@type": "DiscussionForumPosting",
      "commentCount": comments.length,  // ← DYNAMISCH
      "comment": comments.slice(0, 10).map(comment => ({
        "@type": "Comment",
        "text": comment.content.slice(0, 200),
        "dateCreated": toISO(comment.createdAt),
        "author": { "@type": "Person", "name": comment.authorName }
      }))
    }
  ]
};
```

---

### 4. ISR revalidation zorgt voor actuele data
```typescript
// ISR configuratie
export const revalidate = 600; // 10 minuten

// On-demand revalidation via API
POST /api/revalidate
{
  "secret": "...",
  "path": "/nieuws/{slug}"
}
```

**Resultaat**: Elke 10 minuten (of on-demand) wordt de pagina opnieuw gegenereerd met:
- ✅ Actuele commentCount
- ✅ Nieuwste comments (max 10 in JSON-LD)
- ✅ Huidige geo-locatie
- ✅ Bijgewerkte metadata

---

## 📊 SEO Impact

### Google News
- ✅ **NewsArticle** schema → indexering in Google News
- ✅ **articleSection** → categorisering
- ✅ **keywords** → relevantie-signaal
- ✅ **isAccessibleForFree: true** → positieve ranking

### Lokale SEO
- ✅ **Place + GeoCoordinates** → "nieuws in Rotterdam"
- ✅ **contentLocation** → lokale zoekresultaten
- ✅ Google Maps integratie mogelijk

### Forum Context
- ✅ **DiscussionForumPosting** → Google herkent discussie-platform
- ✅ **commentCount** → engagement-signaal
- ✅ **comment[]** → Q&A rich snippets mogelijk (bij relevante vragen)

### Rich Snippets
- ✅ Afbeelding (1200x630 OG image)
- ✅ Publicatiedatum
- ✅ Auteur
- ✅ Breadcrumbs (via @graph in layout.tsx)
- ✅ Locatie-pin (bij geo-data)
- ✅ Commentaar preview (mogelijk in SERP)

---

## 🧪 Testen & Validatie

### Google Rich Results Test
```
https://search.google.com/test/rich-results
```
Voer in: `https://politie-forum.nl/nieuws/{slug}`

**Verwachte detecties**:
- ✅ NewsArticle
- ✅ DiscussionForumPosting
- ✅ BreadcrumbList (via layout.tsx)
- ✅ Organization (via layout.tsx)

---

### Schema.org Validator
```
https://validator.schema.org/
```
Plak volledige HTML of URL.

**Check**:
- ✅ Geen errors
- ✅ Warnings alleen voor optionele velden
- ✅ Alle @id's consistent en uniek

---

### Google Search Console
Na 1-2 weken:
- Check "Enhancements" → "Article"
- Kijk naar indexed articles
- Monitor CTR (Click-Through Rate)

---

## 📁 Gewijzigde Bestanden

### Backend (Python)
- ✅ `news-rip.py`
  - `detect_location()` functie (regel ~789)
  - `save_article_to_firebase()` met location data (regel ~730)
  - 20+ DUTCH_LOCATIONS met coördinaten

### Next.js Frontend
- ✅ `src/app/nieuws/[slug]/page.tsx`
  - `getServerArticleComments()` import
  - Dynamische JSON-LD generatie
  - Place schema met geo-checks
  - DiscussionForumPosting met echte comments

- ✅ `src/app/nieuws/[slug]/ArticleClient.tsx`
  - Article type import fix
  - Field mapping (imageUrl → image)

- ✅ `src/lib/firebaseAdmin.ts`
  - `ArticleLocation` type
  - `Article` type met location field
  - `getServerArticleComments()` functie
  - `getServerArticleCommentCount()` functie
  - `mapAdminToArticle()` met location mapping

- ✅ `src/lib/types.ts`
  - `ArticleLocation` interface
  - `Article` interface update

### Static HTML Template
- ✅ `static-article-template-new.html`
  - Enhanced @graph met placeholders
  - `{{LOCATION_JSON}}` placeholder
  - `{{TAGS_JSON}}` placeholder

---

## 🔮 Toekomst (Optioneel)

### Verdere uitbreidingen mogelijk:
1. **VideoObject** schema (als artikelen video's bevatten)
2. **FAQPage** schema (voor veelgestelde vragen in comments)
3. **Event** schema (politie-evenementen)
4. **HowTo** schema (handleidingen)
5. **Review** schema (gebruikerservaringen)
6. **Q&A snippets** (automatische detectie vraag/antwoord in comments)

---

## ✅ Samenvatting

| Feature | Status | Details |
|---------|--------|---------|
| **NewsArticle** | ✅ | Volledig dynamisch per artikel |
| **DiscussionForumPosting** | ✅ | Met echte comments uit Firebase |
| **Place + GeoCoordinates** | ✅ | Auto-detectie 20+ steden |
| **Comment Integration** | ✅ | Server-side, max 10 in JSON-LD |
| **Dynamic commentCount** | ✅ | Real-time via ISR |
| **Geo-location Detection** | ✅ | Automatisch in Python |
| **ISR Revalidation** | ✅ | 10min + on-demand |
| **SEO Optimized** | ✅ | Google News + lokaal + forum |

---

**Status**: 🎉 **PRODUCTIE-READY**
**Implementatie**: 9 oktober 2025
**Versie**: 2.0 (Full Dynamic)

---

**Volgende stap**: Deploy en monitor via Google Search Console! 🚀
