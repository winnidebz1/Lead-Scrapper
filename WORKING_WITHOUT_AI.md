# Working Without AI APIs

**Yes! The site can work completely without AI APIs (Gemini, OpenAI, etc.)**

The app is designed to prioritize **real directory searches** over AI-generated data. AI is completely optional and only used as a fallback.

## How It Works Without AI

### Primary Sources (No AI Required)

1. **Google Places API** (if configured)
   - Real business data from Google Maps
   - Requires `GOOGLE_PLACES_API_KEY`
   - **Note**: Requires backend proxy due to CORS

2. **Business Directories** (Real scraping)
   - **Yelp API** (US only) - Works directly with API key
   - **Backend Directory Scraping** - For all other directories
   - Real businesses from actual directories
   - No AI needed!

3. **AI Discovery** (Optional fallback)
   - Only used if directories return no results
   - Completely optional
   - Can be disabled entirely

## Setup Without AI

### Option 1: Yelp API Only (US Searches)

```env
# .env.local
YELP_API_KEY=your_yelp_key_here
```

This works immediately for US searches - no AI needed!

### Option 2: Backend Directory Scraping (All Countries)

Set up a backend that scrapes directories:

```env
# .env.local
BACKEND_URL=http://localhost:5000
```

Then your backend can scrape:
- Yellow Pages (US, AU, Ghana)
- Yell.com (UK)
- All other directories

**No AI required!**

### Option 3: Google Places + Backend Proxy

```env
# .env.local
GOOGLE_PLACES_API_KEY=your_key_here
BACKEND_URL=http://localhost:5000  # For CORS proxy
```

## Discovery Flow (Without AI)

1. **Google Places API** → Real businesses
2. **Directory APIs** (Yelp, etc.) → Real businesses  
3. **Backend Directory Scraping** → Real businesses
4. **AI Discovery** → Only if all above fail (optional)

## Benefits of Working Without AI

✅ **Real Data**: Actual businesses from directories, not generated  
✅ **No API Costs**: No AI API fees  
✅ **More Reliable**: Real businesses vs. synthetic data  
✅ **Better Quality**: Verified directory listings  
✅ **Faster**: Direct API calls vs. AI generation  

## Backend Setup for Directory Scraping

To enable directory scraping without AI, create a simple backend:

### Example Backend (Node.js/Express)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/directories/search', async (req, res) => {
  const { country, industry, city } = req.body;
  
  // Scrape directories based on country
  const results = await scrapeDirectories(country, industry, city);
  
  res.json({ results });
});

async function scrapeDirectories(country, industry, city) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Example: Scrape Yellow Pages Ghana
  if (country === 'Ghana') {
    const url = `https://www.yellowpagesghana.com/search?q=${industry}&location=${city}`;
    await page.goto(url);
    
    // Extract business data
    const businesses = await page.evaluate(() => {
      // Your scraping logic here
      return Array.from(document.querySelectorAll('.business-item')).map(item => ({
        name: item.querySelector('.name')?.textContent,
        phone: item.querySelector('.phone')?.textContent,
        // ... extract other fields
      }));
    });
    
    await browser.close();
    return businesses;
  }
  
  // Add other countries...
}

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
```

### Example Backend (Python/FastAPI)

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/directories/search")
async def search_directories(data: dict):
    country = data.get("country")
    industry = data.get("industry")
    city = data.get("city")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Scrape directories
        if country == "Ghana":
            url = f"https://www.yellowpagesghana.com/search?q={industry}&location={city}"
            await page.goto(url)
            
            businesses = await page.evaluate("""
                () => {
                    return Array.from(document.querySelectorAll('.business-item')).map(item => ({
                        name: item.querySelector('.name')?.textContent,
                        phone: item.querySelector('.phone')?.textContent,
                    }));
                }
            """)
            
            await browser.close()
            return {"results": businesses}
    
    return {"results": []}
```

## Current Status

### Works Now (No Backend Needed)
- ✅ **Yelp API** (US only) - Direct API integration

### Requires Backend (No AI Needed)
- ⚠️ **All other directories** - Need backend scraping service
- ⚠️ **Google Places** - Needs backend proxy for CORS

### Optional (Can Disable)
- 🔄 **AI Discovery** - Only used if directories return nothing

## Making AI Completely Optional

The app is already configured to work without AI:

1. **Directory searches run first** - Before AI
2. **AI only if no results** - Won't run if directories work
3. **No errors if AI unavailable** - Gracefully handles missing AI keys

## Recommendations

### For Best Results (No AI)
1. **Set up backend** for directory scraping
2. **Use Yelp API** for US searches
3. **Use Google Places** with backend proxy
4. **Skip AI entirely** - Not needed!

### Quick Start (Minimal Setup)
1. **Yelp API** for US → Works immediately
2. **Backend for other countries** → Real directory data
3. **No AI keys needed** → Save money!

## FAQ

**Q: Do I need AI APIs to use the app?**  
A: No! AI is completely optional. Directories work independently.

**Q: Can I disable AI completely?**  
A: Yes! Just don't add any AI API keys. The app will only use directories.

**Q: Which works better - AI or directories?**  
A: Directories provide **real businesses**. AI generates **synthetic data**. Directories are better for actual leads.

**Q: Why use AI at all?**  
A: AI is only a fallback when directories don't return results. It's optional.

**Q: How do I get real directory data?**  
A: Set up a backend scraping service (see examples above) or use available APIs like Yelp.

## Summary

✅ **The app works without AI**  
✅ **Directories provide real data**  
✅ **AI is optional fallback only**  
✅ **Backend enables full directory scraping**  
✅ **Yelp API works immediately (US)**

**Bottom line**: You can use the app entirely with directory searches and never need AI APIs!

