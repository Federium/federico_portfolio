#!/bin/bash

echo "🚀 Starting Netlify build with Tailwind CSS processing..."

# Installa dipendenze
echo "📦 Installing dependencies..."
npm ci

# Verifica che Tailwind sia installato
echo "🔍 Checking Tailwind installation..."
npm list tailwindcss

# Build CSS esplicitamente con PostCSS/Tailwind
echo "🎨 Processing CSS with Tailwind..."
npx tailwindcss -i ./src/app/global.css -o ./src/app/global.processed.css --minify

# Copia il CSS processato se necessario
if [ -f "./src/app/global.processed.css" ]; then
    echo "✅ CSS processed successfully"
    # cp ./src/app/global.processed.css ./src/app/global.css
fi

# Build Next.js
echo "⚡ Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"