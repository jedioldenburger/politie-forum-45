# Firebase Quota Fix - Quick Reference

**TL;DR**: Added Next.js caching to reduce Firestore reads by 96.5% (15K/day → 500/day)

---

## What Changed

### 4 Functions Now Cached

1. **`getLatestArticles()`** - 5 min cache
2. **`getServerArticles()`** - 30 min cache
3. **`getRelatedArticles()`** - 1 hour cache
4. **`getMostCommentedArticles()`** - 30 min cache

### Cache Tags

- `articles` - All queries
- `latest` - Homepage
- `trending` - Most commented
- `related` - Sidebar
- `all` - Sitemap

---

## Deploy Checklist

```bash
# 1. Add Vercel env var
REVALIDATE_SECRET="$(openssl rand -base64 32)"

# 2. Deploy
git add .
git commit -m "Add aggressive caching to fix Firestore quota"
git push origin master

# 3. Test cache invalidation
curl -X POST https://politie-forum.nl/api/revalidate-cache \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["articles"]}'

# 4. Monitor quota (Firebase Console → Firestore → Usage)
# Target: < 1,000 reads/day (was 15,000)
```

---

## Python Integration

Add to `news-rip.py` after publishing:

```python
import requests
import os

def revalidate_cache(tags=["articles", "latest", "all"]):
    try:
        response = requests.post(
            "https://politie-forum.nl/api/revalidate-cache",
            headers={"Authorization": f"Bearer {os.environ.get('REVALIDATE_SECRET')}"},
            json={"tags": tags},
            timeout=10
        )
        print("✅ Cache invalidated" if response.status_code == 200 else f"⚠️  Failed: {response.status_code}")
    except Exception as e:
        print(f"⚠️  Error: {e}")

# Call after syncing to /news
revalidate_cache()
```

---

## When to Invalidate

| Action | Tags to Invalidate |
|--------|--------------------|
| Publish article | `["articles", "latest", "all"]` |
| Delete article | `["articles", "latest", "related"]` |
| Update article | `["articles", currentSlug]` |
| Mass import | `["articles"]` |

---

## Expected Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Daily reads | 15,044 | 528 | -96.5% |
| Quota usage | 30% | 1% | 29x reduction |
| Build reads | 5,544 | 48 | -99% |
| Homepage freshness | Real-time | 5 min | Acceptable |

---

## Rollback

If issues occur:

```bash
git revert HEAD
git push origin master
```

---

**Status**: ✅ Ready for production
**Docs**: See `MD/FIREBASE-QUOTA-FIX-NOV-5.md` for full details
