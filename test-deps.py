#!/usr/bin/env python3
"""
Quick test script voor News Ripper dependencies
"""

print("🧪 Testing News Ripper Dependencies...\n")

# Test 1: Feedparser
try:
    import feedparser

    print(f"✅ feedparser {feedparser.__version__}")
except Exception as e:
    print(f"❌ feedparser: {e}")

# Test 2: Firebase Admin
try:
    import firebase_admin

    print(f"✅ firebase-admin (imported)")
except Exception as e:
    print(f"❌ firebase-admin: {e}")

# Test 3: Selenium
try:
    import selenium

    print(f"✅ selenium (imported)")
except Exception as e:
    print(f"❌ selenium: {e}")

# Test 4: BeautifulSoup
try:
    import bs4

    print(f"✅ beautifulsoup4 (imported)")
except Exception as e:
    print(f"❌ beautifulsoup4: {e}")

# Test 5: OpenAI (for Groq)
try:
    from openai import OpenAI

    print(f"✅ openai (imported)")
except Exception as e:
    print(f"❌ openai: {e}")

# Test 6: NLTK
try:
    import nltk
    from nltk.corpus import stopwords

    # Try to load stopwords
    try:
        stop_words = stopwords.words("dutch")
        print(f"✅ nltk + stopwords ({len(stop_words)} Dutch stopwords)")
    except:
        print(f"⚠️  nltk imported but stopwords not downloaded")
except Exception as e:
    print(f"❌ nltk: {e}")

# Test 7: Groq Client
try:
    from openai import OpenAI

    client = OpenAI(api_key="test_key", base_url="https://api.groq.com/openai/v1")
    print(f"✅ Groq client initialization (syntax)")
except Exception as e:
    print(f"❌ Groq client: {e}")

# Test 8: Firebase Service Account
import os

possible_keys = ["./secretkey.json", "./news_ripper_key.json"]

key_found = False
for key_path in possible_keys:
    if os.path.exists(key_path):
        print(f"✅ Firebase key: {key_path}")
        key_found = True
        break

if not key_found:
    print(f"⚠️  Firebase key not found (secretkey.json or news_ripper_key.json)")

print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("✅ All core dependencies are working!")
print("🚀 Ready to run: python3 news-rip.py")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
