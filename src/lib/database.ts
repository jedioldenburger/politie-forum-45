import {
    get,
    limitToLast,
    onValue,
    orderByChild,
    push,
    query,
    ref,
    set,
    update,
} from "firebase/database";
import { database } from "./firebase";
import { Category, Comment, Post, Topic, User } from "./types";

// Helper function to convert image file to base64
export async function imageToBase64(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Helper to ensure database is initialized
function ensureDatabase() {
  try {
    // database is now a getter function from firebase.ts
    const db = database();
    if (!db) {
      console.warn(
        "Firebase database not initialized. Please check your environment variables."
      );
      throw new Error("Firebase database not initialized");
    }
    return db;
  } catch (error) {
    console.error("Failed to get database instance:", error);
    throw new Error("Firebase database not initialized");
  }
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const categoriesRef = ref(ensureDatabase(), "categories");
  const snapshot = await get(categoriesRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
  }
  return [];
}

export async function createCategory(
  category: Omit<Category, "id">
): Promise<string> {
  const categoriesRef = ref(ensureDatabase(), "categories");
  const newCategoryRef = push(categoriesRef);
  await set(newCategoryRef, category);
  return newCategoryRef.key!;
}

// Topics
export async function getTopicsByCategory(
  categoryId: string,
  limit: number = 20
): Promise<Topic[]> {
  const topicsRef = ref(ensureDatabase(), "topics");
  const topicsQuery = query(
    topicsRef,
    orderByChild("categoryId"),
    limitToLast(limit)
  );
  const snapshot = await get(topicsQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .filter((key) => data[key].categoryId === categoryId)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return [];
}

export async function getRecentTopics(limit: number = 10): Promise<Topic[]> {
  const topicsRef = ref(ensureDatabase(), "topics");
  const topicsQuery = query(
    topicsRef,
    orderByChild("updatedAt"),
    limitToLast(limit)
  );
  const snapshot = await get(topicsQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return [];
}

export async function getTopic(topicId: string): Promise<Topic | null> {
  const topicRef = ref(ensureDatabase(), `topics/${topicId}`);
  const snapshot = await get(topicRef);

  if (snapshot.exists()) {
    return { id: topicId, ...snapshot.val() };
  }
  return null;
}

export async function createTopic(topic: Omit<Topic, "id">): Promise<string> {
  const topicsRef = ref(ensureDatabase(), "topics");
  const newTopicRef = push(topicsRef);
  await set(newTopicRef, topic);

  // Update category topic count
  const categoryRef = ref(ensureDatabase(), `categories/${topic.categoryId}`);
  const categorySnapshot = await get(categoryRef);
  if (categorySnapshot.exists()) {
    const category = categorySnapshot.val();
    await update(categoryRef, {
      topicsCount: (category.topicsCount || 0) + 1,
    });
  }

  return newTopicRef.key!;
}

export async function updateTopicViews(topicId: string): Promise<void> {
  const topicRef = ref(ensureDatabase(), `topics/${topicId}`);
  const snapshot = await get(topicRef);

  if (snapshot.exists()) {
    const topic = snapshot.val();
    await update(topicRef, {
      views: (topic.views || 0) + 1,
    });
  }
}

// Posts
export async function getPostsByTopic(topicId: string): Promise<Post[]> {
  const postsRef = ref(ensureDatabase(), "posts");
  const postsQuery = query(postsRef, orderByChild("topicId"));
  const snapshot = await get(postsQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .filter((key) => data[key].topicId === topicId)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => a.createdAt - b.createdAt);
  }
  return [];
}

export async function createPost(post: Omit<Post, "id">): Promise<string> {
  const postsRef = ref(ensureDatabase(), "posts");
  const newPostRef = push(postsRef);
  await set(newPostRef, post);

  // Update topic reply count and last reply
  const topicRef = ref(ensureDatabase(), `topics/${post.topicId}`);
  const topicSnapshot = await get(topicRef);
  if (topicSnapshot.exists()) {
    const topic = topicSnapshot.val();
    await update(topicRef, {
      repliesCount: (topic.repliesCount || 0) + 1,
      updatedAt: post.createdAt,
      lastReply: {
        userId: post.authorId,
        userName: post.authorName,
        timestamp: post.createdAt,
      },
    });
  }

  // Update category post count
  if (topicSnapshot.exists()) {
    const topic = topicSnapshot.val();
    const categoryRef = ref(ensureDatabase(), `categories/${topic.categoryId}`);
    const categorySnapshot = await get(categoryRef);
    if (categorySnapshot.exists()) {
      const category = categorySnapshot.val();
      await update(categoryRef, {
        postsCount: (category.postsCount || 0) + 1,
      });
    }
  }

  return newPostRef.key!;
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const postRef = ref(ensureDatabase(), `posts/${postId}`);
  const snapshot = await get(postRef);

  if (snapshot.exists()) {
    const post = snapshot.val();
    const likedBy = post.likedBy || [];

    if (!likedBy.includes(userId)) {
      await update(postRef, {
        likes: (post.likes || 0) + 1,
        likedBy: [...likedBy, userId],
      });
    }
  }
}

// Users
export async function getUser(userId: string): Promise<User | null> {
  const userRef = ref(ensureDatabase(), `users/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return { uid: userId, ...snapshot.val() };
  }
  return null;
}

export async function createUser(
  userId: string,
  userData: Omit<User, "uid">
): Promise<void> {
  const userRef = ref(ensureDatabase(), `users/${userId}`);
  await set(userRef, userData);
}

export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  const userRef = ref(ensureDatabase(), `users/${userId}`);
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([, value]) => value !== undefined)
  ) as Partial<User>;

  if (Object.keys(sanitizedUpdates).length === 0) {
    return;
  }

  await update(userRef, sanitizedUpdates);
}

// Real-time listeners
export function subscribeToTopics(
  categoryId: string,
  callback: (topics: Topic[]) => void
): () => void {
  const topicsRef = ref(ensureDatabase(), "topics");

  const unsubscribe = onValue(topicsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const topics = Object.keys(data)
        .filter((key) => data[key].categoryId === categoryId)
        .map((key) => ({ id: key, ...data[key] }))
        .sort((a, b) => b.updatedAt - a.updatedAt);
      callback(topics);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

export function subscribeToTopic(
  topicId: string,
  callback: (topic: Topic | null) => void
): () => void {
  const topicRef = ref(ensureDatabase(), `topics/${topicId}`);

  const unsubscribe = onValue(topicRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: topicId, ...snapshot.val() });
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

export function subscribeToPosts(
  topicId: string,
  callback: (posts: Post[]) => void
): () => void {
  const postsRef = ref(ensureDatabase(), "posts");

  const unsubscribe = onValue(postsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const posts = Object.keys(data)
        .filter((key) => data[key].topicId === topicId)
        .map((key) => ({ id: key, ...data[key] }))
        .sort((a, b) => a.createdAt - b.createdAt);
      callback(posts);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

// Comments for news articles
export async function getCommentsByArticle(
  articleSlug: string
): Promise<Comment[]> {
  const commentsRef = ref(ensureDatabase(), "comments");
  const commentsQuery = query(commentsRef, orderByChild("articleSlug"));
  const snapshot = await get(commentsQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .filter((key) => data[key].articleSlug === articleSlug)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  return [];
}

export async function createComment(
  comment: Omit<Comment, "id">
): Promise<string> {
  const commentsRef = ref(ensureDatabase(), "comments");
  const newCommentRef = push(commentsRef);
  await set(newCommentRef, comment);
  return newCommentRef.key!;
}

export async function likeComment(
  commentId: string,
  userId: string
): Promise<void> {
  const commentRef = ref(ensureDatabase(), `comments/${commentId}`);
  const snapshot = await get(commentRef);

  if (snapshot.exists()) {
    const comment = snapshot.val();
    const likedBy = comment.likedBy || [];

    if (!likedBy.includes(userId)) {
      await update(commentRef, {
        likes: (comment.likes || 0) + 1,
        likedBy: [...likedBy, userId],
      });
    }
  }
}

export function subscribeToComments(
  articleSlug: string,
  callback: (comments: Comment[]) => void
): () => void {
  const commentsRef = ref(ensureDatabase(), "comments");

  const unsubscribe = onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const comments = Object.keys(data)
        .filter((key) => data[key].articleSlug === articleSlug)
        .map((key) => ({ id: key, ...data[key] }))
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(comments);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

// Notifications
import { Notification } from "./types";

export async function createNotification(
  notification: Omit<Notification, "id">
): Promise<string> {
  const notificationsRef = ref(ensureDatabase(), "notifications");
  const newNotificationRef = push(notificationsRef);
  await set(newNotificationRef, notification);
  return newNotificationRef.key!;
}

export async function getUserNotifications(
  userId: string
): Promise<Notification[]> {
  const notificationsRef = ref(ensureDatabase(), "notifications");
  const notificationsQuery = query(notificationsRef, orderByChild("userId"));
  const snapshot = await get(notificationsQuery);

  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data)
      .filter((key) => data[key].userId === userId)
      .map((key) => ({ id: key, ...data[key] }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  return [];
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const notificationRef = ref(
    ensureDatabase(),
    `notifications/${notificationId}`
  );
  await update(notificationRef, { read: true });
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<void> {
  const notifications = await getUserNotifications(userId);
  const updates: { [key: string]: boolean } = {};

  notifications.forEach((notification) => {
    if (!notification.read) {
      updates[`notifications/${notification.id}/read`] = true;
    }
  });

  if (Object.keys(updates).length > 0) {
    const dbRef = ref(ensureDatabase());
    await update(dbRef, updates);
  }
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): () => void {
  const notificationsRef = ref(ensureDatabase(), "notifications");

  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const notifications = Object.keys(data)
        .filter((key) => data[key].userId === userId)
        .map((key) => ({ id: key, ...data[key] }))
        .sort((a, b) => b.createdAt - a.createdAt);
      callback(notifications);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}
