/**
 * Automated RSS to Forum Pipeline
 * Fetches RSS articles, rewrites with Groq AI, and posts to forum
 */

import * as fs from "fs";
import * as path from "path";
import { rewriteArticleWithGroq, type RewrittenArticle } from "./groq-rewriter";
import {
    extractSlugFromUrl,
    generateStaticHTML,
} from "./html-generator";
import {
    getRSSFeed,
    type RSSFeedItem
} from "./rss-feed";

// Firebase Admin imports (server-side only)
let admin: any = null;

async function getFirebaseAdmin() {
  if (admin) return admin;

  if (typeof window === "undefined") {
    const adminModule = await import("firebase-admin");

    // Use environment variable for service account (required in production)
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required");
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    if (!adminModule.apps.length) {
      adminModule.initializeApp({
        credential: adminModule.credential.cert(serviceAccount as any),
        databaseURL:
          "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
      });
    }

    admin = adminModule;
    return admin;
  }

  return null;
}

interface ProcessedArticle {
  rssId: string;
  title: string;
  link: string;
  processedAt: number;
  topicId?: string;
}

const PROCESSED_ARTICLES_PATH = "rss/processed-articles";
const FORUM_BOT_USER_ID = "rss-bot";
const FORUM_BOT_USER_NAME = "Politie Nieuws Bot";
const DEFAULT_CATEGORY_ID = "cat1"; // Algemeen category

/**
 * Get list of already processed article IDs
 */
async function getProcessedArticleIds(): Promise<string[]> {
  try {
    const admin = await getFirebaseAdmin();
    if (!admin) return [];

    const db = admin.database();
    const ref = db.ref(PROCESSED_ARTICLES_PATH);
    const snapshot = await ref.once("value");

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data).map((item: any) => item.rssId);
    }

    return [];
  } catch (error) {
    console.error("Error getting processed articles:", error);
    return [];
  }
}

/**
 * Mark article as processed
 */
async function markArticleAsProcessed(
  article: ProcessedArticle
): Promise<void> {
  try {
    const admin = await getFirebaseAdmin();
    if (!admin) return;

    const db = admin.database();
    const ref = db.ref(PROCESSED_ARTICLES_PATH);
    await ref.push(article);

    console.log(`✅ Marked as processed: ${article.rssId}`);
  } catch (error) {
    console.error("Error marking article as processed:", error);
  }
}

/**
 * Create a forum topic from a rewritten article
 */
async function createForumTopicFromArticle(
  article: RewrittenArticle
): Promise<string | null> {
  try {
    const admin = await getFirebaseAdmin();
    if (!admin) {
      console.error("Firebase Admin not initialized");
      return null;
    }

    const db = admin.database();
    const topicsRef = db.ref("topics");
    const newTopicRef = topicsRef.push();

    const topic = {
      title: article.title,
      categoryId: DEFAULT_CATEGORY_ID,
      authorId: FORUM_BOT_USER_ID,
      authorName: FORUM_BOT_USER_NAME,
      content: article.content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
      repliesCount: 0,
      isPinned: false,
      isLocked: false,
    };

    await newTopicRef.set(topic);

    // Update category topic count
    const categoryRef = db.ref(`categories/${DEFAULT_CATEGORY_ID}`);
    const categorySnapshot = await categoryRef.once("value");

    if (categorySnapshot.exists()) {
      const category = categorySnapshot.val();
      await categoryRef.update({
        topicsCount: (category.topicsCount || 0) + 1,
      });
    }

    console.log(`✅ Created forum topic: ${article.title}`);
    return newTopicRef.key;
  } catch (error) {
    console.error("Error creating forum topic:", error);
    return null;
  }
}

/**
 * Find new articles that haven't been processed yet
 */
function findNewArticles(
  currentArticles: RSSFeedItem[],
  processedIds: string[]
): RSSFeedItem[] {
  return currentArticles.filter((article) => {
    return !processedIds.includes(article.guid);
  });
}

