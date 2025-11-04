#!/usr/bin/env python3
"""
Quick fix script to remove orphan </p> tags from published articles in /news collection
"""
import re
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin
cred = credentials.Certificate("./secretkey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Target article slug
slug = "rechter-schorst-nexperia-topman-wegens-roekeloos-leiderschap"

print(f"🔍 Fetching article: {slug}")
doc_ref = db.collection("news").document(slug)
doc = doc_ref.get()

if not doc.exists:
    print(f"❌ Article not found: {slug}")
    exit(1)

article = doc.to_dict()
content = article.get("content", "")

print(f"📄 Original content length: {len(content)} characters")
print(f"📊 Original </p> count: {content.count('</p>')}")

# Count tags
p_open = len(re.findall(r"<p(?:\s|>)", content))
p_close = content.count("</p>")
print(f"   <p> opens: {p_open}")
print(f"   </p> closes: {p_close}")
print(f"   Excess: {p_close - p_open}")

# Apply aggressive orphan removal
fixed_content = content

# Step 0: Master fix - remove ALL trailing </p> sequences
fixed_content = re.sub(r"((?:</p>)+)\s*$", "", fixed_content).rstrip()
print(f"🔥 Master fix: Stripped trailing </p> sequences")

# Step 1: Aggressive orphan removal
p_open_after = len(re.findall(r"<p(?:\s|>)", fixed_content))
p_close_after = fixed_content.count("</p>")

if p_close_after > p_open_after:
    excess = p_close_after - p_open_after
    # Fallback: Remove from end one by one
    for _ in range(excess):
        last_idx = fixed_content.rfind("</p>")
        if last_idx == -1:
            break
        fixed_content = fixed_content[:last_idx] + fixed_content[last_idx + 4 :]
    print(f"🧼 Removed {excess} additional orphan </p> tags")

# Step 2: Collapse consecutive </p>
fixed_content = re.sub(r"(</p>\s*){2,}", "</p>\n", fixed_content)

# Step 3: Remove whitespace between block elements
fixed_content = re.sub(r"</p>\s+<h", "</p>\n<h", fixed_content)
fixed_content = re.sub(r"</h2>\s+<p>", "</h2>\n<p>", fixed_content)
fixed_content = re.sub(r"</h2>\s+<h", "</h2>\n<h", fixed_content)

# Step 4: Fix invalid nesting
fixed_content = re.sub(r"<p>\s*<h([23])", "</p>\n<h\\1", fixed_content)
fixed_content = re.sub(r"</h([23])>\s*</p>", "</h\\1>", fixed_content)

print(f"\n📊 Fixed content stats:")
print(f"   Length: {len(fixed_content)} characters")
p_open_final = len(re.findall(r"<p(?:\s|>)", fixed_content))
p_close_final = fixed_content.count("</p>")
print(f"   <p> opens: {p_open_final}")
print(f"   </p> closes: {p_close_final}")
print(f"   Balanced: {'✅' if p_open_final == p_close_final else '❌'}")

# Update Firestore
if p_open_final == p_close_final:
    print(f"\n💾 Updating Firestore document...")
    doc_ref.update({"content": fixed_content})
    print(f"✅ Article updated successfully!")
    print(f"\n🔗 View at: https://politie-forum.nl/nieuws/{slug}")
else:
    print(f"\n⚠️ Tags still not balanced, manual review needed")
    print(f"Excess: {p_close_final - p_open_final}")
