# Immediate GSC & Technical Verification Checklist

**Priority**: CRITICAL
**Timeline**: Complete within 2 days
**Owner**: Site Administrator

---

## Step 1: Google Search Console Verification ✅ CRITICAL

### 1.1 Check if Domain is Verified

1. Go to https://search.google.com/search-console/
2. Look for "politie-forum.nl" in property list
3. If NOT present → Add property:
   - Select "Domain" property type (not URL prefix)
   - Method: DNS verification (most reliable)
   - Add DNS TXT record provided by Google
   - Wait 24-48 hours for verification

### 1.2 Check for Manual Actions (CRITICAL)

1. In GSC → Left menu → "Security & manual actions"
2. Look for "Manual Actions" section
3. If red flag appears → Document it
   - Screenshot the message
   - Note the date and reason
   - This indicates Google human reviewer penalized the site

### 1.3 Check Security Issues

1. In GSC → Left menu → "Security & manual actions"
2. Look for "Security Issues" section
3. If issues present → Investigate:
   - Malware: Contact hosting provider
   - Hacked content: Audit all files
   - User-generated spam: Enable moderation

### 1.4 Review Coverage Report

1. In GSC → Left menu → "Pages" → "Coverage"
2. Check:
   - "Valid": How many pages indexed?
   - "Excluded": Why aren't they indexed?
   - "Error": Any crawl errors?
3. Expected: Homepage + key category pages should be indexed
4. Action: If homepage not indexed:
   - Click on homepage URL
   - Click "Test Live URL"
   - If error appears, note it

### 1.5 Request Homepage Indexation

1. In GSC → "URL Inspection" (search box at top)
2. Type: https://politie-forum.nl/
3. Click "Inspect"
4. Review results:
   - "URL is on Google": Already indexed (good)
   - "URL is not on Google": Not indexed (needs action)
5. If not indexed:
   - Click "Request Indexing" button
   - Google will re-crawl within 1-7 days

---

## Step 2: Technical Health Check

### 2.1 robots.txt Verification

```bash
# Command to run:
curl -I https://politie-forum.nl/robots.txt

# Expected output:
# HTTP/2 200 ← This is GOOD
# Content-Type: text/plain ← This is GOOD

# If you see:
# HTTP 500, 403, timeout ← PROBLEM (but not currently happening)
```

**Status**: ✅ Currently returning 200 OK

### 2.2 Sitemap Verification

```bash
# Check both sitemaps are accessible:
curl -I https://politie-forum.nl/sitemap.xml
curl -I https://politie-forum.nl/news-sitemap.xml

# Both should return HTTP 200
```

### 2.3 Homepage Full Crawl Test

```bash
# Get full HTML response:
curl -s https://politie-forum.nl/ | head -200

# Look for:
# ✅ <title> tag present? (Should contain "Politie Forum")
# ✅ <meta name="description"> present?
# ✅ <meta property="og:image"> present?
# ✅ <script type="application/ld+json"> present?
```

**Status**: ✅ All present and valid

---

## Step 3: Search Visibility Test

### 3.1 Manual Google Search
```
1. Go to https://www.google.nl/
2. Search: site:politie-forum.nl
3. Expected result:
   - Shows indexed pages from your domain
   - If ZERO results → Nothing indexed yet
   - If multiple results → Some pages indexed
4. Screenshot results for records
```

### 3.2 Search for Brand Name
```
1. Go to https://www.google.nl/
2. Search: "politie forum"
3. Expected result:
   - politie-forum.nl appears in top 20?
   - No results? Confirms ranking issue
4. Screenshot results for records
```

### 3.3 Google Mobile-Friendly Test
```
1. Go to https://search.google.com/test/mobile-friendly
2. Enter: https://politie-forum.nl/
3. Click "Analyze"
4. Expected: "Page is mobile-friendly" ✅
5. Review Core Web Vitals (LCP, FID, CLS)
6. Screenshot results
```

---

## Step 4: Rich Results Validation

### 4.1 Rich Results Test (Schema)
```
1. Go to https://search.google.com/test/rich-results
2. Enter: https://politie-forum.nl/
3. Click "Test URL"
4. Expected results:
   - No ERRORS (may have warnings)
   - Valid schema types detected:
     ✅ Organization
     ✅ WebSite
     ✅ BreadcrumbList
     ✅ FAQPage
   - Screenshot results
```

### 4.2 Check Article Pages
```
1. Pick one article: https://politie-forum.nl/nieuws/[article-slug]
2. Test in Rich Results Test
3. Expected:
   - NewsArticle schema valid
   - DiscussionForumPosting schema valid
   - Place schema valid
   - No errors
```

---

## Step 5: Competitive Landscape Scan

