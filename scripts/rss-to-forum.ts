/**
 * Script to process RSS articles and post them to the forum
 * Usage: npm run rss-to-forum
 */

import { processNewArticlesToForum } from "../src/lib/rss-to-forum";

async function main() {
  console.log("🚀 RSS-to-Forum Automation");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Check for GROQ_API_KEY
  if (!process.env.GROQ_API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY environment variable is not set");
    console.error("\nPlease set your Groq API key:");
    console.error("export GROQ_API_KEY='your-api-key-here'");
    console.error(
      "\nGet a free API key at: https://console.groq.com/keys\n"
    );
    process.exit(1);
  }

  // Process up to 5 new articles (free tier friendly)
  const result = await processNewArticlesToForum(5);

  if (result.processed > 0) {
    console.log(`\n✅ Successfully processed ${result.processed} articles!`);
    process.exit(0);
  } else if (result.failed > 0) {
    console.log(`\n⚠️  ${result.failed} articles failed to process`);
    process.exit(1);
  } else {
    console.log(`\nℹ️  No new articles to process`);
    process.exit(0);
  }
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  })
  .finally(() => {
    // Force exit after 3 seconds
    setTimeout(() => {
      console.log("\n⏱️  Force exiting...");
      process.exit(0);
    }, 3000);
  });
