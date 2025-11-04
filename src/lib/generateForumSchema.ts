// src/lib/generateForumSchema.ts
// Universele helper voor automatische Forum Schema generatie
// Ondersteunt zowel overzichtspagina's (ItemList) als individuele threads (DiscussionForumPosting)

export type ForumThread = {
  id: string
  slug: string
  title: string
  url?: string
  author?: string
  datePublished?: string
  dateModified?: string
  text?: string
  excerpt?: string
  commentCount?: number
  viewCount?: number
  comments?: {
    id: string
    author: string
    authorPhoto?: string
    text: string
    datePublished: string
    upvoteCount?: number
  }[]
}

/**
 * Generate a valid JSON-LD schema for either:
 *  - a forum overview (ItemList of threads)
 *  - an individual thread (DiscussionForumPosting with nested Comments)
 *
 * @param threads - Array of threads (for overview page)
 * @param thread  - Single thread object (for thread detail page)
 * @returns JSON-LD object or null
 */
export function generateForumSchema({
  threads,
  thread,
}: {
  threads?: ForumThread[]
  thread?: ForumThread
}) {
  const baseUrl = 'https://politie-forum.nl'

  // === Individual thread page (DiscussionForumPosting) ===
  if (thread) {
    const threadUrl = thread.url || `${baseUrl}/nieuws/${thread.slug}`

    return {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      '@id': threadUrl,
      headline: thread.title,
      datePublished: thread.datePublished || new Date().toISOString(),
      dateModified: thread.dateModified || thread.datePublished || new Date().toISOString(),
      url: threadUrl,
      image: thread.image || `${baseUrl}/og/politie-forum-1200x630.png`,
      text: thread.text || thread.excerpt || thread.title,
      author: {
        '@type': 'Person',
        '@id': `${baseUrl}/#editor`,
        name: thread.author || 'Politie Forum Redactie',
        url: `${baseUrl}/redactie`,
        jobTitle: 'Hoofdredacteur',
        worksFor: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#org`,
          name: 'Politie Forum Nederland',
        },
      },
      commentCount: thread.commentCount || thread.comments?.length || 0,
      comment: thread.comments?.map((c) => ({
        '@type': 'Comment',
        '@id': `${threadUrl}#comment-${c.id}`,
        author: {
          '@type': 'Person',
          name: c.author,
          url: c.authorUrl || `${baseUrl}/profiel/${encodeURIComponent(c.author)}`,
          image: c.authorPhoto || undefined,
        },
        text: c.text,
        datePublished: c.datePublished,
        upvoteCount: c.upvoteCount || 0,
      })) || [],
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/CommentAction',
          userInteractionCount: thread.commentCount || thread.comments?.length || 0,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ViewAction',
          userInteractionCount: thread.viewCount || 0,
        },
      ],
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#org`,
        name: 'Politie Forum Nederland',
        url: `${baseUrl}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.svg`,
          width: 512,
          height: 512,
        },
      },
      isPartOf: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
      },
      inLanguage: 'nl-NL',
    }
  }

  // === Forum overview / category page (ItemList) ===
  if (threads && threads.length > 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${baseUrl}/#popular-discussions`,
      name: 'Populaire Discussies',
      description: 'Meest recente en populaire forumonderwerpen.',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: threads.length,
      itemListElement: threads.map((t, i) => {
        const threadUrl = t.url || `${baseUrl}/nieuws/${t.slug}`

        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'DiscussionForumPosting',
            '@id': threadUrl,
            url: threadUrl,
            headline: t.title,
            image: t.image || `${baseUrl}/og/politie-forum-1200x630.png`,
            text: t.excerpt || t.title,
            datePublished: t.datePublished || new Date().toISOString(),
            dateModified: t.dateModified || t.datePublished || new Date().toISOString(),
            author: {
              '@type': 'Person',
              '@id': `${baseUrl}/#editor`,
              name: t.author || 'Politie Forum Redactie',
              url: `${baseUrl}/redactie`,
              jobTitle: 'Hoofdredacteur',
              worksFor: {
                '@type': 'Organization',
                '@id': `${baseUrl}/#org`,
                name: 'Politie Forum Nederland',
              },
            },
            interactionStatistic: [
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: t.commentCount || 0,
              },
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/ViewAction',
                userInteractionCount: t.viewCount || 0,
              },
            ],
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/#webpage`,
            },
            publisher: {
              '@type': 'Organization',
              '@id': `${baseUrl}/#org`,
              name: 'Politie Forum Nederland',
              url: `${baseUrl}/`,
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.svg`,
                width: 512,
                height: 512,
              },
            },
            inLanguage: 'nl-NL',
          },
        }
      }),
    }
  }

  // === Fallback (no data) ===
  return null
}
