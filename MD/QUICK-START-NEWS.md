# Quick Start: Generate News Articles

## 🚀 Quick Setup (5 minutes)

### 1. Copy Updated Functions to news-rip.py

Open `news-rip-updated.py` and copy these functions into your `news-rip.py`:

```python
# Replace these functions in news-rip.py:
# - generate_static_html()
# - save_article_to_firebase()
# - Add the new process_and_publish_article()
```

Or simply use this command:

```bash
# Append the new functions to news-rip.py
cat news-rip-updated.py >> news-rip.py
```

### 2. Update the Template Path

In `news-rip.py`, find the `generate_static_html_new()` function and update:

```python
# Change from:
template_path = os.path.join(os.path.dirname(base_dir), "static-article-template-new.html")

# To the absolute path:
template_path = "/Users/_akira/CSAD/websites-new-2025/politie-forum-45/static-article-template-new.html"
```

### 3. Run the News Ripper

```bash
# Activate environment
source venv/bin/activate

# Run script
python3 news-rip.py
```

### 4. Choose Your Options

```
1. Voer RSS-URL in
   → Enter: https://rss.politie.nl/rss/algemeen/ab/algemeen.xml

2. Voer categorie in
   → Enter: Nieuws

3. Voer aantal artikelen in
   → Enter: 1

4. Kies schrijfstijl
   → Choose: 2 (Normal)

10. Advanced AI Rewriter
   → This processes and publishes the article
```

### 5. Check Results

The script will output:

```
✅ ARTICLE PUBLISHED SUCCESSFULLY!
===============================================

📍 Available at:
   🌐 Static HTML:  https://politie-forum.nl/nieuws/your-slug/
   ⚡ Next.js:      https://politie-forum.nl/nieuws/your-slug
   💬 Forum topic:  https://politie-forum.nl/topic/topic-id

===============================================
```

### 6. Test Locally

```bash
# Start dev server
npm run dev

# Visit:
# http://localhost:3001/nieuws/your-slug       (Next.js)
# http://localhost:3001/nieuws/your-slug/      (Static HTML)
```

### 7. Deploy

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔥 One-Command Article Generation

Create this helper script `generate-article.sh`:

```bash
#!/bin/bash

# generate-article.sh - Quick article generator

echo "🚀 Starting article generation..."

# Activate venv
source venv/bin/activate

# Create input file
cat > /tmp/article-input.txt <<EOF
8
https://rss.politie.nl/rss/algemeen/ab/algemeen.xml
Nieuws
1
2
10
13
EOF

# Run news ripper
python3 news-rip.py < /tmp/article-input.txt

# Clean up
rm /tmp/article-input.txt

echo "✅ Article generated!"
echo "📍 Check /public/nieuws/ for static HTML"
echo "🔥 Check Firebase console for database entry"
```

Make it executable:

```bash
chmod +x generate-article.sh
```

Use it:

```bash
./generate-article.sh
```

## 📝 Manual Article Creation

### Python Function

```python
from news_rip_updated import process_and_publish_article

# Extract article
articles = extract_articles(
    "https://rss.politie.nl/rss/algemeen/ab/algemeen.xml",
    num_articles=1
)

# Process and publish
result = process_and_publish_article(articles[0])

if result:
    print(f"✅ Published: {result['slug']}")
```

### Direct Template Usage

```python
from news_rip_updated import generate_static_html_new, save_article_to_firebase_new

# Your article data
article_data = {
    "title": "Your Article Title",
    "slug": "your-article-slug",
    "full_text": "<p>HTML content here</p>",
    "summary": "Short description",
    "category": "Nieuws",
    "tags": ["politie", "nieuws"],
    "timestamp": "2025-10-08 10:30:00",
    "link": "https://source-url.com"
}

# Generate static HTML
generate_static_html_new(article_data)

# Save to Firebase
save_article_to_firebase_new(article_data)
```

## 🎯 Common Tasks

### Generate Multiple Articles

```python
# Extract 5 articles
articles = extract_articles(rss_url, num_articles=5)

# Process each
for article in articles:
    result = process_and_publish_article(article)
    if result:
        print(f"✅ {result['title']}")
```

### Test Static HTML Only

```python
article_data = {
    "title": "Test Article",
    "slug": "test-article",
    "full_text": "<p>Test content</p>",
    "summary": "Test",
    "category": "Nieuws",
    "tags": ["test"],
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

generate_static_html_new(article_data)
```

### Test Firebase Only

```python
save_article_to_firebase_new(article_data)
```

## 🔍 Verification

### Check Static HTML

```bash
# List generated files
ls -la public/nieuws/

# View specific article
open public/nieuws/your-slug/index.html
```

### Check Firebase

```javascript
// In Firebase Console or using Firebase CLI
firebase database:get /news/your-slug
```

### Check Next.js

```bash
# Start dev server
npm run dev

# Navigate to:
# http://localhost:3001/nieuws/your-slug
```

## 🐛 Troubleshooting

### Article not generating?

```bash
# Check Python environment
source venv/bin/activate
pip list | grep firebase

# Check template exists
ls -la static-article-template-new.html

# Check permissions
ls -la public/nieuws/
```

### Firebase not saving?

```python
# Check Firebase initialization
import firebase_admin
print(firebase_admin._apps)  # Should show initialized app

# Test connection
from firebase_admin import db
ref = db.reference('news')
print(ref.get())
```

### Next.js not finding article?

```bash
# Rebuild
npm run build

# Check Firebase data exists
# Visit: https://console.firebase.google.com

# Check console errors
# Open browser DevTools → Console
```

## 📚 Next Steps

1. ✅ Read `MD/NEWS-DUAL-SYSTEM.md` for full documentation
2. 🎨 Customize `static-article-template-new.html`
3. 🔧 Adjust Tailwind colors if needed
4. 📱 Test mobile responsiveness
5. 🚀 Deploy to production

---

**Need Help?**
- Check `MD/NEWS-DUAL-SYSTEM.md`
- Review `news-rip-updated.py` examples
- Test with sample data first
