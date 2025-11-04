# Vercel Environment Variables Update Guide

## 🚨 Problem

Firebase authentication showing error:
```
Illegal url for new iframe - https://blockchainkix-com-fy.firebaseapp.com%0A/__/auth/iframe
```

The `%0A` in the URL means there's a newline character (`\n`) in the Firebase configuration.

## ✅ Local Files Status

- `.env.local` - ✅ Clean (no trailing `\n`)
- `.env.production` - ✅ Clean (no trailing `\n`)

## ⚠️ Issue: Vercel Dashboard Has Cached Old Values

Vercel's production environment still has the old values with `\n` characters from when they were first set.

## 🔧 Fix: Update Vercel Environment Variables

### Step 1: Access Vercel Dashboard

1. Go to: https://vercel.com/xcom/politie-forum/settings/environment-variables
2. Or: Navigate to your project → Settings → Environment Variables

### Step 2: Update These Variables (Production)

Delete and recreate these environment variables in the **Production** environment:

#### 1. NEXT_PUBLIC_FIREBASE_APP_ID
- **Current value** (has `\n`): `1:148890561425:web:44728e308ce134cf880830\n`
- **New value** (clean): `1:148890561425:web:44728e308ce134cf880830`

#### 2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- **Current value**: `blockchainkix-com-fy.firebaseapp.com\n`
- **New value**: `blockchainkix-com-fy.firebaseapp.com`

#### 3. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- **Current value**: `148890561425\n`
- **New value**: `148890561425`

#### 4. NEXT_PUBLIC_FIREBASE_PROJECT_ID
- **Current value**: `blockchainkix-com-fy\n`
- **New value**: `blockchainkix-com-fy`

#### 5. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- **Current value**: `blockchainkix-com-fy.appspot.com\n`
- **New value**: `blockchainkix-com-fy.appspot.com`

#### 6. REVALIDATE_SECRET
- **Current value**: `politie-forum-revalidate-2025-secret-key\n`
- **New value**: `politie-forum-revalidate-2025-secret-key`

### Step 3: Keep These Variables (Already Correct)

These don't need updating:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Already clean
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL` - Already clean
- `FIREBASE_SERVICE_ACCOUNT` - Already correct (internal `\n` are needed for the private key)

### Step 4: Redeploy

After updating the variables in Vercel dashboard:

```bash
cd /Users/_akira/CSAD/websites-new-2025/politie-forum-45
vercel --prod
```

Or simply trigger a redeploy from Vercel dashboard:
- Go to Deployments tab
- Click "Redeploy" on the latest deployment

## 🧪 Verification

After redeploying, test:

1. **Google Sign-In**: https://politie-forum.nl
   - Click "Inloggen" → "Google"
   - Should open Google auth popup (no iframe error)

2. **Check Console**:
   - Should NOT see: `Illegal url for new iframe`
   - Should NOT see: `%0A` in any URLs

3. **Revalidation API**:
   ```bash
   curl -X POST https://politie-forum.nl/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"politie-forum-revalidate-2025-secret-key","path":"/nieuws/test"}'
   ```
   - Should return: `{"revalidated": true}`
   - Should NOT return: `401 Unauthorized`

## 📋 Quick Copy-Paste Values

For easy copy-paste into Vercel dashboard:

```
NEXT_PUBLIC_FIREBASE_APP_ID
1:148890561425:web:44728e308ce134cf880830

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
blockchainkix-com-fy.firebaseapp.com

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
148890561425

NEXT_PUBLIC_FIREBASE_PROJECT_ID
blockchainkix-com-fy

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
blockchainkix-com-fy.appspot.com

REVALIDATE_SECRET
politie-forum-revalidate-2025-secret-key
```

## 🎯 Root Cause

When you ran `vercel env pull .env.production`, Vercel CLI added literal `\n` characters to the end of some string values. This is a known quirk of the Vercel CLI.

The fix is to manually update them in the dashboard where you can ensure clean values.

---

**After updating these 6 variables and redeploying, Firebase authentication will work correctly!** ✅
