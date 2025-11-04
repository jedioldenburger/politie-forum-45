/**
 * API Route: /api/rss/update
 * Manually trigger RSS feed update
 */

import { updateRSSFeedCache } from "@/lib/rss-feed";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    // Timeout protection: 25s max
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), 25000)
    );

    const feedData = await Promise.race([
      updateRSSFeedCache(),
      timeoutPromise
    ]).catch(error => {
      console.error("RSS update timed out:", error);
      return null;
    });

    if (!feedData) {
      return NextResponse.json(
        { error: "Failed to fetch RSS feed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `RSS feed updated successfully with ${feedData.items.length} items`,
      data: {
        title: feedData.title,
        itemCount: feedData.items.length,
        lastFetched: feedData.lastFetched,
      },
    });
  } catch (error) {
    console.error("Error in RSS update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
