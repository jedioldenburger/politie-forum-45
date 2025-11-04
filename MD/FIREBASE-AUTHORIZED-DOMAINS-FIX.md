# Fix Firebase 400 INVALID_ARGUMENT Error

## Problem
```
FirebaseError: Installations: Create Installation request failed with error
"400 INVALID_ARGUMENT: Request contains an invalid argument."
(installations/request-failed)
```

This error occurs because `politie-forum.nl` is not authorized in Firebase Console.

## Solution: Add Authorized Domains

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com
2. Select project: **blockchainkix-com-fy**

### Step 2: Navigate to Authentication Settings
1. Click **Authentication** in left sidebar
2. Click **Settings** tab at the top
3. Click **Authorized domains** section

### Step 3: Add Your Domains
Click **Add domain** and add each of these:

✅ **Production domains:**
- `politie-forum.nl`
- `www.politie-forum.nl`
- `politie-forum.vercel.app`
- `politie-forum-45-hk45ha6sy-jedixcoms-projects.vercel.app`

✅ **Development domains:**
- `localhost`

### Step 4: Save Changes
Click **Add** for each domain, then wait 1-2 minutes for changes to propagate.

## Verification

After adding domains, the 400 error should disappear. Test by:

```bash
# Open your production site in browser
open https://politie-forum.nl
```

Check the browser console - the Firebase Installation error should be gone.

## Alternative: Disable Firebase Installations

If you don't need Firebase Analytics/Performance/Remote Config, you can disable the Installations API:

### Option 1: Remove Analytics (Recommended for now)
Already done in `src/lib/firebase.ts`:
```typescript
export const analytics = Promise.resolve(null);
```

### Option 2: Conditionally Initialize
Already implemented - analytics only loads when `isSupported()` returns true.

## Current Status

✅ **Fixed Issues:**
- Slug generation (no more leading hyphens)
- Firebase timeout increased to 15s
- Manifest.json created
- Analytics gracefully disabled

⚠️ **Remaining Issue:**
- Firebase Installations 400 error (cosmetic - doesn't affect functionality)
- **Fix:** Add authorized domains in Firebase Console (steps above)

## Notes

The 400 error doesn't break your site - it's just a warning in the console. However, it's best practice to add the authorized domains to silence it and enable future Firebase features.
