# CSP, SEO & Accessibility Fixes - Oktober 2025

**Datum**: 8 oktober 2025
**Status**: ✅ Compleet

---

## 🔒 CSP Violations Opgelost

### Probleem
Firebase Database probeerde long-polling scripts te laden via `https://*.firebasedatabase.app/.lp?...` maar deze werden geblokkeerd door CSP:

```
Refused to load the script 'https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app/.lp?...'
because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'..."
```

### Oplossing
✅ **Toegevoegd aan CSP `script-src`**:
```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval'
  https://www.googletagmanager.com
  https://www.google-analytics.com
  https://apis.google.com
  https://*.firebaseapp.com
  https://*.firebasedatabase.app"  // ← NIEUW
```

**Locaties**:
- `src/middleware.ts` (primary)
- `next.config.js` (fallback)

**Resultaat**: Firebase kan nu zowel WebSocket als long-polling gebruiken zonder CSP violations

---

## 📊 SEO Optimalisaties

### 1. Metadata Consolidatie

✅ **Voor**:
- Dubbele `article:published_time` tags
- Inconsistente OG images
- Category met punt: `"Nieuws."`
- Icons in metadata (niet nodig)

✅ **Na**:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getServerArticle(slug);
  const articleUrl = `${BASE_URL}/nieuws/${slug}`;
  const section = (article.category || "Nieuws").replace(/\.$/, "").trim();
  const description = (article.excerpt || "").replace(/…$/, "").slice(0, 158).trim();

  return {
    title: `${article.title} | Politie Forum Nederland`,
    description,
    keywords: article.tags || ["politie", "nieuws", "Nederland"],
    alternates: { canonical: articleUrl },
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.title,
      description,
      siteName: "Politie Forum Nederland",
      locale: "nl_NL",
      publishedTime: toISO(article.publishedAt),
      modifiedTime: toISO(article.updatedAt || article.publishedAt),
      section,  // ← Geen punt meer
      images: [
        {
          url: `${BASE_URL}/og/politie-forum-1200x630.png`,
          width: 1200,
          height: 630,
          alt: article.title,  // ← Artikel-specifieke alt
        },
      ],
    },
    twitter: { /* ... */ },
    robots: {
      index: true,
      follow: true,
      maxImagePreview: "large",
      googleBot: { index: true, follow: true },
    },
  };
}
```

### 2. JSON-LD: NewsArticle + Discussion

✅ **Component**: `src/components/JsonLdArticleWithDiscussion.tsx`

**Structuur**:
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://politie-forum.nl/#organization",
      "name": "Politie Forum Nederland",
      "logo": { "@type": "ImageObject", "url": "..." }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://politie-forum.nl/nieuws/slug#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "..." },
        { "@type": "ListItem", "position": 2, "name": "Nieuws", "item": "..." },
        { "@type": "ListItem", "position": 3, "name": "Article Title", "item": "..." }
      ]
    },
    {
      "@type": "NewsArticle",
      "@id": "https://politie-forum.nl/nieuws/slug#article",
      "headline": "...",
      "description": "...",
      "image": { "@type": "ImageObject", "url": "...", "width": 1200, "height": 630 },
      "author": { "@type": "Organization", "@id": "#organization" },
      "publisher": { "@id": "#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "..." },
      "datePublished": "2025-10-08T14:30:00+02:00",
      "dateModified": "2025-10-08T15:45:00+02:00",
      "articleSection": "Nieuws",
      "keywords": "politie, nieuws, ...",
      "isAccessibleForFree": true,
      "discussionUrl": "https://politie-forum.nl/nieuws/slug#comments"
    },
    {
      "@type": "DiscussionForumPosting",
      "@id": "https://politie-forum.nl/nieuws/slug#comments#discussion",
      "headline": "Discussie over: ...",
      "discussionUrl": "...",
      "commentCount": 42,
      "datePublished": "...",
      "publisher": { "@id": "#organization" },
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": 42
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://politie-forum.nl/nieuws/slug",
      "url": "...",
      "name": "Article — Politie Forum Nederland",
      "breadcrumb": { "@id": "#breadcrumb" },
      "primaryImageOfPage": { "@type": "ImageObject", "url": "..." },
      "isPartOf": { "@type": "WebSite", "@id": "https://politie-forum.nl/#website" }
    }
  ]
}
```

