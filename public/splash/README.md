# iOS Splash Screens - Politie Forum Nederland

## Required Splash Screen Sizes

Generate these PNG files with your branding (logo centered on #001f5c background):

### iPhone Models
- `iphone-se.png` - 640×1136px (iPhone SE, 5s)
- `iphone-8.png` - 750×1334px (iPhone 8, 7, 6s)
- `iphone-11.png` - 828×1792px (iPhone 11, XR)
- `iphone-14.png` - 1290×2796px (iPhone 14, 15 Pro)

### iPad Models
- `ipad-9.7.png` - 1536×2048px (iPad 9.7", Air)
- `ipad-pro-11.png` - 1668×2388px (iPad Pro 11")
- `ipad-pro-12.9.png` - 2048×2732px (iPad Pro 12.9")

## Design Guidelines

1. **Background**: Use brand gradient (#001f5c → #004bbf)
2. **Logo**: Center the Politie Forum logo/badge
3. **Safe Area**: Keep content 20% from edges
4. **Format**: PNG with transparency support
5. **Optimization**: Compress to <100KB per file

## Quick Generation

Use tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- Figma/Sketch export with proper dimensions

## Testing

Test on real devices:
```bash
# Safari iOS → Share → Add to Home Screen
# Check splash screen appears on launch
```

## Current Status

⚠️ Placeholder files needed - generate with brand assets
✅ HTML meta tags configured in layout.tsx
✅ Manifest.webmanifest configured
✅ Service Worker ready for offline support
