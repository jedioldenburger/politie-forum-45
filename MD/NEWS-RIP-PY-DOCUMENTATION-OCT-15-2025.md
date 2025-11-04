# news-rip.py - Complete Documentation
**Python News Automation System for Politie Forum Nederland**

---

## 📋 Overview

`news-rip.py` is a comprehensive Python automation system for extracting, processing, rewriting, and publishing news articles from Dutch sources (NU.nl, Politie.nl) to the Politie Forum Nederland website.

**File Size**: 7,503 lines
**Language**: Python 3.13
**AI Provider**: Groq (default: `openai/gpt-oss-20b`)
**Database**: Firebase (Firestore + Realtime Database)
**Framework Integration**: Next.js 15.5 ISR

---

## 🎯 Core Features

### 1. Multi-Source RSS Extraction
- **NU.nl**: 7 RSS feeds (Algemeen, Binnenland, Buitenland, Economie, Sport, Tech, Opmerkelijk)
- **Politie.nl**: Official police news RSS
- **Duplicate Detection**: Link-based and title-based checking
- **Configurable Limits**: Extract N articles per feed

### 2. AI-Powered Rewriting
- **AI Provider**: Groq Cloud API
- **Default Model**: `openai/gpt-oss-20b` (500k tokens/day)
- **Fallback Models**: llama-3.3-70b-versatile, llama-3.1-8b-instant
- **Features**:
  - Dutch language optimization
  - SEO title generation (60 chars max)
  - FAQ extraction (minimum 3 questions)
  - Location detection (100+ Dutch cities)
  - Geo-coordinates addition
  - Semantic HTML structure

### 3. Location Intelligence
- **Database**: 115 Dutch cities with geo-coordinates
- **Auto-Detection**: Scans article content for location mentions
- **Geo-Coordinates**: Latitude/longitude for Google Maps integration
- **Coverage**: Amsterdam, Rotterdam, Den Haag, Utrecht, and 111 more cities

### 4. Firebase Integration
- **Firestore Collections**:
  - `articles_raw`: Extracted RSS items
  - `articles_full`: Full content processed
  - `articles_rewritten`: AI-enhanced articles
  - `news`: Published articles (production)
- **Realtime Database**:
  - `comments`: User comments with nesting
  - `topics`: Forum topics
- **Duplicate Checking**: Multi-stage validation across collections

### 5. Next.js ISR Publishing
- **Target**: Firestore `/news` collection
- **ISR**: Automatic revalidation (10-minute cache)
- **Vercel Integration**: On-demand cache purging
- **URL Structure**: `/nieuws/[slug]`

### 6. Automation & Scheduling
- **Cron Job**: 30-minute intervals (`*/30 * * * *`)
- **Workflow**: Extract → Process → Rewrite → Publish
- **Menu Option 26**: Manual workflow trigger
- **Menu Option 21**: Automated cron setup

---

## 🛠️ Configuration

### AI Model Settings (Lines 48-75)

```python
# Default AI Configuration
selected_model = "groq"  # Hardcoded to use Groq
selected_groq_model = "openai/gpt-oss-20b"  # 500k tokens/day
selected_style = "Normal"
selected_language = "Dutch"
output_mode = "both"  # "nextjs", "static", "both"

# Available Groq Models
GROQ_MODELS = [
    {"name": "openai/gpt-oss-20b", "limit": "500k tokens/day", "priority": 2},
    {"name": "llama-3.3-70b-versatile", "limit": "14k-30k tokens/day", "priority": 1},
    {"name": "llama-3.1-8b-instant", "limit": "500k tokens/day", "priority": 3},
    {"name": "gemma2-9b-it", "limit": "14k tokens/day", "priority": 4},
    {"name": "mixtral-8x7b-32768", "limit": "14k tokens/day", "priority": 5}
]
```

### RSS Feed Sources (Lines 6948-6960)

```python
RSS_FEEDS = {
    "Nederlandse Politie": {
        "Algemeen": "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml"
    },
    "NU.nl": {
        "Algemeen": "https://www.nu.nl/rss/Algemeen",
        "Binnenland": "https://www.nu.nl/rss/Binnenland",
        "Buitenland": "https://www.nu.nl/rss/Buitenland",
        "Economie": "https://www.nu.nl/rss/Economie",
        "Sport": "https://www.nu.nl/rss/Sport",
        "Tech": "https://www.nu.nl/rss/Tech",
        "Opmerkelijk": "https://www.nu.nl/rss/Opmerkelijk"
    }
}
```

