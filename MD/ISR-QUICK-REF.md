# ISR Quick Reference Card

## 🚀 Publishing Workflow

```bash
python3 news-rip.py

1. Set mode: 15 → 1 (Next.js ISR)
2. Set count: 3 → 1
3. Extract: 8 (NU.nl)
4. Process: 9 (Verwerk NU.nl)
5. Publish: 10 (Advanced Rewriter)
   └─► ✅ LIVE in 1-3 seconds
```

---

## ⚙️ Key Configuration

### Next.js Page (`src/app/nieuws/[slug]/page.tsx`)
```typescript
export const revalidate = 600; // 10 min auto-refresh
```

### API Endpoint
```
POST /api/revalidate
Body: {
  "secret": "politie-forum-revalidate-2025-secret-key",
  "path": "/nieuws/article-slug"
}
```

### Python Function (`news-rip.py`)
```python
revalidate_vercel_path(slug)  # Auto-called after save
```

---

## 🎯 Output Modes

| Mode | Next.js ISR | Static HTML | Use Case |
|------|-------------|-------------|----------|
| **1** | ✅ | ❌ | Production (RECOMMENDED) |
| **2** | ❌ | ✅ | Legacy/Testing |
| **3** | ✅ | ✅ | Backwards compatibility |

**Default**: Option 3 (Both)
**Recommended**: Option 1 (ISR only)

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Page Load** | ~50ms (CDN cached) |
| **Publishing** | 1-3 seconds |
| **Auto-Refresh** | Every 10 minutes |
| **Build Time** | ~30 seconds |
| **SEO Score** | 100/100 ✅ |

---

## 🔧 Troubleshooting

### Article not updating?
```bash
# Hard refresh browser
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)

# Manual revalidation
curl -X POST https://politie-forum.nl/api/revalidate \
  -d '{"secret":"politie-forum-revalidate-2025-secret-key","path":"/nieuws/slug"}'
```

### Revalidation fails (401)?
```bash
# Check Vercel environment variable
vercel env ls
→ Should show: REVALIDATE_SECRET

# Add if missing
vercel env add REVALIDATE_SECRET production
vercel --prod
```

---

## ✅ Checklist

**Before Publishing**:
- [ ] Output mode set to ISR (option 1)
- [ ] Article count configured
- [ ] Groq AI model selected

**After Publishing**:
- [ ] Article saved to Firebase
- [ ] Revalidation API called successfully
- [ ] Article accessible at `/nieuws/{slug}`
- [ ] Comments working
- [ ] Footer rendering

**Verification**:
```bash
# Check Firebase
https://console.firebase.google.com
→ Realtime Database → news/{slug}

# Check live site
https://politie-forum.nl/nieuws/{slug}
```

---

## 📚 Documentation

- **Full Guide**: `MD/ISR-IMPLEMENTATION.md`
- **Migration Summary**: `MD/ISR-MIGRATION-SUMMARY.md`
- **Legacy Docs**: `MD/DUAL-URL-SYSTEM.md`

---

**Quick Help**:
- **Instant publish**: ISR + revalidation API
- **Auto-refresh**: Every 10 minutes
- **Manual refresh**: Call `/api/revalidate`
- **No deploy**: Changes live in 1-3 seconds

---

**Last Updated**: October 8, 2025
