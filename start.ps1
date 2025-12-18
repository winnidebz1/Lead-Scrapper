# Lead Scrapper - Quick Start Script (Windows)
# This script helps you get started quickly

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Lead Scrapper - Quick Start" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local file not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating .env.local with default values..." -ForegroundColor Yellow
    
    $envContent = @"
# Backend URL (for directory scraping)
BACKEND_URL=http://localhost:5000

# OPTIONAL: For AI-powered discovery
# VITE_GOOGLE_API_KEY=your_gemini_api_key_here

# OPTIONAL: For Google Places API
# GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Please edit .env.local and add your API keys if needed" -ForegroundColor Yellow
    Write-Host ""
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm run install:all
    Write-Host ""
}

Write-Host "🚀 Starting Lead Scrapper..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm start
