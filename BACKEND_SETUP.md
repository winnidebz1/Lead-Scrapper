# Backend Setup Guide for Directory Scraping

This guide shows you how to set up a simple backend to enable directory scraping for all countries.

## Why Backend is Needed

Most business directories (Yellow Pages, BusinessGhana, Yell.com, etc.) cannot be scraped directly from the browser due to:
- **CORS restrictions** - Browsers block cross-origin requests
- **Anti-scraping measures** - Directories block browser requests
- **Rate limiting** - Need server-side handling

## Quick Setup (5 minutes)

### Option 1: Simple Node.js Backend (Recommended)

1. **Create a new folder** for your backend:
   ```bash
   mkdir lead-scrapper-backend
   cd lead-scrapper-backend
   ```

2. **Initialize Node.js project:**
   ```bash
   npm init -y
   npm install express cors puppeteer
   ```

3. **Create `server.js`:**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const puppeteer = require('puppeteer');

   const app = express();
   app.use(cors());
   app.use(express.json());

   app.post('/api/directories/search', async (req, res) => {
     const { country, industry, city } = req.body;
     
     try {
       const browser = await puppeteer.launch({ headless: true });
       const page = await browser.newPage();
       
       let results = [];
       
       // Ghana directories
       if (country === 'Ghana') {
         // BusinessGhana
         try {
           const url = `https://www.businessghana.com/site/directory?search=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
           await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
           
           const businesses = await page.evaluate(() => {
             const items = Array.from(document.querySelectorAll('.directory-item, .listing-item, .business-item'));
             return items.slice(0, 10).map(item => {
               const nameEl = item.querySelector('h3, .name, .title, .business-name');
               const phoneEl = item.querySelector('.phone, .tel, [class*="phone"]');
               const emailEl = item.querySelector('.email, [class*="email"]');
               const addressEl = item.querySelector('.address, .location, [class*="address"]');
               
               return {
                 name: nameEl?.textContent?.trim() || '',
                 phone: phoneEl?.textContent?.trim() || '',
                 email: emailEl?.textContent?.trim() || emailEl?.getAttribute('href')?.replace('mailto:', '') || '',
                 address: addressEl?.textContent?.trim() || '',
                 website: null, // We want businesses without websites
               };
             }).filter(b => b.name.length > 0);
           });
           
           results = businesses.map(b => ({
             ...b,
             source: 'BusinessGhana',
           }));
         } catch (error) {
           console.error('BusinessGhana scraping error:', error);
         }
         
         // Yellow Pages Ghana
         try {
           const ypUrl = `https://www.yellowpagesghana.com/search?q=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
           await page.goto(ypUrl, { waitUntil: 'networkidle2', timeout: 30000 });
           
           const ypBusinesses = await page.evaluate(() => {
             const items = Array.from(document.querySelectorAll('.listing, .business-listing, .result-item'));
             return items.slice(0, 5).map(item => {
               const nameEl = item.querySelector('h2, .name, .business-name');
               const phoneEl = item.querySelector('.phone, .tel');
               const emailEl = item.querySelector('.email');
               
               return {
                 name: nameEl?.textContent?.trim() || '',
                 phone: phoneEl?.textContent?.trim() || '',
                 email: emailEl?.textContent?.trim() || '',
                 address: '',
                 website: null,
               };
             }).filter(b => b.name.length > 0);
           });
           
           results.push(...ypBusinesses.map(b => ({
             ...b,
             source: 'Yellow Pages Ghana',
           })));
         } catch (error) {
           console.error('Yellow Pages scraping error:', error);
         }
       }
       
       // UK directories
       if (country === 'United Kingdom') {
         // Yell.com
         try {
           const yellUrl = `https://www.yell.com/ucs/UcsSearchAction.do?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
           await page.goto(yellUrl, { waitUntil: 'networkidle2', timeout: 30000 });
           
           const yellBusinesses = await page.evaluate(() => {
             const items = Array.from(document.querySelectorAll('.businessCapsule, .listing'));
             return items.slice(0, 10).map(item => {
               const nameEl = item.querySelector('h2, .business-name');
               const phoneEl = item.querySelector('.phoneNumber, .tel');
               const addressEl = item.querySelector('.address');
               
               return {
                 name: nameEl?.textContent?.trim() || '',
                 phone: phoneEl?.textContent?.trim() || '',
                 email: '',
                 address: addressEl?.textContent?.trim() || '',
                 website: null,
               };
             }).filter(b => b.name.length > 0);
           });
           
           results.push(...yellBusinesses.map(b => ({
             ...b,
             source: 'Yell.com',
           })));
         } catch (error) {
           console.error('Yell.com scraping error:', error);
         }
       }
       
       // US directories
       if (country === 'United States') {
         // Yellow Pages
         try {
           const ypUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(industry)}&geo_location_terms=${encodeURIComponent(city)}`;
           await page.goto(ypUrl, { waitUntil: 'networkidle2', timeout: 30000 });
           
           const ypBusinesses = await page.evaluate(() => {
             const items = Array.from(document.querySelectorAll('.result, .srp-listing'));
             return items.slice(0, 10).map(item => {
               const nameEl = item.querySelector('h2 a, .business-name');
               const phoneEl = item.querySelector('.phone, .phones');
               const addressEl = item.querySelector('.adr, .address');
               
               return {
                 name: nameEl?.textContent?.trim() || '',
                 phone: phoneEl?.textContent?.trim() || '',
                 email: '',
                 address: addressEl?.textContent?.trim() || '',
                 website: null,
               };
             }).filter(b => b.name.length > 0);
           });
           
           results.push(...ypBusinesses.map(b => ({
             ...b,
             source: 'Yellow Pages',
           })));
         } catch (error) {
           console.error('Yellow Pages scraping error:', error);
         }
       }
       
       await browser.close();
       
       res.json({ results });
     } catch (error) {
       console.error('Scraping error:', error);
       res.status(500).json({ error: error.message, results: [] });
     }
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Backend server running on http://localhost:${PORT}`);
     console.log('Ready to scrape directories!');
   });
   ```

4. **Start the backend:**
   ```bash
   node server.js
   ```

5. **Update your frontend `.env.local`:**
   ```env
   BACKEND_URL=http://localhost:5000
   ```

6. **Restart your frontend dev server**

That's it! Directory scraping will now work.

### Option 2: Python Backend (Alternative)

1. **Create backend folder:**
   ```bash
   mkdir lead-scrapper-backend
   cd lead-scrapper-backend
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn playwright python-cors
   playwright install chromium
   ```

3. **Create `main.py`:**
   ```python
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from playwright.async_api import async_playwright
   import asyncio

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
       
       results = []
       
       async with async_playwright() as p:
           browser = await p.chromium.launch()
           page = await browser.new_page()
           
           # Ghana - BusinessGhana
           if country == "Ghana":
               try:
                   url = f"https://www.businessghana.com/site/directory?search={industry}&location={city}"
                   await page.goto(url, wait_until="networkidle", timeout=30000)
                   
                   businesses = await page.evaluate("""
                       () => {
                           const items = Array.from(document.querySelectorAll('.directory-item, .listing-item'));
                           return items.slice(0, 10).map(item => ({
                               name: item.querySelector('h3, .name')?.textContent?.trim() || '',
                               phone: item.querySelector('.phone')?.textContent?.trim() || '',
                               email: item.querySelector('.email')?.textContent?.trim() || '',
                               address: item.querySelector('.address')?.textContent?.trim() || '',
                               website: null
                           })).filter(b => b.name.length > 0);
                       }
                   """)
                   
                   results = [{"source": "BusinessGhana", **b} for b in businesses]
               except Exception as e:
                   print(f"Error scraping BusinessGhana: {e}")
           
           await browser.close()
       
       return {"results": results}

   if __name__ == "__main__":
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=5000)
   ```

4. **Run the backend:**
   ```bash
   python main.py
   ```

## Testing the Backend

1. **Start your backend server**
2. **Test with curl:**
   ```bash
   curl -X POST http://localhost:5000/api/directories/search \
     -H "Content-Type: application/json" \
     -d '{"country":"Ghana","industry":"IT Companies","city":"Accra"}'
   ```

3. **You should see JSON results** with business data

## Frontend Configuration

Once backend is running, update `.env.local`:

```env
BACKEND_URL=http://localhost:5000
```

Then restart your frontend:
```bash
npm run dev
```

## What Gets Scraped

The backend will scrape:
- **Business names**
- **Phone numbers**
- **Email addresses** (if available)
- **Addresses**
- **Website status** (filters for businesses without websites)

## Troubleshooting

### "Connection refused" error
- Make sure backend is running on port 5000
- Check `BACKEND_URL` in `.env.local` is correct
- Restart frontend after adding `BACKEND_URL`

### "No results" from scraping"
- Check browser console in backend for errors
- Verify directory website structure hasn't changed
- Try different city/industry combinations

### Puppeteer/Playwright errors
- Make sure Chromium is installed: `npx playwright install` or `playwright install chromium`
- Check you have enough memory (scraping uses resources)

## Production Deployment

For production, deploy backend to:
- **Railway** (easy, free tier)
- **Render** (free tier)
- **Heroku** (paid)
- **AWS/GCP** (more complex)

Then update `BACKEND_URL` to your production URL.

## Quick Start Summary

1. ✅ Create backend folder
2. ✅ Install dependencies (express + puppeteer)
3. ✅ Copy server.js code above
4. ✅ Run: `node server.js`
5. ✅ Add `BACKEND_URL=http://localhost:5000` to `.env.local`
6. ✅ Restart frontend
7. ✅ Directory scraping now works!

**Time to setup: ~5 minutes**

