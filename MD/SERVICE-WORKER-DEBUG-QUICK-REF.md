# Service Worker Debug - Quick Reference

November 5, 2025

## What Changed

**Public/sw.js** - Service Worker v2.0.0 Enhanced:

1. ✅ Added Promise.race 10-second timeout to prevent hanging
2. ✅ Added comprehensive logging at every stage
3. ✅ Guaranteed valid response return from all handlers
4. ✅ Three-tier fallback: network → cache → offline page → 503
5. ✅ All error handlers wrapped with try-catch

## Quick Debug Steps

### 1. Open DevTools
```
F12 (or Cmd+Option+I on Mac)
```

### 2. Go to Console Tab

Look for logs starting with `[SW]`:

```
[SW INSTALL] Installing Service Worker v2.0.0
[SW INSTALL] CACHE_NAME: politie-forum-v2.0.0
[SW INSTALL] Caching critical assets
[SW ACTIVATE] Activating Service Worker v2.0.0
[SW ACTIVATE] Claiming all clients
```

### 3. Load Homepage
```
Navigate to: https://politie-forum.nl/
```

### 4. Check Network Tab

Should show:
```
Request: GET https://politie-forum.nl/
Status: 200 ✓ (NOT 0!)
Type: document
Size: ~15KB
```

### 5. Expected Console Logs

```
[SW FETCH] Request received: {
  method: 'GET',
  url: 'https://politie-forum.nl/',
  mode: 'navigate'
}
[SW FETCH] Using NAVIGATION handler for: https://politie-forum.nl/
[SW] handleNavigationRequest START for: https://politie-forum.nl/
[SW] Cache opened: politie-forum-v2.0.0-pages
[SW] Attempting network fetch for: https://politie-forum.nl/
[SW] Network response received: { status: 200, ok: true, statusText: 'OK' }
[SW] Response OK (200), caching: https://politie-forum.nl/
[SW] Returning network response for: https://politie-forum.nl/
```

## Cache Verification

Go to: **Application → Cache Storage**

Expected caches:
```
politie-forum-v2.0.0
├── https://politie-forum.nl/
├── https://politie-forum.nl/offline
├── https://politie-forum.nl/manifest.webmanifest
├── https://politie-forum.nl/favicon.ico
└── Images...
```

## Key Improvements

| Issue | Fix |
|-------|-----|
| Hanging requests | Promise.race with 10s timeout |
| No response returned | Guaranteed response in all paths |
| Silent failures | Comprehensive logging |
| Cache issues | Three-tier fallback strategy |
| Network errors | Proper error handlers everywhere |

## If Status 0 Still Shows

1. ✓ Clear browser cache: `Ctrl+Shift+Delete`
2. ✓ Unregister SW: DevTools → Application → Service Workers → Unregister
3. ✓ Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. ✓ Check console for `[SW]` errors
5. ✓ Check for browser extensions blocking requests

## Files Modified

- `/public/sw.js` - v2.0.0 with enhanced logging

## Build Status

✅ 103 pages compiled successfully
✅ Syntax valid (node -c check passed)
✅ No errors or warnings
