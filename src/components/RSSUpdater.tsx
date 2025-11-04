/**
 * Client-side RSS Feed Updater
 * Updates RSS feed hourly using browser intervals
 * Alternative to Vercel Cron (which requires Pro plan)
 */

"use client";

import { useEffect } from "react";

export default function RSSUpdater() {
  useEffect(() => {
    // Update immediately on mount
    updateRSSFeed();

    // Then update every hour
    const interval = setInterval(() => {
      updateRSSFeed();
    }, 60 * 60 * 1000); // 1 hour in milliseconds

    return () => clearInterval(interval);
  }, []);

  async function updateRSSFeed() {
    try {
      const response = await fetch("/api/rss/update");
      const data = await response.json();

      // Silent update - no console log
    } catch (error) {
      console.error("[RSS] Failed to update feed:", error);
    }
  }

  // This component doesn't render anything
  return null;
}
