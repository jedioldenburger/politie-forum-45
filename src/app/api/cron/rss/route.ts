/**
 * Vercel Cron Job Configuration
 * Updates RSS feed every hour
 *
 * Note: This requires Vercel Pro plan for cron jobs
 * For free tier, use the manual API endpoint or client-side polling
 */

import { updateRSSFeedCache } from "@/lib/rss-feed";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Starting RSS feed update...");

    // Timeout protection: Race between update and 55s timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), 55000)
    );

    const feedData = await Promise.race([
      updateRSSFeedCache(),
      timeoutPromise
    ]).catch(error => {
      console.error("[CRON] Update timed out or failed:", error);
      return null;
    });

    if (!feedData) {
      console.error("[CRON] Failed to update RSS feed");
      return NextResponse.json(
        { error: "Failed to fetch RSS feed" },
        { status: 500 }
      );
    }

    console.log(
      `[CRON] RSS feed updated successfully with ${feedData.items.length} items`
    );

    return NextResponse.json({
      success: true,
      message: `RSS feed updated with ${feedData.items.length} items`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error updating RSS feed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
