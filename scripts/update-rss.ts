/**
 * Script to manually update RSS feed
 * Usage: npm run update-rss
 */

import { updateRSSFeedCache } from "../src/lib/rss-feed";

async function main() {
  console.log("Starting RSS feed update...");

  const feedData = await updateRSSFeedCache();

  if (feedData) {
    console.log("\n✅ RSS Feed Update Successful!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Feed Title: ${feedData.title}`);
    console.log(`Total Items: ${feedData.items.length}`);
    console.log(
      `Last Updated: ${new Date(feedData.lastFetched).toLocaleString("nl-NL")}`
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("Recent Items:");
    feedData.items.slice(0, 5).forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`);
      console.log(
        `   Published: ${new Date(item.pubDate).toLocaleString("nl-NL")}`
      );
      console.log(`   Link: ${item.link}`);
    });

    console.log("\n✅ Script completed successfully");
    process.exit(0);
  } else {
    console.error("\n❌ Failed to update RSS feed");
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(() => {
    // Force exit after 2 seconds if Firebase doesn't close cleanly
    setTimeout(() => {
      console.log("\n⏱️  Force exiting...");
      process.exit(0);
    }, 2000);
  });
