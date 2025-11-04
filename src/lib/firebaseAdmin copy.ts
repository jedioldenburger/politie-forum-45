/**
 * Firebase Admin SDK for Server-Side Operations
 * Use this for Next.js Server Components and API Routes
 */

import * as admin from 'firebase-admin';

// Initialize Firebase Admin (singleton pattern)
if (!admin.apps.length) {
  try {
    // Try to use service account from environment variable first
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    } else {
      // Fallback: Use default credentials (works on Cloud Run, App Engine, etc.)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      });
    }

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
  }
}

export const adminDb = admin.database();
export const adminAuth = admin.auth();

export default admin;

/**
 * Server-side function to fetch article by slug
 */
export async function getServerArticle(slug: string) {
  try {
    const snapshot = await adminDb.ref(`news/${slug}`).once('value');

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.val();
    return {
      id: slug,
      slug,
      ...data,
    };
  } catch (error) {
    console.error(`Error fetching article "${slug}":`, error);
    return null;
  }
}

/**
 * Server-side function to fetch all article slugs for ISR
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const snapshot = await adminDb.ref('news').once('value');

    if (!snapshot.exists()) {
      return [];
    }

    return Object.keys(snapshot.val());
  } catch (error) {
    console.error('Error fetching article slugs:', error);
    return [];
  }
}

/**
 * @deprecated Use getAllArticleSlugs instead
 */
export async function getServerArticleSlugs(): Promise<string[]> {
  return getAllArticleSlugs();
}
