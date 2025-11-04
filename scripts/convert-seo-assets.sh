#!/bin/bash

# SEO Assets PNG Conversion Script
# Converts all SVG files to PNG and optimizes them
# Run this script before production deployment

set -e  # Exit on error

echo "🎨 Politie Forum - SEO Asset Conversion"
echo "========================================"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo ""
    echo "📦 Install with: brew install imagemagick"
    echo ""
    exit 1
fi

echo "✅ ImageMagick found"
echo ""

# Navigate to project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📂 Working directory: $PROJECT_ROOT"
echo ""

# Convert OG Images
echo "🖼️  Converting OG Images..."
cd public/og

if ls *.svg 1> /dev/null 2>&1; then
    for svg in *.svg; do
        png="${svg%.svg}.png"
        echo "  ↳ $svg → $png"
        convert "$svg" "$png"
    done
    echo "  ✅ OG images converted ($(ls -1 *.png 2>/dev/null | wc -l | tr -d ' ') files)"
else
    echo "  ⚠️  No SVG files found in public/og/"
fi

cd "$PROJECT_ROOT"
echo ""

# Convert Icons
echo "🎯 Converting Icons..."
cd public/icons

if ls *.svg 1> /dev/null 2>&1; then
    for svg in *.svg; do
        png="${svg%.svg}.png"
        echo "  ↳ $svg → $png"
        convert "$svg" "$png"
    done
    echo "  ✅ Icons converted ($(ls -1 *.png 2>/dev/null | wc -l | tr -d ' ') files)"
else
    echo "  ⚠️  No SVG files found in public/icons/"
fi

cd "$PROJECT_ROOT"
echo ""

# Check if pngquant is installed for optimization
if command -v pngquant &> /dev/null; then
    echo "🔧 Optimizing PNGs with pngquant..."

    # Optimize OG images
    if ls public/og/*.png 1> /dev/null 2>&1; then
        echo "  ↳ Optimizing OG images..."
        pngquant --quality=80-95 --force --ext .png --skip-if-larger public/og/*.png 2>/dev/null || true
        echo "  ✅ OG images optimized"
    fi

    # Optimize icons
    if ls public/icons/*.png 1> /dev/null 2>&1; then
        echo "  ↳ Optimizing icons..."
        pngquant --quality=80-95 --force --ext .png --skip-if-larger public/icons/*.png 2>/dev/null || true
        echo "  ✅ Icons optimized"
    fi
else
    echo "⚠️  pngquant not found - skipping optimization"
    echo "   Install with: brew install pngquant"
fi

echo ""
echo "📊 File Sizes:"
echo "=============="

# Show OG image sizes
if ls public/og/*.png 1> /dev/null 2>&1; then
    echo ""
    echo "OG Images:"
    for png in public/og/*.png; do
        size=$(du -h "$png" | cut -f1)
        printf "  %-45s %s\n" "$(basename "$png")" "$size"
    done
fi

# Show icon sizes
if ls public/icons/*.png 1> /dev/null 2>&1; then
    echo ""
    echo "Icons:"
    for png in public/icons/*.png; do
        size=$(du -h "$png" | cut -f1)
        printf "  %-45s %s\n" "$(basename "$png")" "$size"
    done
fi

echo ""
echo "✅ Conversion Complete!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Verify PNG files: ls -lh public/og/*.png public/icons/*.png"
echo "2. Build production: npm run build"
echo "3. Test locally: npm start"
echo "4. Validate SEO:"
echo "   - Google Rich Results: https://search.google.com/test/rich-results"
echo "   - Facebook Debugger: https://developers.facebook.com/tools/debug/"
echo "   - Twitter Cards: https://cards-dev.twitter.com/validator"
echo "5. Deploy to production! 🚀"
echo ""
