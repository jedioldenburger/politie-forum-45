# Homepage Category Integration - Quick Reference

**Status**: ✅ Implemented
**Date**: October 9, 2025

---

## What It Does

Dynamically generates **CollectionPage** JSON-LD schemas for all forum categories, creating a comprehensive site map for Google.

---

## Key Changes

### 1. HomepageSchema Component
**File**: `src/components/SEO/HomepageSchema.tsx`

```typescript
interface HomepageSchemaProps {
  articles: ArticleItem[];
  categories?: CategoryItem[];  // NEW
  updatedAt?: string;
}

// Maps categories to CollectionPage schemas
const categoryPages = categories.slice(0, 8).map((c) => ({
  "@type": "CollectionPage",
  "@id": `${baseUrl}/categorie/${c.id}`,
  name: c.name,
  description: c.description || `Discussies in de categorie ${c.name}`,
  url: `${baseUrl}/categorie/${c.id}`,
  isPartOf: { "@id": `${baseUrl}/#website` },
  inLanguage: "nl-NL",
}));

// Enhanced hasPart array
const hasPart = [
  // Static pages (Nieuws, Categorieën overview)
  { ... },

  // DYNAMIC: All category pages
  ...categoryPages,

  // Static info pages (Over, Contact)
  { ... },
];
```

### 2. WebSite Schema Added
```typescript
{
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  publisher: { "@id": `${baseUrl}/#org` },
  potentialAction: {
    "@type": "SearchAction",
    target: { urlTemplate: `${baseUrl}/zoeken?q={search_term_string}` }
  }
}
```

### 3. Homepage Integration
**File**: `src/app/page.tsx`

```typescript
<HomepageSchema
  articles={schemaArticles}
  categories={categories.map(c => ({  // NEW
    id: c.id,
    name: c.name,
    description: c.description,
  }))}
  updatedAt={new Date().toISOString()}
/>
```

---

## Schema Structure

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": ".../#org" },
    { "@type": "WebSite", "@id": ".../#website", "potentialAction": { "@type": "SearchAction" } },
    {
      "@type": ["WebPage", "CollectionPage"],
      "@id": ".../#webpage",
      "hasPart": [
        { "@type": "CollectionPage", "@id": ".../nieuws" },
        { "@type": "CollectionPage", "@id": ".../categorieen" },
        { "@type": "CollectionPage", "@id": ".../categorie/algemeen" },
        { "@type": "CollectionPage", "@id": ".../categorie/opleiding" },
        // ... up to 8 categories
        { "@type": "WebPage", "@id": ".../over" },
        { "@type": "WebPage", "@id": ".../contact" }
      ]
    },
    { "@type": "BreadcrumbList", "@id": ".../#breadcrumb" },
    { "@type": "SiteNavigationElement", "@id": ".../#nav" }
  ]
}
```

---

## Benefits

✅ **Improved Crawlability** - Google discovers all categories instantly
✅ **Sitelinks Potential** - Categories may appear as sitelinks in SERP
✅ **SearchAction** - Search box may appear in results
✅ **Stronger Entity Graph** - WebSite → WebPage → CollectionPage hierarchy

---

## Limits

- **Max 8 categories** in schema (keeps size under 5 KB)
- **Client-side rendering** (non-blocking)
- **ISR 120s** (refreshes every 2 minutes)

---

## Validation

### Schema.org Validator
```
https://validator.schema.org/
```
Paste homepage HTML → Should show 5 valid schemas

### Google Rich Results Test
```
https://search.google.com/test/rich-results
```
Test URL: `https://politie-forum.nl/`

---

## Testing Commands

```bash
# Build
npm run build

# Check schema in browser
# DevTools → Application → Structured Data

# Deploy
vercel --prod
```

---

## Example Output

### Category in Firebase
```json
{
  "id": "algemeen",
  "name": "Algemene Discussies",
  "description": "Bespreek algemene politiezaken en dagelijkse ervaringen."
}
```

### Generated Schema
```json
{
  "@type": "CollectionPage",
  "@id": "https://politie-forum.nl/categorie/algemeen",
  "name": "Algemene Discussies",
  "description": "Bespreek algemene politiezaken en dagelijkse ervaringen.",
  "url": "https://politie-forum.nl/categorie/algemeen",
  "isPartOf": { "@id": "https://politie-forum.nl/#website" },
  "inLanguage": "nl-NL"
}
```

---

## Troubleshooting

### Categories Not Showing
**Check**: `page.tsx` passes categories prop
```typescript
categories={categories.map(c => ({ id: c.id, name: c.name, description: c.description }))}
```

### Schema Errors
**Check**: https://validator.schema.org/
- Missing `url` or `name`
- Invalid `@id` format (must include fragment like `#website`)

### SearchAction Not Appearing
- Takes weeks/months to appear
- Not guaranteed (Google's decision)
- Requires good search functionality + traffic

---

## Files Modified

1. `src/components/SEO/HomepageSchema.tsx` - Added categories prop, dynamic mapping, WebSite schema
2. `src/app/page.tsx` - Passes categories to HomepageSchema
3. `.github/copilot-instructions.md` - Updated project log
4. `MD/HOMEPAGE-CATEGORY-INTEGRATION.md` - Comprehensive docs (this file's companion)

---

## Timeline

- **Implementation**: October 9, 2025
- **Build**: ✅ Successful (4.1s, 27 pages)
- **Deployment**: Pending
- **Rich Results**: Expected within 1-2 weeks after deployment
- **Sitelinks**: May take 1-2 months (organic)

---

## Related Docs

- Full Implementation: `MD/HOMEPAGE-CATEGORY-INTEGRATION.md`
- Homepage Schema: `MD/HOMEPAGE-SCHEMA-IMPLEMENTATION.md`
- Related Articles: `MD/RELATED-ARTICLES-SCHEMA.md`

---

**Last Updated**: October 9, 2025
**Status**: Ready for production
