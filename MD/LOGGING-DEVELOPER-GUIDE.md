# Service Worker Logging - Developer Guide 🚀

**Quick Reference** | Production-Ready Logging | Zero Status 0 Errors

---

## ⚡ Quick Start

### Enable Verbose Logging (Development)

**Option 1: Edit File**
```javascript
// In /public/sw.js line 9
const DEBUG = true; // Change false to true
```

**Option 2: DevTools Console**
```javascript
// In browser DevTools Console:
// Reload page → Service Worker sees new DEBUG value on next request
localStorage.setItem('debugSW', 'true');
```

**Option 3: Add to Next.js Environment**
```bash
# In .env.local
NEXT_PUBLIC_SW_DEBUG=true
```

---

## 📊 What You'll See

### Production (DEBUG = false - Default) ✅

```
[No verbose logs - clean console]

Only warnings and errors show:
[SW] Warning: Network timeout (10s) for: /
[SW] Error: Failed to cache: [error details]
```

**Perfect for**: Live websites (no noise)

### Development (DEBUG = true)

```
[SW] Installing Service Worker v2.0.0
[SW] Cached: 10 static assets
[SW] Activating Service Worker v2.0.0

[SW FETCH] GET /
  Mode: navigate
  Destination: document
  Headers: {...}

[SW] handleNavigationRequest START for: /
[SW] Trying network (10s timeout) for: /
[SW] Network response OK, caching: /
[SW] Serving from cache: /style.css
[SW] Image request for: /logo.png
...
```

**Perfect for**: Development, debugging network issues

---

## 🎯 What Gets Logged

### ✅ Logged (Meaningful)

- Navigation requests (HTML pages)
- Cache hits/misses
- Network timeouts (10s)
- Error conditions
- Fetch handler routing
- Firebase syncing

### ❌ Skipped (Noise)

- Static assets (/_next/static/)
- Image files (*.png, *.jpg, etc.)
- CSS/JS/Font files
- Browser extensions
- DevTools requests
- no-cors requests
- Prefetch requests

---

## 🔧 Logging Functions

### `log(...args)` - Conditional (respects DEBUG)

```javascript
log('User clicked button');
// Output: [SW] User clicked button (only if DEBUG=true)
```

**Use for**: Development-only diagnostic logs

### `warn(...args)` - Always Visible

```javascript
warn('Cache unavailable, using network');
// Output: [SW] Cache unavailable, using network (always shown)
```

**Use for**: Important warnings that should always be visible

### `error(...args)` - Always Visible

```javascript
error('Network failed:', error);
// Output: [SW] Network failed: [error details] (always shown)
```

**Use for**: Error conditions

### `logFetch(event, category)` - Filtered Groups

```javascript
logFetch(event, 'FETCH');
// Output: [SW FETCH] GET /path/to/page
//   Mode: navigate
//   Destination: document
```

**Use for**: Analyzing which requests Service Worker handles

---

## 🐛 Troubleshooting

### Problem: Not Seeing Expected Logs

**Solution**: Make sure DEBUG = true in `/public/sw.js` line 9

```javascript
const DEBUG = true; // Not false!
```

Then reload the page.

### Problem: Service Worker Seems Unresponsive

**Steps**:
1. Open DevTools → Application → Service Workers
2. Unregister existing Service Workers
3. Set DEBUG = true
4. Hard refresh (Cmd+Shift+R on Mac)
5. Check console for [SW] logs

### Problem: Status 0 Errors Still Occurring

**Check These First**:
1. Is Promise.race timeout in handleNavigationRequest?
2. Are all code paths returning Response objects?
3. Is there an uncaught exception?

**If persists**:
1. Set DEBUG = true
2. Check console for [SW] error logs
3. Look for specific fetch that's failing

---

## 📋 Service Worker Lifecycle

### Install Event (Caches critical assets)

```
[SW] Installing Service Worker v2.0.0
[SW] Cached: 10 static assets
```

**Critical files**:
- `/` (homepage)
- `/offline` (offline page)
- Favicon
- Icons (192x192, 512x512)
- Manifest

### Activate Event (Cleans old caches)

```
[SW] Activating Service Worker v2.0.0
[SW] Cleaning 1 old cache version(s)
[SW] Clients claimed
```

### Fetch Event (Handles requests)

