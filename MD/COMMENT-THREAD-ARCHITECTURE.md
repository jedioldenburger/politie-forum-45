# CommentThread Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Article Page (/nieuws/[slug])                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    ArticleClient.tsx                        │    │
│  │                    (Client Component)                       │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │         CommentThread Component                   │     │    │
│  │  │         (1,200+ lines)                           │     │    │
│  │  │                                                  │     │    │
│  │  │  Props:                                         │     │    │
│  │  │  - articleSlug: string                         │     │    │
│  │  │  - enableAdvancedFeatures: true                │     │    │
│  │  │  - onSchemaUpdate: callback                    │     │    │
│  │  │                                                  │     │    │
│  │  │  ┌────────────────────────────────────┐       │     │    │
│  │  │  │     Firebase Realtime Database     │       │     │    │
│  │  │  │                                     │       │     │    │
│  │  │  │  /comments/{id}/                   │       │     │    │
│  │  │  │    - articleSlug                   │       │     │    │
│  │  │  │    - content                       │       │     │    │
│  │  │  │    - authorId                      │       │     │    │
│  │  │  │    - parentCommentId               │       │     │    │
│  │  │  │    - likes, likedBy[]              │       │     │    │
│  │  │  │    - isPinned, isBestAnswer        │       │     │    │
│  │  │  │                                     │       │     │    │
│  │  │  │  /users/{uid}/                     │       │     │    │
│  │  │  │    - badges/                       │       │     │    │
│  │  │  │    - watchedThreads/               │       │     │    │
│  │  │  │    - savedPosts/                   │       │     │    │
│  │  │  └────────────────────────────────────┘       │     │    │
│  │  │                    ▲                           │     │    │
│  │  │                    │ Real-time Listeners      │     │    │
│  │  │                    ▼                           │     │    │
│  │  │  ┌────────────────────────────────────┐       │     │    │
│  │  │  │     Comment State Management       │       │     │    │
│  │  │  │                                     │       │     │    │
│  │  │  │  useState: comments[]              │       │     │    │
│  │  │  │  useState: userStats{}             │       │     │    │
│  │  │  │  useState: replyingTo              │       │     │    │
│  │  │  │  useState: editingComment          │       │     │    │
│  │  │  │  useState: watchedThreads[]        │       │     │    │
│  │  │  │  useState: savedPosts[]            │       │     │    │
│  │  │  └────────────────────────────────────┘       │     │    │
│  │  │                    │                           │     │    │
│  │  │                    ▼                           │     │    │
│  │  │  ┌────────────────────────────────────┐       │     │    │
│  │  │  │   Comment Tree Builder             │       │     │    │
│  │  │  │   buildNestedComments()            │       │     │    │
│  │  │  │                                     │       │     │    │
│  │  │  │   Flat Array → Nested Tree         │       │     │    │
│  │  │  │   using parentCommentId            │       │     │    │
│  │  │  └────────────────────────────────────┘       │     │    │
│  │  │                    │                           │     │    │
│  │  │                    ▼                           │     │    │
│  │  │  ┌────────────────────────────────────┐       │     │    │
│  │  │  │   Recursive Rendering              │       │     │    │
│  │  │  │   renderComment(comment, depth)    │       │     │    │
│  │  │  │                                     │       │     │    │
│  │  │  │   ┌─────────────────────────┐     │       │     │    │
│  │  │  │   │  Comment Card (Depth 0)  │     │       │     │    │
│  │  │  │   │  Avatar: 48px            │     │       │     │    │
│  │  │  │   │  Font: text-base         │     │       │     │    │
│  │  │  │   │                          │     │       │     │    │
│  │  │  │   │  ┌───────────────────┐  │     │       │     │    │
│  │  │  │   │  │ Reply (Depth 1)   │  │     │       │     │    │
│  │  │  │   │  │ Avatar: 44px      │  │     │       │     │    │
│  │  │  │   │  │ Font: text-sm     │  │     │       │     │    │
│  │  │  │   │  │                   │  │     │       │     │    │
│  │  │  │   │  │ ┌──────────────┐ │  │     │       │     │    │
│  │  │  │   │  │ │ Reply (D=2)  │ │  │     │       │     │    │
│  │  │  │   │  │ │ Avatar: 40px │ │  │     │       │     │    │
│  │  │  │   │  │ └──────────────┘ │  │     │       │     │    │
│  │  │  │   │  └───────────────────┘  │     │       │     │    │
│  │  │  │   └─────────────────────────┘     │       │     │    │
│  │  │  └────────────────────────────────────┘       │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  │                                                             │    │
│  │  ┌──────────────────────────────────────────────────┐     │    │
│  │  │         ArticleJsonLd Component                   │     │    │
│  │  │         (Server Component)                        │     │    │
│  │  │                                                   │     │    │
│  │  │  Receives: comments[] from onSchemaUpdate       │     │    │
│  │  │                                                   │     │    │
│  │  │  Generates:                                      │     │    │
│  │  │  {                                               │     │    │
│  │  │    "@type": "DiscussionForumPosting",           │     │    │
│  │  │    "commentCount": comments.length,             │     │    │
│  │  │    "comment": [                                 │     │    │
│  │  │      {                                          │     │    │
│  │  │        "@type": "Comment",                     │     │    │
│  │  │        "@id": "...#comment-123",               │     │    │
│  │  │        "parentItem": "...#comment-456",        │     │    │
│  │  │        "interactionStatistic": {...}           │     │    │
│  │  │      }                                          │     │    │
│  │  │    ]                                            │     │    │
│  │  │  }                                              │     │    │
│  │  └──────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
CommentThread (Main Container)
│
├─ Header Section
│  ├─ Title + Comment Count
│  ├─ Sort Dropdown (newest/oldest/popular)
│  └─ Toolbar
│     ├─ Export Menu (JSON/CSV)
│     └─ Leaderboard Toggle
│
├─ Leaderboard Modal (conditional)
│  └─ Top 10 Users List
│     ├─ Rank Badge
│     ├─ Avatar
│     ├─ Display Name
│     ├─ Level Info
│     └─ Stats (comments, likes, score)
│
├─ Comment Form (if logged in)
│  ├─ Textarea (with placeholder)
│  ├─ Formatting Toolbar
│  │  ├─ Bold Button
│  │  ├─ Italic Button
│  │  ├─ Underline Button
│  │  ├─ Link Button
│  │  ├─ Image Button
│  │  └─ Upload Button
│  ├─ Image Preview (if image selected)
│  └─ Submit Button
│
├─ Login Prompt (if not logged in)
│  └─ Message + Link to Auth
│
└─ Comments List
   │
   ├─ Comment Card (Root Level - Depth 0)
   │  │
   │  ├─ Avatar (48px)
   │  ├─ Header
   │  │  ├─ Author Name
   │  │  ├─ Level Badge (Lv1-6)
   │  │  ├─ Achievement Badges (max 2 shown)
   │  │  ├─ Pinned Badge (if pinned)
   │  │  ├─ Best Answer Badge (if marked)
   │  │  └─ Timestamp
   │  │
   │  ├─ Content
   │  │  ├─ Formatted Text (HTML with markdown)
   │  │  ├─ Image (if attached)
   │  │  └─ Poll (if present)
   │  │
   │  ├─ Action Bar
   │  │  ├─ Like Button (with count)
   │  │  ├─ Reply Button
   │  │  ├─ Watch Button (if logged in)
   │  │  ├─ Save Button (if logged in)
   │  │  ├─ Edit Button (if author)
   │  │  ├─ Delete Button (if author)
   │  │  ├─ Pin Button (if logged in)
   │  │  └─ Best Answer Button (if logged in)
   │  │
   │  ├─ Reply Form (if replying)
   │  │  ├─ Textarea
   │  │  ├─ Mini Formatting Toolbar
   │  │  └─ Submit/Cancel Buttons
   │  │
   │  └─ Nested Replies (Depth 1)
   │     │
   │     ├─ Reply Card (44px avatar, text-sm)
   │     │  └─ [Same structure as root, recursively]
   │     │
   │     └─ Nested Replies (Depth 2)
   │        │
   │        ├─ Reply Card (40px avatar, text-sm)
   │        │  └─ [Same structure, recursively]
   │        │
   │        └─ Nested Replies (Depth 3...)
   │           └─ [Continues infinitely until maxDepth]
   │
   └─ [More Root Comments...]
