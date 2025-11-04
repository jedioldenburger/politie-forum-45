#!/usr/bin/env node

/**
 * Generate Icon PNGs for Politie Forum Nederland
 * Creates icon files in various sizes for PWA and devices
 */

const fs = require("fs");
const path = require("path");

const PRIMARY_COLOR = "#001f5c";
const ACCENT_COLOR = "#e60000";
const WHITE = "#ffffff";

// Create icon SVG (template function)
const createIcon = (size) => {
  const scale = size / 512; // Base size is 512

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${PRIMARY_COLOR}" rx="${
    size * 0.15
  }"/>

  <!-- Shield logo (centered and scaled) -->
  <g transform="translate(${size * 0.5}, ${size * 0.5}) scale(${scale})">
    <g transform="translate(-150, -160)">
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
  </g>
</svg>`;
};

// Create simple rounded icon (for small sizes)
const createSimpleIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${PRIMARY_COLOR}" rx="${
    size * 0.2
  }"/>

  <!-- Simplified shield -->
  <g transform="translate(${size / 2}, ${size / 2}) scale(${size / 64})">
    <path d="M 0 -24 L 20 -18 L 20 2 Q 20 18 0 24 Q -20 18 -20 2 L -20 -18 Z"
          fill="${ACCENT_COLOR}" stroke="${WHITE}" stroke-width="2"/>
    <path d="M 0 -16 L 14 -12 L 14 2 Q 14 14 0 18 Q -14 14 -14 2 L -14 -12 Z"
          fill="${WHITE}"/>
    <circle cx="0" cy="0" r="6" fill="${PRIMARY_COLOR}"/>
  </g>
</svg>`;
};

const iconsDir = path.join(__dirname, "..", "public", "icons");

// Generate various sizes
const sizes = {
  "icon-32.svg": 32,
  "icon-192.svg": 192,
  "icon-512.svg": 512,
  "apple-touch-icon-180.svg": 180,
};

for (const [filename, size] of Object.entries(sizes)) {
  const svg = size <= 32 ? createSimpleIcon(size) : createIcon(size);
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`✓ Created ${filename} (${size}x${size})`);
}

console.log("\n✅ Icon SVG files generated successfully!");
console.log("\n📝 To convert to PNG:");
console.log(
  '   cd public/icons && for f in *.svg; do convert "$f" "${f%.svg}.png"; done'
);
console.log("\n💡 Or use online converter: https://svgtopng.com/");
