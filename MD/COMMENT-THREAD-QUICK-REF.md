# CommentThread Component - Quick Reference

**Component**: `src/components/CommentThread.tsx`
**Lines**: 1,200+
**Status**: ✅ Production Ready

## Quick Start

### Basic Usage
```tsx
import CommentThread from "@/components/CommentThread";

<CommentThread articleSlug="article-slug" />
```

### Full Configuration
```tsx
<CommentThread
  articleSlug="article-slug"
  enableAdvancedFeatures={true}
  maxDepth={Infinity}
  initialSortOrder="newest"
  onSchemaUpdate={(comments) => {
    // Handle comment updates for JSON-LD
  }}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `articleSlug` | string | **required** | Article identifier for comments |
| `onSchemaUpdate` | function | undefined | Callback with comment data for SEO |
| `enableAdvancedFeatures` | boolean | true | Toggle all advanced features |
| `maxDepth` | number | Infinity | Maximum nesting depth |
| `initialSortOrder` | string | "newest" | Default sort (newest/oldest/popular) |

## Feature Overview

### 🎯 Core Features (Always Active)
- Infinite nested replies
- Like/unlike comments
- Reply to any comment
- Real-time updates
- Visual hierarchy

### 🏆 Gamification (enableAdvancedFeatures)
- 6 user levels (Rookie → Legend)
- 8 achievement badges
- Top 10 leaderboard
- Score calculation (comments × 10 + likes × 5)

### ✍️ Rich Formatting (enableAdvancedFeatures)
| Syntax | Result |
|--------|--------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `__underline__` | underline |
| `[text](url)` | link |
| `![alt](url)` | image |
| `@username` | mention |
| `#hashtag` | hashtag |

### 💫 Advanced Interactions (enableAdvancedFeatures)
- 👁️ Watch threads for notifications
- 🔖 Save posts for later
- 📌 Pin important comments
- ✅ Mark best answers
- ✏️ Edit own comments
- 🗑️ Delete own comments
- 📷 Upload images (max 300KB)

### 📊 Export & Analytics (enableAdvancedFeatures)
- Export to JSON (full data)
- Export to CSV (spreadsheet)
- User statistics dashboard
- Real-time comment counts

## Markdown Quick Reference

### Text Formatting
```
**This is bold text**
*This is italic text*
__This is underlined text__
```

### Links & Images
```
[Link text](https://example.com)
![Image alt text](https://example.com/image.jpg)
```

### Mentions & Hashtags
```
Hey @username, check out this #topic
```

### Auto-Detection
URLs are automatically converted to clickable links:
```
Check out https://example.com
```

## Firebase Structure

### Comment Document
```typescript
{
  id: "comment-id-12345",
  articleSlug: "article-slug",
  authorId: "user-uid",
  authorName: "John Doe",
  authorEmail: "john@example.com",
  authorPhoto: "https://...",
  content: "Comment text with **formatting**",
  createdAt: 1696867200000,
  likes: 5,
  likedBy: ["uid1", "uid2", "uid3"],
  parentCommentId: null,  // or parent comment ID
  isPinned: false,
  isBestAnswer: false,
  isEdited: false,
  mentions: ["@username"],
  hashtags: ["#topic"],
  imageUrl: "data:image/png;base64,..."
}
```

### User Paths
```
/users/{userId}/badges/{badgeId}     # Earned badges
/users/{userId}/watchedThreads/      # Threads being watched
/users/{userId}/savedPosts/          # Saved posts
```

## Common Tasks

### Disable Advanced Features
```tsx
<CommentThread
  articleSlug="slug"
  enableAdvancedFeatures={false}  // Disables badges, levels, leaderboard, export
/>
```

### Limit Nesting Depth
```tsx
<CommentThread
  articleSlug="slug"
  maxDepth={3}  // Max 3 levels deep
/>
```

### Connect to JSON-LD Schema
```tsx
const [comments, setComments] = useState([]);

<CommentThread
  articleSlug="slug"
  onSchemaUpdate={setComments}  // Updates when comments change
/>

<ArticleJsonLd
  article={article}
  slug={slug}
  comments={comments}  // Pass to schema generator
/>
```

### Custom Sort Order
```tsx
<CommentThread
  articleSlug="slug"
  initialSortOrder="popular"  // newest | oldest | popular
/>
```

## User Levels

