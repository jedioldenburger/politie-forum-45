# News Article Dual System - Static HTML + Next.js

This document explains how the news system works with **both static HTML pages and dynamic Next.js rendering**, sharing the same design, header, footer, and Firebase comment system.

## 🎯 Overview

The forum now supports **two ways** to display news articles:

1. **Static HTML** - Fast-loading, pre-generated HTML files (SEO-friendly)
2. **Next.js Dynamic** - Server-side rendered pages with React interactivity

Both use:
- ✅ Same header and navigation
- ✅ Same footer
- ✅ Same Tailwind CSS styling
- ✅ Same dark/light mode toggle
- ✅ Same Firebase comment system
- ✅ Same URL structure

## 📁 File Structure

```
politie-forum-45/
├── public/
│   └── nieuws/
│       └── {slug}/
│           └── index.html          # Static HTML articles
│
├── src/
│   ├── app/
│   │   └── nieuws/
│   │       ├── page.tsx            # News listing page
│   │       └── [slug]/
│   │           └── page.tsx        # Dynamic article page
│   ├── data/
│   │   └── news.ts                 # Sample + Firebase news
│   └── lib/
│       └── firebaseNews.ts         # Firebase news fetcher
│
├── static-article-template-new.html # HTML template
├── news-rip.py                      # Python news ripper
└── news-rip-updated.py              # Updated functions
```

## 🔄 How It Works

### URL Structure

Both systems use the **same URL pattern**:

```
https://politie-forum.nl/nieuws/politieacademie-intake-2025-inschrijving-geopend
```

This URL can be served by:
1. **Static HTML**: `/public/nieuws/{slug}/index.html`
2. **Next.js**: `/src/app/nieuws/[slug]/page.tsx`

### Python News Ripper Workflow

```python
# 1. Extract article from RSS feed
article = extract_articles(rss_url, num_articles=1)[0]

# 2. Process and publish (does BOTH static + Firebase)
from news_rip_updated import process_and_publish_article

published = process_and_publish_article(article, db)

# This creates:
# ✅ /public/nieuws/{slug}/index.html (static)
# ✅ Firebase entry at /news/{slug} (for Next.js)
```

### What Gets Created

When you run the news ripper, it creates:

#### 1. Static HTML File
**Location**: `/public/nieuws/{slug}/index.html`

Features:
- Full HTML page with embedded CSS (Tailwind CDN)
- Firebase SDK included
- Comment system works client-side
- Dark mode toggle works with localStorage
- Standalone - no Next.js needed

#### 2. Firebase Database Entry
**Location**: Firebase Realtime Database → `/news/{slug}`

Data structure:
```json
{
  "news": {
    "article-slug-here": {
      "id": "article-slug-here",
      "slug": "article-slug-here",
      "title": "Article Title",
      "excerpt": "Short description...",
      "content": "<p>Full HTML content...</p>",
      "author": "Politie Forum Redactie",
      "publishedAt": "2025-10-08T10:30:00.000Z",
      "updatedAt": "2025-10-08T10:30:00.000Z",
      "category": "Nieuws",
      "tags": ["politie", "nieuws"],
      "imageUrl": "/og/politie-forum-1200x630.png",
      "featured": false,
      "source": "RSS Feed",
      "sourceUrl": "https://original-article-url.com"
    }
  }
}
```

## 🚀 Usage Guide

### 1. Install Dependencies

```bash
# Python dependencies
pip install firebase-admin feedparser beautifulsoup4 selenium anthropic openai nltk

# Node.js dependencies (already installed)
npm install
```

### 2. Generate Articles with Python

```bash
# Activate virtual environment
source venv/bin/activate

# Run news ripper
python3 news-rip.py
```

Choose option **10** (Advanced AI Rewriter) for best results.

### 3. Access Articles

Both URLs work immediately:

**Static HTML** (instant):
```
https://politie-forum.nl/nieuws/your-article-slug/
```

**Next.js** (requires rebuild):
```
https://politie-forum.nl/nieuws/your-article-slug
```

### 4. Deploy

```bash
# Build Next.js
npm run build

# Deploy to Vercel
vercel --prod
```

Static HTML files in `/public/nieuws/` are automatically served by Vercel.

## 🎨 Styling & Components

### Shared Tailwind Config

Both static and Next.js use the same color scheme:

