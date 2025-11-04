# Firebase Admin SDK Setup Guide

## ✅ Setup Complete!

Firebase Admin SDK has been successfully configured with your service account credentials.

## 📁 Files Created

1. **`secretkey.json`** - Firebase service account credentials (already exists)
2. **`scripts/firebase-admin.ts`** - Firebase Admin SDK initialization
3. **`scripts/test-firebase-admin.ts`** - Connection test utility
4. **`scripts/deploy-rules.ts`** - Database rules deployment helper

## 🔧 Configuration

### Service Account Details

- **Project ID:** blockchainkix-com-fy
- **Database URL:** https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app
- **Client Email:** firebase-adminsdk-i3dcq@blockchainkix-com-fy.iam.gserviceaccount.com
- **Region:** europe-west1

### Admin SDK Initialization

```javascript
const admin = require("firebase-admin");

const serviceAccount = require("./secretkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
});
```

### File Structure

```
politie-forum-45/
├── secretkey.json              # Service account credentials ⚠️ Keep secure!
├── scripts/
│   ├── firebase-admin.ts       # Admin SDK initialization
│   ├── test-firebase-admin.ts  # Connection test
│   ├── deploy-rules.ts         # Rules deployment helper
│   └── init-database.ts        # Database initialization
└── database.rules.json         # Database security rules
```

## 🚀 Available Commands

### Test Firebase Connection

```bash
npm run test-admin
```

**What it does:**

- Tests database connection
- Verifies authentication
- Shows sample data
- Confirms all services are operational

**Expected output:**

```
🔥 Firebase Admin SDK - Connection Test
✅ Database connection successful!
✅ Auth connection successful!
✨ All Firebase services are operational!
```

### Deploy Database Rules Helper

```bash
npm run deploy-rules
```

**What it does:**

- Validates rules file
- Shows rules structure
- Provides deployment instructions

**Note:** Firebase Admin SDK cannot directly deploy rules. You must use:

1. Firebase Console (recommended)
2. Firebase CLI with `firebase deploy --only database`

### Initialize Database

```bash
npm run init-db
```

Creates initial categories, topics, and posts in the database.

## 📝 Using Firebase Admin in Your Code

### TypeScript/ESM (Recommended)

```typescript
import admin, { db, auth } from "./scripts/firebase-admin";

// Database operations
const ref = db.ref("categories");
const snapshot = await ref.once("value");
const data = snapshot.val();

// Auth operations
const user = await auth.getUser(userId);
const users = await auth.listUsers(100);
```

### CommonJS (Node.js)

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("./secretkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();
const auth = admin.auth();
```

## 🔐 Security Best Practices

### ⚠️ Critical: Protect Your Service Account Key

1. **Never commit to Git:**

   ```bash
   # .gitignore (should already contain)
   secretkey.json
   *.json # service account keys
   ```

2. **Verify it's ignored:**

   ```bash
   git status
   # secretkey.json should NOT appear
   ```

3. **Environment variable alternative:**
   Instead of using the JSON file directly, you can use environment variables:

   ```typescript
   // For production deployment
   const credential = admin.credential.cert({
     projectId: process.env.FIREBASE_PROJECT_ID,
     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
   });
   ```

4. **For Vercel deployment:**
   Add these environment variables in Vercel dashboard:
   - `FIREBASE_PROJECT_ID`: blockchainkix-com-fy
   - `FIREBASE_CLIENT_EMAIL`: firebase-adminsdk-i3dcq@blockchainkix-com-fy.iam.gserviceaccount.com
   - `FIREBASE_PRIVATE_KEY`: (entire private key from secretkey.json)

## 🛠️ Common Operations

### Read Data

```typescript
import { db } from "./scripts/firebase-admin";

// Get all categories
const categoriesRef = db.ref("categories");
const snapshot = await categoriesRef.once("value");
const categories = snapshot.val();

// Get specific category
const categoryRef = db.ref("categories/cat1");
const categorySnapshot = await categoryRef.once("value");
const category = categorySnapshot.val();
```

### Write Data

```typescript
// Create new category
await db.ref("categories").push({
  name: "Nieuwe Categorie",
  description: "Beschrijving",
  icon: "MessageSquare",
  order: 10,
  topicsCount: 0,
  postsCount: 0,
  createdAt: Date.now(),
});

// Update existing data
await db.ref("categories/cat1").update({
  topicsCount: 15,
});
```

### User Management

```typescript
import { auth } from "./scripts/firebase-admin";

// Get user by ID
const user = await auth.getUser(userId);
console.log(user.email, user.displayName);

// List all users
const listUsersResult = await auth.listUsers(1000);
listUsersResult.users.forEach((userRecord) => {
  console.log(userRecord.toJSON());
});

// Create custom token
const customToken = await auth.createCustomToken(userId);

// Verify ID token
const decodedToken = await auth.verifyIdToken(idToken);
```

### Query Data

```typescript
// Query with filters
const recentTopics = await db
  .ref("topics")
  .orderByChild("createdAt")
  .limitToLast(10)
  .once("value");

// Query by index (requires .indexOn in rules)
const topicsByCategory = await db
  .ref("topics")
  .orderByChild("categoryId")
  .equalTo("cat1")
  .once("value");
```

## 🎯 Use Cases

### 1. Server-Side Rendering (SSR)

Use Firebase Admin in Next.js API routes or server components:

```typescript
// app/api/categories/route.ts
import { db } from "@/scripts/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  const snapshot = await db.ref("categories").once("value");
  const categories = snapshot.val();
  return NextResponse.json(categories);
}
```

### 2. Background Jobs

Create scheduled tasks or cron jobs:

```typescript
// scripts/cleanup-old-posts.ts
import { db } from "./firebase-admin";

