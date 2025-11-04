#!/bin/bash

echo "🧹 Removing all existing Vercel environment variables..."

# Remove all environment variables from all environments
npx vercel env rm FIREBASE_ADMIN_PROJECT_ID production -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PROJECT_ID preview -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PROJECT_ID development -y 2>/dev/null || true

npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY_ID production -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY_ID preview -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY_ID development -y 2>/dev/null || true

npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY production -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY preview -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_PRIVATE_KEY development -y 2>/dev/null || true

npx vercel env rm FIREBASE_ADMIN_CLIENT_EMAIL production -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_CLIENT_EMAIL preview -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_CLIENT_EMAIL development -y 2>/dev/null || true

npx vercel env rm FIREBASE_ADMIN_CLIENT_ID production -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_CLIENT_ID preview -y 2>/dev/null || true
npx vercel env rm FIREBASE_ADMIN_CLIENT_ID development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_DATABASE_URL production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_DATABASE_URL preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_DATABASE_URL development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_PROJECT_ID production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_PROJECT_ID preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_PROJECT_ID development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_APP_ID production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_APP_ID preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_APP_ID development -y 2>/dev/null || true

npx vercel env rm NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID preview -y 2>/dev/null || true
npx vercel env rm NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID development -y 2>/dev/null || true

npx vercel env rm REVALIDATE_SECRET production -y 2>/dev/null || true
npx vercel env rm REVALIDATE_SECRET preview -y 2>/dev/null || true
npx vercel env rm REVALIDATE_SECRET development -y 2>/dev/null || true

echo "✅ Cleanup complete!"
echo "📝 Now run: ./setup-vercel-env.sh"
