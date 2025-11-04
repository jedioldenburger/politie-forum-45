#!/bin/bash

# News Ripper Python Environment Setup
# Voor politie-forum.nl RSS-to-Forum automatisering

echo "🐍 Setting up Python environment for News Ripper..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✅ Found $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "✅ Virtual environment created: ./venv"
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo ""
echo "📥 Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Download NLTK data
echo ""
echo "📚 Downloading NLTK stopwords data..."
python3 -c "import nltk; nltk.download('stopwords')"

# Check ChromeDriver
echo ""
echo "🌐 Checking ChromeDriver..."
if command -v chromedriver &> /dev/null; then
    CHROMEDRIVER_VERSION=$(chromedriver --version)
    echo "✅ Found $CHROMEDRIVER_VERSION"
else
    echo "⚠️  ChromeDriver not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install chromedriver
        echo "✅ ChromeDriver installed"
    else
        echo "❌ Homebrew not found. Please install ChromeDriver manually:"
        echo "   https://chromedriver.chromium.org/downloads"
    fi
fi

# Check for Firebase service account key
echo ""
echo "🔑 Checking Firebase service account key..."
if [ -f "news_ripper_key.json" ]; then
    echo "✅ Found news_ripper_key.json"
elif [ -f "secretkey.json" ]; then
    echo "✅ Found secretkey.json"
else
    echo "⚠️  Firebase service account key not found!"
    echo ""
    echo "📝 To create a service account key:"
    echo "   1. Go to: https://console.firebase.google.com/"
    echo "   2. Select project: blockchainkix-com-fy"
    echo "   3. Go to: Project Settings > Service Accounts"
    echo "   4. Click: 'Generate new private key'"
    echo "   5. Save as: news_ripper_key.json in this directory"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo ""
echo "📖 To use the News Ripper:"
echo ""
echo "   1. Activate environment:"
echo "      source venv/bin/activate"
echo ""
echo "   2. Run the script:"
echo "      python3 news-rip.py"
echo ""
echo "   3. Deactivate when done:"
echo "      deactivate"
echo ""
echo "🚀 Quick start guide: See MD/NEWS-RIPPER-TO-FORUM.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
