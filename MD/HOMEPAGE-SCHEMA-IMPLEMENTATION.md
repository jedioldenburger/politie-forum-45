# Homepage SEO Schema Implementation - Complete Guide
**Date**: October 9, 2025
**Status**: ✅ Production Ready

---

## 🎯 Overview

This document describes the complete SEO-optimized homepage with **automatic schema generation** including:
- **ItemList** (10 latest articles)
- **BreadcrumbList** (homepage navigation hierarchy)
- **SiteNavigationElement** (main menu structure)
- **hasPart** (logical site sections)
- **Organization** (company/site identity)

All schemas are **dynamically generated** via ISR (Incremental Static Regeneration) every 5 minutes.

---

## 📁 Files Created

### 1. **`src/components/SEO/HomepageSchema.tsx`**
**Purpose**: Client component that generates complete homepage JSON-LD schema

**Features**:
- ✅ **ItemList** with top 10 articles (enables "Top stories" rich results)
- ✅ **BreadcrumbList** for homepage hierarchy
- ✅ **SiteNavigationElement** for main menu
- ✅ **hasPart** defining site sections (Nieuws, Categorieën, Over, Contact)
- ✅ **Organization** with complete business info
- ✅ Auto-updates via ISR every 5 minutes

**Props**:
```typescript
interface HomepageSchemaProps {
  articles: ArticleItem[];  // Minimal: slug + title
  updatedAt?: string;       // ISO 8601 timestamp
}
```

**Schema Types Generated**:
1. **Organization** - Site identity with logo, address, social links
2. **WebPage + CollectionPage** - Homepage metadata with mainEntity ItemList
3. **BreadcrumbList** - Home → Nieuws hierarchy
4. **SiteNavigationElement** - Top menu URLs

---

### 2. **`src/lib/api.ts`**
**Purpose**: Server-side API wrapper for fetching homepage data

**Functions**:
```typescript
export async function getFeaturedArticles(limit = 10): Promise<{ slug: string; title: string }[]>
```

**Why Minimal Data?**
- Only returns `slug` and `title` for SEO performance
- Reduces JSON-LD payload size
- No unnecessary data in HTML
- Firestore reads minimized

---

### 3. **`src/app/page.tsx`** (Updated)
**Changes**:
- ✅ Increased ISR revalidation from 120s → 300s (5 minutes)
- ✅ Added `getFeaturedArticles(10)` fetch for schema
- ✅ Integrated `<HomepageSchema>` component
- ✅ Parallel fetches via `Promise.all()`

**Before**:
```typescript
export const revalidate = 120; // 2 minutes
```

**After**:
```typescript
export const revalidate = 300; // 5 minutes for SEO freshness
```

---

## 🏗️ Schema Structure

### Full JSON-LD Output

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://politie-forum.nl/#org",
      "name": "Politie Forum Nederland",
      "alternateName": ["Politie Forum", "Politie-Forum.nl"],
      "logo": {
        "@type": "ImageObject",
        "url": "https://politie-forum.nl/logo.svg",
        "width": 512,
        "height": 512
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sint Olofssteeg 4",
        "postalCode": "1012AK",
        "addressLocality": "Amsterdam",
        "addressCountry": "NL"
      },
      "sameAs": [
        "https://x.com/politieforum",
        "https://facebook.com/politieforum",
        "https://instagram.com/politieforum"
      ]
    },
    {
      "@type": ["WebPage", "CollectionPage"],
      "@id": "https://politie-forum.nl/#webpage",
      "name": "Politie Forum Nederland — Discussies over Politie, Nieuws en Veiligheid",
      "dateModified": "2025-10-09T12:00:00+00:00",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Laatste Artikelen",
        "itemListOrder": "Descending",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "url": "https://politie-forum.nl/nieuws/article-slug",
            "name": "Article Title"
          }
          // ... 10 items
        ]
      },
      "hasPart": [
        {
          "@type": "CollectionPage",
          "@id": "https://politie-forum.nl/nieuws",
          "name": "Nieuws",
          "description": "Laatste politienieuws en actuele artikelen."
        },
        {
          "@type": "CollectionPage",
          "@id": "https://politie-forum.nl/categorieen",
          "name": "Categorieën",
          "description": "Alle forumonderwerpen en categorieën."
        },
        {
          "@type": "WebPage",
          "@id": "https://politie-forum.nl/over",
          "name": "Over"
        },
        {
          "@type": "WebPage",
          "@id": "https://politie-forum.nl/contact",
          "name": "Contact"
        }
      ],
      "about": [
        { "@type": "Thing", "name": "Politie" },
        { "@type": "Thing", "name": "Criminaliteit" },
        { "@type": "Thing", "name": "Veiligheid" }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://politie-forum.nl/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://politie-forum.nl" },
        { "@type": "ListItem", "position": 2, "name": "Nieuws", "item": "https://politie-forum.nl/nieuws" }
      ]
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://politie-forum.nl/#nav",
      "name": ["Nieuws", "Categorieën", "Over", "Contact"],
      "url": [
        "https://politie-forum.nl/nieuws",
        "https://politie-forum.nl/categorieen",
        "https://politie-forum.nl/over",
        "https://politie-forum.nl/contact"
      ]
    }
  ]
}
```

---

## 🚀 SEO Benefits

| Feature | SEO Impact | Rich Result Type |
|---------|-----------|------------------|
| **ItemList** | Lists 10 newest articles dynamically | "Top stories", "More from this site" |
| **hasPart** | Defines logical subsections | Improved crawl depth & sitelinks |
| **BreadcrumbList** | Shows internal hierarchy | Breadcrumb rich results in SERP |
| **SiteNavigationElement** | Mirrors top menu | Helps Google understand structure |
| **Organization** | Complete business identity | Knowledge Graph, Local SEO |
| **ISR (5 min)** | Auto-refresh every 300s | Fresh schema without manual deploy |

---

## 🔧 How It Works

### 1. **Data Fetching (Server-Side)**
```typescript
// app/page.tsx
const [articles, schemaArticles] = await Promise.all([
  getLatestArticles(3),      // For UI display
  getFeaturedArticles(10),   // For SEO schema (minimal data)
]);
```

### 2. **Schema Generation (Client-Side)**
```typescript
<HomepageSchema
  articles={schemaArticles}           // 10 latest articles
  updatedAt={new Date().toISOString()} // Current timestamp