| Level | Name | Min Score | Color |
|-------|------|-----------|-------|
| 1 | Rookie | 0 | Slate |
| 2 | Member | 100 | Blue |
| 3 | Contributor | 500 | Green |
| 4 | Expert | 1,500 | Purple |
| 5 | Master | 4,000 | Orange |
| 6 | Legend | 10,000 | Red |

**Score Formula**: `commentCount × 10 + totalLikes × 5`

## Badges

| Badge | Icon | Requirement |
|-------|------|-------------|
| Eerste Reactie | 💬 | 1 comment |
| Gesprekspartner | 🗣️ | 10 comments |
| Populair | ⭐ | 50 likes |
| Expert | 🎓 | Level 4 |
| Veteraan | 🛡️ | 50 comments |
| Legende | 👑 | Level 6 |
| Helper | 🤝 | 5 best answers |
| On Fire | 🔥 | 100 likes |

## Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+K` | Insert link |
| `Enter` | Submit comment |
| `Esc` | Cancel reply |

## Performance Tips

### For Small Threads (<50 comments)
- Default settings work perfectly
- No optimization needed

### For Medium Threads (50-500 comments)
- Consider disabling leaderboard on mobile
- Use `maxDepth={5}` to limit nesting

### For Large Threads (500+ comments)
- Implement pagination (future feature)
- Consider virtualization (future feature)
- Disable real-time updates on low-end devices

## Troubleshooting

### Comments not loading?
1. Check Firebase database URL in `.env.local`
2. Verify articleSlug matches Firebase data
3. Check browser console for errors
4. Ensure Firebase security rules allow reads

### Images not uploading?
1. Verify file size < 300KB
2. Check file type (must be image/*)
3. Ensure currentUser is authenticated
4. Review browser console for errors

### Likes not working?
1. Ensure user is logged in
2. Check Firebase security rules allow writes
3. Verify `likedBy` array structure in Firebase
4. Review network tab for failed requests

### Formatting not rendering?
1. Check `enableAdvancedFeatures={true}`
2. Verify content has valid markdown syntax
3. Inspect rendered HTML for correct tags
4. Ensure CSS classes are applied

## Migration from ArticleComments

### Old Component (ArticleComments)
```tsx
import ArticleComments from "@/components/ArticleComments";

<ArticleComments articleSlug={slug} />
```

### New Component (CommentThread)
```tsx
import CommentThread from "@/components/CommentThread";

<CommentThread
  articleSlug={slug}
  enableAdvancedFeatures={true}
/>
```

### Breaking Changes
- ✅ **None!** - Fully backward compatible
- Old comments display correctly
- All Firebase data preserved
- No migration script needed

### Data Structure Changes
- `parentId` → `parentCommentId` (both supported)
- New fields added (optional): `isPinned`, `isBestAnswer`, `isEdited`, `mentions`, `hashtags`, `imageUrl`

## API Reference

### Component Methods (Internal)
```typescript
// Firebase operations
handleSubmitComment(e: FormEvent): Promise<void>
handleSubmitReply(parentId: string): Promise<void>
handleLikeComment(commentId: string): Promise<void>
handleEditComment(commentId: string): Promise<void>
handleDeleteComment(commentId: string): Promise<void>

// Moderation
handlePinComment(commentId: string, isPinned: boolean): Promise<void>
handleMarkBestAnswer(commentId: string, isBestAnswer: boolean): Promise<void>

// User actions
handleWatchThread(commentId: string): Promise<void>
handleSavePost(commentId: string): Promise<void>

// Formatting
insertFormatting(before: string, after: string): void
formatTextWithLinks(text: string): string

// Tree building
buildNestedComments(flatComments: CommentData[]): CommentData[]
renderComment(comment: CommentData, depth: number): ReactNode

// Export
exportToJSON(): void
exportToCSV(): void
```

### Helper Functions
```typescript
// Utility functions
calculateScore(stats: UserStats): number
getUserLevel(score: number): Level
formatTimestamp(timestamp: number): string
```

## Related Documentation

- **Full Documentation**: `MD/ADVANCED-COMMENT-SYSTEM.md`
- **Firebase Setup**: `MD/FIREBASE-SETUP.md`
- **JSON-LD Integration**: `MD/ADVANCED-SCHEMA-IMPLEMENTATION.md`
- **Performance Guide**: `MD/PERFORMANCE-OPTIMIZATION.md`

## Support

- **Issues**: File on GitHub Issues
- **Questions**: Ask in #dev-help Slack
- **Bug Reports**: Include browser, steps to reproduce, console errors

---

**Last Updated**: October 9, 2025
**Version**: 2.0.0
**Maintainer**: [Your Team]