**Voordelen**:
- ✅ Google News eligible (NewsArticle)
- ✅ Rich snippets in zoekresultaten (BreadcrumbList)
- ✅ Forum recognition met comment count (DiscussionForumPosting)
- ✅ Duplicate vermijding (gebruik van `@id` references)

---

## ♿ Accessibility & HTML Semantiek

### 3. Correcte HTML Structuur

✅ **Voor**:
```html
<!-- FOUT: <h3> in <p>, geen <h1> -->
<p>
  <h3>Titel van sectie</h3>
  Tekst...
</p>
```

✅ **Na**:
```html
<article itemScope itemType="https://schema.org/NewsArticle">
  <header>
    <h1 itemProp="headline">Twee DNA-matches bijzetting in cold case Amsterdam</h1>
    <div>
      <time itemProp="datePublished" dateTime="2025-10-08T12:53:48.776Z">
        8 oktober 2025
      </time>
      · <span itemProp="articleSection">Nieuws</span>
    </div>
  </header>

  <div itemProp="articleBody">
    <p>Inleiding van het artikel...</p>

    <h2>Nieuwe ontwikkeling</h2>
    <p>Tekst over de ontwikkeling...</p>

    <h2>Reacties van politie</h2>
    <p>Quotes en details...</p>
  </div>
</article>
```

**Belangrijke fixes**:
- ✅ Eén `<h1>` per pagina (article title)
- ✅ Correcte heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- ✅ Geen headings binnen `<p>` tags
- ✅ Semantische HTML5 elementen (`<article>`, `<header>`, `<time>`)
- ✅ Microdata attributes (`itemProp`, `itemScope`, `itemType`)

---

## 🎨 OG Image & Alt Text

### 4. Consistente Open Graph Images

✅ **Voor**:
- Site-generieke OG image in layout
- Artikel-specifieke alt in component
- → Inconsistentie tussen metadata en rendering

✅ **Na**:
```typescript
// METADATA (page.tsx)
openGraph: {
  images: [
    {
      url: `${BASE_URL}/og/politie-forum-1200x630.png`,  // Generiek
      width: 1200,
      height: 630,
      alt: article.title,  // ← Artikel-specifieke alt
    },
  ],
}

// JSON-LD (JsonLdArticleWithDiscussion.tsx)
{
  "@type": "NewsArticle",
  "image": {
    "@type": "ImageObject",
    "url": "https://politie-forum.nl/og/politie-forum-1200x630.png",
    "width": 1200,
    "height": 630
  }
}
```

**Toekomst**: Genereer per-artikel OG images met article title overlay

---

## 🔧 Technische Verbeteringen

### 5. Category Normalisatie

✅ **Code**:
```typescript
// Verwijder trailing dots en trim whitespace
const section = (article.category || "Nieuws")
  .replace(/\.$/, "")
  .trim();
```

**Effect**: `"Nieuws."` → `"Nieuws"` in alle metadata en JSON-LD

### 6. Description Cleanup

✅ **Code**:
```typescript
// Verwijder ellipsis, trim tot 158 chars, trim whitespace
const description = (article.excerpt || "")
  .replace(/…$/, "")
  .slice(0, 158)
  .trim();
```

**Effect**: Cleane meta descriptions zonder trailing `…`

---

## 📁 Gewijzigde Files

### Core Files
1. ✅ `src/middleware.ts` → CSP fix voor Firebase scripts
2. ✅ `next.config.js` → CSP update in headers
3. ✅ `src/app/nieuws/[slug]/page.tsx` → Metadata optimalisatie
4. ✅ `src/app/nieuws/[slug]/ArticleClient.tsx` → Correcte HTML semantiek (al goed)
5. ✅ `src/components/JsonLdArticleWithDiscussion.tsx` → Comprehensive JSON-LD (al goed)

### Documentation
6. ✅ `.github/copilot-instructions.md` → Updated met nieuwe optimalisaties
7. ✅ `MD/CSP-SEO-FIXES-OCT-2025.md` → Deze file (NIEUW)

---

## ✅ Checklist Implementatie

### CSP & Security
- [x] Firebase Database URL toegevoegd aan `script-src`
- [x] Long-polling scripts toegestaan
- [x] COOP headers route-specifiek
- [x] Geen CSP violations meer in console

