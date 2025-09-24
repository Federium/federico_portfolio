#!/bin/bash

echo "🚀 Starting Netlify build with Node.js $(node -v) and TypeScript support..."

# Verifica versione Node.js
echo "🔍 Node.js version: $(node -v)"
echo "🔍 npm version: $(npm -v)"

# Installa dipendenze
echo "📦 Installing dependencies..."
npm ci --verbose

# Verifica che TypeScript sia installato
echo "🔍 Checking TypeScript installation..."
if npm list typescript >/dev/null 2>&1; then
    echo "✅ TypeScript found: $(npx tsc --version)"
else
    echo "❌ TypeScript not found, installing..."
    npm install --save-dev typescript@latest
fi

# Verifica che Tailwind sia installato
echo "🔍 Checking Tailwind installation..."
if npm list tailwindcss >/dev/null 2>&1; then
    echo "✅ Tailwind CSS found"
    npm list tailwindcss
else
    echo "❌ Tailwind CSS not found!"
    exit 1
fi

# Verifica che PostCSS sia installato
echo "🔍 Checking PostCSS installation..."
if npm list postcss >/dev/null 2>&1; then
    echo "✅ PostCSS found"
else
    echo "❌ PostCSS not found!"
    exit 1
fi

# Build CSS esplicitamente con PostCSS/Tailwind
echo "🎨 Processing CSS with Tailwind..."
npx tailwindcss -i ./src/app/global.css -o ./src/app/global.processed.css --minify

# Verifica che il CSS sia stato processato
if [ -f "./src/app/global.processed.css" ]; then
    echo "✅ CSS processed successfully"
    echo "📄 CSS file size: $(wc -c < ./src/app/global.processed.css) bytes"
else
    echo "⚠️  CSS processing completed but no output file found"
fi

# Build Next.js
echo "⚡ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"

# Verifica che la build sia stata creata
if [ -d "./.next" ]; then
    echo "✅ .next directory created"
    echo "📁 Build size: $(du -sh .next | cut -f1)"
else
    echo "❌ .next directory not found!"
    exit 1
fi