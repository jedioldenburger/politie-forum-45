# ✅ On-Demand Revalidation - COMPLETE

**Status**: Fully functional
**Date**: October 8, 2025

## Problem Solved

Articles generated via `news-rip.py` option 10 now load **immediately** without requiring manual `vercel --prod` deployment.

## How It Works

### 1. Revalidation API Endpoint
**File**: `src/app/api/revalidate/route.ts`

```typescript
POST /api/revalidate
{
  "secret": "politie-forum-revalidate-2025-secret-key",
  "path": "/nieuws/article-slug"
}
```

- Validates secret token
- Calls Next.js `revalidatePath()` to clear cache
- Revalidates both the article page and `/nieuws` index

### 2. Python Script Integration
**File**: `news-rip.py`

Added `revalidate_vercel_path()` function that:
- Sends POST request to `/api/revalidate`
- Called automatically after `save_article_to_firebase()`
- Non-blocking (doesn't fail article generation if revalidation fails)

### 3. Environment Configuration

**Local** (`.env.local`):
```bash
REVALIDATE_SECRET=politie-forum-revalidate-2025-secret-key
```

**Vercel Production**:
```bash
REVALIDATE_SECRET=politie-forum-revalidate-2025-secret-key
```

⚠️ **Important**: Added via `printf` (not `echo`) to avoid trailing newline character

## Workflow Now

1. **Run Python script**: `python3 news-rip.py` → Option 10
2. **Article is generated**: Saved to Firebase + static HTML
3. **Revalidation triggered**: Python calls `/api/revalidate`
4. **Vercel cache cleared**: Article immediately accessible
5. **No manual deployment needed**: Article loads at `politie-forum.nl/nieuws/{slug}`

## Testing

```bash
# Test revalidation API
curl -X POST https://politie-forum.nl/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret":"politie-forum-revalidate-2025-secret-key",
    "path":"/nieuws/your-article-slug"
  }'

# Expected response:
{
  "revalidated": true,
  "path": "/nieuws/your-article-slug",
  "timestamp": "2025-10-08T07:04:14.926Z"
}
```

## Benefits

✅ **No manual deployment** - Articles live immediately
✅ **Faster workflow** - Generate and publish in one step
✅ **Better UX** - Articles accessible to readers instantly
✅ **Cost efficient** - Avoids unnecessary full rebuilds
✅ **Scalable** - Can revalidate individual pages on-demand

## Files Modified

1. `src/app/api/revalidate/route.ts` - NEW: Revalidation API endpoint
2. `news-rip.py` - Added `revalidate_vercel_path()` function and call
3. `.env.local` - Added `REVALIDATE_SECRET`
4. Vercel Production - Added `REVALIDATE_SECRET` env var

## Technical Details

- **Next.js ISR**: Uses `revalidatePath()` from `next/cache`
- **Cache Strategy**: `force-dynamic` + `revalidate: 60` in article pages
- **Security**: Secret token authentication prevents unauthorized revalidation
- **Error Handling**: Graceful fallback if revalidation fails

## Troubleshooting

**401 Invalid secret**:
- Check `REVALIDATE_SECRET` matches in both `.env.local` and Vercel
- Ensure no trailing newline (use `printf` not `echo`)

**500 REVALIDATE_SECRET not configured**:
- Add env var to Vercel Production environment
- Redeploy with `vercel --prod`

**Article still 404**:
- Verify article exists in Firebase: `/news/{slug}`
- Check console for revalidation success message
- Wait 1-2 seconds for CDN propagation

## Next Steps

Consider adding:
- [ ] Bulk revalidation endpoint for multiple paths
- [ ] Webhook from Firebase for automatic revalidation
- [ ] Revalidation dashboard to monitor cache status
- [ ] Rate limiting to prevent abuse

---

**Status**: ✅ Production-ready
**Last Updated**: October 8, 2025