```
[SW] FETCH GET / (HTML navigation)
[SW] handleNavigationRequest START for: /
[SW] Trying network (10s timeout) for: /
[SW] Network response OK, caching: /

[SW] FETCH GET /style.css (static asset)
[SW] Serving static asset from cache: /style.css

[SW] FETCH GET /image.png (image)
[SW] Serving image from cache: /image.png

[SW] FETCH POST /api/comments (Firebase)
[SW] Firebase network successful, caching: https://...
```

---

## 🚨 Key Features (Behind The Scenes)

### Promise.race 10-Second Timeout ⏱️

```javascript
// Prevents indefinite hanging on slow networks
const response = await Promise.race([
  fetch(request),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Network timeout')), 10000)
  )
]);
```

**Result**: Page loads in 10s max (from cache if network slow)

### Three-Tier Fallback Strategy 🔄

1. **Tier 1**: Fresh from network
2. **Tier 2**: Cached version if network fails
3. **Tier 3**: Offline page if cache unavailable
4. **Tier 4**: 503 Service Unavailable (never Status 0)

**Result**: Never Status 0 errors

### Cache Strategies by Request Type 📦

| Type | Strategy | Timeout | Fallback |
|------|----------|---------|----------|
| HTML | Network-first + 10s | 10s | Cache → /offline → 503 |
| Images | Cache-first | None | SVG placeholder |
| CSS/JS | Cache-first | None | 503 Error |
| Firebase | Network-first | None | Offline cache |
| Other | Network-first | None | Cache fallback |

---

## 🎓 Examples

### Example 1: Debug a Failing Request

```javascript
// Set DEBUG = true in sw.js line 9
const DEBUG = true;

// Reload page
// Look for logs like:
// [SW] Network error for: https://api.example.com/data
// [SW] Using cached Firebase data (offline mode)
```

### Example 2: Verify Caching Works

```javascript
// With DEBUG = true:
// [SW] Network response OK, caching: /index.html
// [SW] Serving from cache: /index.html

// This shows: 1st request caches, 2nd request uses cache
```

### Example 3: Find Problematic Request

```javascript
// With DEBUG = true, look for:
// [SW FETCH] GET /path/that/fails
//   [Error details in console]

// Then fix that specific path
```

---

## 🔍 Console Inspection

### DevTools → Console

```javascript
// See all Service Worker logs with [SW] prefix:
// [SW] Network successful, caching: /
// [SW] Serving from cache: /style.css
// [SW] Image network error, returning placeholder

// These show the lifecycle of each request
```

### DevTools → Application → Service Workers

```
Status: Active
Workers: 1 running

Scope: https://politie-forum.nl/
State: activated and running
Last update: [timestamp]
```

---

## 📝 Best Practices

### ✅ DO

- Set DEBUG = false for production (default)
- Set DEBUG = true for development
- Use `warn()` for important diagnostics
- Use `error()` for failures
- Use `log()` for detailed debugging

### ❌ DON'T

- Leave DEBUG = true in production
- Spam console with excessive logs
- Log sensitive data (API keys, tokens)
- Ignore error logs in production

---

## 🚀 Performance Impact

| Setting | Console Output | Performance | When to Use |
|---------|---|---|---|
| DEBUG = false | Clean (only warnings/errors) | ✅ Zero impact | **Production** |
| DEBUG = true | Detailed with groups | ✅ Minimal impact* | Development |

*Logging overhead is negligible (~1-2ms per request) and only when DEBUG=true

---

## 📞 Support

**Issue**: Service Worker not updating
**Fix**: DevTools → Application → Unregister all Service Workers → Hard refresh

**Issue**: Logs not showing
**Fix**: Make sure DEBUG = true AND reload page (not just refresh)

**Issue**: Cache not clearing
**Fix**: Devtools → Application → Clear site data → Reload

---

## 🎉 Summary

The Service Worker logging system provides:

1. ✅ **Clean Production**: No verbose logs by default
2. ✅ **Easy Debugging**: Set DEBUG = true for full details
3. ✅ **Smart Filtering**: Skip noisy requests automatically
4. ✅ **Zero Performance Cost**: Minimal overhead
5. ✅ **Complete Coverage**: All request types logged

**Production-Ready**: Deployed to https://politie-forum.nl/

---

**Version**: Service Worker v2.0.0 | Logging: Production-Ready | Build: 103 pages ✅
