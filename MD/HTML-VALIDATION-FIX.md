# HTML Validation Fix - Nested H3 in P Tags

## Issue

Google Search Console reports HTML validation warning:
```
⚠️ Avoid nested <h3> inside <p> tags (minor HTML validity issue)
```

**Current SEO Score**: 9/10 Accessibility/Semantics

## Root Cause

The AI-generated article content from `news-rip.py` sometimes produces:
```html
<p>
  <h3>Heading Text</h3>
  Regular paragraph text...
</p>
```

This is invalid HTML - block-level elements (h1-h6) cannot be nested inside `<p>` tags.

## Solution Options

### Option 1: Fix in AI Prompt (Recommended)
Update the Groq AI rewriting prompt in `news-rip.py` to enforce proper HTML structure:

```python
# In generate_dutch_police_article() function (around line ~1488)
prompt = f"""
Rewrite this article in Dutch...

CRITICAL HTML RULES:
- NEVER wrap headings (<h1>, <h2>, <h3>) inside <p> tags
- Use proper semantic structure:
  <h2>Heading</h2>
  <p>Paragraph text</p>
- Each heading should be a standalone element
- Paragraphs should only contain inline elements (span, strong, em, a)
- Preserve heading hierarchy: h2 → h3 → h4
"""
```

### Option 2: Post-Process HTML Cleanup
Add a cleanup function in ArticleClient.tsx to fix invalid nesting:

```typescript
// src/app/nieuws/[slug]/ArticleClient.tsx
function cleanHTMLStructure(html: string): string {
  // Remove <p> wrappers around headings
  return html
    .replace(/<p>\s*(<h[1-6][^>]*>.*?<\/h[1-6]>)\s*<\/p>/gi, '$1')
    .replace(/<p>\s*(<h[1-6][^>]*>.*?<\/h[1-6]>)/gi, '$1')
    .replace(/(<\/h[1-6]>)\s*<\/p>/gi, '$1');
}

// Usage in component:
<div
  itemProp="articleBody"
  dangerouslySetInnerHTML={{ __html: cleanHTMLStructure(article.content) }}
/>
```

### Option 3: Server-Side Fix (Best for Performance)
Fix during article save in `news-rip.py` after AI generation:

```python
# In save_to_firebase() function
import re

def clean_html_structure(html):
    """Remove invalid <p> wrappers around headings"""
    # Remove <p> tags around headings
    html = re.sub(r'<p>\s*(<h[1-6][^>]*>.*?</h[1-6]>)\s*</p>', r'\1', html, flags=re.IGNORECASE)
    html = re.sub(r'<p>\s*(<h[1-6][^>]*>)', r'\1', html, flags=re.IGNORECASE)
    html = re.sub(r'(</h[1-6]>)\s*</p>', r'\1', html, flags=re.IGNORECASE)
    return html

# Apply before saving
content = clean_html_structure(dutch_article)
```

## Implementation Plan

**Phase 1: Quick Fix (Immediate)**
1. Add post-processing in ArticleClient.tsx (Option 2)
2. Deploy and verify with existing articles

**Phase 2: Source Fix (Permanent)**
1. Update AI prompt in news-rip.py (Option 1)
2. Add HTML validation in Python script (Option 3)
3. Test with new articles

**Phase 3: Cleanup (Long-term)**
1. Run batch fix on existing articles in Firebase
2. Remove post-processing code (no longer needed)

## Testing

### Before Fix
```bash
curl -s https://politie-forum.nl/nieuws/example-article | grep -E "<p>\s*<h[1-6]"
```

### After Fix
No matches should be found. HTML should show:
```html
<h2>Heading</h2>
<p>Paragraph text</p>
```

## SEO Impact

**Current**: 9/10 Accessibility
**After Fix**: 10/10 Accessibility ✅

This fix will:
- ✅ Improve Google Search Console HTML validation score
- ✅ Better screen reader accessibility
- ✅ Proper semantic HTML structure
- ✅ Potentially boost SEO rankings

## Related Issues

- [ ] Also check for nested divs in p tags
- [ ] Validate proper heading hierarchy (h2 → h3, not h2 → h4)
- [ ] Ensure alt text on all images
- [ ] Verify ARIA labels on interactive elements

---

**Priority**: Medium (9/10 → 10/10 accessibility boost)
**Effort**: Low (1-2 hours)
**Status**: Documented, awaiting implementation
**Created**: October 10, 2025
