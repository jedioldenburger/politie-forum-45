# JSON-LD Schema Enhancement — Complete Implementation

**Datum**: 9 oktober 2025
**Status**: ✅ Volledig geïmplementeerd

---

## 🎯 Doel

Uitgebreide Schema.org JSON-LD implementatie voor optimale Google News indexering, lokale zoekresultaten en forum-context.

---

## ✅ Geïmplementeerde Schema's

### 1. **NewsArticle**
```json
{
  "@type": "NewsArticle",
  "@id": "https://politie-forum.nl/nieuws/{slug}#article",
  "headline": "...",
  "description": "...",
  "url": "...",
  "mainEntityOfPage": "...",
  "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
  "datePublished": "ISO-8601",
  "dateModified": "ISO-8601",
  "author": { "@type": "Person", "name": "Politie Forum Redactie" },
  "publisher": { "@id": "https://politie-forum.nl/#org" },
  "articleSection": "Categorie",
  "keywords": ["tag1", "tag2"],
  "inLanguage": "nl-NL",
  "isAccessibleForFree": true,
  "contentLocation": { "@id": "...#place" }
}
```

**Voordelen**:
- ✅ Google News indexering
- ✅ Rich snippets met afbeelding, datum, auteur
- ✅ Artikel secties (categorie) zichtbaar
- ✅ Gratis toegankelijk (positieve ranking)

---

### 2. **DiscussionForumPosting**
```json
{
  "@type": "DiscussionForumPosting",
  "@id": "https://politie-forum.nl/nieuws/{slug}#discussion",
  "headline": "Discussie: ...",
  "articleBody": "Forumdiscussie over: ...",
  "url": "...#reacties",
  "about": { "@id": "...#article" },
  "author": { "@id": "https://politie-forum.nl/#org" },
  "datePublished": "ISO-8601",
  "inLanguage": "nl-NL",
  "commentCount": 0,
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 0
  },
  "comment": []
}
```

**Voordelen**:
- ✅ Forum-context voor Google (Q&A snippets mogelijk)
- ✅ Comment count tracking (kan dynamisch worden gevuld)
- ✅ `about` linkt terug naar NewsArticle
- ✅ Klaar voor Comment-objecten in `comment[]`

---

### 3. **Place met GeoCoordinates**
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

**Voordelen**:
- ✅ Lokale zoekresultaten (Google Maps integratie)
- ✅ "Nieuws bij jou in de buurt" in Google News
- ✅ Rich snippets met locatie-pin

**Locatie-detectie**:
De `detect_location()` functie in `news-rip.py` zoekt automatisch naar 20+ Nederlandse steden in titel/samenvatting:
- Amsterdam, Rotterdam, Den Haag, Utrecht, Eindhoven, Groningen, ...
- Specifieke locaties: De Kuip, Schiphol
- Fallback: "Nederland" (zonder coördinaten)

---

### 4. **BreadcrumbList**
```json
{
  "@type": "BreadcrumbList",
  "@id": "...#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "..." },
    { "@type": "ListItem", "position": 2, "name": "Nieuws", "item": "..." },
    { "@type": "ListItem", "position": 3, "name": "Titel", "item": "..." }
  ]
}
```

---

### 5. **Organization & WebPage**
Volledige site-context met:
- Publisher info
- Logo (1024x1024)
- Contact details
- Social media links

---

## 📁 Gewijzigde Bestanden

### 1. **Next.js ISR** (`src/app/nieuws/[slug]/page.tsx`)
```typescript
// Nieuwe JSON-LD met @graph
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Place", ... },
    { "@type": "NewsArticle", ... },
    { "@type": "DiscussionForumPosting", "comment": [] }
  ]
};

return (
  <>
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <ArticleClient article={article} slug={slug} />
  </>
);
```

### 2. **Python News Ripper** (`news-rip.py`)

**Nieuwe functies**:
```python
def detect_location(title, summary):
    """Auto-detect Dutch cities with coordinates"""
    DUTCH_LOCATIONS = {
        "amsterdam": {"name": "Amsterdam", "lat": 52.3676, "lon": 4.9041},
        "rotterdam": {"name": "Rotterdam", "lat": 51.9244, "lon": 4.4777},
        "de kuip": {"name": "Stadion Feijenoord (De Kuip)", "lat": 51.8939, "lon": 4.5231},
        # ... 20+ meer
    }
    # Zoekt in titel + samenvatting
    # Returns: {"name": "Rotterdam", "lat": 51.9244, "lon": 4.4777}
```

