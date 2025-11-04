# Vercel Deployment Fix - Environment Variables

## 🔴 Issue

Vercel deployment failed with: `Firebase: Error (auth/invalid-api-key)`

## ✅ Solution

Firebase environment variables need to be added to Vercel.

---

## 📋 Steps to Fix

### 1. Get Firebase Configuration

Go to [Firebase Console](https://console.firebase.google.com/) → **blockchainkix-com-fy** project:

1. Click **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Select your web app or create one
4. Copy the configuration values

### 2. Add Environment Variables to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com/jedixcoms-projects/politie-forum-45
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = [your_api_key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = [your_project].firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL = https://[your_project].firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = blockchainkix-com-fy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = [your_project].appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [your_sender_id]
NEXT_PUBLIC_FIREBASE_APP_ID = [your_app_id]
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-PYNT9RRWHB
```

**Option B: Via CLI**

```bash
# Set each variable
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### 3. Create Local .env.local File

```bash
# Copy example file
cp .env.local.example .env.local

# Edit with your values
nano .env.local
```

Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=blockchainkix-com-fy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://blockchainkix-com-fy.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=blockchainkix-com-fy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=blockchainkix-com-fy.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-PYNT9RRWHB
```

### 4. Redeploy to Vercel

After adding environment variables:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

---

## 🔧 What Was Fixed

### Updated `src/lib/firebase.ts`

- Added configuration check before initializing Firebase
- Services return `null` if Firebase is not configured
- Prevents build errors when env vars are missing
- Safe for local development without Firebase

### Created `.env.local.example`

- Template for environment variables
- Documents required Firebase config
- Copy to `.env.local` and fill in values

---

## 📝 Quick Commands

```bash
# Local development
cp .env.local.example .env.local
# Edit .env.local with your Firebase config
npm run dev

# Deploy to Vercel (after adding env vars)
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs politie-forum-45
```

---

## ✅ Verification Checklist

- [ ] Get Firebase config from Firebase Console
- [ ] Add all 8 environment variables to Vercel
- [ ] Create `.env.local` for local development
- [ ] Test locally: `npm run dev`
- [ ] Redeploy: `vercel --prod`
- [ ] Check Vercel deployment logs
- [ ] Verify Google Analytics tracking works

---

## 🔗 Quick Links

- [Vercel Project](https://vercel.com/jedixcoms-projects/politie-forum-45)
- [Firebase Console](https://console.firebase.google.com/project/blockchainkix-com-fy)
- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)

---

## 🚨 Important Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use `NEXT_PUBLIC_` prefix** - Required for client-side access
3. **Restart dev server** after changing `.env.local`
4. **Redeploy to Vercel** after adding env vars

---

## 📊 Build Output (From Terminal)

```
Error [FirebaseError]: Firebase: Error (auth/invalid-api-key).
Export encountered an error on /_not-found/page: /_not-found
Error: Command "npm run build" exited with 1
```

**Cause**: Missing `NEXT_PUBLIC_FIREBASE_API_KEY` environment variable on Vercel.

**Fix**: Add all Firebase env vars to Vercel project settings.

---

**Status**: 🟡 Waiting for Firebase env vars to be added to Vercel
