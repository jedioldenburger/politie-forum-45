#!/bin/bash

# 🚀 Quick News Article Generator
# Generates articles from politie.nl RSS feed with AI rewriting
# Creates both static HTML and Firebase entries

echo "════════════════════════════════════════════════════"
echo "   📰 Politie Forum News Article Generator"
echo "════════════════════════════════════════════════════"
echo ""

# Check if we're in the right directory
if [ ! -f "news-rip.py" ]; then
    echo "❌ Error: news-rip.py not found!"
    echo "   Please run this script from the project root directory."
    exit 1
fi

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    echo "🔄 Activating virtual environment..."
    source venv/bin/activate
else
    echo "❌ Error: Virtual environment not found!"
    echo "   Create one with: python3 -m venv venv"
    exit 1
fi

# Ask user for configuration
echo ""
echo "📋 Configuration:"
echo "────────────────────────────────────────────────────"
echo ""

# RSS Feed selection
echo "Select RSS Feed:"
echo "  1. Politie Nederland (Algemeen)"
echo "  2. NU.nl (Algemeen)"
echo "  3. Custom URL"
echo ""
read -p "Choice [1-3]: " feed_choice

case $feed_choice in
    1)
        RSS_URL="https://rss.politie.nl/rss/algemeen/ab/algemeen.xml"
        IS_POLITIE="true"
        ;;
    2)
        RSS_URL="https://www.nu.nl/rss/Algemeen"
        IS_POLITIE="false"
        ;;
    3)
        read -p "Enter RSS URL: " RSS_URL
        IS_POLITIE="false"
        ;;
    *)
        RSS_URL="https://rss.politie.nl/rss/algemeen/ab/algemeen.xml"
        IS_POLITIE="true"
        ;;
esac

# Number of articles
echo ""
read -p "How many articles to generate? [1-5]: " NUM_ARTICLES
NUM_ARTICLES=${NUM_ARTICLES:-1}

# Writing style
echo ""
echo "Select writing style:"
echo "  1. Technical (Formal, professional)"
echo "  2. Normal (Standard news)"
echo "  3. Easy (Simple, accessible)"
echo "  4. Populair (Engaging, broad audience)"
echo ""
read -p "Choice [1-4]: " style_choice

case $style_choice in
    1) STYLE="1" ;;
    2) STYLE="2" ;;
    3) STYLE="3" ;;
    4) STYLE="4" ;;
    *) STYLE="2" ;;
esac

echo ""
echo "────────────────────────────────────────────────────"
echo "📝 Summary:"
echo "   RSS Feed: $RSS_URL"
echo "   Articles: $NUM_ARTICLES"
echo "   Style: $([ "$STYLE" = "1" ] && echo "Technical" || [ "$STYLE" = "2" ] && echo "Normal" || [ "$STYLE" = "3" ] && echo "Easy" || echo "Populair")"
echo "────────────────────────────────────────────────────"
echo ""

read -p "Continue? [Y/n]: " confirm
confirm=${confirm:-Y}

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled."
    exit 0
fi

# Create input file for Python script
INPUT_FILE="/tmp/news-generator-input.txt"

if [ "$IS_POLITIE" = "true" ]; then
    # Politie.nl workflow: option 11 -> 12
    cat > $INPUT_FILE <<EOF
11
$NUM_ARTICLES
12
Nieuws
$STYLE
10
13
EOF
else
    # Other RSS workflow: option 1 -> 2 -> 3 -> 4 -> 10
    cat > $INPUT_FILE <<EOF
1
$RSS_URL
2
Nieuws
3
$NUM_ARTICLES
4
$STYLE
10
13
EOF
fi

echo ""
echo "🚀 Starting article generation..."
echo "════════════════════════════════════════════════════"
echo ""

# Run Python script with input
python3 news-rip.py < $INPUT_FILE

# Clean up
rm $INPUT_FILE

# Check if articles were generated
if ls public/nieuws/*/index.html 1> /dev/null 2>&1; then
    echo ""
    echo "════════════════════════════════════════════════════"
    echo "   ✅ Articles generated successfully!"
    echo "════════════════════════════════════════════════════"
    echo ""
    echo "📍 Static HTML files:"
    ls -1 public/nieuws/*/index.html | head -n 5
    echo ""
    echo "🔥 Firebase entries should be created at /news/{slug}"
    echo ""
    echo "🌐 Next steps:"
    echo "   1. Start dev server: npm run dev"
    echo "   2. Visit: http://localhost:3001/nieuws"
    echo "   3. Deploy: vercel --prod"
    echo ""
else
    echo ""
    echo "⚠️  No articles found. Check the output above for errors."
    echo ""
fi

echo "════════════════════════════════════════════════════"
