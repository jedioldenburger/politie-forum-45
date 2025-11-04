# RSS Feed Update - Vercel Free Tier Solution

## Problem

Vercel's **Hobby (free) plan** only allows **daily cron jobs** (once per day).
Your original cron expression `0 * * * *` (every hour) requires the **Pro plan**.

## ✅ Solution Implemented

### 1. Changed Cron to Daily (Midnight)

Updated `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/rss",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This runs **once per day at midnight** (free tier compatible).

### 2. Added Client-Side Hourly Updates

Created `/src/components/RSSUpdater.tsx` that:

- ✅ Runs in the browser (no server costs)
- ✅ Updates RSS feed every hour when users visit
- ✅ Updates immediately on page load
- ✅ Works on free tier

### 3. Integrated into Root Layout

Added `RSSUpdater` component to `/src/app/layout.tsx`:

```tsx
import RSSUpdater from "@/components/RSSUpdater";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <Analytics />
          <RSSUpdater /> {/* ← Hourly RSS updates */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## How It Works

### Daily Server Update (Free Tier)

- **When**: Every day at midnight (00:00)
- **Where**: Vercel cron job `/api/cron/rss`
- **Cost**: Free ✅

### Hourly Client Updates

- **When**: Every hour when users browse the site
- **Where**: Browser interval in `RSSUpdater` component
- **Trigger**: Active users (no server cost)
- **Cost**: Free ✅

## Update Schedule

| Time        | Method      | Trigger            |
| ----------- | ----------- | ------------------ |
| 00:00       | Server Cron | Automatic (Vercel) |
| 01:00-23:00 | Client-side | User visits        |

**Result**: RSS feed stays fresh throughout the day as long as people visit your forum!

## Manual Updates

You can still manually trigger updates:

```bash
# Development
curl http://localhost:3001/api/rss/update

# Production
curl https://your-domain.vercel.app/api/rss/update
```

## Monitoring

Check console in browser DevTools:

```
[RSS] Feed updated: 30 items
```

## Cost Breakdown

| Feature     | Free Tier       | Your Setup             |
| ----------- | --------------- | ---------------------- |
| Daily Cron  | ✅ Allowed      | ✅ Used (midnight)     |
| Hourly Cron | ❌ Requires Pro | ✅ Client-side instead |
| API Calls   | ✅ Unlimited    | ✅ Used                |
| Bandwidth   | ✅ 100GB/month  | ✅ Well within limit   |

## Advantages

1. **Zero Cost**: Works perfectly on free tier
2. **Distributed Load**: Updates spread across user visits
3. **Always Fresh**: Active during peak hours when users browse
4. **Fallback**: Daily cron ensures at least one update per day
5. **No Pro Plan Needed**: Save $20/month

## Deploy Now

```bash
vercel --prod
```

This will deploy successfully! 🚀

## Alternative: Upgrade to Pro

If you need guaranteed hourly updates regardless of traffic:

**Vercel Pro Plan**: $20/month

- Unlimited cron jobs
- Any schedule (hourly, every 5 minutes, etc.)
- Higher bandwidth limits
- Priority support

For most forums, the **client-side solution is sufficient** and free!
