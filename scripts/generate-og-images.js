#!/usr/bin/env node

/**
 * Generate OG Images for Politie Forum Nederland
 * Creates PNG images for social media sharing
 */

const fs = require("fs");
const path = require("path");

// Brand colors
const PRIMARY_COLOR = "#001f5c"; // Dark blue
const ACCENT_COLOR = "#e60000"; // Red
const WHITE = "#ffffff";

// Create SVG for OG image (1200x630)
const createOGImage = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${PRIMARY_COLOR}"/>

  <!-- Accent stripe -->
  <rect x="0" y="0" width="1200" height="8" fill="${ACCENT_COLOR}"/>
  <rect x="0" y="622" width="1200" height="8" fill="${ACCENT_COLOR}"/>

  <!-- Shield logo (centered) -->
  <g transform="translate(150, 150)">
    <!-- Outer shield -->
    <path d="M 150 20 L 270 60 L 270 180 Q 270 280 150 320 Q 30 280 30 180 L 30 60 Z"
          fill="${ACCENT_COLOR}" stroke="${WHITE}" stroke-width="4"/>

    <!-- Inner shield -->
    <path d="M 150 50 L 240 80 L 240 180 Q 240 260 150 290 Q 60 260 60 180 L 60 80 Z"
          fill="${WHITE}"/>

    <!-- Star -->
    <path d="M 150 120 L 165 155 L 203 160 L 176 185 L 184 223 L 150 205 L 116 223 L 124 185 L 97 160 L 135 155 Z"
          fill="${PRIMARY_COLOR}"/>
  </g>

  <!-- Text content -->
  <text x="500" y="230" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${WHITE}">
    Politie Forum
  </text>

  <text x="500" y="310" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${WHITE}">
    Nederland
  </text>

  <text x="500" y="390" font-family="Arial, sans-serif" font-size="36" fill="${WHITE}" opacity="0.9">
    Het grootste Nederlandse politie forum
  </text>

  <text x="500" y="440" font-family="Arial, sans-serif" font-size="32" fill="${ACCENT_COLOR}" font-weight="600">
    Forum • Nieuws • Discussie
  </text>

  <!-- URL -->
  <text x="600" y="580" font-family="Arial, sans-serif" font-size="24" fill="${WHITE}" opacity="0.7" text-anchor="middle">
    politie-forum.nl
  </text>
</svg>`;
};

// Create square OG image (1200x1200)
const createOGImageSquare = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="1200" fill="${PRIMARY_COLOR}"/>

  <!-- Accent stripe -->
  <rect x="0" y="0" width="1200" height="12" fill="${ACCENT_COLOR}"/>
  <rect x="0" y="1188" width="1200" height="12" fill="${ACCENT_COLOR}"/>

  <!-- Shield logo (large, centered) -->
  <g transform="translate(300, 200)">
    <!-- Outer shield -->
    <path d="M 300 40 L 540 120 L 540 360 Q 540 560 300 640 Q 60 560 60 360 L 60 120 Z"
          fill="${ACCENT_COLOR}" stroke="${WHITE}" stroke-width="8"/>

    <!-- Inner shield -->
    <path d="M 300 100 L 480 160 L 480 360 Q 480 520 300 580 Q 120 520 120 360 L 120 160 Z"
          fill="${WHITE}"/>

    <!-- Star -->
    <path d="M 300 240 L 330 310 L 406 320 L 352 370 L 368 446 L 300 410 L 232 446 L 248 370 L 194 320 L 270 310 Z"
          fill="${PRIMARY_COLOR}"/>
  </g>

  <!-- Text content -->
  <text x="600" y="900" font-family="Arial, sans-serif" font-size="96" font-weight="bold" fill="${WHITE}" text-anchor="middle">
    Politie Forum
  </text>

  <text x="600" y="1000" font-family="Arial, sans-serif" font-size="96" font-weight="bold" fill="${WHITE}" text-anchor="middle">
    Nederland
  </text>

  <!-- URL -->
  <text x="600" y="1130" font-family="Arial, sans-serif" font-size="32" fill="${WHITE}" opacity="0.7" text-anchor="middle">
    politie-forum.nl
  </text>
</svg>`;
};

// Create smaller OG image (600x315)
const createOGImageSmall = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="315" viewBox="0 0 600 315" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="600" height="315" fill="${PRIMARY_COLOR}"/>

  <!-- Accent stripe -->
  <rect x="0" y="0" width="600" height="4" fill="${ACCENT_COLOR}"/>
  <rect x="0" y="311" width="600" height="4" fill="${ACCENT_COLOR}"/>

  <!-- Shield logo -->
  <g transform="translate(75, 75)">
    <!-- Outer shield -->
    <path d="M 75 10 L 135 30 L 135 90 Q 135 140 75 160 Q 15 140 15 90 L 15 30 Z"
          fill="${ACCENT_COLOR}" stroke="${WHITE}" stroke-width="2"/>

    <!-- Inner shield -->
    <path d="M 75 25 L 120 40 L 120 90 Q 120 130 75 145 Q 30 130 30 90 L 30 40 Z"
          fill="${WHITE}"/>

    <!-- Star -->
    <path d="M 75 60 L 82.5 77.5 L 101.5 80 L 88 92.5 L 92 111.5 L 75 102.5 L 58 111.5 L 62 92.5 L 48.5 80 L 67.5 77.5 Z"
          fill="${PRIMARY_COLOR}"/>
  </g>

  <!-- Text content -->
  <text x="250" y="115" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${WHITE}">
    Politie Forum
  </text>

  <text x="250" y="155" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${WHITE}">
    Nederland
  </text>

  <text x="250" y="195" font-family="Arial, sans-serif" font-size="18" fill="${WHITE}" opacity="0.9">
    Het grootste Nederlandse politie forum
  </text>

  <!-- URL -->
  <text x="300" y="285" font-family="Arial, sans-serif" font-size="14" fill="${WHITE}" opacity="0.7" text-anchor="middle">
    politie-forum.nl
  </text>
</svg>`;
};

// Save SVG files
const ogDir = path.join(__dirname, "..", "public", "og");

fs.writeFileSync(
  path.join(ogDir, "politie-forum-1200x630.svg"),
  createOGImage()
);
console.log("✓ Created politie-forum-1200x630.svg");

fs.writeFileSync(
  path.join(ogDir, "politie-forum-1200x1200.svg"),
  createOGImageSquare()
);
console.log("✓ Created politie-forum-1200x1200.svg");

fs.writeFileSync(
  path.join(ogDir, "politie-forum-600x315.svg"),
  createOGImageSmall()
);
console.log("✓ Created politie-forum-600x315.svg");

console.log("\n✅ SVG OG images generated successfully!");
console.log("\n📝 Next steps:");
console.log("1. Convert SVG to PNG using online tool or ImageMagick:");
console.log("   - https://svgtopng.com/");
console.log(
  "   - Or: brew install imagemagick && convert input.svg output.png"
);
console.log("2. Optimize PNG files (compress to <300KB):");
console.log("   - https://tinypng.com/");
console.log(
  "   - Or: npm install -g pngquant && pngquant --quality=80-95 input.png"
);
console.log(
  "\n💡 Or use this command to convert all at once (if ImageMagick installed):"
);
console.log(
  '   cd public/og && for f in *.svg; do convert "$f" "${f%.svg}.png"; done'
);