/**
 * Main pipeline: Process new RSS articles and post to forum
 */
export async function processNewArticlesToForum(
  maxArticles: number = 5
): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
  console.log("\n🤖 Starting RSS-to-Forum Pipeline...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  let processed = 0;
  let failed = 0;
  let skipped = 0;

  try {
    // 1. Fetch latest RSS feed
    console.log("📡 Fetching RSS feed...");
    const feedData = await getRSSFeed(true); // Force refresh

    if (!feedData || !feedData.items || feedData.items.length === 0) {
      console.log("❌ No RSS articles found");
      return { processed, failed, skipped };
    }

    console.log(`✅ Found ${feedData.items.length} RSS articles\n`);

    // 2. Get already processed articles
    console.log("🔍 Checking processed articles...");
    const processedIds = await getProcessedArticleIds();
    console.log(`✅ ${processedIds.length} articles already processed\n`);

    // 3. Find new articles
    const newArticles = findNewArticles(feedData.items, processedIds);
    console.log(`🆕 Found ${newArticles.length} new articles\n`);

    if (newArticles.length === 0) {
      console.log("ℹ️  No new articles to process");
      return { processed, failed, skipped };
    }

    // 4. Process only the specified number of new articles
    const articlesToProcess = newArticles.slice(0, maxArticles);
    console.log(`📝 Processing ${articlesToProcess.length} articles...\n`);

    for (const article of articlesToProcess) {
      console.log(`\n🔄 Processing: ${article.title}`);

      // Rewrite with Groq (with 10s timeout per article)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Groq API timeout')), 10000)
      );

      const rewritten = await Promise.race([
        rewriteArticleWithGroq(
        article.title,
        article.contentSnippet || article.content || "",
        article.link,
        article.categories
      ),
        timeoutPromise
      ]).catch(error => {
        console.error('Groq rewrite failed:', error);
        return null;
      });

      if (!rewritten) {
        console.log(`❌ Failed to rewrite article`);
        failed++;
        continue;
      }

      // Extract slug from original URL
      const slug = extractSlugFromUrl(article.link);
      console.log(`📝 URL Slug: ${slug}`);

      // Generate static HTML file
      try {
        const html = generateStaticHTML(
          rewritten,
          slug,
          new Date(article.pubDate).toISOString()
        );

        // Create directory structure: public/forum/{slug}/
        const forumDir = path.join(process.cwd(), "public", "forum", slug);
        if (!fs.existsSync(forumDir)) {
          fs.mkdirSync(forumDir, { recursive: true });
        }

        // Write index.html
        const htmlPath = path.join(forumDir, "index.html");
        fs.writeFileSync(htmlPath, html, "utf-8");
        console.log(`✅ Generated HTML: /forum/${slug}/index.html`);
      } catch (htmlError) {
        console.error(`❌ Failed to generate HTML:`, htmlError);
        // Continue anyway - at least save to database
      }

      // Create forum topic in Firebase
      const topicId = await createForumTopicFromArticle(rewritten);

      if (!topicId) {
        console.log(`❌ Failed to create forum topic`);
        failed++;
        continue;
      }

      // Mark as processed
      await markArticleAsProcessed({
        rssId: article.guid,
        title: article.title,
        link: article.link,
        processedAt: Date.now(),
        topicId,
      });

      processed++;
      console.log(`✅ Successfully posted to forum (ID: ${topicId})`);
      console.log(`🌐 Static URL: https://politie-forum.nl/forum/${slug}/`);


      // Rate limiting: 2 seconds between articles
      if (articlesToProcess.indexOf(article) < articlesToProcess.length - 1) {
        console.log("⏳ Waiting 2 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`✅ Pipeline Complete!`);
    console.log(`   Processed: ${processed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Skipped: ${newArticles.length - articlesToProcess.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return {
      processed,
      failed,
      skipped: newArticles.length - articlesToProcess.length,
    };
  } catch (error) {
    console.error("❌ Pipeline error:", error);
    return { processed, failed, skipped };
  }
}
