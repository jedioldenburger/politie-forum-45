// src/components/ForumSchemaRenderer.tsx
// Automatische schema renderer voor forum overzichten en individuele threads
// Server-side component voor optimale SEO

import { ForumThread, generateForumSchema } from '@/lib/generateForumSchema'

interface ForumSchemaRendererProps {
  threads?: ForumThread[]
  thread?: ForumThread
}

/**
 * Renders JSON-LD structured data for forum content
 * Automatically detects whether to render:
 * - ItemList schema (for overview pages)
 * - DiscussionForumPosting schema (for individual threads)
 *
 * @param threads - Array of threads for overview page
 * @param thread - Single thread for detail page
 */
export default function ForumSchemaRenderer({
  threads,
  thread,
}: ForumSchemaRendererProps) {
  const schema = generateForumSchema({ threads, thread })

  if (!schema) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0) // No spaces for optimal performance
      }}
      suppressHydrationWarning
    />
  )
}
