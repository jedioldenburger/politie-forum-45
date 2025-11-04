# Analytics Cleanup - GTM Removed, GA4 Only (Oct 13, 2025)

## ✅ Changes Completed

### 1. **Removed Google Tag Manager (GTM)**
- **Container ID Removed**: `GTM-WQVFTQSS`
- **Files Modified**:
  - `src/app/layout.tsx` - Removed GTM script and noscript iframe
  - Removed `requestIdleCallback` GTM loader
  - Removed GTM preconnect link

### 2. **Kept Only Google Analytics 4 (GA4)**
- **Measurement ID**: `G-PYNT9RRWHB` ✅
- **Implementation**: Inline script in `layout.tsx` (optimized)
- **Configuration**:
  ```javascript
  gtag('config', 'G-PYNT9RRWHB', {
    send_page_view: true,
    anonymize_ip: true
  });
  ```
- **Loading**: Async script tag for performance

### 3. **Removed Duplicate GoogleAnalytics Component**
- **Deleted from**:
  - `src/app/page.tsx` - Removed import and component
  - `src/app/forum/page.tsx` - Removed import and component
- **Reason**: GA4 already loaded globally in `layout.tsx`
- **Impact**: No more double page view tracking

### 4. **Crime Map Optimization**
- **Removed**: `LazyMiniCrimeMap` component (interactive map)
- **Replaced with**: Static SVG placeholder with icon
- **Files Modified**: `src/app/forum/ForumClient.tsx`
- **Benefits**:
  - ✅ Instant load (no JS execution)
  - ✅ No map tile API calls on homepage
  - ✅ Reduced bundle size (~3 KB)
  - ✅ Still clickable to full interactive map page

## 📊 Build Results

**Before**:
- Homepage: 1.87 kB + 219 kB JS
- Forum: 217 kB JS
- GTM + GA4 + GoogleAnalytics component

**After**:
- Homepage: 1.86 kB + 216 kB JS ✅ (-3 KB)
- Forum: 214 kB JS ✅ (-3 KB)
- GA4 only (single implementation)

## 🎯 Current Analytics Setup

### Google Analytics 4 (GA4)
**Location**: `src/app/layout.tsx` (lines ~200-220)

```tsx
{/* Google Analytics 4 (GA4) - Optimized inline tracking */}
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PYNT9RRWHB', {
        send_page_view: true,
        anonymize_ip: true
      });
    `
  }}
/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-PYNT9RRWHB" />
```

### Web Vitals Reporting
- **Component**: `src/components/WebVitalsReporter.tsx` ✅
- **API**: `/api/analytics/vitals` ✅
- **Metrics**: FCP, LCP, CLS, FID, TTFB, INP

### Route Change Tracking
- **Component**: `src/components/Analytics.tsx` ✅
- **Function**: `trackPageView()` on navigation

## 🔧 Crime Map Preview

**Component**: `src/app/forum/ForumClient.tsx` (line ~410)

```tsx
<div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
  {/* Static map placeholder - instant load, no JS overhead */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <svg className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interactieve Misdaadkaart</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Klik voor volledige kaart</p>
    </div>
  </div>
</div>
```

**Benefits**:
- Pure HTML/CSS (no React component)
- Gradient background for visual interest
- Map icon to indicate functionality
- Text labels for clarity
- Fully accessible

## 📈 Expected Performance Impact

### Lighthouse Improvements
- **TBT**: -10-20ms (no GTM JavaScript execution)
- **Bundle Size**: -3 KB (no LazyMiniCrimeMap)
- **Network**: -1 request (no duplicate GA4)
- **Score**: Expected 97 → 98 Performance

### User Experience
- ✅ Faster initial page load
- ✅ No map tile loading delay on homepage
- ✅ Cleaner analytics data (no duplicates)
- ✅ Simpler tracking setup

## 🚀 Deployment

**Build Status**: ✅ Successful
```
✓ Compiled successfully in 4.8s
✓ Generating static pages (27/27)
```

**Ready for Production**:
```bash
vercel --prod
```

**Post-Deploy Verification**:
1. Check GA4 in Real-Time view: https://analytics.google.com
2. Verify no GTM requests in DevTools Network tab
3. Confirm crime map placeholder displays correctly
4. Run Lighthouse: `lighthouse https://politie-forum.nl --view`

## 📝 Summary

**Removed**:
- ❌ Google Tag Manager (GTM-WQVFTQSS)
- ❌ Duplicate GoogleAnalytics component
- ❌ LazyMiniCrimeMap interactive widget

**Kept**:
- ✅ Google Analytics 4 (G-PYNT9RRWHB)
- ✅ Web Vitals reporting
- ✅ Route change tracking
- ✅ Crime map link (static placeholder)

**Result**: Cleaner, faster, simpler analytics with same tracking capabilities.

---

**Status**: ✅ Complete
**Build**: ✅ Successful
**Date**: October 13, 2025
**Next**: Deploy to production
