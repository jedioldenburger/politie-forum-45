# Hybrid Vercel + Firebase Deployment Guide

## 🎯 Overview

This project uses a **hybrid deployment strategy**:
- **Vercel**: Primary hosting with SSR/ISR capabilities
- **Firebase Hosting**: Static export mirror for CDN fallback

Both platforms share **identical caching rules** ensuring consistent performance globally.

---

## 📦 Configuration Files

### 1. **Vercel (`vercel.json`)**
```json
{
  "headers": [
    {
      "source": "/(.*)\\.@(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2|ttf)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "cleanUrls": true
}
```

### 2. **Firebase (`firebase.json`)**
```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2|ttf)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      }
    ]
  }
}
```

### 3. **Next.js (`next.config.js`)**
Already configured with matching cache headers via `async headers()`.

---

## 🚀 Deployment Commands

### Deploy to Vercel (Primary)
```bash
npm run deploy:vercel
# or
npm run build
vercel --prod
```

### Deploy to Firebase (Mirror)
```bash
npm run deploy:firebase
# or
npm run build:firebase  # builds + exports
firebase deploy --only hosting
```

### Deploy to Both (Recommended)
```bash
npm run deploy:all
```

---

## 📊 Caching Strategy

| Resource Type | Cache Duration | Strategy |
|--------------|----------------|----------|
| **HTML** | 0 seconds | `must-revalidate` |
| **JS/CSS** | 1 year | `immutable` |
| **Images** | 1 year | `immutable` |
| **Fonts** | 1 year | `immutable` |
| **Service Worker** | 0 seconds | `must-revalidate` |

### Why This Works

1. **Immutable Static Assets**
   - All JS/CSS/images have hashed filenames (`main.abc123.js`)
   - 1-year cache = instant repeat visits
   - New deploy = new hash = automatic cache bust

2. **Fresh HTML**
   - HTML always revalidates (0 seconds cache)
   - Ensures users get latest navigation/content
   - Still benefits from fast static assets

3. **Service Worker**
   - Never cached by CDN (must-revalidate)
   - Can update itself and cache strategies
   - Provides offline support

---

## 🛠️ Service Worker v2.0

### Features

- **Network-first for HTML** - Always get latest version
- **Cache-first for assets** - Instant load from cache
- **Offline fallback** - `/offline.html` when disconnected
- **Smart precaching** - Critical assets cached on install
- **Auto-cleanup** - Old caches removed on activation

### Cache Version Management

Update version in `/public/sw.js` when deploying:
```javascript
const CACHE_VERSION = 'v2'; // Increment on each deploy
```

This forces all clients to download fresh cache.

---

## 📱 Progressive Web App (PWA)

### Manifest Configuration

Located at `/public/manifest.webmanifest`:
```json
{
  "name": "Politie Forum Nederland",
  "short_name": "Politie Forum",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#001f5c",
  "background_color": "#ffffff",
  "icons": [...]
}
```

### Installation

Users can "Add to Home Screen" on:
- iOS Safari
- Android Chrome
- Desktop Chrome/Edge

---

## 🔍 Testing & Validation

### 1. Test Service Worker
```bash
# Start local server
npm run build
npm start

# Open http://localhost:3001
# Chrome DevTools → Application → Service Workers
# Verify "activated and running"
```

### 2. Test Offline Mode
```bash
# In Chrome DevTools:
# Network tab → Throttling → Offline
# Refresh page → should show /offline.html
```

### 3. Test Cache Headers
```bash
# Vercel
curl -I https://politie-forum.nl/_next/static/css/main.css
# Should see: Cache-Control: public, max-age=31536000, immutable

# Firebase (after deploy)
curl -I https://politie-forum-45.web.app/_next/static/css/main.css
# Should match Vercel headers
```

### 4. Run Lighthouse
```bash
npm run lighthouse
npm run lighthouse:mobile

# Check scores:
# Performance: 90+
# PWA: 100
# Accessibility: 98+
```

---

## 📈 Performance Expectations

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **FCP** | 2.8s | ~1.8s | -1.0s |
| **LCP** | 4.8s | ~3.0s | -1.8s |
| **TBT** | 410ms | ~70ms | -340ms |
| **CLS** | 0 | 0 | Maintained |
| **Performance Score** | 66 | **90+** | +24 points |

---

## 🌐 Domain Configuration

### Vercel
- **Primary**: https://politie-forum.nl
- **Preview**: https://politie-forum.vercel.app

### Firebase
- **Primary**: https://politie-forum-45.web.app
- **Custom**: Configure in Firebase Console → Hosting

---

## 🔄 Update Workflow

### Standard Deployment
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build and test
npm run build
npm start

# 4. Deploy to Vercel (primary)
npm run deploy:vercel

# 5. (Optional) Deploy to Firebase (mirror)
npm run deploy:firebase
```

### Emergency Rollback

**Vercel**: Instant rollback via dashboard
```bash
vercel rollback
```

**Firebase**: Redeploy previous version
```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION TARGET_SITE_ID
```

---

## ⚡ Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server (port 3001)

# Building
npm run build                  # Next.js production build
npm run build:firebase         # Build + export for Firebase
npm run build:analyze          # Analyze bundle size

# Deployment
npm run deploy:vercel          # Deploy to Vercel
npm run deploy:firebase        # Deploy to Firebase
npm run deploy:all             # Deploy to both

# Testing
npm run lighthouse             # Run Lighthouse desktop
npm run lighthouse:mobile      # Run Lighthouse mobile
npm start                      # Test production build locally

# Optimization
./scripts/optimize-images.sh   # Convert images to WebP
```

---

## 🎯 Best Practices

### 1. Always Increment SW Version
```javascript
// public/sw.js
const CACHE_VERSION = 'v3'; // Change on each deploy
```

### 2. Test Offline First
Before deploying, verify offline functionality locally.

### 3. Monitor Web Vitals
Check `/api/analytics/vitals` for real user metrics.

### 4. Compress Images
```bash
./scripts/optimize-images.sh
```

### 5. Review Build Output
Check for unexpected bundle size increases:
```bash
npm run build:analyze
```

---

## 🐛 Troubleshooting

### Service Worker Not Updating
```javascript
// Clear old SW and refresh
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
location.reload(true);
```

### Cache Not Clearing
- Increment `CACHE_VERSION` in `sw.js`
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache manually

### Headers Not Applied
- Verify `vercel.json` / `firebase.json` syntax
- Check deployment logs
- Test with `curl -I <url>`

---

## ✅ Checklist Before Deploy

- [ ] Service Worker version incremented
- [ ] Images optimized (WebP/AVIF)
- [ ] Build succeeds without errors
- [ ] Lighthouse score 90+
- [ ] Offline mode works
- [ ] Web Vitals monitored
- [ ] No console errors
- [ ] Cache headers verified

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)

---

**Status**: ✅ Production Ready
**Last Updated**: October 13, 2025
**Version**: 2.0.0 (Enhanced with hybrid deployment)