### Location Database (Lines 710-875)

```python
DUTCH_CITIES = [
    {"name": "Amsterdam", "province": "Noord-Holland",
     "lat": 52.3676, "lon": 4.9041},
    {"name": "Rotterdam", "province": "Zuid-Holland",
     "lat": 51.9225, "lon": 4.47917},
    # ... 113 more cities
]
```

---

## 📚 Main Functions

### 1. RSS Extraction

#### `extract_articles(feed_url, num_articles, is_nu_nl, existing_links)` (Line 862)
- Fetches RSS feed using `feedparser`
- Filters duplicates using `existing_links` set
- Returns list of article dictionaries
- **Returns**: `[{title, link, summary, timestamp}]`

#### `extract_nu_nl_article_body(page_source)` (Line 1094)
- Uses Selenium + BeautifulSoup for full content extraction
- NU.nl specific: `<div class="block-wrapper">` parser
- Handles image captions, paragraphs, lists
- **Returns**: Full article text or "Full text not found."

### 2. Article Processing

#### `process_nu_nl_articles(db)` (Line 4394)
- Reads from `articles_raw` collection
- Filters NU.nl articles (`"nu.nl" in link`)
- Duplicate checking via `check_duplicate_article()`
- Full content extraction with Selenium
- Saves to `articles_full` collection
- **New Feature**: Pre-checks existing articles count

```python
# Duplicate checking added Oct 15, 2025
existing_docs = full_collection.stream()
existing_links = set()
existing_titles = set()
print(f"📊 Found {len(existing_links)} existing articles")
```

### 3. AI Rewriting

#### `start_advanced_rewriting_v2(db)` (Line 3812)
- **2-in-1 Workflow**: Rewrite + Publish
- Source: `articles_full` collection
- Target: `articles_rewritten` → `news` collection
- Features:
  - AI title generation (60 chars max)
  - FAQ extraction (min 3 Q&A)
  - Location detection + geo-coordinates
  - Semantic HTML structure
  - Enhanced metadata extraction
  - **New Feature**: Duplicate checking before publishing

```python
# Duplicate checking added Oct 15, 2025
existing_news = db.collection("news").get()
existing_slugs = set()
existing_titles = set()

# Before publishing each article:
if article_slug in existing_slugs:
    print(f"⚠️ Article already published (slug exists)")
    continue

if article_title in existing_titles:
    print(f"⚠️ Article already published (title exists)")
    continue
```

#### `rewrite_article(article)` (Line 2550)
- Core AI rewriting logic
- Groq API integration
- Prompt engineering for Dutch news
- FAQ extraction and validation
- Location detection
- Semantic HTML building
- **Returns**: Enhanced article dictionary

### 4. Publishing

#### `save_article_to_firebase(article)` (Line 1923)
- Saves to Firestore `/news/{slug}`
- Slug generation: URL-safe, lowercase, dashes
- Metadata: title, body, excerpt, publishedAt, tags, etc.
- Location: name, province, coordinates
- FAQ: array of {question, answer} objects

#### `revalidate_vercel_path(slug)` (Line 2032)
- Calls Next.js revalidation API
- Endpoint: `/api/revalidate`
- Purges Vercel cache for specific article
- Enables instant ISR updates

### 5. Automation

#### `automate_quick_workflow(db)` (Line 6320)
- **30-Minute Workflow** (Menu 22, 26)
- Steps:
  1. Extract from NU.nl (2 articles/feed = 14 total)
  2. Process to `articles_full`
  3. AI rewrite + publish to `/news`
  4. Sync to Crime Map
  5. Generate sitemaps
  6. Update Next.js sitemap cache
- **Used by**: Cron job automation

#### `setup_cron_automation()` (Line 5322)
- **Menu Option 21**
- Installs cron job: `*/30 * * * *` (every 30 minutes)
- Command: `python3 news-rip.py --automate`
- Log file: `automation.log`
- Auto-detects existing cron jobs
- **Updated**: 30-minute interval (was 60 minutes)

---

## 🎮 Menu System (27 Options)

### Core Operations (1-9)

