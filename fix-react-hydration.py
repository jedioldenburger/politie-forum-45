#!/usr/bin/env python3
"""Fix React hydration errors in published articles"""

import firebase_admin
from firebase_admin import credentials, firestore
import re
import sys

# Initialize Firebase Admin
cred = credentials.Certificate("secretkey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


def fix_html_for_react(html):
    """Apply React-safe HTML fixes"""
    if not html:
        return html

    # Fix invalid nesting: <p><h2> → </p><h2>
    html = re.sub(r"<p>([^<]*)<h2>", r"<p>\1</p>\n<h2>", html)
    html = re.sub(r"<p>([^<]*)<h3>", r"<p>\1</p>\n<h3>", html)

    # Remove incomplete sentences before headings
    html = re.sub(r"\s+[a-zA-Z]+\s+<h([23])>", r"</p>\n<h\1>", html)

    # Remove stray -- characters
    html = re.sub(r"\s*--\s*", " ", html)

    # Remove double closing tags
    html = re.sub(r"</p>\s*</p>", "</p>", html)
    html = re.sub(r"</h2>\s*</h2>", "</h2>", html)

    # REACT HYDRATION FIXES: Remove problematic whitespace
    # Remove trailing/leading whitespace inside tags
    html = re.sub(r"<h2>\s+", "<h2>", html)
    html = re.sub(r"\s+</h2>", "</h2>", html)
    html = re.sub(r"<p>\s+", "<p>", html)
    html = re.sub(r"\s+</p>", "</p>", html)

    # Remove empty paragraphs
    html = re.sub(r"<p>\s*</p>", "", html)

    # Normalize whitespace between tags (prevent text nodes)
    html = re.sub(r"</p>\s+<h", "</p>\n<h", html)
    html = re.sub(r"</h2>\s+<p>", "</h2>\n<p>", html)
    html = re.sub(r"</h2>\s+<h", "</h2>\n<h", html)

    # Remove trailing whitespace at end of content
    html = html.rstrip()

    # PROPER HTML TAG BALANCING using regex to find opening/closing pairs
    # Count <h2> tags (match both <h2> and <h2 class="...">)
    h2_open = len(re.findall(r"<h2(?:\s|>)", html))
    h2_close = html.count("</h2>")

    # Count <p> tags (match both <p> and <p class="...">)
    p_open = len(re.findall(r"<p(?:\s|>)", html))
    p_close = html.count("</p>")

    # CRITICAL FIX: Remove ORPHANED closing tags first
    # These are closing tags without corresponding opening tags
    if p_close > p_open:
        # Too many closing </p> tags - remove extras from the end
        excess = p_close - p_open
        # Remove excess closing tags from end of content
        for _ in range(excess):
            # Find last </p> and remove it
            last_p_close = html.rfind("</p>")
            if last_p_close != -1:
                html = html[:last_p_close] + html[last_p_close + 4 :]
        print(f"    ✅ Removed {excess} orphaned </p> tags")

    if h2_close > h2_open:
        excess = h2_close - h2_open
        for _ in range(excess):
            last_h2_close = html.rfind("</h2>")
            if last_h2_close != -1:
                html = html[:last_h2_close] + html[last_h2_close + 5 :]
        print(f"    ✅ Removed {excess} orphaned </h2> tags")

    # Now close any remaining unclosed tags (only if more opening than closing)
    if h2_open > h2_close:
        html += "</h2>\n" * (h2_open - h2_close)
        print(f"    ✅ Fixed {h2_open - h2_close} unclosed <h2> tags")
    if p_open > p_close:
        html += "</p>\n" * (p_open - p_close)
        print(f"    ✅ Fixed {p_open - p_close} unclosed <p> tags")

    # Final cleanup: remove any trailing empty lines
    html = html.rstrip()

    return html


def main():
    slugs = (
        sys.argv[1:]
        if len(sys.argv) > 1
        else [
            "china-trekt-exportverbod-nexperia-infiltrateur-handeltijd",
            "china-legt-exportverbod-nexperia-wegens-nederlandse",
        ]
    )

    print(f"🔧 Fixing {len(slugs)} articles for React hydration...")

    for slug in slugs:
        print(f"\n📄 Processing: {slug}")
        article_ref = db.collection("news").document(slug)
        article = article_ref.get()

        if not article.exists:
            print(f"❌ Not found: {slug}")
            continue

        data = article.to_dict()
        full_text = data.get("full_text", "")

        if not full_text:
            print(f"⚠️ No content in article")
            continue

        # Apply fixes
        fixed_html = fix_html_for_react(full_text)

        if fixed_html == full_text:
            print(f"✅ No changes needed")
        else:
            # Update article
            article_ref.update({"full_text": fixed_html})
            print(f"✅ Fixed HTML issues")
            print(f"   - Original length: {len(full_text)}")
            print(f"   - Fixed length: {len(fixed_html)}")

    print("\n✅ Done! Now trigger revalidation:")
    print("curl -X POST 'https://politie-forum.nl/api/revalidate?secret=YOUR_SECRET'")


if __name__ == "__main__":
    main()
