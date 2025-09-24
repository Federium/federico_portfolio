#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting Netlify build with Node.js $(node -v) and TypeScript support..."

# Verifica versione Node.js
echo "🔍 Node.js version: $(node -v)"
echo "🔍 npm version: $(npm -v)"

# Installa dipendenze
echo "📦 Installing dependencies..."
npm ci

# Verifica che TypeScript sia installato
echo "🔍 Checking TypeScript installation..."
if npm list typescript >/dev/null 2>&1; then
    echo "✅ TypeScript found in dependencies: $(npx tsc --version)"
else
    echo "❌ TypeScript not found, installing..."
    npm install typescript@latest --save-dev --no-save
    echo "✅ TypeScript installed: $(npx tsc --version)"
fi

# Verifica che Tailwind sia installato
echo "🔍 Checking Tailwind installation..."
if npm list tailwindcss >/dev/null 2>&1; then
    echo "✅ Tailwind CSS found"
else
    echo "❌ Tailwind CSS not found!"
    exit 1
fi

# Build CSS esplicitamente con PostCSS/Tailwind
echo "🎨 Processing CSS with Tailwind..."
npx tailwindcss -i ./src/app/global.css -o ./src/app/global.processed.css --minify || {
    echo "⚠️  Tailwind processing failed, continuing with original CSS..."
}

# Verifica che il CSS sia stato processato
if [ -f "./src/app/global.processed.css" ]; then
    echo "✅ CSS processed successfully"
    echo "📄 CSS file size: $(wc -c < ./src/app/global.processed.css) bytes"
fi

# Build Next.js
echo "⚡ Building Next.js application..."
npm run build

# Verifica che la build sia stata creata
if [ -d "./.next" ]; then
    echo "✅ .next directory created successfully"
    echo "📁 Build size: $(du -sh .next | cut -f1)"
else
    echo "❌ .next directory not found! Build failed."
    exit 1
fi

echo "✅ Build completed successfully!"