# SEO Audit Priority Fixes - October 14, 2025

**Status**: 🔧 Implementation in progress
**Audit Date**: October 14, 2025
**Expected Impact**: High (Rich Results + Core Web Vitals + E-E-A-T)

---

## 🔴 HIGH IMPACT (Fix First)

### 1. ✅ Hreflang Cleanup
**Problem**: `nl-NL`, `nl-BE`, `nl`, `x-default` all point to same URL without separate content
**Fix**: Keep only `nl` + `x-default` (we serve Dutch content, no regional variants)

**Before**:
```html
<link rel="alternate" hrefLang="nl-NL" href="https://politie-forum.nl/" />
<link rel="alternate" hrefLang="nl-BE" href="https://politie-forum.nl/" />
<link rel="alternate" hrefLang="nl" href="https://politie-forum.nl/" />
<link rel="alternate" hrefLang="x-default" href="https://politie-forum.nl/" />
```

**After**:
```html
<link rel="alternate" hrefLang="nl" href="https://politie-forum.nl/" />
<link rel="alternate" hrefLang="x-default" href="https://politie-forum.nl/" />
```

---

### 2. ✅ Remove Duplicate Structured Data
**Problem**:
- JSON-LD in `<head>` (layout.tsx)
- Microdata in `<body>` (duplicate Organization)
- Potential second JSON-LD block

**Fix**:
- Keep ONLY JSON-LD in `<head>` (layout.tsx)
- Remove microdata `<div itemScope>` from body
- Consolidate all schemas in single @graph

**Files to update**:
- `src/app/layout.tsx` - Remove body microdata if exists
- Check for duplicate schema injections

---

### 3. ✅ Fix Multiple H1s
**Problem**: Header has `<h1>` + hero section has another `<h1>`

**Fix**:
```html
<!-- Header: Change to div -->
<div class="text-2xl font-bold">Politie Forum Nederland</div>

<!-- Hero: Keep single H1 -->
<h1 class="text-3xl font-bold">Welkom bij Politie Forum Nederland</h1>
```

**Files**: `src/components/Header.tsx`, `src/app/forum/ForumClient.tsx`

---

### 4. ✅ Remove Duplicate IDs
**Problem**: `id="locatie-en-tijd"` appears multiple times (invalid HTML)

**Fix**: Already implemented in news-rip.py with unique slugs:
```python
location_id = f"locatie-en-tijd-{article_slug}"
```

**Status**: ✅ Fixed (commit earlier today)

---

### 5. ✅ Remove Useless Preconnect
**Problem**: `<link rel="preconnect" href="/" crossorigin>` does nothing

**Fix**: Already removed in earlier commit

**Status**: ✅ Fixed

---

## 🟡 MEDIUM IMPACT (Quick Wins)

### 6. ✅ Remove Meta Keywords
**Problem**: Deprecated since 2009, adds noise

**Fix**: Remove entire `keywords` array from metadata

**File**: `src/app/layout.tsx`

---

### 7. ✅ Canonical Normalization
**Problem**: Inconsistent trailing slash usage

**Fix**: Standardize to **WITH trailing slash**:
```typescript
canonical: "https://politie-forum.nl/"
```

All internal links → `/` (with slash)
Server redirects → bare domain → `https://politie-forum.nl/` (301)

---

### 8. 🔧 Rich Breadcrumbs
**Current**: Only "Home" in breadcrumb
**Enhancement**: Add category/section paths when rendering category pages

**Implementation**: Dynamic breadcrumbs based on route

---

### 9. 🔧 FAQ Content Enhancement
**Problem**: Some FAQ answers are thin ("De locatie wordt vermeld...")

**Fix**: Enrich answers with actionable info:
```json
{
  "question": "Waar komt de nieuwsinhoud vandaan?",
  "answer": "We cureren nieuws uit o.a. politie.nl, rechtspraak.nl en grote NL-media en voegen context en discussie toe. Bronvermelding staat in elk artikel. Onze redactie controleert dagelijks op juistheid en actualiteit."
}
```

