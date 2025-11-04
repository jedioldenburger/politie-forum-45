# RSS-to-Forum Automation

Automatic pipeline that fetches Politie.nl RSS articles, rewrites them using Groq AI, and posts them as forum topics.

## 🎯 Overview

**Flow:** RSS Feed → Groq AI Rewriter → Forum Topic Creation

1. **Fetch** - Get latest articles from Politie.nl RSS feed
2. **Filter** - Find new articles that haven't been processed
3. **Rewrite** - Use Groq AI to make content more engaging for forum discussion
4. **Post** - Create forum topics in "Algemeen" category
5. **Track** - Mark articles as processed to avoid duplicates

## 🔧 Setup

### 1. Get Groq API Key (Free)

1. Go to https://console.groq.com/keys
2. Sign up for a free account
3. Create a new API key
4. Copy the key

### 2. Add Environment Variable

**For Vercel (Production):**
```bash
# In Vercel Dashboard → Settings → Environment Variables
GROQ_API_KEY=your-api-key-here
```

**For Local Development:**
```bash
# In your terminal
export GROQ_API_KEY='your-api-key-here'

# Or add to .env.local
echo "GROQ_API_KEY=your-api-key-here" >> .env.local
```

## 📝 Usage

### Manual Execution

Process new articles manually:

```bash
npm run rss-to-forum
```

This will:
- Fetch latest RSS feed
- Find up to 5 new articles
- Rewrite each with Groq AI
- Post to forum as topics
- Mark as processed

### API Endpoint

Trigger via HTTP request:

```bash
curl https://your-domain.com/api/cron/rss-to-forum
```

### Automated (Cron)

The system runs automatically every 6 hours via Vercel Cron:

**Schedule:** `0 */6 * * *` (Every 6 hours at minute 0)
- 00:00 (midnight)
- 06:00 (morning)
- 12:00 (noon)
- 18:00 (evening)

## 🤖 AI Rewriting

### Groq Settings

- **Model:** `llama-3.3-70b-versatile`
- **Free Tier Limits:**
  - 30 requests per minute
  - 14,400 requests per day
  - More than enough for daily news

### Rewriting Rules

The AI follows these instructions:

✅ **Keep all facts and details exactly as they are**
✅ **Make title engaging but professional**
✅ **Write in clear Dutch**
✅ **Add intro that invites discussion**
✅ **End with question to community**
✅ **Use paragraphs for readability**
✅ **Always add source link at bottom**
✅ **Maximum 300 words**

### Example Transformation

**Before (RSS):**
```
Title: Man aangehouden en aanhanger in beslag genomen
Content: Politie heeft vandaag een man aangehouden...
```

**After (Groq AI):**
```
Title: Gestolen aanhanger teruggevonden: Verdachte aangehouden na onderzoek
Content:
Vandaag heeft de politie een doorbraak bereikt in een onderzoek naar diefstal.
Een man is aangehouden in verband met...

Deze zaak toont opnieuw het belang van waakzaamheid.
Wat denken jullie over de straf voor voertuigdiefstal?

Bron: https://www.politie.nl/nieuws/...
```

## 📊 Tracking System

### Processed Articles Database

Articles are tracked to prevent duplicates:

**Firebase Path:** `rss/processed-articles`

**Structure:**
```json
{
  "rss-abc123": {
    "rssId": "article-guid",
    "title": "Original title",
    "link": "https://...",
    "processedAt": 1234567890,
    "topicId": "forum-topic-id"
  }
}
```

### Forum Bot Identity

**Bot Details:**
- **User ID:** `rss-bot`
- **Display Name:** `Politie Nieuws Bot`
- **Category:** `cat1` (Algemeen)

## 🚀 Production Deployment

### Vercel Configuration

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/rss-to-forum",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Environment Variables

Required in Vercel:

1. ✅ `GROQ_API_KEY` - Your Groq API key
2. ✅ `CRON_SECRET` - (Optional) For cron authentication
3. ✅ All Firebase credentials (already configured)

### Deploy Commands

```bash
# Deploy to Vercel
vercel --prod

# Or via git push (if connected to GitHub)
git push origin main
```

## 📈 Rate Limiting

### Free Tier Protection

**Built-in delays:**
- 2 seconds between article rewrites
- Max 5 articles per run
- Runs every 6 hours = 20 articles/day max

**Groq Free Tier:**
- 30 requests/minute (we use ~0.5/min)
- 14,400 requests/day (we use ~20/day)
- **Plenty of headroom!** ✅

## 🔍 Monitoring

### Check Logs

**Vercel Dashboard:**
1. Go to your project
2. Click "Functions"
3. Find `/api/cron/rss-to-forum`
4. View execution logs

**Local Testing:**
```bash
npm run rss-to-forum
```

### Success Indicators

```
✅ RSS Feed Update Successful!
✅ Found X new articles
✅ Rewritten: [article title]
✅ Created forum topic: [topic title]
✅ Successfully posted to forum (ID: xxx)
```

## 🛠️ Troubleshooting

### GROQ_API_KEY not set

**Error:**
```
❌ ERROR: GROQ_API_KEY environment variable is not set
```

**Solution:**
```bash
export GROQ_API_KEY='your-key-here'
```

### No new articles

**Message:**
```
ℹ️  No new articles to process
```

**This is normal!** It means:
- All RSS articles have already been posted
- Wait for Politie.nl to publish new content

### Rate limit exceeded

**Error:**
```
429 Too Many Requests
```

**Solution:**
- Increase delay between requests
- Reduce `maxArticles` parameter
- Wait for rate limit to reset

## 📋 Files Created

```
src/lib/groq-rewriter.ts          # Groq AI integration
src/lib/rss-to-forum.ts            # Main pipeline logic
scripts/rss-to-forum.ts            # CLI script
src/app/api/cron/rss-to-forum/     # API endpoint
```

## 🎯 Next Steps

1. ✅ Set up GROQ_API_KEY in Vercel
2. ✅ Test manually: `npm run rss-to-forum`
3. ✅ Deploy to production
4. ✅ Monitor first cron run
5. ✅ Check forum for new topics

## 📚 Related Documentation

- [RSS Integration](./RSS-INTEGRATION.md)
- [RSS Free Tier Solution](./RSS-FREE-TIER-SOLUTION.md)
- [RSS Articles Location](./RSS-ARTICLES-LOCATION.md)
