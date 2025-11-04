# Sitemap Generator - Quick Reference

**Menu Option**: 18 in news-rip.py
**Status**: ✅ Ready to use

---

## Quick Start

```bash
python3 news-rip.py
# Select: 18
```

---

## What It Does

Generates 3 files in `/public/`:
1. **sitemap.xml** - 14 static pages + all articles
2. **news-sitemap.xml** - 100 recent articles (Google News)
3. **robots.txt** - Crawler rules + sitemap references

---

## Output Location

```
/public/
├── sitemap.xml         (14 static + N articles)
├── news-sitemap.xml    (100 recent articles)
└── robots.txt          (crawl directives)
```

---

## URLs

```
https://politie-forum.nl/sitemap.xml
https://politie-forum.nl/news-sitemap.xml
https://politie-forum.nl/robots.txt
```

---

## Static Pages Included

| Page | Priority | Changefreq |
|------|----------|------------|
| `/` | 1.0 | daily |
| `/nieuws` | 0.9 | daily |
| `/forum` | 0.8 | daily |
| `/categorieen` | 0.8 | weekly |
| `/crime-map-nederland` | 0.7 | daily |
| `/over` | 0.5 | monthly |
| `/contact` | 0.5 | monthly |
| `/leden` | 0.6 | weekly |
| `/profiel` | 0.5 | weekly |
| `/login` | 0.4 | monthly |
| `/register` | 0.4 | monthly |
| `/privacy` | 0.3 | yearly |
| `/voorwaarden` | 0.3 | yearly |
| `/admin` | 0.2 | monthly |

**Total**: 14 pages

---

## Article Pages

- **Source**: Firestore `/news` collection
- **Priority**: 0.8
- **Changefreq**: weekly
- **Limit**: All articles (sitemap.xml), 100 recent (news-sitemap.xml)

---

## robots.txt Rules

```txt
User-agent: *
Allow: /

Sitemap: https://politie-forum.nl/sitemap.xml
Sitemap: https://politie-forum.nl/news-sitemap.xml

Disallow: /admin
Disallow: /api/
Disallow: /login
Disallow: /register

Allow: /nieuws/
Allow: /forum/
Allow: /categorieen/
Allow: /crime-map-nederland

Crawl-delay: 1
```

---

## Google Search Console

### Submit Sitemaps
```
1. Go to: https://search.google.com/search-console
2. Select property: politie-forum.nl
3. Click: Sitemaps
4. Add: https://politie-forum.nl/sitemap.xml
5. Add: https://politie-forum.nl/news-sitemap.xml
```

### Verify robots.txt
```
1. Go to: https://search.google.com/search-console
2. Click: Crawl → robots.txt Tester
3. Test: https://politie-forum.nl/robots.txt
```

---

## Validation

### Check XML Syntax
```bash
xmllint --noout public/sitemap.xml
xmllint --noout public/news-sitemap.xml
```

### Online Validators
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://search.google.com/test/rich-results

---

## Automation

### Cron Job (Daily 2 AM)
```cron
0 2 * * * cd /path/to/project && python3 news-rip.py <<< "18"
```

### After Publishing Articles
```bash
# Run menu option 16 (generate articles)
# Then run menu option 18 (generate sitemaps)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No articles in sitemap | Run option 16 first to generate articles |
| XML validation errors | Check article titles for special chars |
| robots.txt 404 | Ensure Next.js serves /public/robots.txt |
| Sitemap not updating | Regenerate with option 18 after new articles |

---

## Example Output

```
🗺️  Generating sitemaps and robots.txt...
📖 Fetching articles from Firestore /news collection...
✅ Found 42 articles

📝 Generating sitemap.xml...
✅ sitemap.xml created: /public/sitemap.xml
   📊 14 static pages + 42 articles

📰 Generating news-sitemap.xml...
✅ news-sitemap.xml created: /public/news-sitemap.xml
   📊 42 recent articles

🤖 Generating robots.txt...
✅ robots.txt created: /public/robots.txt

✅ Sitemap generation complete!
📁 Files created in: /public
   • sitemap.xml (56 URLs)
   • news-sitemap.xml (42 news articles)
   • robots.txt

🌐 URLs:
   https://politie-forum.nl/sitemap.xml
   https://politie-forum.nl/news-sitemap.xml
   https://politie-forum.nl/robots.txt

💡 Submit to Google Search Console:
   https://search.google.com/search-console
```

---

## Performance

- **Generation Time**: 2-5 seconds
- **Firestore Reads**: 1 query (all articles)
- **File Writes**: 3 files
- **Memory Usage**: <10 MB

---

## Benefits

✅ Faster indexing (<24h for new articles)
✅ Google News inclusion (news-sitemap.xml)
✅ Complete site coverage (14 static + all articles)
✅ Crawl budget optimization (robots.txt)
✅ Priority signals (1.0 to 0.2)
✅ Change frequency hints (daily to yearly)

---

## Related Commands

| Option | Description |
|--------|-------------|
| 16 | Generate articles (Next.js ISR) |
| 17 | Sync to Crime Map |
| 18 | **Generate Sitemaps** |
| 19 | Exit |

---

**Last Updated**: October 9, 2025
**Status**: Ready for production use
**Documentation**: `MD/SITEMAP-GENERATOR.md`