| Option | Description | Function |
|--------|-------------|----------|
| 1 | Show RSS Feeds | `show_rss_feeds()` |
| 2-7 | (Legacy options) | Various RSS extractions |
| 8 | Extract NU.nl articles | Inline code → `articles_raw` |
| 9 | Process NU.nl full content | `process_nu_nl_articles()` |

### Processing & Rewriting (10-17)

| Option | Description | Function |
|--------|-------------|----------|
| 10 | Advanced AI Rewriter v1 | `start_advanced_rewriting()` |
| 11 | Extract Politie.nl articles | Inline code → `articles_raw` |
| 12 | Process Politie.nl full content | `process_politie_nl_articles()` |
| 13 | Test Selenium extraction | `test_selenium_extraction()` |
| 14 | Show articles from Firestore | `show_firestore_articles()` |
| 15 | Generate Static HTML | `generate_static_html_pages()` |
| 16 | Advanced AI Rewriter v2 | `start_advanced_rewriting_v2()` |
| 17 | Publish to /news (Next.js ISR) | `publish_rewritten_to_news()` |

### Integration & Automation (18-21)

| Option | Description | Function |
|--------|-------------|----------|
| 18 | Sync to Crime Map | `sync_articles_to_crime_map()` |
| 19 | Generate Sitemaps | `generate_all_sitemaps()` |
| 20 | Update Next.js Sitemap | `update_nextjs_sitemap()` |
| 21 | **Setup Cron (30m)** | `setup_cron_automation()` |

### Workflow Shortcuts (22-26)

| Option | Description | Workflow | Status |
|--------|-------------|----------|--------|
| 22 | Quick Workflow (NU.nl) | 8→9→16→17→18→19 | ✅ |
| 23 | Full Workflow (Politie.nl) | Extract→Process→Rewrite→Publish | ✅ |
| 24 | Enhanced Rewriter V3 | `start_enhanced_rewriting_v3()` | ✅ |
| 25 | Advanced Rewriter V4 | `advanced_rewriter_v4_articles_full()` | ✅ |
| 26 | **RUN CRON NOW (8→9→25)** | `automate_quick_workflow()` | ✅ NEW |
| 27 | Exit | Break loop | ✅ |

---

## 🔧 Recent Updates (October 15, 2025)

### 1. Default Model Changed ✅
```python
# Line 54 - Changed from llama-3.3-70b-versatile
selected_groq_model = "openai/gpt-oss-20b"
# Reason: 500k tokens/day, balanced quality for high volume
```

### 2. Cron Interval Updated ✅
```python
# Line 5330 - Changed from hourly to 30-minute
cron_command = f"*/30 * * * * cd {script_path} && python3 {script} --automate"
# Schedule: Every 30 minutes (:00 and :30 of each hour)
```

### 3. Menu Option 26 Added ✅
```python
# Line 7364 - New workflow automation
elif choice == "26":
    automate_quick_workflow(db)
# Runs: Extract NU.nl → Process → AI Rewrite → Publish
# Purpose: Test 30-minute automation manually
```

### 4. Duplicate Checker in process_nu_nl_articles() ✅
```python
# Lines 4397-4411 - Added pre-check
existing_docs = full_collection.stream()
existing_links = set()
existing_titles = set()
print(f"📊 Found {len(existing_links)} existing articles")
# Prevents re-processing existing full articles
```

### 5. Duplicate Checker in start_advanced_rewriting_v2() ✅
```python
# Lines 3849-3860 - Added before publishing
existing_news = db.collection("news").get()
existing_slugs = set()
existing_titles = set()

# Before save_article_to_firebase():
if article_slug in existing_slugs:
    print(f"⚠️ Article already published (slug exists)")
    duplicate_count += 1
    continue
# Prevents duplicate publications to /news
```

---

## 🔄 Complete Workflow (Option 26)