**File**: `src/components/HomepageFAQ.tsx`

---

### 10. ✅ LCP/CLS Optimization
**Current**: Good (Next Image + preloads)

**Enhancement**:
- Hero badge gets `priority` prop ✅
- Marquee has fixed height ✅
- fetchPriority="high" on critical images ✅

---

### 11. ✅ Consent Mode Verification
**Current**: Defaults set to 'denied' (GDPR compliant)

**Check**: Verify GA4 only fires after consent granted
**File**: `src/components/Analytics.tsx`

---

## 🟢 LOW IMPACT (Nice to Have)

### 12. Schema Consistency
**SiteNavigationElement**: Keep consistent with visible nav ✅

### 13. OG Image Optimization
**Current**: PNG 1200×630
**Future**: Consider WebP/AVIF for smaller size (not SEO-critical)

### 14. NAP Consistency
**Address**: Sint Olofssteeg 4, 1012AK Amsterdam
**Action**: Verify this matches all business listings OR remove if not physical location

### 15. Performance - Code Splitting
**Crime Map**: Load via `intersectionObserver` (lazy load when visible)
**Heavy widgets**: Defer non-critical JavaScript

---

## 📋 Implementation Checklist

**Layout.tsx** (`src/app/layout.tsx`):
- [ ] Simplify hreflang to `nl` + `x-default`
- [ ] Remove `keywords` metadata
- [ ] Verify no duplicate schema injections
- [ ] Remove body microdata if exists
- [ ] Canonical with trailing slash

**Header.tsx** (`src/components/Header.tsx`):
- [ ] Change site title from `<h1>` to `<div>` or `<span>`

**ForumClient.tsx** (`src/app/forum/ForumClient.tsx`):
- [ ] Ensure hero has single `<h1>` only
- [ ] Check for duplicate `id` attributes

**HomepageFAQ.tsx** (`src/components/HomepageFAQ.tsx`):
- [ ] Enrich thin FAQ answers with more detail

**HomepageSchema.tsx** (`src/components/SEO/HomepageSchema.tsx`):
- [ ] Verify ItemList doesn't use misleading `DiscussionForumPosting` on homepage
- [ ] Keep simple `ItemList` with article links

**News Article Pages** (`src/app/nieuws/[slug]/page.tsx`):
- [ ] Use `NewsArticle` schema (not `DiscussionForumPosting`)
- [ ] Ensure `mainEntityOfPage`, `datePublished`, `dateModified` present
- [ ] No `rel=canonical` to source (we create unique content)
- [ ] Clear source attribution visible

---

## 🎯 Content Strategy Checklist

- [ ] **E-E-A-T**: Create visible "Redactie" page with editorial guidelines
- [ ] **About Page**: Add transparency section (sources, fact-checking process)
- [ ] **Internal Links**: Use descriptive anchor text (not "Lees meer →")
- [ ] **Unique Content**: All article summaries are rewritten, not copied
- [ ] **Source Attribution**: Visible "Bron: politie.nl" in each article
- [ ] **Related Articles**: Link with descriptive text

---

## 📊 Expected Results

**After Implementation**:
- ✅ Google Rich Results Test: All green
- ✅ Search Console Structured Data: 0 errors
- ✅ Lighthouse SEO: 100/100
- ✅ Valid HTML5 (no duplicate IDs)
- ✅ Hreflang consistency
- ✅ Single H1 per page
- ✅ Clean schema (no duplicates)
- ✅ Better E-E-A-T signals

**Timeline**: 30 minutes implementation + testing

---

## 🔍 Validation Tools

After fixes, test with:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **W3C HTML Validator**: https://validator.w3.org/
4. **Lighthouse**: Run in Chrome DevTools
5. **Search Console**: Check "Enhancements" section

---

**Next Steps**: Implement all checkboxes, run validators, document results.