### 5.1 Search Results for "politie forum"
```
1. Google.nl search: "politie forum"
2. Screenshot top 10 results
3. Document:
   - Position 1: [Domain] (DA estimate)
   - Position 2: [Domain] (DA estimate)
   - ...
   - Is politie-forum.nl present? At what position?
4. Create benchmark table
```

### 5.2 Backlink Audit
```
1. Go to https://ahrefs.com/backlink-checker (free tier)
2. Enter: politie-forum.nl
3. Check:
   - Total backlinks: _____ (expect 0-5 for new domain)
   - Referring domains: _____ (expect 0-3)
   - Most valuable links: _____ (which domains linking to you?)
4. Screenshot results
5. Compare to competitors:
   - Check politieforum.be backlinks
   - Check politie.nl backlinks
   - Document gap
```

---

## Step 6: Documentation & Reporting

### Create a Status Report
```
POLITIE-FORUM.NL - SEO STATUS REPORT
Date: [Today's Date]
Prepared By: [Your Name]

TECHNICAL STATUS:
✅ robots.txt: HTTP 200 OK
✅ Homepage: Fully crawlable, <title> + <meta> present
✅ Sitemap: Accessible
✅ CSP headers: Configured for Firebase
✅ Mobile-friendly: Yes

INDEXATION STATUS:
- GSC verified: YES / NO ← MUST COMPLETE
- Homepage indexed: YES / NO
- Total pages indexed: _____
- Manual actions: YES / NO
- Security issues: YES / NO

RANKING STATUS:
- site:politie-forum.nl results: _____ pages
- "politie forum" ranking position: Not in top 20
- Estimated DA: 8-15
- Backlinks: 0-5

NEXT ACTIONS:
1. [ ] Complete GSC verification (if not done)
2. [ ] Request homepage indexation
3. [ ] Check for manual actions
4. [ ] Implement Phase 2: Trust-building pages
5. [ ] Start content creation (bylined articles)

TIMELINE:
- Technical fixes: DONE ✅
- GSC verification: Days 1-2
- Trust pages: Days 5-14
- First articles: Days 15-30
- Backlink campaign: Days 30+

OWNER: [Name]
NEXT REVIEW: 30 days
```

---

## Critical Decision Tree

```
START HERE:
│
├─ Is politie-forum.nl verified in GSC?
│  ├─ NO → Add property immediately (DNS method preferred)
│  └─ YES → Continue
│
├─ Are there manual actions against the site?
│  ├─ YES → STOP. Assess policy violations before proceeding.
│  └─ NO → Continue
│
├─ Are there security issues?
│  ├─ YES → STOP. Fix malware/hacking before proceeding.
│  └─ NO → Continue
│
├─ Is homepage indexed (site:politie-forum.nl shows results)?
│  ├─ NO → Request indexation in GSC URL Inspection
│  └─ YES → Proceed
│
├─ How many total backlinks?
│  ├─ 0 → Expected. Start Phase 3 (backlink campaign).
│  └─ 1-5 → Good start. Continue building.
│
└─ Proceed to Phase 2: Trust-Building Pages
   └─ Create /about, /contact, /moderation, /privacy
   └─ Publish 3-5 bylined expert articles
   └─ Create social media profiles
```

---

## Red Flags to Watch

⚠️ **If you see any of these**:

1. **Manual Action Against Politie-Forum.nl**
   - Severity: CRITICAL
   - Action: Stop all SEO work. File reconsideration request.

2. **Security Issues (Malware/Hacking)**
   - Severity: CRITICAL
   - Action: Contact hosting provider immediately.

3. **Zero Pages Indexed After 30 Days**
   - Severity: HIGH
   - Action: Investigate GSC for crawl errors.

4. **robots.txt Returns 5xx Error**
   - Severity: HIGH
   - Action: Contact Vercel support (hosting provider).

5. **Homepage Returns Incomplete HTML**
   - Severity: HIGH
   - Action: Check server response times, investigate timeout issues.

---

## Success Checklist (Complete by Day 7)

- [ ] GSC domain verified (DNS method)
- [ ] No manual actions detected
- [ ] No security issues detected
- [ ] Homepage indexed (or indexation requested)
- [ ] robots.txt returns HTTP 200
- [ ] Sitemap accessible
- [ ] All metadata present (title, description, OG)
- [ ] Rich results test passes (no errors)
- [ ] Mobile-friendly test passes
- [ ] Baseline backlink count documented
- [ ] Competitive landscape mapped
- [ ] Status report created & filed

---

**DEADLINE**: November 11, 2025
**STATUS**: 🔴 NOT STARTED / 🟡 IN PROGRESS / 🟢 COMPLETE

**Notes**: Keep detailed notes of all findings. This becomes your baseline for measuring Month 3, Month 6, and Month 12 progress.
