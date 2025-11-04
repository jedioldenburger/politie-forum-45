# Firebase Admin SDK - Quick Reference

## 🚀 Quick Start

### Basic Initialization

```javascript
const admin = require("firebase-admin");

const serviceAccount = require("./secretkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
});
```

### TypeScript Import

```typescript
import admin, { db, auth } from "./scripts/firebase-admin";
```

## 📝 Database Operations

### Read

```typescript
// Get single value
const snapshot = await db.ref("categories/cat1").once("value");
const category = snapshot.val();

// Get all
const allCategories = await db.ref("categories").once("value");
```

### Write

```typescript
// Set (overwrite)
await db.ref("categories/cat1").set(data);

// Update (merge)
await db.ref("categories/cat1").update({ topicsCount: 15 });

// Push (new child)
const newRef = await db.ref("categories").push(data);
console.log(newRef.key); // auto-generated ID
```

### Delete

```typescript
await db.ref("categories/cat1").remove();
// or
await db.ref("categories/cat1").set(null);
```

### Query

```typescript
// Order and limit
const recent = await db
  .ref("topics")
  .orderByChild("createdAt")
  .limitToLast(10)
  .once("value");

// Filter by value
const byCategory = await db
  .ref("topics")
  .orderByChild("categoryId")
  .equalTo("cat1")
  .once("value");

// Range query
const inRange = await db
  .ref("posts")
  .orderByChild("createdAt")
  .startAt(timestamp1)
  .endAt(timestamp2)
  .once("value");
```

## 👤 Auth Operations

### Get User

```typescript
// By UID
const user = await auth.getUser(userId);

// By email
const user = await auth.getUserByEmail("user@example.com");

// By phone
const user = await auth.getUserByPhoneNumber("+31612345678");
```

### List Users

```typescript
const listUsersResult = await auth.listUsers(1000);
listUsersResult.users.forEach((userRecord) => {
  console.log(userRecord.uid, userRecord.email);
});
```

### Create/Update User

```typescript
// Create
const newUser = await auth.createUser({
  email: "user@example.com",
  password: "secretPassword",
  displayName: "John Doe",
  emailVerified: false,
});

// Update
await auth.updateUser(userId, {
  displayName: "Jane Doe",
  photoURL: "https://example.com/photo.jpg",
});
```

### Custom Claims (Roles)

```typescript
// Set claims
await auth.setCustomUserClaims(userId, {
  role: "moderator",
  premium: true,
});

// Verify token and check claims
const decodedToken = await auth.verifyIdToken(idToken);
console.log(decodedToken.role); // "moderator"
```

### Delete User

```typescript
await auth.deleteUser(userId);
```

## 🔧 Transactions

```typescript
await db.ref("categories/cat1/topicsCount").transaction((current) => {
  return (current || 0) + 1;
});
```

## 📊 Batch Operations

```typescript
const updates: any = {};
updates["categories/cat1/name"] = "New Name";
updates["categories/cat2/name"] = "Another Name";
updates["topics/topic1/title"] = "Updated Title";

await db.ref().update(updates);
```

## 🎯 NPM Scripts

```bash
# Test connection
npm run test-admin

# View deployment instructions
npm run deploy-rules

# Initialize database
npm run init-db
```

## 🔐 Security

```typescript
// Admin SDK bypasses security rules!
// Use with caution on server-side only
```

## 📚 More Info

See **FIREBASE-ADMIN-SETUP.md** for complete documentation.
