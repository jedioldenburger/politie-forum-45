# Homepage Schema Quick Reference
**Last Updated**: October 9, 2025

---

## 🎯 What Was Implemented

✅ **5 Schema Types** on Homepage:
1. **Organization** - Business identity + contact info
2. **WebPage + CollectionPage** - Homepage with ItemList
3. **BreadcrumbList** - Home → Nieuws hierarchy
4. **SiteNavigationElement** - Main menu structure
5. **ItemList** (mainEntity) - 10 latest articles

---

## 📁 Files Modified/Created

| File | Type | Purpose |
|------|------|---------|
| `src/components/SEO/HomepageSchema.tsx` | NEW | Schema generator component |
| `src/lib/api.ts` | NEW | Server-side data fetcher |
| `src/app/page.tsx` | UPDATED | Integrated schema + ISR 300s |

---

## 🚀 Key Features

| Feature | Benefit |
|---------|---------|
| **ISR 300s** | Auto-refresh every 5 minutes |
| **ItemList (10 articles)** | "Top stories" rich results |
| **BreadcrumbList** | Breadcrumb SERP display |
| **SiteNavigationElement** | Clear menu structure for Google |
| **hasPart (4 sections)** | Improved sitelinks |
| **Minimal Data** | Only slug + title (fast) |

---

## 🧪 Testing Commands

### 1. Build & Check
```bash
npm run build
# Check for schema errors in output
```

### 2. Rich Results Test
```
https://search.google.com/test/rich-results
```
Enter: `https://politie-forum.nl`

Expected:
- ✅ Organization
- ✅ BreadcrumbList
- ✅ ItemList (10 items)

### 3. Schema Validator
```
https://validator.schema.org/
```
Paste homepage HTML source

---

## 📊 Schema Structure (Simplified)

```json
{
  "@graph": [
    {
      "@type": "Organization",
      "name": "Politie Forum Nederland",
      "logo": {...},
      "address": {...},
      "sameAs": [...]
    },
    {
      "@type": ["WebPage", "CollectionPage"],
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          // 10 latest articles
        ]
      },
      "hasPart": [
        // Nieuws, Categorieën, Over, Contact
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    },
    {
      "@type": "SiteNavigationElement",
      "name": ["Nieuws", "Categorieën", "Over", "Contact"],
      "url": [...]
    }
  ]
}
```

---

## 🔄 How ISR Works

1. **Build Time**: Generate static HTML with 10 latest articles
2. **Runtime (0-300s)**: Serve cached version
3. **300s Mark**: Next request triggers rebuild
4. **New Build**: Fetch 10 latest articles → Update JSON-LD → Cache new HTML
5. **Repeat**: Every 5 minutes

**Result**: Always fresh schema, no manual deployment needed.

---

## 📈 Expected SEO Impact

| Timeline | Result |
|----------|--------|
| **24 hours** | Google crawls new schema |
| **1-2 days** | Breadcrumbs appear in SERP |
| **1-2 weeks** | ItemList → "Top stories" eligible |
| **2-4 weeks** | Enhanced sitelinks |

---

## 🔧 Customization

### Change ISR Timing
```typescript
// src/app/page.tsx
export const revalidate = 300; // Change this (seconds)
```

### Change Article Count
```typescript
// src/app/page.tsx
getFeaturedArticles(10) // Change to 5, 15, 20, etc.
```

### Add More hasPart Sections
```typescript
// src/components/SEO/HomepageSchema.tsx
const hasPart = [
  {
    "@type": "WebPage",
    "@id": `${baseUrl}/new-page`,
    name: "New Page",
    url: `${baseUrl}/new-page`,
    description: "Description here"
  },
  // ... existing sections
];
```

---

## 🐛 Troubleshooting

### Schema Not Detected in Rich Results Test

**Check**:
1. JSON-LD in HTML source? (View Page Source → Search `"@type": "ItemList"`)
2. Valid JSON? (Copy JSON-LD → Paste in https://jsonlint.com/)
3. ISR triggered? (Wait 5 min after deployment)

### Articles Not Updating

**Check**:
1. ISR revalidation timing: `export const revalidate = 300;`
2. Firebase connection: `getLatestArticles()` returns data?
3. Build logs: `npm run build` shows no errors?

### Breadcrumbs Not Showing

**Check**:
1. BreadcrumbList in HTML source?
2. Wait 24-48 hours after deployment (Google cache)
3. Submit sitemap to Search Console

---

## 📝 Maintenance

### When Schema Auto-Updates ✅
- New articles published
- Content changes
- `dateModified` timestamp

### When Manual Update Needed ⚠️
- Adding new top-level pages → Update `hasPart`
- Changing main menu → Update `SiteNavigationElement`
- Business info changes → Update `Organization`

---

## 🔗 Related Docs

- **Full Guide**: `MD/HOMEPAGE-SCHEMA-IMPLEMENTATION.md`
- **SEO Audit**: `MD/SEO-AUDIT-FINAL-OCT-9-2025.md`
- **Article Schemas**: `MD/ADVANCED-SCHEMA-IMPLEMENTATION.md`

---

## ⚡ Next Steps

1. **Deploy**: `vercel --prod`
2. **Test**: Rich Results Tool + Schema Validator
3. **Monitor**: Google Search Console → Enhancements
4. **Wait**: 1-2 days for breadcrumbs, 1-2 weeks for "Top stories"

---

**Status**: ✅ Ready for Production
