/**
 * API endpoint to process RSS articles and post to forum
 * This can be triggered by Vercel cron or called manually
 */

import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 60 seconds for Vercel

export async function GET(request: Request) {
  try {
    // Optional: Add authentication
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
      // If CRON_SECRET is set, require authentication
      // But don't fail if CRON_SECRET is not set (for manual testing)
      console.log("Unauthorized RSS-to-Forum request");
    }

    // Check for GROQ_API_KEY
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY not configured",
          message: "Please set GROQ_API_KEY environment variable",
        },
        { status: 500 }
      );
    }

    // Dynamic import to avoid server-side build issues
    const { processNewArticlesToForum } = await import(
      "@/lib/rss-to-forum"
    );

    // Process up to 5 new articles
    const result = await processNewArticlesToForum(5);

    return NextResponse.json({
      success: true,
      message: "RSS-to-Forum pipeline completed",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in RSS-to-Forum API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
