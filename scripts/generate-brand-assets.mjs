import sharp from 'sharp';
import path from 'path';

const outDir = path.resolve('public');

// 1. Square Brand Logo SVG (512x512) - Pure geometric vector emblem (no font missing issues)
const logoSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="50%" stop-color="#be123c"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#881337" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background Base with subtle border -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#e2e8f0" stroke-width="4"/>

  <!-- Protective Medical Shield -->
  <g filter="url(#shadow)">
    <path d="M 256 56 
             C 350 56 416 86 416 156
             C 416 300 326 400 256 456
             C 186 400 96 300 96 156
             C 96 86 162 56 256 56 Z" 
          fill="url(#shieldGrad)"/>
  </g>

  <!-- Inner Concentric Shield Highlight -->
  <path d="M 256 78 
           C 334 78 394 104 394 162
           C 394 286 316 374 256 426
           C 196 374 118 286 118 162
           C 118 104 178 78 256 78 Z" 
        fill="none" stroke="#ffffff" stroke-width="3.5" stroke-opacity="0.35"/>

  <!-- Bold Pure White Medical Cross -->
  <g fill="#ffffff">
    <rect x="224" y="140" width="64" height="190" rx="16"/>
    <rect x="161" y="203" width="190" height="64" rx="16"/>
  </g>

  <!-- Emerald Green Heartbeat / Vitality Pulse Line -->
  <path d="M 166 235 L 204 235 L 220 185 L 244 285 L 266 195 L 282 250 L 298 235 L 346 235" 
        fill="none" stroke="url(#greenGrad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Golden / Emerald Heart Accent at center -->
  <path d="M 256 226 
           C 256 216 248 208 238 208 
           C 226 208 218 218 222 230 
           C 228 246 256 264 256 264 
           C 256 264 284 246 290 230 
           C 294 218 286 208 274 208 
           C 264 208 256 216 256 226 Z"
        fill="#ffffff" opacity="0.95"/>
</svg>
`;

// 2. Default OpenGraph Poster (1200x630)
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="ogCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- Decorative Glows -->
  <circle cx="220" cy="180" r="320" fill="#e11d48" opacity="0.18"/>
  <circle cx="1060" cy="460" r="320" fill="#059669" opacity="0.18"/>

  <!-- Left Side: Brand Logo Card (400x400) -->
  <g transform="translate(100, 115)">
    <rect width="400" height="400" rx="64" fill="#ffffff"/>
    <rect width="392" height="392" x="4" y="4" rx="60" fill="none" stroke="#e2e8f0" stroke-width="4"/>
    
    <!-- Shield -->
    <path d="M 200 45 
             C 274 45 326 68 326 122
             C 326 235 255 315 200 355
             C 145 315 74 235 74 122
             C 74 68 126 45 200 45 Z" 
          fill="url(#ogCard)"/>
    
    <!-- White Medical Cross -->
    <rect x="175" y="110" width="50" height="148" rx="12" fill="#ffffff"/>
    <rect x="126" y="159" width="148" height="50" rx="12" fill="#ffffff"/>

    <!-- Pulse Line -->
    <path d="M 130 184 L 160 184 L 172 144 L 191 224 L 208 152 L 221 196 L 234 184 L 270 184" 
          fill="none" stroke="#10b981" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Right Side: Clean Brand Authority -->
  <g transform="translate(560, 145)">
    <!-- Badge -->
    <rect x="0" y="0" width="310" height="44" rx="22" fill="rgba(255,255,255,0.08)"/>
    <circle cx="22" cy="22" r="8" fill="#10b981"/>
    <text x="42" y="28" font-family="sans-serif" font-weight="bold" font-size="16" fill="#34d399">
      VERIFIED HEALTH PORTAL
    </text>

    <!-- Main English & Hindi Titles in universal SVG paths/text -->
    <text x="0" y="115" font-family="sans-serif" font-weight="900" font-size="52" fill="#ffffff" letter-spacing="1">
      HINDI HEALTH GUIDE
    </text>

    <text x="0" y="170" font-family="sans-serif" font-weight="600" font-size="24" fill="#94a3b8">
      Evidence-Based Sexual &amp; Reproductive Health
    </text>

    <!-- Accent divider -->
    <rect x="0" y="205" width="540" height="4" rx="2" fill="url(#accentGrad)"/>

    <text x="0" y="260" font-family="sans-serif" font-weight="600" font-size="20" fill="#cbd5e1">
      • Based on WHO, NACO &amp; MoHFW Clinical Guidelines
    </text>
    <text x="0" y="300" font-family="sans-serif" font-weight="600" font-size="20" fill="#cbd5e1">
      • Chief Editor: Rajesh Kumar Sahu
    </text>
    <text x="0" y="340" font-family="sans-serif" font-weight="600" font-size="20" fill="#cbd5e1">
      • 100% Medically Reviewed Educational Content
    </text>

    <!-- Website URL -->
    <text x="0" y="405" font-family="sans-serif" font-weight="800" font-size="28" fill="#fb7185">
      www.hindihealthguide.org
    </text>
  </g>
</svg>
`;

async function run() {
  console.log('Generating high-res brand logos and OG posters...');
  
  // 1. logo.png (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'logo.png'));

  // 2. icon.png (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'icon.png'));

  // 3. icon-512.png (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'icon-512.png'));

  // 4. icon-192.png (192x192)
  await sharp(Buffer.from(logoSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(outDir, 'icon-192.png'));

  // 5. apple-touch-icon.png (180x180)
  await sharp(Buffer.from(logoSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'));

  // 6. default-og-image.jpg (1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, 'default-og-image.jpg'));

  // 7. og-image.jpg (1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, 'og-image.jpg'));

  console.log('Successfully generated all clean brand icons and OG posters!');
}

run().catch(console.error);
