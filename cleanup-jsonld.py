#!/usr/bin/env python3
"""
Cleanup script: Remove deprecated 'jsonLd' field from Firebase /news collection
This field is no longer needed as Next.js generates JSON-LD dynamically via ArticleJsonLd.tsx
"""

import firebase_admin
from firebase_admin import credentials, firestore
import os


def cleanup_jsonld_field():
    """Remove 'jsonLd' field from all articles in /news collection"""
    try:
        # Initialize Firebase Admin SDK
        possible_paths = [
            "./secretkey.json",
            "../secretkey.json",
            os.path.expanduser("~/secretkey.json"),
        ]

        cred_path = None
        for path in possible_paths:
            if os.path.exists(path):
                cred_path = path
                break

        if not cred_path:
            print("❌ Error: secretkey.json not found")
            return

        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)

        db = firestore.client()

        print("\n🔍 Scanning /news collection for 'jsonLd' fields...")

        # Get all documents in /news collection
        news_ref = db.collection("news")
        docs = news_ref.stream()

        updated_count = 0
        skipped_count = 0

        for doc in docs:
            doc_data = doc.to_dict()

            if "jsonLd" in doc_data:
                print(f"   ✅ Removing 'jsonLd' from: {doc.id}")
                # Remove the jsonLd field
                news_ref.document(doc.id).update({"jsonLd": firestore.DELETE_FIELD})
                updated_count += 1
            else:
                skipped_count += 1

        print(f"\n{'='*60}")
        print(f"✅ Cleanup completed!")
        print(f"   Updated: {updated_count} articles")
        print(f"   Skipped: {skipped_count} articles (already clean)")
        print(f"{'='*60}\n")

    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    print("🧹 Firebase JSON-LD Cleanup Script")
    print("=" * 60)
    cleanup_jsonld_field()
