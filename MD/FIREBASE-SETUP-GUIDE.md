# Firebase Setup Guide for Politie Forum

## Current Status

Your Firebase configuration is already set in `.env.local`:

- Project: `blockchainkix-com-fy`
- Database URL: `https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app`
- All credentials are configured ✅

## Issues to Fix

### 1. Environment Variables Not Loading in Production

The `.env.local` file only works locally. For Vercel production, you need to:

**Add environment variables to Vercel:**

```bash
# Run these commands:
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste: AIzaSyDCRYKrWUvtOtDAY4TThjlm7AxkzHG-62s

vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# Paste: blockchainkix-com-fy.firebaseapp.com

vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL
# Paste: https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app

vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# Paste: blockchainkix-com-fy

vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# Paste: blockchainkix-com-fy.firebasestorage.app

vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# Paste: 148890561425

vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
# Paste: 1:148890561425:web:44728e308ce134cf880830

vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
# Paste: G-PYNT9RRWHB
```

**Or add via Vercel Dashboard:**

1. Go to: https://vercel.com/jedixcoms-projects/politie-forum-45/settings/environment-variables
2. Add each variable from `.env.local`
3. Select "Production", "Preview", and "Development"
4. Click "Save"

### 2. Initialize Firebase Realtime Database

Your database is currently empty. You need to:

**Option A: Use the initialization script (I'll create this)**

- Run `npm run init-db` to populate sample categories and discussions

**Option B: Manually via Firebase Console**

1. Go to: https://console.firebase.google.com/project/blockchainkix-com-fy/database/blockchainkix-com-fy-default-rtdb/data
2. Import the sample data (see below)

### 3. Set Firebase Security Rules

Go to: https://console.firebase.google.com/project/blockchainkix-com-fy/database/blockchainkix-com-fy-default-rtdb/rules

Replace with:

```json
{
  "rules": {
    "categories": {
      ".read": true,
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    },
    "topics": {
      ".read": true,
      "$topicId": {
        ".write": "auth != null"
      }
    },
    "posts": {
      ".read": true,
      "$postId": {
        ".write": "auth != null"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "notifications": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
        ".write": "auth != null"
      }
    }
  }
}
```

## Sample Database Structure

```json
{
  "categories": {
    "cat1": {
      "name": "Algemeen",
      "description": "Algemene discussies over de politie en veiligheid in Nederland",
      "icon": "MessageSquare",
      "topicsCount": 12,
      "postsCount": 48,
      "order": 1,
      "createdAt": 1696291200000
    },
    "cat2": {
      "name": "Sollicitatie & Selectie",
      "description": "Tips en ervaringen over solliciteren, assessments en de selectieprocedure",
      "icon": "Users",
      "topicsCount": 23,
      "postsCount": 156,
      "order": 2,
      "createdAt": 1696291200000
    },
    "cat3": {
      "name": "Politieacademie",
      "description": "Alles over de opleiding, modules en de tijd op de academie",
      "icon": "TrendingUp",
      "topicsCount": 18,
      "postsCount": 92,
      "order": 3,
      "createdAt": 1696291200000
    },
    "cat4": {
      "name": "Werken bij de Politie",
      "description": "Ervaringen uit de praktijk, werkroosters en carrièremogelijkheden",
      "icon": "Shield",
      "topicsCount": 31,
      "postsCount": 187,
      "order": 4,
      "createdAt": 1696291200000
    },
    "cat5": {
      "name": "Vakbonden & Rechten",
      "description": "Informatie over politievakbonden, arbeidsvoorwaarden en rechtspositie",
      "icon": "Scale",
      "topicsCount": 9,
      "postsCount": 34,
      "order": 5,
      "createdAt": 1696291200000
    },
    "cat6": {
      "name": "Specialisaties",
      "description": "Recherche, ME, hondengeleider, verkeer en andere specialismen",
      "icon": "Target",
      "topicsCount": 15,
      "postsCount": 67,
      "order": 6,
      "createdAt": 1696291200000
    },
    "cat7": {
      "name": "Techniek & Middelen",
      "description": "Politie-uitrusting, voertuigen, ICT en technische innovaties",
      "icon": "Cpu",
      "topicsCount": 7,
      "postsCount": 28,
      "order": 7,
      "createdAt": 1696291200000
    },
    "cat8": {
      "name": "Off Topic",
      "description": "Alles wat niet direct met politie te maken heeft",
      "icon": "Coffee",
      "topicsCount": 14,
      "postsCount": 53,
      "order": 8,
      "createdAt": 1696291200000
    }
  }
}
```

## Quick Fix Commands

Run these in order:

```bash
# 1. Test local Firebase connection
npm run dev
# Open http://localhost:3001 and check console for errors

# 2. Add env vars to Vercel (run each one)
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# 3. Redeploy
vercel --prod
```

## Testing

After setup:

1. ✅ Visit homepage - should show 8 categories
2. ✅ Click "Gratis Registreren" - auth modal should open
3. ✅ Create account - should work without errors
4. ✅ Navigate to categories - should show all 8 categories
5. ✅ Click a category - should show topics (if any exist)

## Troubleshooting

### "Firebase auth not initialized"

- Check browser console for environment variable values
- They should NOT be `undefined`
- Add them to Vercel if in production

### "Database not found" or empty categories

- Initialize database with sample data
- Check Firebase Console for data
- Verify database URL is correct

### Can't create account

- Check Firebase Authentication is enabled
- Go to: https://console.firebase.google.com/project/blockchainkix-com-fy/authentication/providers
- Enable "Email/Password" and "Google" sign-in methods

## Next Steps

Would you like me to:

1. ✅ Create an initialization script to populate the database?
2. ✅ Add Vercel environment variables automatically?
3. ✅ Create sample forum topics and discussions?
4. ✅ Set up admin panel for content management?