```

## Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                       User Actions Flow                            │
└───────────────────────────────────────────────────────────────────┘

1. USER SUBMITS COMMENT
   │
   ├─> handleSubmitComment(e)
   │   │
   │   ├─> Validate: currentUser, text not empty
   │   ├─> Parse: mentions (@user), hashtags (#tag)
   │   ├─> Create: Firebase Realtime Database entry
   │   │   └─> /comments/{newId}
   │   │       ├─ articleSlug
   │   │       ├─ content
   │   │       ├─ authorId
   │   │       ├─ createdAt
   │   │       └─ mentions[], hashtags[]
   │   │
   │   └─> Clear: commentText state
   │
   └─> Firebase onValue Listener Triggers
       │
       ├─> Fetch: All comments for articleSlug
       ├─> Build: Nested tree (buildNestedComments)
       ├─> Update: comments[] state
       └─> Callback: onSchemaUpdate(comments)
           │
           └─> ArticleJsonLd receives new data
               └─> Generates updated JSON-LD schema

2. USER LIKES COMMENT
   │
   ├─> handleLikeComment(commentId)
   │   │
   │   ├─> Check: currentUser logged in
   │   ├─> Fetch: Current comment data
   │   ├─> Update: Firebase Realtime Database
   │   │   └─> /comments/{commentId}
   │   │       ├─ likes: +1 or -1
   │   │       └─ likedBy: add/remove UID
   │   │
   │   └─> Optimistic UI Update (instant feedback)
   │
   └─> Firebase onValue Listener Triggers
       └─> Re-render with updated likes

3. USER REPLIES TO COMMENT
   │
   ├─> setReplyingTo(commentId)
   │   └─> Show reply form below comment
   │
   └─> handleSubmitReply(parentId)
       │
       ├─> Validate: currentUser, text not empty
       ├─> Create: Firebase Realtime Database entry
       │   └─> /comments/{newId}
       │       └─ parentCommentId: parentId
       │
       └─> Firebase Listener Updates Tree
           └─> Reply appears nested under parent

4. USER EDITS COMMENT
   │
   ├─> setEditingComment(commentId)
   │   └─> Show edit form in place of content
   │
   └─> handleEditComment(commentId)
       │
       ├─> Validate: currentUser is author
       ├─> Update: Firebase Realtime Database
       │   └─> /comments/{commentId}
       │       ├─ content: new text
       │       ├─ isEdited: true
       │       └─ editedAt: timestamp
       │
       └─> Firebase Listener Updates Display

5. USER WATCHES THREAD
   │
   └─> handleWatchThread(commentId)
       │
       ├─> Check: if already watching
       ├─> Update: Firebase Realtime Database
       │   └─> /users/{uid}/watchedThreads/{commentId}
       │       └─ watchedAt: timestamp
       │
       └─> Update: watchedThreads[] state
           └─> Button changes to "Stop watching"

6. USER EXPORTS COMMENTS
   │
   ├─> exportToJSON()
   │   │
   │   ├─> Stringify: comments array
   │   ├─> Create: Blob (application/json)
   │   └─> Download: comments-{slug}-{timestamp}.json
   │
   └─> exportToCSV()
       │
       ├─> Convert: comments to CSV rows
       ├─> Create: Blob (text/csv)
       └─> Download: comments-{slug}-{timestamp}.csv
```

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Component State                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Core State                                             │
│  ├─ comments: CommentData[]          # All comments    │
│  ├─ loading: boolean                 # Loading state   │
│  ├─ sortOrder: string                # Sort preference │
│  └─ filterOptions: object            # Filter settings │
│                                                          │
│  Form State                                             │
│  ├─ commentText: string              # Main form       │
│  ├─ replyText: string                # Reply form      │
│  ├─ replyingTo: string|null          # Active reply    │
│  ├─ editText: string                 # Edit form       │
│  └─ editingComment: string|null      # Active edit     │
│                                                          │
│  Media State                                            │
│  ├─ selectedImage: string|null       # Image preview   │
│  └─ imageSize: number                # File size       │
│                                                          │
│  UI State                                               │
│  ├─ showLeaderboard: boolean         # Modal visible   │
│  ├─ isSubmitting: boolean            # Form disabled   │
│  └─ authModalOpen: boolean           # Auth prompt     │
│                                                          │
│  User Data                                              │
│  ├─ userStats: {[uid]: UserStats}    # Cached stats   │
│  ├─ watchedThreads: string[]         # Thread IDs      │
│  └─ savedPosts: string[]             # Post IDs        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Performance Optimizations