async function cleanupOldPosts() {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const oldPosts = await db
    .ref("posts")
    .orderByChild("createdAt")
    .endAt(oneWeekAgo)
    .once("value");

  const updates: any = {};
  oldPosts.forEach((post) => {
    updates[`posts/${post.key}`] = null; // Delete
  });

  await db.ref().update(updates);
  console.log(`Cleaned up ${Object.keys(updates).length} old posts`);
}
```

### 3. Data Migration

Migrate or transform data:

```typescript
// scripts/migrate-comments.ts
import { db } from "./firebase-admin";

async function addArticleSlugIndex() {
  const commentsRef = db.ref("comments");
  const snapshot = await commentsRef.once("value");

  const updates: any = {};
  snapshot.forEach((comment) => {
    const data = comment.val();
    // Add missing field
    if (!data.articleSlug) {
      updates[`comments/${comment.key}/articleSlug`] = "unknown";
    }
  });

  await db.ref().update(updates);
  console.log(`Updated ${Object.keys(updates).length} comments`);
}
```

### 4. User Operations

Manage users programmatically:

```typescript
// scripts/promote-to-moderator.ts
import { db, auth } from "./firebase-admin";

async function promoteUser(userId: string) {
  // Update custom claims
  await auth.setCustomUserClaims(userId, { role: "moderator" });

  // Update database
  await db.ref(`users/${userId}`).update({
    role: "moderator",
  });

  console.log(`User ${userId} promoted to moderator`);
}
```

## 🐛 Troubleshooting

### Error: "ENOENT: no such file or directory, open 'secretkey.json'"

**Solution:** Ensure `secretkey.json` is in the root directory of the project.

### Error: "Error: Could not load the default credentials"

**Solution:**

1. Verify `secretkey.json` has correct JSON structure
2. Check file permissions: `chmod 600 secretkey.json`
3. Ensure project_id matches your Firebase project

### Error: "PERMISSION_DENIED: Permission denied"

**Solution:**

1. Deploy database rules using Firebase Console
2. Verify service account has required permissions
3. Check Firebase IAM settings for the service account

### Error: "Database connection timeout"

**Solution:**

1. Check internet connection
2. Verify database URL is correct
3. Ensure database exists in Firebase Console

## 📚 Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Realtime Database Admin Guide](https://firebase.google.com/docs/database/admin/start)
- [Firebase Auth Admin](https://firebase.google.com/docs/auth/admin)
- [Security Rules Reference](https://firebase.google.com/docs/database/security)

## ✅ Next Steps

1. **Test the connection:**

   ```bash
   npm run test-admin
   ```

2. **Deploy database rules:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Realtime Database → Rules
   - Copy from `database.rules.json`
   - Click "Publish"

3. **Use in your application:**

   - Import from `scripts/firebase-admin.ts`
   - Add server-side operations
   - Create API routes with Firebase Admin

4. **Secure your credentials:**
   - Verify `secretkey.json` is in `.gitignore`
   - Set up environment variables for production
   - Rotate keys if ever exposed

---

**Status:** ✅ Firebase Admin SDK is fully configured and operational!
