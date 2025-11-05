#!/bin/bash

# Fix ESLint errors systematically
echo "🔧 Fixing ESLint errors..."

# 1. Add Link import to files that need it
FILES_NEED_LINK=(
  "src/app/cookies/CookiesClient.tsx"
  "src/app/correcties/CorrectiesClient.tsx"
  "src/app/feitencontrole/FeitencontroleClient.tsx"
  "src/app/forum-disclaimer/ForumDisclaimerClient.tsx"
  "src/app/gebruikersregels/GebruikersregelsClient.tsx"
  "src/app/moderatie-beleid/ModeratiebeleidClient.tsx"
  "src/app/redactionele-principes/RedactionelePrincipesClient.tsx"
  "src/app/toegankelijkheid/ToegankelijkheidClient.tsx"
)

for file in "${FILES_NEED_LINK[@]}"; do
  if [ -f "$file" ]; then
    # Check if Link is already imported
    if ! grep -q "from 'next/link'" "$file"; then
      echo "Adding Link import to $file"
      # Add Link import after other imports
      sed -i '' "s/import { useState } from 'react';/import { useState } from 'react';\nimport Link from 'next\/link';/" "$file" 2>/dev/null || true
      sed -i '' "s/import Header from '@\/components\/Header';/import Header from '@\/components\/Header';\nimport Link from 'next\/link';/" "$file" 2>/dev/null || true
    fi
  fi
done

# 2. Replace <a href="/"> with <Link href="/">
echo "Replacing <a> tags with <Link> components..."
find src/app -name "*Client.tsx" -type f -exec sed -i '' \
  -e 's/<a href="\/" className="\([^"]*\)">/\<Link href="\/" className="\1"\>/g' \
  -e 's/<a href="\/\([^"]*\)" className="\([^"]*\)">/\<Link href="\/\1" className="\2"\>/g' \
  -e 's/<a href="\/\([^"]*\)" rel="nofollow" className="\([^"]*\)">/\<Link href="\/\1" className="\2"\>/g' \
  -e 's/<\/a>/<\/Link>/g' {} \;

# 3. Fix quote escaping (common patterns)
echo "Fixing quote escaping..."
find src/app src/components -name "*.tsx" -type f -exec sed -i '' \
  -e "s/\([^&]\)'\([^&]\)/\1\&apos;\2/g" \
  -e 's/"\([^&]\)/\&quot;\1/g' {} \;

echo "✅ Basic fixes applied. Run npm run lint to check remaining issues."