**Template replacement**:
```python
# Detect location
location_data = detect_location(title, description)
tags = article_data.get("tags", ["politie", "nieuws", "Nederland"])

# Generate JSON-LD
location_json = {
    "@type": "Place",
    "name": location_data["name"],
    "geo": { "latitude": ..., "longitude": ... }
}

html_content = html_content.replace("{{LOCATION_JSON}}", json.dumps(location_json))
html_content = html_content.replace("{{TAGS_JSON}}", json.dumps(tags))
```

### 3. **Static Template** (`static-article-template-new.html`)

**Placeholders**:
- `{{LOCATION_JSON}}` — Dynamische Place met geo
- `{{TAGS_JSON}}` — Array van keywords
- `{{SLUG}}`, `{{TITLE}}`, `{{DESCRIPTION}}`, `{{DATE_ISO}}`, etc.

---

## 🚀 Gebruik

### Comments dynamisch vullen (✅ GEÏMPLEMENTEERD)

**In `page.tsx`** (Next.js Server Component):
```typescript
// Haal comments op uit Firebase (server-side)
const { getServerArticleComments } = await import("@/lib/firebaseAdmin");
const comments = await getServerArticleComments(slug);

// DiscussionForumPosting met echte comments
{
  "@type": "DiscussionForumPosting",
  "commentCount": comments.length,
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": comments.length
  },
  "comment": comments.slice(0, 10).map((comment) => ({
    "@type": "Comment",
    "text": comment.content.length > 200
      ? comment.content.slice(0, 200) + "..."
      : comment.content,
    "dateCreated": toISO(comment.createdAt),
    "author": {
      "@type": "Person",
      "name": comment.authorName || "Anoniem"
    }
  }))
}
```

**Voordelen van server-side rendering**:
- ✅ Geen client-side fetch delay
- ✅ Comments direct in initial HTML (SEO boost)
- ✅ ISR revalidation zorgt voor actuele data
- ✅ Eerste 10 comments in JSON-LD voor rich snippets

### Nieuwe locatie toevoegen

**In `news-rip.py`** (regel ~789):
```python
DUTCH_LOCATIONS = {
    # ... bestaande ...
    "arnhem": {"name": "Arnhem", "lat": 51.9851, "lon": 5.8987},
    "nieuw": {"name": "Nieuwe Stad", "lat": 52.1234, "lon": 4.5678}
}
```

---

## 🧪 Testen

### Google Rich Results Test
1. Ga naar: https://search.google.com/test/rich-results
2. Voer URL in: `https://politie-forum.nl/nieuws/{slug}`
3. Controleer:
   - ✅ NewsArticle detected
   - ✅ BreadcrumbList detected
   - ✅ Organization detected

### Schema.org Validator
1. Ga naar: https://validator.schema.org/
2. Plak HTML of URL
3. Check: Geen errors, alleen warnings (optioneel)

---

## 📊 SEO Impact

### Voor
- ❌ Basis NewsArticle (alleen title + date)
- ❌ Geen forum-context
- ❌ Geen geo-locatie

### Na
- ✅ **NewsArticle** met volledige metadata (author, section, keywords, free access)
- ✅ **DiscussionForumPosting** (Google weet dat het een discussie-platform is)
- ✅ **Place + GeoCoordinates** (lokale zoekresultaten)
- ✅ **Comment hooks** (klaar voor Q&A snippets)
- ✅ **BreadcrumbList** (navigatie in search results)

**Verwachte voordelen**:
- 📈 Betere ranking in Google News
- 📍 Verschijnen in lokale zoekresultaten ("nieuws in Rotterdam")
- 💬 Mogelijke Q&A rich snippets bij actieve discussies
- 🖼️ Betere afbeelding-thumbnails in search results

---

## 🔄 Next Steps (Optioneel)

1. **VideoObject** toevoegen als artikelen video's bevatten
2. **FAQPage** schema voor veelgestelde vragen
3. **Event** schema voor geplande politie-evenementen
4. **HowTo** schema voor handleidingen (bijv. "Hoe word je politieagent")
5. **Review** schema voor gebruikerservaringen met politieopleidingen

---

## 📚 Referenties

- [Schema.org NewsArticle](https://schema.org/NewsArticle)
- [Schema.org DiscussionForumPosting](https://schema.org/DiscussionForumPosting)
- [Schema.org Place](https://schema.org/Place)
- [Google Search Central — Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google News Publisher Center](https://publishercenter.google.com/)

---

**Implementatie**: @GitHub Copilot
**Datum**: 9 oktober 2025
**Versie**: 1.0
