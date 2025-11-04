// src/lib/schemaBuilder.ts
// Universal JSON-LD Schema Builder - Automatic semantic SEO for all routes
// Part of Politie Forum Nederland's semantic ecosystem


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SchemaContext {
  pathname: string;
  content?: any;
  baseUrl?: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

// ============================================================================
// CORE ENTITIES (Always Present)
// ============================================================================

function getOrganizationSchema(baseUrl: string) {
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#org`,
    name: 'Politie Forum Nederland',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+31-20-1234567',
      contactType: 'customer service',
      email: 'info@politie-forum.nl',
      areaServed: 'NL',
      availableLanguage: 'Dutch',
    },
    sameAs: [
      'https://www.facebook.com/politieforum',
      'https://twitter.com/politieforum',
      'https://www.linkedin.com/company/politie-forum',
    ],
    foundingDate: '2024',
    description: 'Onafhankelijk discussieplatform voor politie, veiligheid en justitie in Nederland.',
  };
}

function getWebSiteSchema(baseUrl: string) {
  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Politie Forum Nederland',
    description: 'Het grootste onafhankelijke forum over politie, veiligheid en justitie in Nederland.',
    publisher: { '@id': `${baseUrl}/#org` },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/zoeken?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'SearchAction',
        target: `${baseUrl}/zoeken?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
    inLanguage: 'nl-NL',
  };
}

// ============================================================================
// ROUTE-SPECIFIC SCHEMAS
// ============================================================================

function getNewsArticleSchema(baseUrl: string, id: string, content: any) {
  if (!content) return null;

  return {
    '@type': 'NewsArticle',
    '@id': id,
    headline: content.title || content.headline,
    alternativeHeadline: content.subtitle,
    description: content.summary || content.excerpt,
    datePublished: content.datePublished || content.publishedAt,
    dateModified: content.dateModified || content.updatedAt || content.datePublished,
    author: {
      '@type': 'Person',
      name: content.author || 'Redactie Politie Forum',
      url: content.authorUrl || `${baseUrl}/redactie`,
    },
    publisher: { '@id': `${baseUrl}/#org` },
    image: content.image || content.imageUrl || `${baseUrl}/og/default-news.jpg`,
    articleBody: content.content || content.text || '',
    articleSection: content.category || 'Nieuws',
    keywords: content.keywords || content.tags?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': id,
    },
    isAccessibleForFree: true,
    inLanguage: 'nl-NL',
  };
}

function getBlogPostingSchema(baseUrl: string, id: string, content: any) {
  if (!content) return null;

  return {
    '@type': 'BlogPosting',
    '@id': id,
    headline: content.title,
    description: content.excerpt || content.summary,
    datePublished: content.datePublished,
    dateModified: content.dateModified || content.datePublished,
    author: {
      '@type': 'Person',
      name: content.author,
      url: content.authorUrl || `${baseUrl}/user/${content.authorId}`,
    },
    publisher: { '@id': `${baseUrl}/#org` },
    image: content.image || `${baseUrl}/og/default-blog.jpg`,
    articleBody: content.text || content.content,
    keywords: content.tags?.join(', '),
    mainEntityOfPage: id,
    wordCount: content.wordCount,
    inLanguage: 'nl-NL',
  };
}

function getDiscussionForumPostingSchema(baseUrl: string, id: string, content: any) {
  if (!content) return null;

  const comments = (content.comments || []).slice(0, 10).map((c: any, i: number) => ({
    '@type': 'Comment',
    '@id': `${id}#comment-${i + 1}`,
    text: c.text || c.content,
    author: {
      '@type': 'Person',
      name: c.author || c.authorName || 'Anoniem',
    },
    datePublished: c.datePublished || c.createdAt,
    upvoteCount: c.upvotes || 0,
  }));

  return {
    '@type': 'DiscussionForumPosting',
    '@id': id,
    headline: content.title,
    text: content.text || content.content,
    author: {
      '@type': 'Person',
      name: content.author || content.authorName,
      url: `${baseUrl}/user/${content.authorId}`,
    },
    datePublished: content.datePublished || content.createdAt,
    commentCount: content.commentCount || content.comments?.length || 0,
    comment: comments,
    publisher: { '@id': `${baseUrl}/#org` },
    mainEntityOfPage: id,
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/ViewAction',
        userInteractionCount: content.viewCount || 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: content.commentCount || 0,
      },
    ],
  };
}

function getDiscussionForumSchema(baseUrl: string) {
  return {
    '@type': 'DiscussionForum',
    '@id': `${baseUrl}/#discussion-forum`,
    name: 'Politie Forum Nederland - Discussieplatform',
    description: 'Onafhankelijk discussieplatform voor politie, veiligheid en justitie in Nederland.',
    publisher: { '@id': `${baseUrl}/#org` },
    url: `${baseUrl}/`,
  };
}

