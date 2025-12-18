#!/bin/bash

# Lead Scrapper - Quick Start Script
# This script helps you get started quickly

echo "=================================="
echo "Lead Scrapper - Quick Start"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "Creating .env.local with default values..."
    cat > .env.local << EOF
# Backend URL (for directory scraping)
BACKEND_URL=http://localhost:5000

# OPTIONAL: For AI-powered discovery
# VITE_GOOGLE_API_KEY=your_gemini_api_key_here

# OPTIONAL: For Google Places API
# GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
EOF
    echo "✅ Created .env.local"
    echo ""
    echo "📝 Please edit .env.local and add your API keys if needed"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

echo "🚀 Starting Lead Scrapper..."
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Backend will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm start
