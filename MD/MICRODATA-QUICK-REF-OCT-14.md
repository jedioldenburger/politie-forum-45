# Microdata Consistency - Quick Reference

## ✅ What Was Fixed

### 1️⃣ Complete Microdata (ArticleClient.tsx)
```tsx
<article itemScope itemType="https://schema.org/NewsArticle">
  {/* Hidden meta tags - ALL fields now present */}
  <meta itemProp="image" content={imageUrl} />
  <meta itemProp="dateModified" content={toISO(...)} />
  <meta itemProp="url" content={articleUrl} />
  <meta itemProp="description" content={article.excerpt} />
  <meta itemProp="inLanguage" content="nl-NL" />
  <meta itemProp="isAccessibleForFree" content="true" />
  {/* keywords, publisher, mainEntityOfPage also added */}
</article>
```

### 2️⃣ ISO-8601 Datetime
```tsx
// BEFORE: <time dateTime="1760372439491">
// AFTER:  <time dateTime="2025-10-13T16:20:39+02:00">
<time dateTime={toISO(article.publishedAt)} itemProp="datePublished">
```

### 3️⃣ Author with URL
```tsx
<span itemProp="author" itemScope itemType="https://schema.org/Organization">
  <meta itemProp="name" content={article.author} />
  <meta itemProp="url" content={`${BASE_URL}/redactie`} />
  {article.author}
</span>
```

### 4️⃣ Clean ArticleBody (ArticleJsonLd.tsx)
```tsx
articleBody: article.content
  .replace(/<span class="sr-only"[^>]*>.*?<\/span>/gi, "") // Remove sr-only
  .replace(/<nav[^>]*>.*?<\/nav>/gi, "") // Remove nav
  .replace(/##\s*(FAQ|Vragen)[\s\S]*$/gi, "") // Remove FAQ sections
  .replace(/<[^>]*>/g, " ") // Strip HTML
  .slice(0, 500) + "..."
```

### 5️⃣ Removed SpeakableSpecification
```tsx
// DELETED (legacy/limited support):
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: [...]
}
```

### 6️⃣ Per-Article Images (page.tsx)
```tsx
// Use article-specific image if available
const imageUrl = article.imageUrl || `${BASE_URL}/og/politie-forum-1200x630.png`;
```

---

## 🎯 Result: 100% Microdata + JSON-LD Consistency

| Field | Status | Both Formats |
|-------|--------|--------------|
| headline | ✅ | JSON-LD + microdata |
| datePublished | ✅ | ISO-8601 everywhere |
| dateModified | ✅ | ISO-8601 everywhere |
| author | ✅ | Organization + url |
| image | ✅ | Both have imageUrl |
| description | ✅ | article.excerpt |
| url | ✅ | articleUrl |
| inLanguage | ✅ | "nl-NL" |
| isAccessibleForFree | ✅ | true |
| keywords | ✅ | tags array |
| publisher | ✅ | Full org + logo |
| mainEntityOfPage | ✅ | WebPage link |

---

## 📁 Files Changed

1. **ArticleClient.tsx** - Added complete microdata (11 meta tags + publisher + time fix + author fix)
2. **ArticleJsonLd.tsx** - Cleaned articleBody + removed SpeakableSpecification
3. **page.tsx** - Per-article image fallback + Twitter alt text

---

## 🚀 Deploy

```bash
npm run build  # ✅ Successful
vercel --prod  # Deploy to production
```

---

## 🔍 Validate

```bash
# Test with Google Rich Results Test
ngrok http 3001
# Paste ngrok URL into https://search.google.com/test/rich-results
```

**Expected**: 0 warnings, 2 valid NewsArticle entities (JSON-LD + microdata, 100% consistent)

---

**Date**: October 14, 2025
**Status**: ✅ Complete
**Build**: ✅ 28 pages, 3.5s
