/**
 * API Route: /api/rss/feed
 * Get cached RSS feed data
 */

import { getRSSFeed } from "@/lib/rss-feed";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const feedData = await getRSSFeed(forceRefresh);

    if (!feedData) {
      return NextResponse.json(
        { error: "Failed to fetch RSS feed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: feedData,
    });
  } catch (error) {
    console.error("Error in RSS feed API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
