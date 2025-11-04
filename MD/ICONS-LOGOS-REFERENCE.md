# Icon & Logo Reference Guide

## 📁 Available Assets

### Primary Logo Files
- **`logo.png`** (1024×1024) - Main square logo for general use
- **`logo-full.png`** (1920×1080) - Full horizontal logo with text
- **`favicon.png`** (1485757 bytes) - High-res favicon source

### Police Badge Icon Set
- `police_badge_icon_16x16.png` - Tiny favicon
- `police_badge_icon_32x32.png` - Small favicon
- `police_badge_icon_64x64.png` - Medium icon
- `police_badge_icon_128x128.png` - Large icon
- `police_badge_icon_192x192.png` - **PWA icon (recommended)**
- `police_badge_icon_256x256.png` - Extra large icon
- `police_badge_icon_512x512.png` - **PWA maskable icon**
- `police_badge_icon.ico` - Windows ICO format

### Open Graph Images
- `/og/politie-forum-1200x630.png` - Social media preview (1200×630)

---

## 🎯 Usage Guide

### 1. **HTML Meta Tags** (Static Pages)
```html
<!-- Favicons -->
<link rel="icon" href="/police_badge_icon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/police_badge_icon_32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/police_badge_icon_16x16.png">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" sizes="192x192" href="/police_badge_icon_192x192.png">

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Open Graph -->
<meta property="og:image" content="https://politie-forum.nl/og/politie-forum-1200x630.png">
```

### 2. **Next.js Metadata** (Dynamic Pages)
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/police_badge_icon_16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/police_badge_icon_32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/police_badge_icon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/police_badge_icon_192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    images: [
      {
        url: "https://politie-forum.nl/og/politie-forum-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Politie Forum Nederland",
      },
    ],
  },
};
```

### 3. **JSON-LD Schema**
```json
{
  "@type": "Organization",
  "logo": {
    "@type": "ImageObject",
    "url": "https://politie-forum.nl/logo.png",
    "width": 1024,
    "height": 1024
  }
}
```

### 4. **PWA Manifest** (`manifest.json`)
```json
{
  "icons": [
    {
      "src": "/police_badge_icon_192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/police_badge_icon_512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## 🎨 Design Specifications

### Logo Colors
- **Primary Blue**: `#004bbf` (primary-600)
- **Dark Blue**: `#0a1931` (dark theme background)
- **Accent Red**: `#e60000` (accent-500)
- **White**: `#ffffff` (light theme)

### Icon Requirements
| Platform | Size | Format | Purpose |
|----------|------|--------|---------|
| Browser Tab | 16×16, 32×32 | ICO/PNG | Favicon |
| Apple Touch | 180×180, 192×192 | PNG | iOS Home Screen |
| Android PWA | 192×192, 512×512 | PNG | App Icon |
| Social Media | 1200×630 | PNG | OG Image |
| Logo (General) | 1024×1024 | PNG | Branding |

### File Paths
```
public/
├── police_badge_icon.ico          # Main favicon
├── police_badge_icon_16x16.png    # Browser favicon
├── police_badge_icon_32x32.png    # Browser favicon
├── police_badge_icon_192x192.png  # PWA icon ⭐
├── police_badge_icon_512x512.png  # PWA maskable ⭐
├── logo.png                        # Main logo (1024×1024)
├── logo-full.png                   # Full logo with text
├── manifest.json                   # PWA manifest
└── og/
    └── politie-forum-1200x630.png # Social preview
```

---

## ✅ Implementation Checklist

- [x] Favicons (ICO + PNG)
- [x] Apple Touch Icons
- [x] PWA Manifest (`manifest.json`)
- [x] Open Graph images
- [x] JSON-LD logo references
- [x] Theme color meta tags
- [x] Static template updated
- [x] Next.js components updated
- [x] TypeScript interfaces created

---

## 🚀 Validation

### Test Your Icons:
1. **Favicon**: Visit site in browser, check tab icon
2. **PWA**: Use Lighthouse > PWA audit
3. **Apple**: Add to iOS Home Screen
4. **Android**: Add to Android Home Screen
5. **Social**: Share on Twitter/Facebook, check preview

### Tools:
- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Open Graph Debugger](https://www.opengraph.xyz/)

---

## 📝 Notes

- **Logo vs Icon**: Use `logo.png` for branding, `police_badge_icon_*.png` for favicons/PWA
- **Maskable Icons**: Android adaptive icons use `police_badge_icon_512x512.png`
- **OG Image**: Always use 1200×630 for best social media compatibility
- **Theme Colors**: Match your brand (`#004bbf` primary, `#0a1931` dark)

---

**Last Updated**: October 8, 2025
**Maintained By**: Politie Forum Nederland Development Team