```javascript
colors: {
  primary: {
    600: '#004bbf',  // Dark blue
    700: '#003a9e',
    800: '#00307f',
    900: '#001f5c',
  },
  accent: {
    500: '#e60000',  // Red
    600: '#cc0000',
  }
}
```

### Header Component

**Static HTML**: Uses pure HTML + JavaScript
**Next.js**: Uses React component (`src/components/Header.tsx`)

Both look identical!

### Dark Mode

**Static HTML**:
```javascript
// Uses localStorage + class toggle
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark', theme === 'dark');
```

**Next.js**:
```typescript
// Same logic in React
const [theme, setTheme] = useState<"light" | "dark">("light");
document.documentElement.classList.toggle("dark", theme === "dark");
```

## 💬 Comment System

### Firebase Integration

Both systems use **identical Firebase configuration**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDCRYKrWUvtOtDAY4TThjlm7AxkzHG-62s",
  authDomain: "blockchainkix-com-fy.firebaseapp.com",
  databaseURL: "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "blockchainkix-com-fy",
  // ...
};
```

### Comment Storage

Comments are stored in Firebase at:
```
/comments/
  {commentId}/
    articleSlug: "article-slug-here"
    authorId: "user-uid"
    authorName: "User Name"
    content: "Comment text"
    createdAt: 1728384000000
    likes: 0
    likedBy: []
```

### Real-time Updates

Both systems listen to the same Firebase path:

```javascript
database.ref('comments')
  .orderByChild('articleSlug')
  .equalTo(articleSlug)
  .on('value', (snapshot) => {
    // Update comments in real-time
  });
```

## 📊 Performance Comparison

### Static HTML
- ⚡ **Fastest** - No server rendering
- 📦 **Smallest** - Pure HTML/CSS/JS
- 🌐 **Best SEO** - Instant indexing
- 🔄 **No hydration** needed

### Next.js Dynamic
- ⚛️ **React features** - Full interactivity
- 🔄 **SSR** - Fresh data on each request
- 📱 **Better UX** - Smooth transitions
- 🎯 **Firebase integration** - Live data

## 🔧 Customization

### Update Template

Edit: `static-article-template-new.html`

Then regenerate articles with the Python script.

### Update Next.js Component

Edit: `src/app/nieuws/[slug]/page.tsx`

Changes apply immediately in dev mode.

### Update Styles

Both systems use Tailwind classes. Update the config in:
- Static: `<script>tailwind.config = {...}</script>`
- Next.js: `tailwind.config.ts`

## 🐛 Troubleshooting

### Static HTML Not Showing

1. Check file exists: `/public/nieuws/{slug}/index.html`
2. Rebuild Next.js: `npm run build`
3. Check Vercel deployment

### Next.js Article Not Found

1. Check Firebase has entry at `/news/{slug}`
2. Check console for errors
3. Verify `getNewsBySlugWithFirebase()` is called

### Comments Not Loading

1. Check Firebase config is correct
2. Verify article slug matches
3. Check browser console for errors
4. Test Firebase connection

### Dark Mode Not Working

1. Clear localStorage: `localStorage.clear()`
2. Check Lucide icons loaded
3. Verify theme toggle button works

## 📈 Best Practices

### For Maximum Performance
1. Generate static HTML for all articles
2. Use Next.js for dynamic, frequently-updated content
3. Enable Vercel caching

### For Best SEO
1. Static HTML is preferred
2. Add structured data (already included)
3. Use descriptive slugs

### For Development
1. Test in both static and Next.js
2. Keep Firebase sync'd with static files
3. Version control both systems

## 🔗 Related Files

- `static-article-template-new.html` - HTML template
- `news-rip-updated.py` - Python functions
- `src/lib/firebaseNews.ts` - Firebase fetcher
- `src/data/news.ts` - Combined news source
- `src/app/nieuws/[slug]/page.tsx` - Next.js component

## ✅ Checklist for New Articles

- [ ] Run Python news ripper
- [ ] Verify static HTML generated in `/public/nieuws/{slug}/`
- [ ] Check Firebase entry created at `/news/{slug}`
- [ ] Test static URL: `https://politie-forum.nl/nieuws/{slug}/`
- [ ] Test Next.js URL: `https://politie-forum.nl/nieuws/{slug}`
- [ ] Verify comments work on both
- [ ] Check dark mode works on both
- [ ] Deploy to Vercel

---

**Last Updated**: October 8, 2025
**Status**: ✅ Fully Operational
