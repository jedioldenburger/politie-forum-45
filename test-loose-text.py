#!/usr/bin/env python3
"""
Quick test: Check if the problematic article has loose text nodes
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

slug = "ex-premier-league-scheidsrechter-bekent-aanranding-minde-2025"

# Get article from /news
doc = db.collection("news").document(slug).get()
if not doc.exists:
    print(f"❌ Article not found: {slug}")
    exit(1)

article = doc.to_dict()
content = article.get("content", "")

print(f"📰 Article: {slug}")
print(f"📏 Content length: {len(content)} chars\n")

# Find loose text nodes (text between block elements not in <p> tags)
pattern = r"(</h[1-6]>|</p>|</div>)\s*([^<]+?)\s*(<h[1-6][^>]*>|<p[^>]*>|<div[^>]*>)"
matches = re.findall(pattern, content)

if matches:
    print(f"❌ Found {len(matches)} loose text nodes:\n")
    for i, match in enumerate(matches[:5], 1):  # Show first 5
        closing_tag = match[0]
        text = match[1][:60]
        opening_tag = match[2][:20]
        print(f"{i}. {closing_tag} «{text}...» {opening_tag}...")
else:
    print("✅ No loose text nodes found!")

# Check for text immediately after headings
heading_text_pattern = r"(</h[1-6]>)\s+([A-Za-z])"
heading_matches = re.findall(heading_text_pattern, content)

if heading_matches:
    print(f"\n❌ Found {len(heading_matches)} text nodes after headings:")
    for i, match in enumerate(heading_matches[:5], 1):
        print(f"{i}. {match[0]} followed by text starting with '{match[1]}'")
else:
    print("\n✅ No text directly after headings!")

print("\n" + "=" * 60)
print("💡 Solution: Run menu option 24 to reprocess this article")
print("   with the new loose text wrapper fix.")
