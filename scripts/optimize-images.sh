#!/bin/bash
# Image Optimization Script for Politie Forum
# Converts PNG/JPG images to WebP format for better performance

echo "🖼️  Starting image optimization..."

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Installing..."
    echo "Run: brew install webp (macOS) or apt-get install webp (Linux)"
    exit 1
fi

# Create WebP versions of badge icons
echo "Converting badge icons..."
cd public

icons=(
    "police_badge_icon_16x16.png"
    "police_badge_icon_32x32.png"
    "police_badge_icon_64x64.png"
    "police_badge_icon_128x128.png"
    "police_badge_icon_192x192.png"
    "police_badge_icon_256x256.png"
    "police_badge_icon_512x512.png"
)

for icon in "${icons[@]}"; do
    if [ -f "$icon" ]; then
        output="${icon%.png}.webp"
        echo "  Converting $icon → $output"
        cwebp -q 85 -m 6 "$icon" -o "$output"
    fi
done

# Convert logo files
echo "Converting logos..."
if [ -f "logo.png" ]; then
    cwebp -q 90 -m 6 logo.png -o logo.webp
fi

if [ -f "logo-full.png" ]; then
    cwebp -q 90 -m 6 logo-full.png -o logo-full.webp
fi

# Convert OG image
if [ -f "og/politie-forum-1200x630.png" ]; then
    echo "Converting OG image..."
    cwebp -q 85 -m 6 og/politie-forum-1200x630.png -o og/politie-forum-1200x630.webp
fi

echo "✅ Image optimization complete!"
echo ""
echo "📊 Size comparison:"
du -h *.png *.webp 2>/dev/null | sort -h

echo ""
echo "🚀 Next steps:"
echo "1. Update image references to use .webp format"
echo "2. Use <picture> element with fallback:"
echo "   <picture>"
echo "     <source srcset='/logo.webp' type='image/webp'>"
echo "     <img src='/logo.png' alt='Logo'>"
echo "   </picture>"
