#!/usr/bin/env bash
# Generate all public assets for anima-web
set -e

PUBLIC="/data/sylphx/home/projects/anima-web/public"
cd "$PUBLIC"

echo "→ Creating favicon.svg"
cat > favicon.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#0a0a0f"/>
  <text x="8" y="43" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="800" fill="#ffffff" letter-spacing="-1">anima</text>
  <circle cx="59" cy="14" r="5" fill="#6366f1"/>
</svg>
SVGEOF

echo "→ Creating og-image SVG base"
cat > /tmp/og-image.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d0d18;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- Grid pattern -->
  <rect width="1200" height="630" fill="none" stroke="#6366f1" stroke-width="0.5" opacity="0.04"/>
  <line x1="0" y1="105" x2="1200" y2="105" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="0" y1="210" x2="1200" y2="210" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="0" y1="315" x2="1200" y2="315" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="0" y1="420" x2="1200" y2="420" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="0" y1="525" x2="1200" y2="525" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="150" y1="0" x2="150" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="300" y1="0" x2="300" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="450" y1="0" x2="450" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="750" y1="0" x2="750" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="900" y1="0" x2="900" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <line x1="1050" y1="0" x2="1050" y2="630" stroke="#6366f1" stroke-width="0.5" opacity="0.06"/>
  <!-- Glow orb -->
  <ellipse cx="600" cy="315" rx="400" ry="280" fill="url(#glow)"/>
  <!-- Logo wordmark -->
  <text x="600" y="295" font-family="system-ui,-apple-system,Arial,sans-serif" font-size="120" font-weight="800" fill="#ffffff" letter-spacing="-4" text-anchor="middle">anima</text>
  <circle cx="878" cy="175" r="14" fill="#6366f1"/>
  <!-- Tagline -->
  <text x="600" y="370" font-family="system-ui,-apple-system,Arial,sans-serif" font-size="28" font-weight="400" fill="#a1a1aa" text-anchor="middle">AI Agents for Enterprise</text>
  <!-- Border accent -->
  <rect x="2" y="2" width="1196" height="626" rx="8" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.15"/>
</svg>
SVGEOF

echo "→ Creating apple-touch-icon SVG base"
cat > /tmp/apple-touch-icon.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#0a0a0f"/>
  <rect width="180" height="180" rx="40" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.3"/>
  <text x="18" y="118" font-family="system-ui,-apple-system,sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-3">anima</text>
  <circle cx="165" cy="28" r="13" fill="#6366f1"/>
</svg>
SVGEOF

echo "→ Creating icon-192 SVG base"
cat > /tmp/icon-192.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <rect width="192" height="192" rx="42" fill="#0a0a0f"/>
  <rect width="192" height="192" rx="42" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.3"/>
  <text x="19" y="126" font-family="system-ui,-apple-system,sans-serif" font-size="82" font-weight="800" fill="#ffffff" letter-spacing="-3">anima</text>
  <circle cx="176" cy="30" r="14" fill="#6366f1"/>
</svg>
SVGEOF

echo "→ Creating icon-512 SVG base"
cat > /tmp/icon-512.svg << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="#0a0a0f"/>
  <rect width="512" height="512" rx="112" fill="none" stroke="#6366f1" stroke-width="4" opacity="0.3"/>
  <text x="48" y="336" font-family="system-ui,-apple-system,sans-serif" font-size="218" font-weight="800" fill="#ffffff" letter-spacing="-8">anima</text>
  <circle cx="470" cy="82" r="38" fill="#6366f1"/>
</svg>
SVGEOF

echo "→ Converting SVGs to PNG/ICO with ImageMagick..."

# OG image 1200x630
convert -background none /tmp/og-image.svg -resize 1200x630 "$PUBLIC/og-image.png"
echo "   og-image.png ✓"

# Apple touch icon 180x180
convert -background none /tmp/apple-touch-icon.svg -resize 180x180 "$PUBLIC/apple-touch-icon.png"
echo "   apple-touch-icon.png ✓"

# PWA icon 192x192
convert -background none /tmp/icon-192.svg -resize 192x192 "$PUBLIC/icon-192.png"
echo "   icon-192.png ✓"

# PWA icon 512x512
convert -background none /tmp/icon-512.svg -resize 512x512 "$PUBLIC/icon-512.png"
echo "   icon-512.png ✓"

# favicon.ico — multi-size from favicon.svg
convert -background none "$PUBLIC/favicon.svg" -define icon:auto-resize=64,48,32,16 "$PUBLIC/favicon.ico"
echo "   favicon.ico ✓"

echo "→ Creating site.webmanifest"
cat > "$PUBLIC/site.webmanifest" << 'EOF'
{
  "name": "Anima — AI Agents for Enterprise",
  "short_name": "Anima",
  "description": "Deploy autonomous AI agents across your tools and channels — privately, on your infrastructure.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
EOF

echo "→ Creating robots.txt"
cat > "$PUBLIC/robots.txt" << 'EOF'
User-agent: *
Allow: /

Sitemap: https://anima.sylphx.com/sitemap.xml
EOF

echo "→ Creating sitemap.xml"
cat > "$PUBLIC/sitemap.xml" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anima.sylphx.com/</loc>
    <lastmod>2026-02-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF

echo ""
echo "✅ All assets generated. File sizes:"
ls -lh "$PUBLIC/"
