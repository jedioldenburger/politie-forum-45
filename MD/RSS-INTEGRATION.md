# RSS Feed Integration - Politie.nl

## Overview

Automatic RSS feed integration that fetches police news from `https://rss.politie.nl/rss/algemeen/ab/algemeen.xml` every hour.

## Features

- ✅ Hourly automatic updates via Vercel Cron Jobs
- ✅ Firebase caching to reduce API calls
- ✅ Manual update endpoint
- ✅ Automatic stale data refresh (> 1 hour old)
- ✅ RSS to News Article conversion

## Setup

### 1. Install Dependencies

```bash
npm install rss-parser node-cron
```

### 2. Configure Vercel Cron (Optional - Pro Plan Required)

The `vercel.json` file is already configured with:

```json
{
  "crons": [
    {
      "path": "/api/cron/rss",
      "schedule": "0 * * * *"
    }
  ]
}
```

### 3. Set Environment Variable (Optional Security)

Add to `.env.local`:

```
CRON_SECRET=your-secret-key-here
```

Then configure in Vercel:

```bash
vercel env add CRON_SECRET
```

## API Endpoints

### 1. Get RSS Feed

```bash
# Get cached feed (auto-refreshes if stale)
GET /api/rss/feed

# Force refresh
GET /api/rss/feed?refresh=true
```

**Response:**

```json
{
  "success": true,
  "data": {
    "title": "Politie Nieuws",
    "items": [...],
    "lastFetched": 1696348800000
  }
}
```

### 2. Manual Update

```bash
# Trigger manual RSS feed update
GET /api/rss/update
POST /api/rss/update
```

**Response:**

```json
{
  "success": true,
  "message": "RSS feed updated successfully with 25 items",
  "data": {
    "title": "Politie Nieuws",
    "itemCount": 25,
    "lastFetched": 1696348800000
  }
}
```

### 3. Cron Job Endpoint (Internal)

```bash
GET /api/cron/rss
# Requires Authorization: Bearer <CRON_SECRET>
```

## Manual Script

Run the manual update script:

```bash
npm run update-rss
```

Add to `package.json`:

```json
{
  "scripts": {
    "update-rss": "tsx scripts/update-rss.ts"
  }
}
```

## Usage in Components

### Fetch RSS Feed in Component

```typescript
import { getRSSFeed } from "@/lib/rss-feed";

export default async function NewsPage() {
  const feedData = await getRSSFeed();

  return (
    <div>
      <h1>{feedData?.title}</h1>
      {feedData?.items.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.contentSnippet}</p>
          <a href={item.link}>Lees meer</a>
        </article>
      ))}
    </div>
  );
}
```

### Client-Side Fetching

```typescript
"use client";

import { useEffect, useState } from "react";

export default function RSSFeed() {
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    fetch("/api/rss/feed")
      .then((res) => res.json())
      .then((data) => setFeed(data.data));
  }, []);

  // Render feed...
}
```

## Caching Strategy

1. **Firebase Cache**: RSS data stored in `rss/politie-feed`
2. **Auto-Refresh**: Cached data is refreshed if older than 1 hour
3. **Manual Refresh**: Use `?refresh=true` to force update
4. **Cron Job**: Automatic hourly updates (Vercel Pro only)

## Alternative: Client-Side Polling (Free Tier)

If you don't have Vercel Pro, use client-side polling:

```typescript
"use client";

import { useEffect } from "react";

export default function RSSUpdater() {
  useEffect(() => {
    // Update every hour
    const interval = setInterval(() => {
      fetch("/api/rss/update")
        .then((res) => res.json())
        .then((data) => console.log("RSS updated:", data));
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return null;
}
```

Add to your root layout:

```typescript
import RSSUpdater from "@/components/RSSUpdater";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RSSUpdater />
        {children}
      </body>
    </html>
  );
}
```

## Firebase Database Rules

Add to `database.rules.json`:

```json
{
  "rules": {
    "rss": {
      ".read": true,
      ".write": false
    }
  }
}
```

## Testing

### 1. Test RSS Fetch

```bash
npm run update-rss
```

### 2. Test API Endpoint

```bash
curl http://localhost:3001/api/rss/update
```

### 3. Test Cached Data

```bash
curl http://localhost:3001/api/rss/feed
```

## Monitoring

Check RSS feed status:

```typescript
const feedData = await getCachedRSSFeed();
if (feedData) {
  const age = Date.now() - feedData.lastFetched;
  const hours = Math.floor(age / (60 * 60 * 1000));
  console.log(`RSS feed is ${hours} hour(s) old`);
}
```

## Troubleshooting

### RSS Feed Not Updating

1. Check Firebase connection
2. Verify RSS URL is accessible
3. Check Vercel cron job logs
4. Manually trigger: `curl /api/rss/update`

### Stale Data

- Force refresh: `/api/rss/feed?refresh=true`
- Check `lastFetched` timestamp
- Verify cron job is running

### CORS Issues

The RSS feed is fetched server-side, so CORS is not an issue.

## Cost Optimization

1. **Use Cache**: Always check cache first
2. **Rate Limiting**: Max 1 update per hour
3. **Firebase Read/Write**: Minimal operations
4. **Vercel Functions**: Only 1 execution per hour

## Next Steps

1. ✅ RSS feed integration complete
2. 🔄 Display RSS items on homepage
3. 🔄 Create news article pages from RSS
4. 🔄 Add RSS item search
5. 🔄 Implement RSS categories