### SEO & Metadata
- [x] Metadata geconsolideerd (één bron van waarheid)
- [x] Category zonder trailing dot
- [x] Description zonder ellipsis
- [x] Canonical URL correct
- [x] OG image 1200×630 met artikel-specifieke alt
- [x] Twitter card compleet

### JSON-LD
- [x] NewsArticle schema
- [x] DiscussionForumPosting schema
- [x] BreadcrumbList schema
- [x] WebPage schema
- [x] Organization reference (geen duplicatie)

### HTML Semantiek
- [x] Eén `<h1>` per pagina
- [x] Correcte heading hierarchy
- [x] Geen headings in `<p>` tags
- [x] Semantische HTML5 elementen
- [x] Microdata attributes

---

## 🚀 Deployment Verificatie

### Pre-Deploy Checks
```bash
# 1. Build test
npm run build

# 2. Check voor TypeScript errors
npm run lint

# 3. Test lokaal
npm run dev
# Open http://localhost:3001/nieuws/[artikel-slug]
# Check console voor errors
```

### Post-Deploy Verificatie

**1. CSP Headers**
```bash
curl -I https://politie-forum.nl/nieuws/[slug] | grep Content-Security-Policy
# Should include: https://*.firebasedatabase.app
```

**2. Console Check**
- Open artikel pagina
- Open Developer Tools → Console
- ✅ Geen CSP violations
- ✅ Geen "Refused to load script" errors
- ✅ Firebase connected zonder warnings

**3. SEO Check**
```bash
# Google Rich Results Test
https://search.google.com/test/rich-results?url=https://politie-forum.nl/nieuws/[slug]

# Schema.org Validator
https://validator.schema.org/?url=https://politie-forum.nl/nieuws/[slug]
```

**4. HTML Validation**
```bash
# W3C Validator
https://validator.w3.org/nu/?doc=https://politie-forum.nl/nieuws/[slug]
# Check: Geen heading hierarchy errors
```

---

## 📈 Verwachte Resultaten

### Console
- ✅ **0** CSP violations
- ✅ **0** Firebase script errors
- ✅ **0** heading hierarchy warnings

### SEO Tools
- ✅ **NewsArticle** detected by Google
- ✅ **BreadcrumbList** rich snippet eligible
- ✅ **DiscussionForumPosting** forum recognition
- ✅ **100/100** Schema.org validation

### PageSpeed Insights
- ✅ **Accessibility**: 100
- ✅ **Best Practices**: 100
- ✅ **SEO**: 100

---

## 🎯 Toekomstige Optimalisaties

### 1. Per-Artikel OG Images
```typescript
// Genereer dynamische OG images met Vercel OG
// https://vercel.com/docs/functions/edge-functions/og-image-generation

export async function generateOGImage(article: Article) {
  return new ImageResponse(
    <div style={{ /* ... */ }}>
      <h1>{article.title}</h1>
      <p>{article.category}</p>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### 2. Preconnect voor Performance
```html
<!-- In layout.tsx <head> -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.gstatic.com" />
<link rel="dns-prefetch" href="https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app" />
```

### 3. Lazy Load Comments
```typescript
// Dynamic import voor ArticleComments
const ArticleComments = dynamic(() => import('@/components/ArticleComments'), {
  loading: () => <CommentsSkeleton />,
  ssr: false, // Client-only voor real-time updates
});
```

### 4. ISR Optimalisatie
```typescript
// Verhoog revalidation tijd voor oudere artikelen
export const revalidate =
  isRecent(article.publishedAt)
    ? 300   // 5 min voor nieuwe artikelen
    : 3600; // 1 uur voor oudere artikelen
```

---

## 📚 Referenties

- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Schema.org NewsArticle](https://schema.org/NewsArticle)
- [Schema.org DiscussionForumPosting](https://schema.org/DiscussionForumPosting)
- [Google Rich Results Guide](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Firebase Realtime Database Web](https://firebase.google.com/docs/database/web/start)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

**Status**: 🎉 **Alle fixes succesvol geïmplementeerd!**
**Volgende stap**: Deploy naar productie + verificatie

---

**Laatste update**: 8 oktober 2025, 21:30 CET
**Versie**: 2.0.0
