#!/bin/bash

# Add Firebase environment variables to Vercel
# This makes the forum work in production

echo "🚀 Adding Firebase environment variables to Vercel..."
echo ""
echo "For each variable, when prompted:"
echo "  1. Select environment: Production, Preview, and Development (use space to select, enter to confirm)"
echo "  2. Paste the value shown below"
echo "  3. Press Enter"
echo ""

# Read values from .env.local
export $(cat .env.local | xargs)

echo "📝 Adding NEXT_PUBLIC_FIREBASE_API_KEY..."
echo "Value: $NEXT_PUBLIC_FIREBASE_API_KEY"
echo $NEXT_PUBLIC_FIREBASE_API_KEY | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
echo "Value: $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo $NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_DATABASE_URL..."
echo "Value: $NEXT_PUBLIC_FIREBASE_DATABASE_URL"
echo $NEXT_PUBLIC_FIREBASE_DATABASE_URL | vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
echo "Value: $NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
echo "Value: $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo $NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
echo "Value: $NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo $NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_APP_ID..."
echo "Value: $NEXT_PUBLIC_FIREBASE_APP_ID"
echo $NEXT_PUBLIC_FIREBASE_APP_ID | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo ""

echo "📝 Adding NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID..."
echo "Value: $NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID"
echo $NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID | vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production
echo ""

echo "✅ All environment variables added!"
echo ""
echo "Next steps:"
echo "  1. Run: vercel --prod"
echo "  2. Wait for deployment to complete"
echo "  3. Visit your site - Firebase should now work!"
