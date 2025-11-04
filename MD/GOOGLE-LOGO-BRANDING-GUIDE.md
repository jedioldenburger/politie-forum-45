# Google Search Console Logo Branding Setup
**Quick Reference Guide for Politie Forum Nederland**

## 🎯 Purpose
Lock in your Knowledge Panel logo to strengthen brand entity recognition and E-E-A-T signals.

---

## 📋 Prerequisites
- [ ] Google Account with admin access
- [ ] Verified ownership of `politie-forum.nl` in Search Console
- [ ] Logo file ready (512×512px recommended)

---

## 🚀 Step-by-Step Instructions

### Step 1: Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Log in with your Google account
3. Select property: `https://politie-forum.nl`

**Not verified yet?** Choose verification method:
- **HTML file**: Upload `google-site-verification.html` to `/public/`
- **DNS record**: Add TXT record to domain DNS
- **Google Analytics**: Already installed (G-PYNT9RRWHB) ✅

---

### Step 2: Navigate to Branding Section
1. In left sidebar, click **Settings** (gear icon)
2. Scroll down to **Branding** section
3. Click **Manage** or **Add branding**

---

### Step 3: Upload Your Logo

#### Logo Requirements
- **Format**: PNG, SVG, or JPG
- **Minimum Size**: 112×112 pixels
- **Recommended Size**: 512×512 pixels (square) or 1920×480 pixels (wide)
- **Aspect Ratio**: 1:1 (square) or 4:1 (wide logo/wordmark)
- **File Size**: Max 5MB
- **Background**: Transparent preferred, white/light background acceptable

#### Your Logo Files (in `/public/`)
**Primary Options**:
1. **`logo.svg`** ✅ BEST CHOICE
   - Vector format (scales perfectly)
   - Professional appearance
   - Small file size

2. **`police_badge_icon_512x512.png`** ✅ BACKUP
   - 512×512 pixels (perfect size)
   - PNG with transparency
   - 60KB file size

**Upload Steps**:
1. Click **Choose file** or drag-and-drop
2. Select `logo.svg` from `/public/` folder
3. Preview how it appears in Knowledge Panel
4. Click **Submit**

---

### Step 4: Verify Submission
**Immediate Actions**:
- [ ] Check confirmation message: "Logo submitted for review"
- [ ] Note submission date for tracking
- [ ] Screenshot preview for records

**Typical Timeline**:
- **Review**: 1-3 business days
- **Indexing**: 7-14 days
- **Live Appearance**: 1-2 weeks

---

### Step 5: Monitor Knowledge Panel

#### Test Your Brand Search
1. Open incognito browser window
2. Search: `politie forum nederland`
3. Check right sidebar for Knowledge Panel
4. Look for your logo in panel header

**Not appearing yet?** Normal timeline:
- Week 1: Still processing
- Week 2: Should start appearing
- Week 3+: Contact Search Console support if still missing

---

## 🔍 Verification Checklist

### Logo Validation
- [ ] Logo is square (1:1) or wide (4:1)
- [ ] Minimum 112×112px size
- [ ] Clear, recognizable at small sizes
- [ ] No text-heavy designs (use simple icon)
- [ ] Transparent or light background

### Schema Validation
- [ ] Organization schema includes `logo` property
- [ ] Logo URL matches uploaded file: `https://politie-forum.nl/logo.svg`
- [ ] `@id` reference: `https://politie-forum.nl/#logo`
- [ ] ImageObject with width/height specified

**Already implemented in your schema** ✅:
```json
{
  "@type": "Organization",
  "@id": "https://politie-forum.nl/#org",
  "logo": {
    "@type": "ImageObject",
    "@id": "https://politie-forum.nl/#logo",
    "url": "https://politie-forum.nl/logo.svg",
    "width": 512,
    "height": 512
  }
}
```

---

## 🎨 Knowledge Panel Preview

### What Users Will See
```
┌─────────────────────────────┐
│  [Your Logo]                │  ← Logo appears here
│                             │
│  Politie Forum Nederland    │  ← Organization name
│  Discussieplatform          │  ← Description
│                             │
│  📍 Amsterdam               │  ← Address
│  🌐 politie-forum.nl        │  ← Website
│  📱 Social media links      │  ← Twitter, Facebook, etc.
│                             │
│  [Description text...]      │
└─────────────────────────────┘
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Logo not appearing after 2 weeks"
**Solutions**:
1. Check Search Console for rejection notice
2. Verify logo meets size/format requirements
3. Ensure Organization schema is valid (test with Rich Results Test)
4. Resubmit with adjusted logo if needed

### Issue 2: "Verification required"
**Solutions**:
1. Add verification meta tag to `<head>` in `layout.tsx`:
   ```html
   <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   ```
2. Or use Google Analytics method (already installed)
3. DNS TXT record (permanent solution)

### Issue 3: "Wrong logo appearing"
**Solutions**:
1. Check for conflicting Organization schemas on subdomains
2. Verify canonical URLs all point to main domain
3. Update logo in Branding section
4. Request re-crawl in Search Console

---

## 📊 Impact Tracking

### Metrics to Monitor

**Week 1-2**:
- [ ] Search Console shows logo approved
- [ ] Rich Results Test validates Organization schema

**Week 2-4**:
- [ ] Knowledge Panel appears with logo
- [ ] Branded search CTR (click-through rate)

**Month 1-3**:
- [ ] Increased brand recognition
- [ ] More direct traffic from branded searches
- [ ] Stronger Knowledge Panel presence

### Google Analytics Goals
- **Event**: `knowledge_panel_click`
- **Source**: `google / organic`
- **Medium**: `referral` or `cpc`

---

## 🔗 Related Resources

### Google Official Docs
- **Branding Guide**: https://developers.google.com/search/docs/appearance/site-names
- **Knowledge Panel**: https://support.google.com/knowledgepanel
- **Organization Schema**: https://developers.google.com/search/docs/appearance/structured-data/organization

### Validation Tools
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

### Your Project Files
- **Homepage Schema**: `src/components/SEO/HomepageSchema.tsx`
- **Layout Meta**: `src/app/layout.tsx`
- **Logo Files**: `/public/logo.svg` and `/public/police_badge_icon_*.png`

---

## ✅ Post-Submission Checklist

### Immediate (Day 1)
- [x] Logo uploaded to Search Console
- [x] Confirmation email received
- [x] Screenshot saved for records
- [ ] Test logo URL in browser: `https://politie-forum.nl/logo.svg`

### Week 1
- [ ] Check Search Console for approval
- [ ] Validate Organization schema in Rich Results Test
- [ ] Monitor Knowledge Panel searches

### Week 2-3
- [ ] Verify logo appears in Knowledge Panel
- [ ] Test from multiple devices/locations
- [ ] Check incognito mode (logged-out view)

### Month 1+
- [ ] Track branded search traffic in GA4
- [ ] Monitor CTR on branded keywords
- [ ] Document Knowledge Panel features earned

---

## 🎯 Success Criteria

**Logo Successfully Implemented When**:
✅ Appears in Knowledge Panel for branded search
✅ Consistent across desktop and mobile
✅ Matches uploaded file (no distortion)
✅ Loads quickly (< 1 second)
✅ Recognized by Google's entity system

**Expected Timeline**: 1-2 weeks from submission to live appearance

---

**Status**: ⏳ Pending manual submission
**Next Action**: Upload `logo.svg` to Google Search Console → Settings → Branding
**Priority**: High (critical for Knowledge Graph entity lock-in)
