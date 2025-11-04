# Sitemap Automation & Cron Setup

**Date**: October 9, 2025
**Status**: ✅ Implemented

## Overview

Dynamic sitemap generation and hourly automation for the Politie Forum website, ensuring search engines always have up-to-date content.

## Features Added

### 1. **Option 20: Update Next.js Sitemap** 🔄
- **Purpose**: Force sitemap update across all platforms
- **What it does**:
  - Generates local sitemaps (`sitemap.xml`, `news-sitemap.xml`, `robots.txt`)
  - Triggers Next.js ISR revalidation via API
  - Updates Firebase Hosting sitemaps
- **Use case**: Run after publishing new articles manually

### 2. **Option 21: Setup Cron Automation** ⏰
- **Purpose**: Configure hourly automated workflow
- **What it does**:
  - Creates cron job: `0 * * * *` (every hour)
  - Runs full workflow automatically
  - Logs all activity to `automation.log`
- **Features**:
  - Auto-detects existing cron jobs
  - Offers to update or install
  - Provides manual setup instructions

### 3. **Option 22: Automate All** 🤖
- **Purpose**: Full workflow execution (updated with sitemap generation)
- **Workflow**:
  1. Extract articles from politie.nl RSS (20 articles)
  2. Process for full content → `articles_full`
  3. AI rewrite with SEO → `articles_rewritten`
  4. Publish to `/news` collection → Next.js ISR
  5. Sync to Crime Map
  6. **Generate sitemaps** (new step)

### 4. **Command-Line Automation** 💻
- **Usage**: `python3 news-rip.py --automate`
- **Purpose**: Run without interactive menu (for cron)
- **Features**:
  - Silent execution
  - Logs to stdout/stderr
  - Exit codes (0 = success, 1 = error)

## How It Works

### Sitemap Generation Flow

```
Python Script (news-rip.py)
  ↓
Firestore /news collection
  ↓
Generate 3 files:
  • sitemap.xml (static pages + articles)
  • news-sitemap.xml (Google News format)
  • robots.txt (crawler rules)
  ↓
Deploy to:
  • Firebase Hosting (public/)
  • Next.js triggers ISR revalidation
  ↓
Live sitemaps:
  • https://politie-forum.nl/sitemap.xml
  • https://politie-forum.nl/news-sitemap.xml
  • https://politie-forum.nl/robots.txt
```

### Next.js Dynamic Sitemap

**File**: `src/app/sitemap.ts`

```typescript
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch articles from Firestore /news collection
  const articlesSnapshot = await adminFirestore.collection("news").get();

  // Generate sitemap with static pages + articles
  return [...staticPages, ...articlePages];
}
```

**Features**:
- Auto-fetches from Firestore
- Updates hourly (ISR)
- No manual intervention needed

## Setup Instructions

### Automatic Setup (Recommended)

1. Run the script:
   ```bash
   cd /Users/_akira/CSAD/websites-new-2025/politie-forum-45
   python3 news-rip.py
   ```

2. Select option **21** (Setup Cron Automation)

3. Follow prompts to install cron job

4. Verify installation:
   ```bash
   crontab -l | grep news-rip.py
   ```

### Manual Setup

1. Edit crontab:
   ```bash
   crontab -e
   ```

2. Add this line:
   ```cron
   0 * * * * cd /Users/_akira/CSAD/websites-new-2025/politie-forum-45 && /usr/bin/python3 /Users/_akira/CSAD/websites-new-2025/politie-forum-45/news-rip.py --automate >> /Users/_akira/CSAD/websites-new-2025/politie-forum-45/automation.log 2>&1
   ```

3. Save and exit

## Cron Schedule Explained

**`0 * * * *`** means:
- **0** = minute (on the hour)
- ***** = every hour
- ***** = every day of month
- ***** = every month
- ***** = every day of week

**Result**: Runs at 00:00, 01:00, 02:00, ..., 23:00

## Monitoring

### View Logs

```bash
# Real-time log monitoring
tail -f /Users/_akira/CSAD/websites-new-2025/politie-forum-45/automation.log

# Last 100 lines
tail -100 automation.log

# Search for errors
grep -i error automation.log
```

### Check Cron Status

```bash
# List active cron jobs
crontab -l

# View system cron logs (macOS)
log show --predicate 'eventMessage contains "cron"' --last 1h

# Check if automation is running
ps aux | grep news-rip.py
```

### Test Automation

```bash
# Manual test run
cd /Users/_akira/CSAD/websites-new-2025/politie-forum-45
python3 news-rip.py --automate

# Check exit code
echo $?  # Should be 0 for success
```

## Sitemap Verification