function getCollectionPageSchema(baseUrl: string, id: string, content: any) {
  if (!content) return null;

  return {
    '@type': 'CollectionPage',
    '@id': id,
    name: content.title || content.name,
    description: content.description,
    url: id,
    publisher: { '@id': `${baseUrl}/#org` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: content.items?.length || 0,
      itemListElement: (content.items || []).map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url || `${baseUrl}${item.path}`,
        name: item.title || item.name,
      })),
    },
  };
}

function getFAQPageSchema(baseUrl: string, id: string, content: any) {
  if (!content?.questions || content.questions.length === 0) return null;

  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: content.questions.map((q: any) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function getHowToSchema(baseUrl: string, id: string, content: any) {
  if (!content?.steps || content.steps.length === 0) return null;

  return {
    '@type': 'HowTo',
    '@id': id,
    name: content.title,
    description: content.description,
    image: content.image,
    totalTime: content.totalTime,
    estimatedCost: content.cost,
    step: content.steps.map((s: any, i: number) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name || `Stap ${i + 1}`,
      text: s.text || s,
      image: s.image,
      url: s.url,
    })),
    tool: content.tools?.map((t: string) => ({
      '@type': 'HowToTool',
      name: t,
    })),
  };
}

function getEventSchema(baseUrl: string, id: string, content: any) {
  if (!content?.startDate) return null;

  return {
    '@type': 'Event',
    '@id': id,
    name: content.name || content.title,
    description: content.description,
    startDate: content.startDate,
    endDate: content.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: content.online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: content.online
      ? {
          '@type': 'VirtualLocation',
          url: content.url || id,
        }
      : {
          '@type': 'Place',
          name: content.location,
          address: {
            '@type': 'PostalAddress',
            streetAddress: content.address,
            addressLocality: content.city,
            postalCode: content.postalCode,
            addressCountry: 'NL',
          },
        },
    organizer: { '@id': `${baseUrl}/#org` },
    image: content.image,
    offers: content.price !== undefined ? {
      '@type': 'Offer',
      price: content.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: id,
    } : undefined,
  };
}

function getProfilePageSchema(baseUrl: string, id: string, content: any) {
  const username = content?.username || id.split('/').pop();

  return {
    '@type': 'ProfilePage',
    '@id': id,
    url: id,
    mainEntity: {
      '@type': 'Person',
      name: content?.name || username,
      url: id,
      image: content?.avatar,
      description: content?.bio,
      memberOf: {
        '@type': 'ProgramMembership',
        '@id': `${baseUrl}/#membership`,
        programName: 'Politie Forum Nederland Community',
        hostingOrganization: { '@id': `${baseUrl}/#org` },
        membershipNumber: content?.userId,
      },
      interactionStatistic: content?.stats ? [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WriteAction',
          userInteractionCount: content.stats.posts || 0,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/CommentAction',
          userInteractionCount: content.stats.comments || 0,
        },
      ] : undefined,
    },
  };
}

function getSearchResultsPageSchema(baseUrl: string, id: string, content: any) {
  return {
    '@type': 'SearchResultsPage',
    '@id': id,
    url: id,
    name: `Zoekresultaten: ${content?.query || ''}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: content?.results?.length || 0,
      itemListElement: (content?.results || []).map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.title,
      })),
    },
  };
}

function getPolicySchema(baseUrl: string, id: string) {
  return {
    '@type': 'WebPage',
    '@id': id,
    url: id,
    name: 'Privacybeleid - Politie Forum Nederland',
    description: 'Privacy- en datagebruiksbeleid van Politie Forum Nederland.',
    publisher: { '@id': `${baseUrl}/#org` },
    inLanguage: 'nl-NL',
  };
}

function getTermsOfServiceSchema(baseUrl: string, id: string) {
  return {
    '@type': 'WebPage',
    '@id': id,
    url: id,
    name: 'Algemene Voorwaarden - Politie Forum Nederland',
    description: 'Algemene voorwaarden voor het gebruik van Politie Forum Nederland.',
    publisher: { '@id': `${baseUrl}/#org` },
    inLanguage: 'nl-NL',
  };
}

function getClaimReviewSchema(baseUrl: string, id: string, content: any) {
  if (!content?.claim || !content?.rating) return null;

  return {
    '@type': 'ClaimReview',
    '@id': id,
    url: id,
    claimReviewed: content.claim,
    itemReviewed: {
      '@type': 'Claim',
      author: {
        '@type': content.claimAuthorType || 'Person',
        name: content.claimAuthor,
      },
      datePublished: content.claimDate,
      appearance: {
        '@type': 'OpinionNewsArticle',
        url: content.claimSource,
        headline: content.claimHeadline,
      },
    },
    author: { '@id': `${baseUrl}/#org` },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: content.rating, // 1-5
      bestRating: 5,
      worstRating: 1,
      alternateName: content.ratingLabel, // "Waar", "Deels waar", "Onwaar", etc.
    },
    datePublished: content.datePublished,
  };
}

