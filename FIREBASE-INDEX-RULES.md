# Firebase Firestore Index Rules

## Current Error
```
Error posting comment: Error: Index not defined, add ".indexOn": "authorId", for path "/comments", to the rules
```

**Note**: This error message is misleading - it's actually a Firestore composite index issue, not Realtime Database.

## Required Firestore Indexes

### Go to Firebase Console
1. Navigate to: https://console.firebase.google.com
2. Select project: **blockchainkix-com-fy**
3. Go to: **Firestore Database** → **Indexes** → **Composite**

### Create Composite Indexes

#### 1. Comments Collection
Create index for querying comments by article and sorting:
- **Collection ID**: `comments`
- **Fields indexed**:
  - `articleSlug` (Ascending)
  - `createdAt` (Descending)
  - `authorId` (Ascending)
- **Query scope**: Collection

#### 2. Comments by Author
Create index for user's comment history:
- **Collection ID**: `comments`
- **Fields indexed**:
  - `authorId` (Ascending)
  - `createdAt` (Descending)
- **Query scope**: Collection

#### 3. News Articles
Create index for filtering and sorting articles:
- **Collection ID**: `news`
- **Fields indexed**:
  - `category` (Ascending)
  - `publishedAt` (Descending)
  - `featured` (Ascending)
- **Query scope**: Collection

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Comments collection
    match /comments/{commentId} {
      // Anyone can read comments
      allow read: if true;

      // Authenticated users can create comments
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid;

      // Users can update/delete their own comments
      allow update, delete: if request.auth != null
                            && resource.data.authorId == request.auth.uid;
    }

    // News articles collection
    match /news/{articleSlug} {
      // Anyone can read articles
      allow read: if true;

      // Only authenticated users can write (admin check recommended)
      allow write: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;

      // Users can write their own profile
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```## Why These Indexes Are Needed

### Comments Collection
- **articleSlug + createdAt**: Query comments for specific article, sorted by date
- **authorId + createdAt**: Query user's comment history, sorted chronologically
- Firestore requires composite indexes for queries with multiple `where()` clauses or `orderBy()`

### News Collection
- **category + publishedAt + featured**: Filter by category, sort by date, show featured articles
- Enables efficient article listing and filtering

### Security Rules
- Comments readable by all, only authors can edit/delete their own
- Articles readable by all
- User profiles private (only owner access)

## How to Add Indexes

### Option 1: Firebase Console (Recommended)
1. Go to Firestore Database → Indexes → Composite
2. Click **Create Index**
3. Enter collection name and field configurations
4. Wait 2-5 minutes for index to build

### Option 2: Auto-Generated Link
When you run a query that needs an index, Firestore provides a direct link in the error message. Click it to auto-create the index.

### Option 3: Firebase CLI
```bash
firebase deploy --only firestore:indexes
```

Create `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "comments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "articleSlug", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "comments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "authorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## Testing After Setup

```javascript
// Firestore query examples that require indexes
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Query comments for article, sorted by date
const commentsQuery = query(
  collection(db, 'comments'),
  where('articleSlug', '==', 'my-article'),
  orderBy('createdAt', 'desc')
);

// Query user's comments
const userCommentsQuery = query(
  collection(db, 'comments'),
  where('authorId', '==', 'user123'),
  orderBy('createdAt', 'desc')
);
```

## After Adding Indexes

1. Indexes take 2-5 minutes to build
2. Check status in Firebase Console → Indexes tab
3. Test comment posting - error should be gone
4. Monitor Console for any new index requirements