/>
```

### 3. **ISR Revalidation**
```typescript
export const revalidate = 300; // Rebuild every 5 minutes
```

**Result**: Fresh schema with latest articles, auto-synced without manual deployment.

---

## 📊 Performance

**Before Homepage Schema**:
- No ItemList → Google couldn't discover article collections
- No BreadcrumbList → No breadcrumb rich results
- No SiteNavigationElement → Google guessed site structure

**After Homepage Schema**:
- ✅ ItemList with 10 articles → "Top stories" eligible
- ✅ BreadcrumbList → Breadcrumb rich results in SERP
- ✅ SiteNavigationElement → Clear site hierarchy for crawlers
- ✅ hasPart → Defined subsections improve sitelinks
- ✅ Organization → Knowledge Graph + Local SEO boost

**JSON-LD Size**: ~2.5KB (minimal, no images or full content)

---

## 🧪 Testing

### 1. **Rich Results Test**
```bash
https://search.google.com/test/rich-results
```
Enter: `https://politie-forum.nl`

**Expected Results**:
- ✅ Organization detected
- ✅ BreadcrumbList detected
- ✅ ItemList detected (10 articles)

### 2. **Schema Markup Validator**
```bash
https://validator.schema.org/
```
Paste homepage HTML source

**Expected**: All schemas valid, no errors

### 3. **Lighthouse SEO**
```bash
npx lighthouse https://politie-forum.nl --view
```

**Target**: 100/100 SEO score

---

## 🔄 ISR + Sitemap Synchronization

### Optional Enhancement: Sitemap Auto-Update

To synchronize ISR revalidation with `sitemap.xml`, add:

**File**: `src/app/sitemap.ts`
```typescript
import { getFeaturedArticles } from "@/lib/api";

export const revalidate = 300; // Same as homepage

export default async function sitemap() {
  const baseUrl = "https://politie-forum.nl";
  const articles = await getFeaturedArticles(100); // All articles

  const articleUrls = articles.map(a => ({
    url: `${baseUrl}/nieuws/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/nieuws`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
```

**Result**: Sitemap updates every 5 minutes with ISR, always in sync with homepage schema.

---

## 📝 Maintenance

### When to Update Schema

**Automatic (No Action Needed)**:
- New articles published → ISR updates ItemList every 5 min
- Site content changes → ISR refreshes `dateModified`

**Manual Updates Required**:
- Adding new top-level pages → Update `hasPart` array
- Changing main menu → Update `SiteNavigationElement` arrays
- Business info changes → Update `Organization` fields

### Monitoring

**Google Search Console**:
- Check "Enhancements" → "Breadcrumbs"
- Check "Enhancements" → "Sitelinks"
- Monitor "Coverage" for new article indexing

**Expected Timeline**:
- Breadcrumbs: 1-2 days after deployment
- ItemList rich results: 1-2 weeks
- Sitelinks: 2-4 weeks (depends on traffic)

---

## ✅ Deployment Checklist

- [x] Created `src/components/SEO/HomepageSchema.tsx`
- [x] Created `src/lib/api.ts`
- [x] Updated `src/app/page.tsx` with schema integration
- [x] ISR revalidation set to 300 seconds (5 minutes)
- [ ] Deploy to production (`vercel --prod`)
- [ ] Test with Rich Results Tool
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor "Enhancements" for breadcrumbs/ItemList

---

## 🎓 Key Concepts

### ItemList vs hasPart

**ItemList** (`mainEntity`):
- Lists individual items (articles, products, posts)
- Used for "Top stories" and "More from this site" rich results
- Should be **dynamic** (latest content)

**hasPart** (section pages):
- Lists subsections/pages of the site
- Used for sitelinks and crawl guidance
- Should be **static** (main navigation pages)

### Why ISR = 300s (5 min)?

**Too Fast** (60s):
- Excessive rebuilds
- Higher server costs
- Cache misses

**Too Slow** (3600s):
- Stale article lists
- Delayed indexing
- Poor SEO freshness

**Sweet Spot** (300s):
- Fresh enough for breaking news
- Efficient server usage
- Good cache hit rate

---

## 🔗 Related Documentation

- `MD/ADVANCED-SCHEMA-IMPLEMENTATION.md` - Article-level schemas (8 types)
- `MD/SEO-AUDIT-FINAL-OCT-9-2025.md` - Complete SEO audit response
- `MD/SEO-QUICK-REFERENCE.md` - Testing & validation commands
- `MD/SCHEMA-VALIDATION-FIXES-OCT-9-2025.md` - Schema field fixes

---

## 📞 Support

**Questions?** Check:
1. Google's [Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
2. Schema.org [ItemList Documentation](https://schema.org/ItemList)
3. Rich Results Test: https://search.google.com/test/rich-results

---

**Status**: ✅ Production Ready - Deploy Immediately
**Last Updated**: October 9, 2025
**Next Action**: `vercel --prod` → Test with Rich Results Tool
