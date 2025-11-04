#!/usr/bin/env python3
"""
Test script to check articles_full structure
"""
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate("secretkey.json")
try:
    app = firebase_admin.get_app()
except ValueError:
    app = firebase_admin.initialize_app(cred)

db = firestore.client()

print("🔍 Checking articles_full collection structure...\n")

# Get the article you mentioned
slug = "david-coote-bekent-ongepast-kinderbeeld-2025"
link = "https://www.nu.nl/voetbal/6372367/veelbesproken-oud-premier-league-arbiter-bekent-maken-ongepast-beeld-kind.html"

# Find by link
articles_ref = db.collection("articles_full").where("link", "==", link).limit(1)
articles = articles_ref.get()

if not articles:
    print(f"❌ Article not found with link: {link}")
    print("\n🔍 Trying to find any unprocessed articles...")
    # Get first unprocessed article
    articles_ref = (
        db.collection("articles_full").where("processed_v3", "==", False).limit(1)
    )
    articles = articles_ref.get()
    if not articles:
        print("❌ No unprocessed articles found in articles_full")
        exit(1)

article_doc = articles[0]
article = article_doc.to_dict()

print(f"✅ Found article: {article_doc.id}\n")
print("=" * 80)

# Show all fields
print("\n📋 Available Fields:")
for key in article.keys():
    value = article[key]
    if isinstance(value, str):
        preview = value[:100] + "..." if len(value) > 100 else value
        print(f"   • {key}: {preview}")
    else:
        print(f"   • {key}: {value}")

print("\n" + "=" * 80)

# Check specific fields
print("\n📊 Field Analysis:")

body = article.get("body", "")
full_text = article.get("full_text", "")
content = article.get("content", "")

print(f"\n   'body' field:")
print(f"   - Exists: {bool(body)}")
print(f"   - Length: {len(body)} chars")
print(f"   - Type: {type(body)}")
if body:
    print(f"   - Preview: {body[:200]}...")
    has_html = "<" in body and ">" in body
    print(f"   - Contains HTML: {has_html}")

print(f"\n   'full_text' field:")
print(f"   - Exists: {bool(full_text)}")
print(f"   - Length: {len(full_text)} chars")
print(f"   - Type: {type(full_text)}")
if full_text:
    print(f"   - Preview: {full_text[:200]}...")
    has_html = "<" in full_text and ">" in full_text
    print(f"   - Contains HTML: {has_html}")

print(f"\n   'content' field:")
print(f"   - Exists: {bool(content)}")
print(f"   - Length: {len(content)} chars")
print(f"   - Type: {type(content)}")
if content:
    print(f"   - Preview: {content[:200]}...")

print("\n" + "=" * 80)
print("\n✅ Analysis complete!")
