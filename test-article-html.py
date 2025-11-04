#!/usr/bin/env python3
"""
Test script to check if articles in /news collection contain HTML fragments or complete documents
"""
import firebase_admin
from firebase_admin import credentials, firestore
import re

# Initialize Firebase Admin
cred = credentials.Certificate("secretkey.json")
try:
    app = firebase_admin.get_app()
except ValueError:
    app = firebase_admin.initialize_app(cred)

db = firestore.client()

print("🔍 Checking /news collection for HTML structure issues...\n")

# Get first 5 articles from /news
news_ref = db.collection("news").limit(5)
articles = news_ref.get()

if not articles:
    print("❌ No articles found in /news collection")
    exit(1)

print(f"✅ Found {len(articles)} articles\n")
print("=" * 80)

for i, doc in enumerate(articles, 1):
    article = doc.to_dict()
    slug = doc.id
    title = article.get("title", "No title")[:60]
    content = article.get("content", "")

    print(f"\n📰 Article {i}/{len(articles)}")
    print(f"   Slug: {slug}")
    print(f"   Title: {title}...")
    print(f"   Content length: {len(content)} chars")

    # Check for document-level tags
    has_doctype = "<!DOCTYPE" in content
    has_html = "<html" in content.lower()
    has_body = "<body" in content.lower()
    has_head = "<head" in content.lower()

    # Check for fragment tags (good)
    has_article = "<article" in content.lower()
    has_h1 = "<h1" in content.lower()
    has_h2 = "<h2" in content.lower()
    has_p = "<p>" in content

    print(f"\n   🔍 HTML Structure Analysis:")
    print(
        f"   {'❌' if has_doctype else '✅'} DOCTYPE: {'Found' if has_doctype else 'Not found'}"
    )
    print(
        f"   {'❌' if has_html else '✅'} <html> tag: {'Found' if has_html else 'Not found'}"
    )
    print(
        f"   {'❌' if has_head else '✅'} <head> tag: {'Found' if has_head else 'Not found'}"
    )
    print(
        f"   {'❌' if has_body else '✅'} <body> tag: {'Found' if has_body else 'Not found'}"
    )

    print(f"\n   📝 Fragment Tags:")
    print(
        f"   {'✅' if has_article else '⚠️ '} <article> tag: {'Found' if has_article else 'Not found'}"
    )
    print(
        f"   {'✅' if has_h1 else '⚠️ '} <h1> tag: {'Found' if has_h1 else 'Not found'}"
    )
    print(
        f"   {'✅' if has_h2 else '⚠️ '} <h2> tag: {'Found' if has_h2 else 'Not found'}"
    )
    print(f"   {'✅' if has_p else '⚠️ '} <p> tag: {'Found' if has_p else 'Not found'}")

    # Overall status
    is_clean = not (has_doctype or has_html or has_head or has_body)
    print(
        f"\n   🎯 Status: {'✅ CLEAN FRAGMENT' if is_clean else '❌ CONTAINS DOCUMENT TAGS'}"
    )

    # Show first 200 chars
    print(f"\n   📄 First 200 chars:")
    print(f"   {content[:200]}...")

    # Show last 150 chars
    print(f"\n   📄 Last 150 chars:")
    print(f"   ...{content[-150:]}")

    print("=" * 80)

print("\n✅ Analysis complete!")