### Check Live Sitemaps

```bash
# Main sitemap
curl -s https://politie-forum.nl/sitemap.xml | grep -c '<loc>'

# News sitemap
curl -s https://politie-forum.nl/news-sitemap.xml | grep -c '<loc>'

# Robots.txt
curl -s https://politie-forum.nl/robots.txt
```

### Validate XML

```bash
# Check if sitemap is valid XML
curl -s https://politie-forum.nl/sitemap.xml | xmllint --noout - && echo "Valid XML"

# Pretty print sitemap
curl -s https://politie-forum.nl/sitemap.xml | xmllint --format -
```

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property: `politie-forum.nl`
3. Navigate to **Sitemaps** → Add new sitemap
4. Submit:
   - `https://politie-forum.nl/sitemap.xml`
   - `https://politie-forum.nl/news-sitemap.xml`

## Troubleshooting

### Cron Not Running

**Problem**: Automation doesn't execute
**Solutions**:
1. Check cron service is running:
   ```bash
   sudo launchctl list | grep cron
   ```
2. Verify absolute paths in crontab
3. Check script permissions:
   ```bash
   chmod +x news-rip.py
   ```
4. Test manual execution:
   ```bash
   python3 news-rip.py --automate
   ```

### Sitemap Not Updating

**Problem**: Old URLs in sitemap
**Solutions**:
1. Run option 20 manually to force update
2. Check Firestore `/news` collection has articles
3. Verify Next.js ISR revalidation:
   ```bash
   curl -X POST https://politie-forum.nl/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"politie-forum-revalidate-2025-secret-key","path":"/sitemap.xml"}'
   ```
4. Clear Vercel cache:
   ```bash
   vercel --prod
   ```

### Firebase Admin Errors

**Problem**: Authentication failures
**Solutions**:
1. Check `secretkey.json` exists and is valid
2. Verify Firebase project ID matches
3. Update service account key if expired
4. Check IAM permissions in Firebase Console

## Performance

### Sitemap Size Limits

| Type | Current | Max |
|------|---------|-----|
| sitemap.xml | ~17 URLs | 50,000 URLs |
| news-sitemap.xml | ~3 URLs | 1,000 URLs (rolling 2 days) |

**Note**: If you exceed limits, implement sitemap index:
```xml
<sitemapindex>
  <sitemap>
    <loc>https://politie-forum.nl/sitemap-1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://politie-forum.nl/sitemap-2.xml</loc>
  </sitemap>
</sitemapindex>
```

### Execution Time

| Task | Duration |
|------|----------|
| Extract RSS | 5-10s |
| Process articles | 30-60s |
| AI rewrite | 2-5 min |
| Publish to /news | 10-20s |
| Sitemap generation | 2-5s |
| **Total** | **3-7 min** |

## SEO Benefits

### Before Automation
- ❌ Manual sitemap updates
- ❌ Stale article listings
- ❌ Delayed search engine indexing
- ❌ Inconsistent content freshness

### After Automation
- ✅ Hourly sitemap updates
- ✅ Real-time article discovery
- ✅ Faster Google indexing
- ✅ Improved crawl efficiency
- ✅ Better search rankings

## Files Modified

1. **`news-rip.py`**
   - Added `update_nextjs_sitemap(db)` function
   - Added `setup_cron_automation()` function
   - Updated `automate_all(db)` to include sitemap step
   - Added CLI automation support (`--automate` flag)
   - Updated menu with options 20, 21, 22, 23

2. **`src/app/sitemap.ts`**
   - Now fetches articles from Firestore
   - Added ISR revalidation (3600s)
   - Includes all static pages + articles

3. **`firebase.json`**
   - Removed blanket redirect
   - Now serves sitemaps from public/

## Next Steps

1. ✅ **Deploy changes** to production
2. ✅ **Setup cron job** (option 21)
3. ⏳ **Monitor logs** for 24 hours
4. ⏳ **Submit sitemaps** to Google Search Console
5. ⏳ **Verify indexing** in Search Console after 1 week

## Command Reference

```bash
# Run automation once
python3 news-rip.py --automate

# Setup cron (interactive)
python3 news-rip.py  # then select option 21

# Force sitemap update
python3 news-rip.py  # then select option 20

# View automation status
ps aux | grep news-rip.py
crontab -l
tail -f automation.log

# Remove cron job
crontab -e  # delete the news-rip.py line

# Test sitemap validity
curl -s https://politie-forum.nl/sitemap.xml | xmllint --noout -
```

---

**Status**: ✅ Fully implemented and ready for production
**Last Updated**: October 9, 2025
**Maintainer**: Politie Forum Development Team
