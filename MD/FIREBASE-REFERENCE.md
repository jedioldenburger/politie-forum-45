# 🔥 Firebase Quick Reference - Politie Forum

## 🎯 Quick Start Checklist

- [ ] Server running on port 3001
- [ ] Visit `/admin` to initialize database
- [ ] Create your first user account
- [ ] Check Firebase Console for data

## 🔧 Firebase Admin SDK Setup

### Server-Side Initialization

```javascript
const admin = require("firebase-admin");

const serviceAccount = require("./secretkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"
});
```

## 🔐 Authentication Methods

### Email/Password

```typescript
const { signUp, signIn } = useAuth();

// Register
await signUp("email@example.com", "password", "Username");

// Login
await signIn("email@example.com", "password");
```

### Google Sign-In

```typescript
const { signInWithGoogle } = useAuth();

await signInWithGoogle();
```

### Current User

```typescript
const { currentUser, userData } = useAuth();

// Firebase user
currentUser?.uid;
currentUser?.email;

// Database user profile
userData?.displayName;
userData?.role;
userData?.posts;
userData?.reputation;
```

## 📊 Database Operations

### Categories

```typescript
import { getCategories, createCategory } from "@/lib/database";

// Get all categories
const categories = await getCategories();

// Create category (admin only)
const categoryId = await createCategory({
  name: "Nieuwe Categorie",
  description: "Beschrijving",
  icon: "MessageSquare",
  topicsCount: 0,
  postsCount: 0,
  order: 5,
  createdAt: Date.now(),
});
```

### Topics

```typescript
import {
  getTopicsByCategory,
  getRecentTopics,
  createTopic,
} from "@/lib/database";

// Get topics by category
const topics = await getTopicsByCategory("cat1", 20);

// Get recent topics
const recent = await getRecentTopics(10);

// Create topic
const topicId = await createTopic({
  title: "Topic titel",
  categoryId: "cat1",
  authorId: currentUser.uid,
  authorName: userData.displayName,
  content: "Topic content...",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  views: 0,
  repliesCount: 0,
  isPinned: false,
  isLocked: false,
});
```

### Posts

```typescript
import { getPostsByTopic, createPost, likePost } from "@/lib/database";

// Get posts for a topic
const posts = await getPostsByTopic("topic123");

// Create post/reply
const postId = await createPost({
  topicId: "topic123",
  authorId: currentUser.uid,
  authorName: userData.displayName,
  content: "Post content...",
  createdAt: Date.now(),
  likes: 0,
});

// Like a post
await likePost("post123", currentUser.uid);
```

## 🔄 Real-time Listeners

### Subscribe to Topics

```typescript
import { subscribeToTopics } from "@/lib/database";

useEffect(() => {
  const unsubscribe = subscribeToTopics("cat1", (topics) => {
    setTopics(topics);
  });

  return () => unsubscribe();
}, []);
```

### Subscribe to Posts

```typescript
import { subscribeToPosts } from "@/lib/database";

useEffect(() => {
  const unsubscribe = subscribeToPosts("topic123", (posts) => {
    setPosts(posts);
  });

  return () => unsubscribe();
}, []);
```

## 🛡️ Protected Routes Example

```typescript
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

## 📱 Firebase Console URLs

- **Main Console**: https://console.firebase.google.com
- **Database**: Console → Realtime Database
- **Authentication**: Console → Authentication
- **Storage**: Console → Storage
- **Rules**: Console → Realtime Database → Rules

## 🔧 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

## 🎨 Using Auth in Components

```typescript
"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { currentUser, userData, signOut } = useAuth();

  return (
    <div>
      {currentUser ? (
        <>
          <p>Welkom, {userData?.displayName}!</p>
          <button onClick={signOut}>Uitloggen</button>
        </>
      ) : (
        <p>Niet ingelogd</p>
      )}
    </div>
  );
}
```

## 📝 TypeScript Types

```typescript
import { User, Category, Topic, Post } from "@/lib/types";

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  role: "user" | "moderator" | "admin";
  posts: number;
  reputation: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  topicsCount: number;
  postsCount: number;
  order: number;
  createdAt: number;
}

interface Topic {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  views: number;
  repliesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastReply?: {
    userId: string;
    userName: string;
    timestamp: number;
  };
}

interface Post {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  likes: number;
  likedBy?: string[];
}
```

## 🚨 Common Errors & Solutions

**"Firebase: Error (auth/popup-closed-by-user)"**
→ User closed Google Sign-In popup. This is normal, just try again.

**"Permission denied"**
→ Check Firebase Security Rules in console.

**"Module not found: Can't resolve 'firebase'"**
→ Run `npm install firebase`

**Auth context undefined**
→ Make sure component is wrapped in `<AuthProvider>`

**Real-time updates not working**
→ Check if listener is properly set up and cleaned up in useEffect

## 💡 Pro Tips

1. Always clean up listeners in useEffect
2. Use `loading` state from AuthContext before rendering
3. Check `currentUser` before accessing `userData`
4. Use server-side validation in production
5. Set up proper Firebase Security Rules
6. Enable email verification for production
7. Add rate limiting for write operations

---

**Need more help?** Check `FIREBASE-SETUP.md` for detailed guide!