```
┌─────────────────────────────────────────────┐
│  MENU OPTION 26: RUN CRON WORKFLOW NOW     │
│  (Manual trigger for 30-minute automation)  │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Extract NU.nl Articles (Option 8)  │
│  ────────────────────────────────────────   │
│  • Fetch 7 RSS feeds (NU.nl)                │
│  • Extract 2 articles per feed = 14 total   │
│  • Check existing_links for duplicates      │
│  • Save to articles_raw collection          │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Process Full Content (Option 9)    │
│  ────────────────────────────────────────   │
│  • Check existing articles_full count       │
│  • Filter NU.nl articles from articles_raw  │
│  • Selenium extraction for full content     │
│  • Duplicate check (link + title)           │
│  • Save to articles_full collection         │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  STEP 3: AI Rewrite + Publish (Option 25)   │
│  ────────────────────────────────────────   │
│  • Initialize Groq AI (openai/gpt-oss-20b)  │
│  • Check existing /news slugs + titles      │
│  • For each unprocessed article:            │
│    - AI rewrite (title, summary, body)      │
│    - Extract FAQ (min 3 Q&A)                │
│    - Detect location + geo-coordinates      │
│    - Build semantic HTML structure          │
│    - Check duplicate (slug + title)         │
│    - Save to articles_rewritten             │
│    - Publish to /news (if not duplicate)    │
│    - Revalidate Vercel cache                │
│    - Create forum topic                     │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  RESULT: New Articles Live on Website       │
│  ────────────────────────────────────────   │
│  • Next.js ISR: /nieuws/[slug]              │
│  • JSON-LD: 8 schema types auto-generated   │
│  • Comments: Real-time via Firebase         │
│  • Forum: Topic created in Realtime DB      │
│  • Sitemap: Auto-updated via API            │
└─────────────────────────────────────────────┘
```

---

## 🐛 Error Handling

### Duplicate Detection Strategy

```python
# Stage 1: RSS Extraction (Option 8)
existing_links = set()  # Check link URLs
existing_titles = set()  # Check article titles
# Prevents: Re-downloading same article

# Stage 2: Full Content Processing (Option 9)
check_duplicate_article(db, "articles_full", link, title)
# Prevents: Re-processing full content

# Stage 3: AI Rewriting (Option 16/25)
check_duplicate_article(db, "articles_rewritten", link, title)
# Prevents: Re-rewriting same article

# Stage 4: Publishing to /news (Option 16/25)
if article_slug in existing_slugs:
    skip_duplicate()
if article_title in existing_titles:
    skip_duplicate()
# Prevents: Duplicate publications
```

### Fallback Logic

```python
# AI Model Fallback (if quota exceeded)
try:
    response = client.chat.completions.create(model="openai/gpt-oss-20b")
except RateLimitError:
    # Automatic fallback to next priority model
    model = "llama-3.3-70b-versatile"  # 14k tokens/day

# Location Detection Fallback
if not location_found:
    location = {"name": "Nederland", "province": ""}  # Default

# FAQ Generation Fallback
if len(faq_data) == 0:
    faq_data = generate_default_faq(title, location)  # 3 generic Q&A
```

---

## 📊 Performance Metrics

### Processing Speed
- **RSS Extraction**: ~2-5 seconds per feed
- **Full Content**: ~10-15 seconds per article (Selenium)
- **AI Rewriting**: ~20-30 seconds per article (Groq API)
- **Total Workflow**: ~5-10 minutes for 14 articles

### Token Usage (Groq)
- **Model**: openai/gpt-oss-20b
- **Limit**: 500,000 tokens/day
- **Per Article**: ~2,000-3,000 tokens
- **Daily Capacity**: ~150-250 articles/day

### Database Collections Size
```
articles_raw:       ~16 documents  (RSS items)
articles_full:      ~24 documents  (Full content)
articles_rewritten: ~Variable      (AI-enhanced)
news:               ~46 documents  (Published)
```

---

## 🔐 Security & API Keys

### Required Environment Variables

```bash
# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY="./secretkey.json"
FIREBASE_DATABASE_URL="https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app"

# Groq API
GROQ_API_KEY="gsk_..."  # Get from console.groq.com

# Vercel Revalidation
REVALIDATE_TOKEN="secret_token_here"
```

### Firebase Security Rules

```javascript
// Firestore Rules
match /news/{slug} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.token.admin == true;
}

// Realtime Database Rules
{
  "comments": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

---

## 🚀 Usage Examples

### Example 1: Manual Workflow (Step-by-Step)

```bash
# Step 1: Extract articles
python3 news-rip.py
# Choose: 8 (Extract NU.nl articles)

# Step 2: Process full content
python3 news-rip.py
# Choose: 9 (Process NU.nl articles)

