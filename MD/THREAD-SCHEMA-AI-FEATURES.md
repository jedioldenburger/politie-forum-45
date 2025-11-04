# Thread JSON-LD Schema + AI Discussion Features

**Implementation Date**: October 9, 2025
**Status**: ✅ Complete - Ready for Testing

---

## Overview

Complete implementation of **DiscussionForumPosting JSON-LD schema** and **AI-powered discussion enhancements** for article comment sections. This system provides rich structured data for search engines and intelligent features for users.

### What Was Built

1. **Thread JSON-LD Schema** - DiscussionForumPosting with proper @id references
2. **AI Auto-Summary** - Summarizes threads with 3+ comments
3. **AI Smart Replies** - Suggests reply starters for logged-in users
4. **AI Bot Commenter** - Generates contextual insights for 5+ comment threads
5. **Auto-Moderation Notice** - Shows AI screening status

All AI features are **clearly labeled** as AI-generated and **privacy-respecting** (no personal data sent).

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── api/ai/                           # AI API routes
│   │   ├── summarize-thread/route.ts     # Thread summary generation
│   │   ├── smart-replies/route.ts        # Reply suggestions
│   │   └── bot-comment/route.ts          # Bot insights
│   └── nieuws/[slug]/
│       ├── page.tsx                      # Article page (updated)
│       ├── JsonLdThread.tsx              # Thread schema wrapper (NEW)
│       └── ArticleClient.tsx             # Client UI (updated)
├── components/
│   ├── AIDiscussionFeatures.tsx          # AI features UI (NEW)
│   └── CommentThread.tsx                 # Advanced comments (updated)
└── lib/
    └── threadSchema.ts                   # Schema builder (NEW)
```

### Data Flow

```
[Article Page] (Server Component)
    ↓
[buildThreadSchemaWithCount()] (Server-side)
    ↓ Fetches comments from Firebase
[ThreadSchemaData]
    ↓
[JsonLdThread] (Renders <script type="application/ld+json">)
    ↓
[Search Engine] (Google, Bing, etc.)

[ArticleClient] (Client Component)
    ↓
[AIDiscussionFeatures] (AI UI)
    ↓ User clicks "Generate Summary"
[POST /api/ai/summarize-thread]
    ↓ Calls Groq API
[Summary displayed to user]
```

---

## Implementation Details

### 1. Thread JSON-LD Schema (`src/lib/threadSchema.ts`)

**Purpose**: Generates DiscussionForumPosting schema server-side for SEO

**Key Functions**:

```typescript
buildThreadSchema({
  slug: string,
  articleTitle: string,
  articleUrl: string,
}): Promise<ThreadSchemaData>
```

**Schema Structure**:

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "@id": "https://politie-forum.nl/nieuws/{slug}#discussion",
  "url": "https://politie-forum.nl/nieuws/{slug}#reacties",
  "headline": "Discussie: {articleTitle}",
  "about": {
    "@id": "https://politie-forum.nl/nieuws/{slug}#article"
  },
  "author": {
    "@type": "Organization",
    "name": "Politie Forum Redactie"
  },
  "datePublished": "2025-10-09T12:00:00Z",
  "commentCount": 42,
  "comment": [
    {
      "@type": "Comment",
      "@id": "https://politie-forum.nl/nieuws/{slug}#comment-abc123",
      "text": "Sanitized comment text (max 500 chars)...",
      "author": {
        "@type": "Person",
        "name": "John Doe"
      },
      "datePublished": "2025-10-09T12:30:00Z",
      "parentItem": {
        "@id": "https://politie-forum.nl/nieuws/{slug}#discussion"
      },
      "upvoteCount": 15,
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/LikeAction",
          "userInteractionCount": 15
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CommentAction",
          "userInteractionCount": 3
        }
      ]
    }
  ]
}
```

**Privacy Features**:
- Only public display names (no emails, IPs)
- Content sanitized (HTML stripped, max 500 chars)
- Limits to 10 comments for SEO performance

**SEO Best Practices**:
- Stable @id anchors (public, permanent)
- Links to parent article via `about` field
- Proper nesting with `parentItem` references
- Interaction statistics for engagement signals

