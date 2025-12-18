# How to Start the Backend Server

The backend server is now set up! Here's how to use it:

## Quick Start

1. **Open a new terminal window** (keep your frontend running in the other one)

2. **Navigate to backend folder:**
   ```bash
   cd "C:\Users\Cornelius Debpuur\Desktop\Web Projects\lead-scrapper-backend"
   ```

3. **Start the backend server:**
   ```bash
   node server.js
   ```

4. **You should see:**
   ```
   ==================================================
   🚀 Backend server running on http://localhost:5000
   📋 Endpoints:
      GET  /health - Health check
      POST /api/directories/search - Search directories
      POST /proxy - Proxy API requests (for CORS)
   ==================================================
   ✅ Ready to scrape directories!
   ```

5. **Keep this terminal open** - the backend needs to keep running

6. **In your frontend terminal**, restart the dev server:
   ```bash
   npm run dev
   ```

## What the Backend Does

- ✅ Scrapes BusinessGhana directory (Ghana)
- ✅ Scrapes Yellow Pages Ghana
- ✅ Scrapes Yell.com (UK)
- ✅ Scrapes Yellow Pages (US)
- ✅ Scrapes Yellow Pages AU (Australia)
- ✅ Provides CORS proxy for Google Places API

## Testing

Once backend is running, test it:

```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","message":"Backend server is running"}`

## Frontend Configuration

The `.env.local` file has been updated with:
```
BACKEND_URL=http://localhost:5000
```

## Running Both Servers

**Terminal 1 (Backend):**
```bash
cd lead-scrapper-backend
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd "Lead Scrapper"
npm run dev
```

Now directory scraping will work! 🎉

