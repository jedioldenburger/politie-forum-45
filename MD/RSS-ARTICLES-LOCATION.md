# Where RSS Articles Are Stored

## 📍 Storage Location

### Firebase Realtime Database Path:

```
rss/politie-feed
```

### Data Structure:

```json
{
  "rss": {
    "politie-feed": {
      "title": "Landelijke feed | Alle berichten | politie.nl",
      "description": "...",
      "link": "https://www.politie.nl",
      "lastBuildDate": "2025-10-03T20:22:00.000Z",
      "lastFetched": 1696348307000,
      "items": [
        {
          "id": "unique-id-1",
          "title": "Steekincident Maastricht...",
          "link": "https://www.politie.nl/nieuws/2025/...",
          "pubDate": "2025-10-03T20:22:00.000Z",
          "content": "Full HTML content...",
          "contentSnippet": "Plain text excerpt...",
          "guid": "unique-guid",
          "categories": ["nieuws"],
          "creator": "Politie Nederland",
          "enclosure": {
            "url": "https://...",
            "type": "image/jpeg"
          }
        }
        // ... 30 items total
      ]
    }
  }
}
```

## 🔍 How to Access RSS Articles

### Option 1: API Endpoint (Recommended)

```bash
# Get all RSS articles
GET https://your-domain.vercel.app/api/rss/feed

# Response:
{
  "success": true,
  "data": {
    "title": "Landelijke feed | Alle berichten | politie.nl",
    "items": [
      // 30 news articles
    ],
    "lastFetched": 1696348307000
  }
}
```

### Option 2: Direct Firebase Query (Server)

```typescript
import { getCachedRSSFeed } from "@/lib/rss-feed";

export default async function Page() {
  const feedData = await getCachedRSSFeed();

  return (
    <div>
      {feedData?.items.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.contentSnippet}</p>
          <a href={item.link}>Read more</a>
        </article>
      ))}
    </div>
  );
}
```

### Option 3: Client-Side Fetch

```typescript
"use client";

import { useEffect, useState } from "react";

export default function RSSFeed() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("/api/rss/feed")
      .then((res) => res.json())
      .then((data) => setArticles(data.data.items));
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <time>{new Date(article.pubDate).toLocaleString("nl-NL")}</time>
          <p>{article.contentSnippet}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📊 Current Data

### Storage Details:

- **Location**: Firebase Realtime Database
- **Path**: `rss/politie-feed`
- **Update Frequency**:
  - Daily at midnight (Vercel cron)
  - Hourly when users visit (client-side)
- **Article Count**: ~30 latest items
- **Source**: https://rss.politie.nl/rss/algemeen/ab/algemeen.xml

### Article Fields:

| Field            | Type     | Description                       |
| ---------------- | -------- | --------------------------------- |
| `id`             | string   | Unique identifier                 |
| `title`          | string   | Article headline                  |
| `link`           | string   | URL to full article on politie.nl |
| `pubDate`        | string   | Publication date (ISO 8601)       |
| `content`        | string   | Full HTML content                 |
| `contentSnippet` | string   | Plain text excerpt                |
| `guid`           | string   | Globally unique ID                |
| `categories`     | string[] | Categories/tags                   |
| `creator`        | string   | Author name                       |
| `enclosure`      | object   | Attached media (images, etc.)     |

## 🎨 Display Examples

### Example 1: News List Page

```typescript
// /app/news/page.tsx
import { getCachedRSSFeed } from "@/lib/rss-feed";

export default async function NewsPage() {
  const feed = await getCachedRSSFeed();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Live Politie Nieuws</h1>

      <div className="grid gap-6">
        {feed?.items.map((article) => (
          <article
            key={article.id}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md"
          >
            <h2 className="text-xl font-bold mb-2">{article.title}</h2>

            <time className="text-sm text-slate-500">
              {new Date(article.pubDate).toLocaleDateString("nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {article.contentSnippet}
            </p>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-primary-600 hover:text-primary-700"
            >
              Lees meer op Politie.nl →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Breaking News Banner (Current Implementation)

```typescript
// Using in /app/forum/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ForumPage() {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    fetch("/api/rss/feed")
      .then((res) => res.json())
      .then((data) => setLatestNews(data.data.items.slice(0, 5)));
  }, []);

  return (
    <div>
      {/* Breaking News Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {latestNews.map((item, i) => (
              <span key={i}>{item.title} •</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rest of forum... */}
    </div>
  );
}
```

### Example 3: Recent News Widget

```typescript
// Sidebar widget showing latest 5 articles
export function RecentNewsWidget() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("/api/rss/feed")
      .then((res) => res.json())
      .then((data) => setNews(data.data.items.slice(0, 5)));
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Laatste Nieuws</h3>

      <div className="space-y-4">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            className="block hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded transition"
          >
            <div className="text-sm font-medium line-clamp-2">
              {article.title}
            </div>
            <time className="text-xs text-slate-500 mt-1 block">
              {new Date(article.pubDate).toLocaleDateString("nl-NL")}
            </time>
          </a>
        ))}
      </div>
    </div>
  );
}
```

## 🔄 Update Flow

1. **Initial Fetch**: RSS feed fetched from Politie.nl
2. **Stored in Firebase**: Data saved to `rss/politie-feed`
3. **Cached**: Subsequent requests use cached data
4. **Auto-Update**:
   - Daily at midnight (Vercel cron)
   - Hourly when users visit (RSSUpdater component)
5. **Serve**: API endpoint returns cached data

## 🛠️ Manual Operations

### View RSS Data in Firebase Console:

1. Go to Firebase Console
2. Navigate to Realtime Database
3. Look for: `rss` → `politie-feed`

### Manually Update RSS Feed:

```bash
# Development
curl http://localhost:3001/api/rss/update

# Production
curl https://your-domain.vercel.app/api/rss/update
```

### Check Last Update Time:

```typescript
const feed = await getCachedRSSFeed();
const lastUpdate = new Date(feed.lastFetched);
console.log(`Last updated: ${lastUpdate.toLocaleString("nl-NL")}`);
```

## 📝 Important Notes

1. **Not Separate Articles**: RSS items are stored as a single feed object, not individual database entries
2. **External Links**: Articles link to politie.nl (original source)
3. **Read-Only**: Users can view but not modify RSS articles
4. **Automatic Updates**: No manual intervention needed
5. **Cache Duration**: Data refreshed when older than 1 hour

## 🚀 Next Steps

To display RSS articles on your site:

1. **Create News Page**: `/app/nieuws-feed/page.tsx`
2. **Add to Navigation**: Link in header/menu
3. **Integrate in Forum**: Show latest in sidebar
4. **Breaking News**: Use in banner (already shown above)
5. **Search**: Add search functionality for RSS items