# Step 3: AI Rewrite + Publish
python3 news-rip.py
# Choose: 25 (Advanced Rewriter V4)
```

### Example 2: Automated Workflow (One-Click)

```bash
# Run complete workflow
python3 news-rip.py
# Choose: 26 (RUN CRON WORKFLOW NOW)

# Or use command-line flag
python3 news-rip.py --quick-workflow
```

### Example 3: Setup Cron Automation

```bash
# Install cron job
python3 news-rip.py
# Choose: 21 (Setup Cron Automation)

# Verify cron is running
crontab -l | grep news-rip.py

# Check logs
tail -f automation.log
```

---

## 🎯 Best Practices

### 1. Run Order
```
Always: 8 → 9 → 25 (Extract → Process → Rewrite/Publish)
Never: Skip step 9 (full content required for quality rewrite)
```

### 2. Duplicate Prevention
```
✅ Run duplicate checks at each stage
✅ Use existing_links/slugs/titles sets
✅ Monitor database collection sizes
❌ Don't disable duplicate checking
```

### 3. AI Token Management
```
✅ Use openai/gpt-oss-20b (500k tokens/day)
✅ Monitor Groq usage dashboard
✅ Set up fallback models
❌ Don't exceed 250 articles/day
```

### 4. Cron Automation
```
✅ Test manually (option 26) before cron
✅ Monitor automation.log for errors
✅ Set up email alerts for failures
❌ Don't run multiple crons simultaneously
```

---

## 🔮 Future Enhancements

### Planned Features
1. ✅ **Category detection**: Auto-assign articles to forum categories
2. ⏳ **Image optimization**: Download + compress images locally
3. ⏳ **Multi-language support**: English translations
4. ⏳ **Sentiment analysis**: Auto-tag article tone
5. ⏳ **Related articles**: ML-based content similarity
6. ⏳ **Trending detection**: Track viral topics

### Performance Improvements
1. ⏳ **Batch processing**: Process 10 articles in parallel
2. ⏳ **Redis caching**: Cache duplicate check results
3. ⏳ **Async I/O**: Non-blocking Firestore operations
4. ⏳ **CDN integration**: Cache static HTML on Cloudflare

---

## 📝 Maintenance Notes

### Monthly Tasks
- [ ] Review Groq token usage and adjust model if needed
- [ ] Clean up old `articles_raw` entries (>30 days)
- [ ] Archive `articles_rewritten` (>90 days)
- [ ] Update location database with new Dutch cities
- [ ] Review duplicate detection accuracy

### Quarterly Tasks
- [ ] Audit published articles quality (manual review)
- [ ] Update RSS feed URLs if changed
- [ ] Test Selenium compatibility with NU.nl site changes
- [ ] Optimize AI prompts for better output
- [ ] Review and update FAQ extraction logic

---

## 🆘 Troubleshooting

### Common Issues

**Issue 1: "NameError: name 'extract_rss_feed' is not defined"**
```python
# Fix: Option 8 uses inline code, not function
# Solution: Use option 26 (automate_quick_workflow) instead
```

**Issue 2: Duplicate articles still being published**
```python
# Check: Are you running option 16 or 25?
# Fix: Use option 25 (has duplicate checking)
# Verify: existing_slugs set is populated
```

**Issue 3: AI model quota exceeded**
```python
# Check: Groq dashboard (console.groq.com)
# Fix 1: Switch to llama-3.1-8b-instant (500k tokens/day)
# Fix 2: Wait 24 hours for quota reset
```

**Issue 4: Selenium timeout errors**
```python
# Check: Is NU.nl accessible?
# Fix 1: Increase timeout in chrome_options
# Fix 2: Use --headless mode (already enabled)
# Fix 3: Update ChromeDriver version
```

---

## 📚 Dependencies

```python
# Core
feedparser>=6.0.10          # RSS parsing
firebase-admin>=6.2.0       # Firebase SDK
selenium>=4.15.0            # Web scraping
beautifulsoup4>=4.12.0      # HTML parsing

# AI
anthropic>=0.18.0           # Anthropic SDK (optional)
openai>=1.12.0              # OpenAI SDK (optional)

# Utilities
requests>=2.31.0            # HTTP requests
python-dateutil>=2.8.2      # Date parsing
nltk>=3.8.1                 # NLP (optional)
```

---

**Last Updated**: October 15, 2025, 03:45 CET
**Version**: 2.6.0
**Status**: Production-ready ✅