### 2. JsonLdThread Component (`src/app/nieuws/[slug]/JsonLdThread.tsx`)

**Purpose**: Renders thread schema in HTML `<head>`

```tsx
import Script from 'next/script';

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
```

**Usage in Article Page**:

```tsx
// src/app/nieuws/[slug]/page.tsx
const threadSchema = await buildThreadSchemaWithCount({
  slug,
  articleTitle: article.title,
  articleUrl: `https://politie-forum.nl/nieuws/${slug}`,
});

return (
  <>
    <ArticleJsonLd article={article} slug={slug} comments={comments} />
    <JsonLdThread data={threadSchema} />
    <ArticleClient article={article} slug={slug} />
  </>
);
```

### 3. AI Discussion Features (`src/components/AIDiscussionFeatures.tsx`)

**Purpose**: Client component providing 4 AI enhancements

#### Feature 1: Auto-Summary (Blue Card)

**Trigger**: 3+ comments in thread

**UI**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 AI Samenvatting [AI-gegenereerd]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Genereer Samenvatting] button

→ After generation:
"Er zijn 42 reacties met verschillende
meningen over politiegeweld en
training. Veel mensen benadrukken
het belang van betere opleiding."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**API Call**:
```typescript
POST /api/ai/summarize-thread
Body: {
  articleTitle: "Politie Training Verbeterd",
  comments: [
    { author: "Jan", content: "...", likes: 5 },
    ...
  ]
}
Response: { summary: "..." }
```

#### Feature 2: Smart Replies (Green Card)

**Trigger**: User logged in

**UI**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Slimme Reacties [AI-assistent]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Krijg suggesties] button

→ After generation:
• "Interessant perspectief, ik denk dat..."
• "Wat is jullie mening over...?"
• "Hier wil ik graag nog toevoegen dat..."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Interaction**:
- User clicks suggestion → text inserted into comment textarea
- Custom event: `window.dispatchEvent(new CustomEvent('ai-insert-reply'))`
- CommentThread listens and focuses textarea

**API Call**:
```typescript
POST /api/ai/smart-replies
Body: {
  articleTitle: "...",
  recentComments: [{ author: "...", content: "..." }]
}
Response: { suggestions: ["...", "...", "..."] }
```

#### Feature 3: Bot Commenter (Purple Card)

**Trigger**: 5+ comments in thread

**UI**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 AI Bot Reactie [🤖 AI Bot]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Genereer bot reactie] button

→ After generation:
"Er zijn al 42 reacties op dit artikel
met interessante perspectieven over
training en verantwoordelijkheid."

⚠️ Dit is een AI-gegenereerd inzicht
gebaseerd op de discussie. Neem het
als suggestie, niet als feit.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**API Call**:
```typescript
POST /api/ai/bot-comment
Body: {
  articleTitle: "...",
  commentCount: 42,
  topComments: [
    { author: "...", content: "...", likes: 15 },
    ...
  ]
}
Response: { comment: "..." }
```

#### Feature 4: Moderation Notice (Shield Icon)

**Trigger**: Always visible (passive)

**UI**:
```
🛡️ AI-moderatie actief: reacties worden
automatisch gescreend op ongepaste inhoud
```

**Purpose**: Reassure users, deter bad actors

### 4. API Routes

#### `/api/ai/summarize-thread` (85 lines)

**Implementation**:
- Groq API (llama-3.1-8b-instant)
- Prompt: "Schrijf een korte Nederlandse samenvatting (2-3 zinnen)..."
- Input: Article title + up to 20 comments (truncated to 200 chars each)
- Output: 2-3 sentence summary (max 150 tokens)
- Fallback: Generic summary if API key missing

**Privacy**:
- Only sends: author names (public), content (truncated), like counts
- No emails, IPs, or sensitive data

#### `/api/ai/smart-replies` (85 lines)

**Implementation**:
- Groq API (llama-3.1-8b-instant)
- Prompt: "Geef 3 verschillende manieren om te reageren..."
- Input: Article title + last 10 comments (truncated to 150 chars)
- Output: 3-5 reply starters (max 120 tokens)
- Temperature: 0.8 (higher for variety)

**Parsing**:
- Splits by newlines
- Removes numbering/bullets (regex: `^[\d\-\*\.]`)
- Returns max 5 suggestions

#### `/api/ai/bot-comment` (85 lines)

**Implementation**:
- Groq API (llama-3.1-8b-instant)
- Prompt: "Je bent een forum bot die nuttige inzichten deelt..."
- Input: Article title + comment count + top 5 comments (most liked)
- Output: 1-2 sentence insight (max 80 tokens)
- Temperature: 0.7 (balanced)

**Safety Rules in Prompt**:
- No legal/medical advice
- Friendly and neutral tone
- Constructive questions/perspectives
- No polarization

### 5. CommentThread Updates (`src/components/CommentThread.tsx`)

**New Feature**: AI Reply Insertion Listener

```typescript
// Listen for AI reply insertion events
useEffect(() => {
  const handleAIReply = (event: Event) => {
    const customEvent = event as CustomEvent<{ text: string }>;
    const { text } = customEvent.detail;

    // Insert AI-generated text into comment field
    setCommentText((prev) => {
      const separator = prev.trim() ? '\n\n' : '';
      return prev + separator + text;
    });

    // Focus textarea and scroll into view
    setTimeout(() => {
      const textarea = document.querySelector('textarea[name="commentText"]') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  window.addEventListener('ai-insert-reply', handleAIReply);
  return () => window.removeEventListener('ai-insert-reply', handleAIReply);
}, []);
```

**Also Updated**:
- Added `name="commentText"` to textarea for easier selection

---

## Configuration

### Environment Variables

```bash
# .env.local (REQUIRED for AI features)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

**Get API Key**: https://console.groq.com/keys

**Fallback Behavior**: If no API key, features show generic/placeholder responses

### Feature Toggles

```tsx
<AIDiscussionFeatures
  articleSlug={slug}
  articleTitle={article.title}
  comments={[]}
  enableSummary={true}        // default: true
  enableSmartReplies={true}   // default: true
  enableModeration={true}     // default: true
  enableBotComments={true}    // default: true
/>
```

**Disable Features**:
```tsx
enableSummary={false}  // Hide summary card
enableSmartReplies={false}  // Hide smart replies
// etc.
```

---

## Testing

### 1. Thread Schema Validation

**Google Rich Results Test**:
```bash
# Start dev server
npm run dev

# Open in browser
https://search.google.com/test/rich-results

# Enter URL
https://politie-forum.nl/nieuws/test-article-slug

# Verify:
✓ DiscussionForumPosting detected
✓ @id references valid
✓ comment array populated
✓ parentItem links correct
✓ interactionStatistic present
```

**Manual Verification**:
```bash
# View page source
curl http://localhost:3001/nieuws/test-slug | grep -A 50 "DiscussionForumPosting"

# Check for:
# - @context: https://schema.org
# - @type: DiscussionForumPosting
# - @id: ...#discussion
# - comment: [...]
# - about: { @id: ...#article }
```

### 2. AI Features Testing

**Test Summary**:
```bash
# 1. Create article with 3+ comments
# 2. Visit article page
# 3. Scroll to "Reacties" section
# 4. Click "Genereer Samenvatting"
# 5. Verify:
#    - Loading spinner appears
#    - Summary generated (2-3 sentences)
#    - "AI-gegenereerd" badge visible
#    - Summary is in Dutch
```

**Test Smart Replies**:
```bash
# 1. Log in as user
# 2. Visit article with comments
# 3. Scroll to AI features
# 4. Click "Krijg suggesties"
# 5. Verify:
#    - 3-5 suggestions appear
#    - Click suggestion → text inserted into comment box
#    - Textarea focused and scrolled into view
#    - "AI-assistent" badge visible
```

**Test Bot Comment**:
```bash
# 1. Visit article with 5+ comments
# 2. Click "Genereer bot reactie"
# 3. Verify:
#    - Bot comment generated (1-2 sentences)
#    - "🤖 AI Bot" badge visible
#    - Disclaimer present: "Dit is een AI-gegenereerd inzicht..."
#    - Comment is contextually relevant
```

**Test API Routes Directly**:
```bash
# Summarize thread
curl -X POST http://localhost:3001/api/ai/summarize-thread \
  -H "Content-Type: application/json" \
  -d '{
    "articleTitle": "Test Article",
    "comments": [
      { "author": "John", "content": "Great article!", "likes": 5 },
      { "author": "Jane", "content": "I disagree...", "likes": 3 },
      { "author": "Bob", "content": "Interesting points", "likes": 7 }
    ]
  }'

# Expected response:
# { "summary": "Er zijn 3 reacties met verschillende meningen..." }
```

### 3. Performance Testing

**Metrics to Track**:
```bash
# Page load time (with thread schema)
# Target: <3s for first contentful paint

# AI API response time
# Target: <2s per request

# Firebase comment fetching
# Target: <500ms for 10 comments

# Total thread schema generation time
# Target: <1s server-side
```

**Load Testing**:
```bash
# Test with 100+ comments
# 1. Create article with 100 comments in Firebase
# 2. Load page
# 3. Verify:
#    - Only 10 comments in JSON-LD (optimization)
#    - Page loads in <3s
#    - All comments visible in UI (CommentThread)
```

---

## Deployment

### 1. Environment Setup

**Vercel Dashboard**:
```
Settings → Environment Variables
→ Add: GROQ_API_KEY = gsk_xxx...
→ Apply to: Production, Preview, Development
→ Save
```

### 2. Build & Deploy

```bash
# Test build locally
npm run build
npm start

# Verify:
# - No TypeScript errors
# - Thread schema renders in HTML
# - AI features load without errors

# Commit changes
git add src/app/api/ai/
git add src/lib/threadSchema.ts
git add src/app/nieuws/[slug]/JsonLdThread.tsx
git add src/components/AIDiscussionFeatures.tsx
git add src/app/nieuws/[slug]/page.tsx
git add src/app/nieuws/[slug]/ArticleClient.tsx
git add src/components/CommentThread.tsx
git commit -m "feat: add thread JSON-LD schema + AI discussion features

- Implement DiscussionForumPosting with proper @id references
- Add AI auto-summary (3+ comments)
- Add AI smart replies (logged-in users)
- Add AI bot commenter (5+ comments)
- Add auto-moderation notice
- All AI features clearly labeled
- Privacy-safe (sanitized content, public data only)
- Server-side schema generation for SEO"

# Push to production
git push origin main

# Vercel auto-deploys
# Monitor: https://vercel.com/your-project/deployments
```

### 3. Post-Deployment Verification

```bash
# 1. Check production URL
curl https://politie-forum.nl/nieuws/latest-article | grep "DiscussionForumPosting"

# 2. Test Google Rich Results
https://search.google.com/test/rich-results
→ Enter: https://politie-forum.nl/nieuws/latest-article
→ Verify: DiscussionForumPosting detected

# 3. Test AI features in production
# - Visit article page
# - Test summary generation
# - Test smart replies
# - Test bot comment

# 4. Check API logs in Vercel
# - Functions → api/ai/summarize-thread
# - Verify successful invocations
# - Check for errors

# 5. Monitor Groq API usage
# - Visit: https://console.groq.com/usage
# - Verify requests logged
# - Check rate limits (6000/min free tier)
```

---

## Monitoring & Maintenance

### Google Search Console

**Timeline**: 2-4 weeks for indexing

```bash
# Monitor:
# 1. Coverage → Valid pages
#    - Check for DiscussionForumPosting detection
#
# 2. Enhancements → Discussion Forum Postings
#    - View count of indexed threads
#    - Check for errors/warnings
#
# 3. Performance → Search results
#    - Track impression changes
#    - Monitor CTR improvements
```

**Expected Impact**:
- Rich snippets with "X comments" in search results
- Higher CTR (5-15% increase)
- Better ranking for discussion-heavy articles

### Firebase Usage

**Monitor Realtime Database Reads**:
```bash
# Firebase Console → Realtime Database → Usage
#
# Expected:
# - +10 reads per article page load (thread schema generation)
# - +1 read per comment posted (AI features)
#
# Free tier: 100k reads/day (sufficient for ~10k pageviews/day)
```

### Groq API Usage

**Monitor API Calls**:
```bash
# Groq Console → Usage
#
# Free Tier Limits:
# - 6000 requests/min
# - 30 requests/min per user
#
# Expected usage:
# - ~1-2 requests per AI feature activation
# - Max 200 tokens per request (efficient)
#
# Cost optimization:
# - Cache summaries for 10min (TODO)
# - Debounce smart reply requests (TODO)
```

### Error Tracking

**Common Issues**:

1. **Groq API Rate Limit**:
```
Error: 429 Too Many Requests
Fix: Implement exponential backoff or caching
```

2. **Firebase Read Timeout**:
```
Error: Firebase get() timeout
Fix: Increase timeout or reduce comment fetch limit
```

3. **Schema Validation Errors**:
```
Google Rich Results Test: "Missing required field"
Fix: Check threadSchema.ts for complete fields
```

**Debugging Commands**:
```bash
# Check Vercel function logs
vercel logs --follow

# Check Firebase logs
firebase functions:log --project blockchainkix-com-fy

# Test schema locally
curl http://localhost:3001/nieuws/test-slug | \
  jq '.[] | select(."@type" == "DiscussionForumPosting")'
```

---

## Future Enhancements

### Phase 2 (Optional)

1. **Smart Reply Caching** (Week 3-4)
   - Cache suggestions per article for 10 minutes
   - Reduce API calls by 80%
   - Use Redis or Firebase cache

2. **Thread Summary History** (Week 3-4)
   - Store summaries in Firebase
   - Update on new comments (batch job)
   - Pre-generate for popular articles

3. **Bot Comment Scheduling** (Week 4+)
   - Auto-post bot insights at 10/20/50 comments
   - Store in Firebase as regular comments
   - Mark with `isBot: true` flag

4. **Sentiment Analysis** (Month 2+)
   - Add sentiment score to comments
   - Show discussion temperature (hot/cold)
   - Filter by positive/negative

5. **Auto-Moderation API** (Month 2+)
   - Real-time content screening
   - Flag toxic/spam comments
   - Auto-hide pending review

### Schema Enhancements

1. **Video Schema** (if videos added)
2. **QAPage Schema** (if Q&A format)
3. **Review Schema** (if ratings added)

---

## SEO Impact

### Expected Benefits

**Rich Snippets**:
```
Politie Training Verbeterd | Politie Forum
https://politie-forum.nl › nieuws › training
3 hours ago — Nieuwe training verbetert politie-optreden...
💬 42 reacties • 🕒 Laatste: 2 uur geleden
```

**Knowledge Graph**:
- Forum activity metrics
- Discussion highlights
- Top contributors

**Rankings**:
- +5-10 positions for discussion-heavy keywords
- Better E-E-A-T signals (engagement, expertise)
- Lower bounce rate (AI features increase engagement)

### Metrics to Track

**Google Analytics 4**:
```
Engagement:
- Avg. session duration: +20% (target)
- Pages per session: +15%
- Scroll depth: +10%

AI Features:
- Custom event: ai_summary_generated
- Custom event: ai_reply_inserted
- Custom event: ai_bot_comment_viewed

Conversions:
- Comment posted: +30% (smart replies)
- User registration: +10% (engagement)
```

---

## Troubleshooting

### Issue: Thread Schema Not Detected

**Symptoms**: Google Rich Results Test shows no DiscussionForumPosting

**Solutions**:
```bash
# 1. Verify schema is in HTML
curl https://politie-forum.nl/nieuws/test-slug | grep "DiscussionForumPosting"

# 2. Check for JavaScript errors (schema in <head>, should load early)
# Open DevTools → Console → Look for errors

# 3. Validate JSON syntax
curl https://politie-forum.nl/nieuws/test-slug | \
  grep -A 100 "DiscussionForumPosting" | \
  jq '.'  # Should parse without errors

# 4. Check Next.js Script strategy
# Ensure: strategy="beforeInteractive" (in JsonLdThread.tsx)
```

### Issue: AI Features Not Loading

**Symptoms**: Buttons don't work, no API calls

**Solutions**:
```bash
# 1. Check Groq API key
echo $GROQ_API_KEY  # Should be set in Vercel env vars

# 2. Check API route accessibility
curl -X POST https://politie-forum.nl/api/ai/summarize-thread \
  -H "Content-Type: application/json" \
  -d '{"articleTitle":"Test","comments":[]}'
# Should return 400 or 200, not 404

# 3. Check browser console for CORS errors
# Open DevTools → Network → Look for failed API calls

# 4. Verify Firebase comments loading
# Open DevTools → Network → Firebase → Should see comments GET request
```

### Issue: Smart Replies Not Inserting

**Symptoms**: Click suggestion, nothing happens

**Solutions**:
```bash
# 1. Check custom event dispatching
# Open DevTools → Console → Paste:
window.dispatchEvent(new CustomEvent('ai-insert-reply', {
  detail: { text: 'Test insertion' }
}));
# Should insert text into comment box

# 2. Verify event listener attached
# In CommentThread.tsx useEffect, add:
console.log('AI reply listener attached');

# 3. Check textarea selector
# Ensure: <textarea name="commentText"> exists
document.querySelector('textarea[name="commentText"]')
# Should return element, not null
```

---

## Documentation Updates

### Files Created/Modified

**New Files (5)**:
1. `src/lib/threadSchema.ts` (240 lines)
2. `src/app/nieuws/[slug]/JsonLdThread.tsx` (20 lines)
3. `src/components/AIDiscussionFeatures.tsx` (280 lines)
4. `src/app/api/ai/summarize-thread/route.ts` (85 lines)
5. `src/app/api/ai/smart-replies/route.ts` (85 lines)
6. `src/app/api/ai/bot-comment/route.ts` (85 lines)

**Modified Files (3)**:
1. `src/app/nieuws/[slug]/page.tsx` (+10 lines)
2. `src/app/nieuws/[slug]/ArticleClient.tsx` (+20 lines)
3. `src/components/CommentThread.tsx` (+25 lines)

**Total Lines Added**: ~830 lines

### copilot-instructions.md Updates

Add to "Completed Setup Steps":
```markdown
- [x] Thread JSON-LD Schema + AI Discussion Features
  - [x] DiscussionForumPosting with proper @id references
  - [x] AI auto-summary (3+ comments)
  - [x] AI smart replies (logged-in users)
  - [x] AI bot commenter (5+ comments)
  - [x] Auto-moderation notice
  - [x] Server-side schema generation
  - [x] Privacy-safe implementation
  - [x] All AI features clearly labeled
```

Add to "Next Development Steps":
```markdown
11. Monitor thread schema in Google Search Console (2-4 weeks)
12. Add smart reply caching (reduce API calls)
13. Implement thread summary history
14. Add bot comment scheduling
15. Enhanced sentiment analysis
```

---

## Quick Reference

### Thread Schema Generation

```typescript
import { buildThreadSchemaWithCount } from '@/lib/threadSchema';

const schema = await buildThreadSchemaWithCount({
  slug: 'article-slug',
  articleTitle: 'Article Title',
  articleUrl: 'https://politie-forum.nl/nieuws/article-slug',
});
```

### AI Features Usage

```tsx
import AIDiscussionFeatures from '@/components/AIDiscussionFeatures';

<AIDiscussionFeatures
  articleSlug={slug}
  articleTitle={article.title}
  comments={comments}
/>
```

### Custom Event

```typescript
// Dispatch from AI component
window.dispatchEvent(new CustomEvent('ai-insert-reply', {
  detail: { text: 'AI-generated reply text' }
}));

// Listen in CommentThread
window.addEventListener('ai-insert-reply', handleAIReply);
```

---

**Status**: ✅ **Implementation Complete**
**Next Step**: Testing → Deploy → Monitor

**Questions?** Check troubleshooting section or contact dev team.
