import Script from "next/script";

/**
 * JsonLdThread Component
 *
 * Renders DiscussionForumPosting JSON-LD schema for SEO.
 * This should be placed in the article page with server-side rendered comment data.
 *
 * The schema includes:
 * - Thread metadata (headline, dates, counts)
 * - Up to 10 most recent comments with nested replies
 * - Interaction statistics (likes, comment counts)
 * - Proper @id references for thread hierarchy
 *
 * @param data - Pre-built JSON-LD schema object from server
 */
export default function JsonLdThread({ data }: { data: unknown }) {
  return (
    <Script
      id="ld-thread"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
}
