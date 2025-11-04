# 🤖 RSS-to-Forum Quick Start

## Setup (1 minute)

1. **Get Groq API Key** (free): https://console.groq.com/keys
2. **Set environment variable:**
   ```bash
   export GROQ_API_KEY='your-api-key-here'
   ```

## Usage

**Process new articles manually:**
```bash
npm run rss-to-forum
```

**What it does:**
- ✅ Fetches latest Politie.nl news
- ✅ Finds new articles (max 5)
- ✅ Rewrites with Groq AI
- ✅ Posts to forum as topics
- ✅ Tracks to avoid duplicates

## Automatic Schedule

**Production:** Runs every 6 hours via Vercel Cron
- 00:00, 06:00, 12:00, 18:00

## Check Results

**Forum:** New topics appear in "Algemeen" category
**Author:** "Politie Nieuws Bot"

## Troubleshooting

**"No new articles"** → Normal! Wait for new RSS content
**"GROQ_API_KEY not set"** → Run: `export GROQ_API_KEY='your-key'`
**"Rate limit"** → Groq free tier maxed (unlikely, we use <1%)

## Rate Limits (Free Tier)

**Groq:**
- 30 requests/min (we use ~0.5/min)
- 14,400 requests/day (we use ~20/day)
- **95%+ headroom** ✅

## Files

- `src/lib/groq-rewriter.ts` - AI rewriting
- `src/lib/rss-to-forum.ts` - Pipeline logic
- `scripts/rss-to-forum.ts` - CLI script
- `src/app/api/cron/rss-to-forum/` - Cron endpoint

## Full Docs

See: `MD/RSS-TO-FORUM-AUTOMATION.md`
