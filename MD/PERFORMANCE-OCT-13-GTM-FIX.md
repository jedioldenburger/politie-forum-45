# Performance Optimization - Oct 13, 2025 (GTM Integration Fix)

## Lighthouse Report Analysis
- **Performance**: 67 → Target 85+
- **Accessibility**: 96 → Target 98+
- **Best Practices**: 96 → Target 100
- **SEO**: 100 ✅

## Issues Identified & Fixed

### 1. ❌ Service Worker Registration Failure
**Problem**: Console error - "ServiceWorker script evaluation failed"
- Syntax errors in `/public/sw.js`
- Duplicate event listener code
- Wrong cache prefix in cleanup

**Fix Applied**:
```javascript
// Fixed duplicate install event listener
// Changed cache prefix from 'politie-forum-' to 'pforum-cache-'
// Removed duplicate fetch event code
```

**Impact**: +5-10 Performance points (offline caching now works)

---

### 2. ❌ GTM Blocking Main Thread (350ms TBT)
**Problem**: Google Tag Manager causing:
- 464 KiB JavaScript transfer
- 350ms Total Blocking Time
- 7 long tasks (>50ms)
- Delayed FCP/LCP

**Fix Applied**:
```javascript
// OLD: GTM loaded synchronously in <head>
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-WQVFTQSS');</script>

// NEW: GTM deferred until window.load
window.addEventListener('load', function() {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WQVFTQSS';
  document.head.appendChild(s);
});
```

**Impact**: +15-20 Performance points (FCP/LCP improvement, TBT reduced)

---

### 3. ❌ Badge Contrast Failure (WCAG AAA)
**Problem**: "Forum Artikel" badges failing contrast check
- Foreground: `#b30000` (accent-700)
- Background: `#ffb3b3` (accent-100)
- Ratio: 4.23:1 (needs 4.5:1 minimum)

**Fix Applied**:
```css
/* OLD */
text-accent-700 /* #b30000 */

/* NEW */
text-accent-800 font-semibold /* #8b0000 - darker + bold */
```

**Files Updated**:
- `src/app/forum/ForumClient.tsx`
- `src/app/nieuws/[slug]/ArticleClient.tsx`
- `tailwind.config.ts` (accent-100 lightened, accent-800 darkened)

**Impact**: +2-4 Accessibility points

---

### 4. ⚠️ Legacy JavaScript Polyfills (11 KiB)
**Problem**: Next.js transpiling modern features unnecessarily
- `Array.prototype.at`
- `Array.prototype.flat`
- `Object.fromEntries`
- `String.prototype.trimStart/trimEnd`

**Fix Applied**:
```javascript
// next.config.js
transpilePackages: [], // Don't transpile for modern browsers
```

**Existing Config Already Optimal**:
```json
// package.json browserslist
"production": [
  "chrome >= 90",
  "firefox >= 88",
  "safari >= 14",
  "edge >= 90"
]
```

**Impact**: +5-8 Performance points (11 KiB removed)

---

### 5. ✅ Resource Hints Optimization
**Old Order**:
1. GTM script (blocking)
2. preconnect hints

**New Order**:
1. preconnect hints (FIRST)
2. GTM script (deferred)

**Impact**: +2-3 Performance points (earlier DNS resolution)

---

### 6. ❌ Render-Blocking CSS (10.2 KiB, 260ms)
**Problem**: `6bf69b5cc2a791fe.css` blocks rendering

**Cannot Fix Easily**: Next.js bundles CSS automatically. Would require:
- Critical CSS extraction (complex)
- Manual CSS splitting (breaks Next.js)

**Alternative**: Already using `font-display: swap` for fonts

---

### 7. ⚠️ Unused JavaScript (241 KiB)
**Problem**:
- GTM: 204.6 KiB unused
- Analytics: 98.7 KiB unused
- Firebase chunks: 36.8 KiB unused

**Mitigation**: GTM now deferred (not blocking initial load)

---

## Expected Results After Deploy

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **Performance** | 67 | 85+ | +18 |
| **Accessibility** | 96 | 98 | +2 |
| **Best Practices** | 96 | 100 | +4 |
| **SEO** | 100 | 100 | ✅ |
| **FCP** | 2.6s | <1.8s | -800ms |
| **LCP** | 5.3s | <2.5s | -2.8s |
| **TBT** | 350ms | <100ms | -250ms |
| **CLS** | 0.0 | 0.0 | ✅ |

---

## Files Modified

1. **`src/app/layout.tsx`**
   - GTM deferred to `window.load`
   - Resource hints reordered
   - Removed redundant preload

2. **`public/sw.js`**
   - Fixed syntax errors
   - Removed duplicate code
   - Fixed cache prefix

3. **`tailwind.config.ts`**
   - accent-100: `#ffb3b3` → `#ffd6d6` (lighter)
   - accent-800: `#990000` → `#8b0000` (darker)

4. **`src/app/forum/ForumClient.tsx`**
   - Badge: `text-accent-700` → `text-accent-800 font-semibold`

5. **`src/app/nieuws/[slug]/ArticleClient.tsx`**
   - Badge: `text-accent-700` → `text-accent-800 font-semibold`

6. **`next.config.js`**
   - Added `transpilePackages: []`
   - Ensured modern browser targeting

---

## Testing Commands

```bash
# Build and test locally
npm run build
npm start

# Run Lighthouse
npm run lighthouse

# Mobile test
npm run lighthouse:mobile

# Production test
lighthouse https://politie-forum.nl --view
```

---

## Remaining Optimizations (Future)

1. **Critical CSS Extraction** (Complex)
   - Inline above-the-fold CSS
   - Defer below-fold CSS
   - Tool: `critters` or manual extraction

2. **Firebase Chunk Splitting** (Medium)
   - Dynamic imports for non-critical Firebase features
   - Lazy load auth providers

3. **Image Optimization** (Already done)
   - AVIF/WebP ✅
   - Lazy loading ✅
   - `fetchPriority="high"` for LCP images ✅

4. **CDN for Static Assets** (Vercel handles this)
   - 1-year immutable cache ✅
   - Brotli compression ✅

---

## Monitoring

- **Google Analytics**: G-PYNT9RRWHB
- **Google Tag Manager**: GTM-WQVFTQSS
- **Web Vitals**: `/api/vitals` endpoint (client-side reporting)

---

**Status**: ✅ All fixes implemented, ready for build + deploy
**Expected Score**: Performance 85+, Accessibility 98+, Best Practices 100, SEO 100
**Last Updated**: October 13, 2025
