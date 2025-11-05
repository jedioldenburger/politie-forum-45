#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix quote escaping in JSX
function fixQuotes(content) {
  // Don't replace quotes inside string literals or attributes
  // Only fix quotes in JSX text content
  
  let result = content;
  
  // Fix standalone " in JSX content (not in attributes)
  // Pattern: >"text"< or >text"text<
  result = result.replace(/>(([^<])*)"(([^<])*)</g, (match) => {
    return match.replace(/"/g, '&quot;');
  });
  
  // Fix standalone ' in JSX content (apostrophes)
  result = result.replace(/>(([^<])*)'(([^<])*)</g, (match) => {
    // Don't replace ' in 't or similar contractions at start
    return match.replace(/([a-z])'([a-z])/gi, '$1&apos;$2');
  });
  
  return result;
}

// Add Link import if needed
function addLinkImport(content) {
  if (content.includes('<Link ') && !content.includes("from 'next/link'")) {
    // Add after useState or Header import
    if (content.includes("import { useState } from 'react';")) {
      content = content.replace(
        "import { useState } from 'react';",
        "import Link from 'next/link';\nimport { useState } from 'react';"
      );
    } else if (content.includes("import Header from '@/components/Header';")) {
      content = content.replace(
        "import Header from '@/components/Header';",
        "import Header from '@/components/Header';\nimport Link from 'next/link';"
      );
    }
  }
  return content;
}

// Replace <a href="/..."> with <Link href="/...">
function replaceAnchorWithLink(content) {
  // Only replace internal links (starting with /)
  content = content.replace(
    /<a href="(\/[^"]*)"([^>]*)>/g,
    (match, href, attrs) => {
      // Remove rel="nofollow" for internal links
      attrs = attrs.replace(/\s*rel="nofollow"\s*/g, ' ');
      return `<Link href="${href}"${attrs}>`;
    }
  );
  
  // Replace closing tags (only if we have Link components)
  if (content.includes('<Link ')) {
    // This is tricky - we need to be smart about which </a> to replace
    // For now, count and replace matching ones
    const linkCount = (content.match(/<Link /g) || []).length;
    let replaced = 0;
    content = content.replace(/<\/a>/g, (match) => {
      if (replaced < linkCount) {
        replaced++;
        return '</Link>';
      }
      return match;
    });
  }
  
  return content;
}

// Process file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // 1. Replace <a> with <Link> for internal links
  content = replaceAnchorWithLink(content);
  
  // 2. Add Link import if needed
  content = addLinkImport(content);
  
  // 3. Fix quotes (disabled for now - too risky)
  // content = fixQuotes(content);
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
    return true;
  }
  
  return false;
}

// Main
const filesToFix = [
  'src/app/cookies/CookiesClient.tsx',
  'src/app/correcties/CorrectiesClient.tsx',
  'src/app/feitencontrole/FeitencontroleClient.tsx',
  'src/app/forum-disclaimer/ForumDisclaimerClient.tsx',
  'src/app/gebruikersregels/GebruikersregelsClient.tsx',
  'src/app/moderatie-beleid/ModeratiebeleidClient.tsx',
  'src/app/redactionele-principes/RedactionelePrincipesClient.tsx',
  'src/app/toegankelijkheid/ToegankelijkheidClient.tsx',
  'src/app/forum/ForumClient.tsx',
];

let fixed = 0;
filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    if (processFile(fullPath)) fixed++;
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log(`\n✅ Fixed ${fixed} files`);
console.log('\n⚠️  Note: Quote escaping must be done manually to avoid breaking code.');
console.log('Run: npm run lint to see remaining issues.');