// ============================================================================
// MAIN BUILDER FUNCTION
// ============================================================================

export function buildSchema({ pathname, content, baseUrl = 'https://politie-forum.nl' }: SchemaContext) {
  const id = `${baseUrl}${pathname}`;
  const pageSchemas: any[] = [];

  // === Core entities (always present) ===
  const org = getOrganizationSchema(baseUrl);
  const website = getWebSiteSchema(baseUrl);

  // === Route-specific detection ===

  // News articles
  if (pathname.startsWith('/nieuws/') && pathname !== '/nieuws' && content) {
    const newsSchema = getNewsArticleSchema(baseUrl, id, content);
    if (newsSchema) pageSchemas.push(newsSchema);

    // Check for ClaimReview (fact-checking)
    if (content.claimReview) {
      const claimSchema = getClaimReviewSchema(baseUrl, id, content.claimReview);
      if (claimSchema) pageSchemas.push(claimSchema);
    }
  }

  // News overview
  else if (pathname === '/nieuws' || pathname === '/nieuws/') {
    const collectionSchema = getCollectionPageSchema(baseUrl, id, {
      title: 'Nieuwsoverzicht',
      description: 'Laatste nieuws over politie, veiligheid en justitie.',
      items: content?.articles || [],
    });
    if (collectionSchema) pageSchemas.push(collectionSchema);
  }

  // Blog posts
  else if (pathname.startsWith('/blog/') && pathname !== '/blog' && content) {
    const blogSchema = getBlogPostingSchema(baseUrl, id, content);
    if (blogSchema) pageSchemas.push(blogSchema);
  }

  // Forum threads
  else if (pathname.startsWith('/forum/topic/') && content) {
    const forumPostSchema = getDiscussionForumPostingSchema(baseUrl, id, content);
    if (forumPostSchema) pageSchemas.push(forumPostSchema);
  }

  // Forum categories
  else if (pathname.startsWith('/forum/') && pathname !== '/forum' && pathname !== '/forum/' && content) {
    const collectionSchema = getCollectionPageSchema(baseUrl, id, content);
    if (collectionSchema) pageSchemas.push(collectionSchema);
  }

  // Forum homepage
  else if (pathname === '/' || pathname === '') {
    const forumSchema = getDiscussionForumSchema(baseUrl);
    pageSchemas.push(forumSchema);
  }

  // FAQ pages
  else if ((pathname.includes('/faq') || pathname.includes('/help')) && content?.questions) {
    const faqSchema = getFAQPageSchema(baseUrl, id, content);
    if (faqSchema) pageSchemas.push(faqSchema);
  }

  // HowTo guides
  else if (pathname.startsWith('/howto/') && content?.steps) {
    const howtoSchema = getHowToSchema(baseUrl, id, content);
    if (howtoSchema) pageSchemas.push(howtoSchema);
  }

  // Events
  else if (pathname.startsWith('/events/') && content?.startDate) {
    const eventSchema = getEventSchema(baseUrl, id, content);
    if (eventSchema) pageSchemas.push(eventSchema);
  }

  // User profiles
  else if (pathname.startsWith('/user/') || pathname.startsWith('/profiel/')) {
    const profileSchema = getProfilePageSchema(baseUrl, id, content);
    if (profileSchema) pageSchemas.push(profileSchema);
  }

  // Search results
  else if (pathname.startsWith('/zoeken') || pathname.startsWith('/search')) {
    const searchSchema = getSearchResultsPageSchema(baseUrl, id, content);
    if (searchSchema) pageSchemas.push(searchSchema);
  }

  // Privacy policy
  else if (pathname.includes('/privacy')) {
    const policySchema = getPolicySchema(baseUrl, id);
    pageSchemas.push(policySchema);
  }

  // Terms of service
  else if (pathname.includes('/voorwaarden') || pathname.includes('/terms')) {
    const termsSchema = getTermsOfServiceSchema(baseUrl, id);
    pageSchemas.push(termsSchema);
  }

  // === Build final @graph ===
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [org, website, ...pageSchemas],
  };

  return graph;
}

// ============================================================================
// HELPER: DETECT SCHEMA TYPES FROM CONTENT
// ============================================================================

export function detectSchemaTypes(content: any): string[] {
  const types: string[] = [];

  if (!content) return types;

  // FAQ detection
  if (content.questions?.length > 0) types.push('FAQPage');

  // HowTo detection
  if (content.steps?.length > 0) types.push('HowTo');

  // Event detection
  if (content.startDate) types.push('Event');

  // Review detection
  if (content.rating !== undefined) types.push('Review');

  // ClaimReview detection
  if (content.claim && content.reviewRating) types.push('ClaimReview');

  return types;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export { getOrganizationSchema, getWebSiteSchema };