```
┌──────────────────────────────────────────────────────────┐
│              Performance Techniques Applied               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Memoization                                          │
│     ├─ useMemo: nestedComments (tree building)          │
│     ├─ useMemo: filteredComments (filtering/sorting)    │
│     ├─ useMemo: leaderboard (top 10 calculation)        │
│     └─ useCallback: filterAndSortComments function       │
│                                                           │
│  2. Optimistic Updates                                   │
│     ├─ Like button: Update UI instantly, sync later     │
│     ├─ Watch/Save: Toggle state immediately              │
│     └─ Delete: Remove from state, then Firebase         │
│                                                           │
│  3. Conditional Rendering                                │
│     ├─ Show leaderboard only when toggled               │
│     ├─ Render reply form only when replying             │
│     └─ Load badges only when enableAdvancedFeatures     │
│                                                           │
│  4. Lazy Loading (Future)                                │
│     ├─ Virtualize long lists (react-virtuoso)           │
│     ├─ Load replies on demand ("Show more...")          │
│     └─ Intersection Observer for images                 │
│                                                           │
│  5. Efficient Tree Building                              │
│     ├─ Two-pass algorithm (O(n) time complexity)        │
│     ├─ Map-based lookup (O(1) parent finding)           │
│     └─ Single nested structure (no duplicates)          │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Firebase Realtime Listeners

```
┌─────────────────────────────────────────────────────────┐
│                  Active Listeners                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Comments Listener                                   │
│     Path: /comments                                     │
│     Query: orderByChild('articleSlug')                  │
│            .equalTo(articleSlug)                        │
│     Trigger: onValue (real-time updates)                │
│     Cleanup: unsubscribe on unmount                     │
│                                                          │
│  2. Watched Threads Listener                            │
│     Path: /users/{userId}/watchedThreads                │
│     Trigger: onValue                                    │
│     Cleanup: unsubscribe on unmount                     │
│                                                          │
│  3. Saved Posts Listener                                │
│     Path: /users/{userId}/savedPosts                    │
│     Trigger: onValue                                    │
│     Cleanup: unsubscribe on unmount                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Integration Points

```
┌──────────────────────────────────────────────────────────┐
│               External System Integrations                │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. Firebase Auth (via AuthContext)                      │
│     └─ Provides: currentUser object                     │
│                                                           │
│  2. Firebase Realtime Database                           │
│     └─ Stores: All comment data                         │
│                                                           │
│  3. ArticleJsonLd Component                              │
│     └─ Receives: comments[] via onSchemaUpdate callback │
│                                                           │
│  4. news-rip.py Script                                   │
│     └─ Fetches: Comments via get_article_comments()     │
│                                                           │
│  5. Google Search (SEO)                                  │
│     └─ Reads: DiscussionForumPosting JSON-LD            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

**Last Updated**: October 9, 2025
**Version**: 2.0.0
**Component Size**: 1,200+ lines
**Max Nesting Depth**: Infinity (configurable)
