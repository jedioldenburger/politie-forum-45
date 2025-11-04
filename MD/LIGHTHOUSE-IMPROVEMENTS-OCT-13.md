# Lighthouse Performance Improvements - October 13, 2025

## Current Scores (Mobile)
- **Performance:** 82/100 ⚠️
- **Accessibility:** 92/100 ⚠️
- **Best Practices:** 96/100 ⚠️
- **SEO:** 100/100 ✅

## Improvements Made

### 1. Security Headers ✅
- Added **HSTS** (HTTP Strict Transport Security) with 1-year max-age
- Enhanced **CSP** with Trusted Types for DOM-based XSS protection
- Maintained Firebase Auth compatibility with `same-origin-allow-popups`

### 2. Caching Strategy ✅
- **HTML pages:** `public, max-age=0, must-revalidate` (always fresh)
- **Static assets:** `public, max-age=31536000, immutable` (1 year cache)
- **Images:** Already configured with 1-year minimum cache TTL

### 3. Favicon & Manifest ✅
- Switched to `/favicon.ico` as primary favicon
- Using `/manifest.webmanifest` for PWA
- Added `favicon.ico` to manifest icons array
- Removed unused files (`manifest.ts`, `manifest.json`)
- Fixed broken `mask-icon` reference

### 4. Organization Schema ✅
- Added missing `image` field to Organization JSON-LD
- Now 100% compliant with Google's Local Business schema

## Remaining Issues & Recommendations

### Performance (82 → Target: 90+)

**Key Metrics:**
- FCP: 2.3s (target: <1.8s)
- LCP: 4.3s (target: <2.5s) ⚠️ **CRITICAL**
- TBT: 110ms (target: <200ms) ✅
- CLS: 0 ✅ **PERFECT**

**Action Items:**

1. **Reduce LCP (Est. 1.5s improvement)**
   ```typescript
   // Preload critical resources in layout.tsx
   <link rel="preload" href="/logo.svg" as="image" />
   <link rel="preload" href="/_next/static/css/app.css" as="style" />
   ```

2. **Optimize Images (Est. 97 KiB savings)**
   - Convert large PNGs to WebP/AVIF (already configured)
   - Use `next/image` for all images (not just some)
   - Implement lazy loading for below-the-fold images

3. **Reduce JavaScript (Est. 226 KiB unused)**
   - Use dynamic imports for heavy components:
     ```typescript
     const CommentThread = dynamic(() => import('@/components/CommentThread'), {
       loading: () => <p>Loading...</p>,
     });
     ```
   - Tree-shake Firebase SDK (use modular imports)

4. **Defer Offscreen Images (Est. 138 KiB)**
   - Already using `next/image` with automatic lazy loading
   - Ensure all images use `loading="lazy"` attribute

5. **Remove Legacy JavaScript (Est. 12 KiB)**
   ```javascript
   // In next.config.js, add:
   compiler: {
     removeConsole: process.env.NODE_ENV === 'production',
   },
   ```

### Accessibility (92 → Target: 95+)

**Issues:**
1. **ARIA Labels Missing**
   - Buttons/links without accessible names
   - Add `aria-label` to icon-only buttons

2. **Color Contrast**
   - Some text doesn't meet WCAG AA standards
   - Check contrast ratios: https://webaim.org/resources/contrastchecker/

**Fix Example:**
```tsx
// Before
<button onClick={handleClick}>
  <Icon />
</button>

// After
<button onClick={handleClick} aria-label="Open menu">
  <Icon />
</button>
```

### Best Practices (96 → Target: 100)

**Issues:**
1. **Console Errors**
   - Browser errors logged to console (likely Firebase auth popups)
   - Suppress non-critical warnings in production

2. **CSP Effectiveness**
   - Added Trusted Types (✅ done)
   - Consider removing `'unsafe-inline'` for scripts (breaks Firebase currently)

## Next Steps

### High Priority (Will get you to 90+)
1. ✅ Add HSTS header (done)
2. ✅ Improve caching strategy (done)
3. ✅ Fix Organization schema (done)
4. ⏳ Optimize LCP by preloading critical resources
5. ⏳ Add missing ARIA labels
6. ⏳ Fix color contrast issues

### Medium Priority (Will get you to 95+)
7. ⏳ Implement dynamic imports for heavy components
8. ⏳ Remove console logs in production
9. ⏳ Convert large images to WebP/AVIF

### Low Priority (Nice to have)
10. ⏳ Tree-shake Firebase SDK
11. ⏳ Remove `'unsafe-inline'` from CSP
12. ⏳ Add service worker for offline support

## Testing Commands

```bash
# Local Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3001 --view

# Production audit
lighthouse https://politie-forum.nl --view

# Or use Chrome DevTools > Lighthouse tab
```

## Resources
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Status:** ✅ Security & caching improvements deployed
**Next:** Optimize LCP and add ARIA labels
