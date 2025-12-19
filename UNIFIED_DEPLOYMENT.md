# Unified Deployment Guide 🚀

## Overview

Your Lead Scrapper application is now **unified** - both frontend and backend are served from a single server! This makes deployment much simpler.

## ✅ What Changed

**Before:**
- Frontend and backend were separate
- Needed to deploy to 2 different platforms
- Had to configure CORS and environment variables

**After:**
- Single `server.js` serves both frontend and backend
- Deploy to ONE platform
- Backend URL is automatically configured

---

## Local Development

### Start Development Servers (Separate - for hot reload)
```bash
npm start
```
This runs:
- Frontend on `http://localhost:3000` (with hot reload)
- Backend on `http://localhost:5000`

### Test Production Build Locally
```bash
# Build the frontend
npm run build

# Start the unified server
npm run start:prod
```
Now visit `http://localhost:5000` - you'll see the frontend AND backend working together!

---

## Deployment Options

### Option 1: Railway (Recommended - Best for Puppeteer)

Railway handles Puppeteer's Chrome browser better than serverless platforms.

#### Steps:

1. **Go to [Railway.app](https://railway.app)** and sign in with GitHub

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**: `winnidebz1/Lead-Scrapper`

4. **Configure the deployment:**
   - **Root Directory**: Leave as `/` (root)
   - **Build Command**: `npm run deploy:build`
   - **Start Command**: `npm run start:prod`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (Settings → Variables):
   ```
   NODE_ENV=production
   PORT=5000
   ```

6. **Deploy!** Railway will:
   - Install dependencies
   - Build your frontend (`vite build` → creates `dist` folder)
   - Start `server.js` which serves both frontend and backend

7. **Get your URL**: Railway gives you a URL like `https://your-app.up.railway.app`

8. **Test it!** Visit your URL and try directory scraping

#### Cost:
- **$5/month** (free trial available)
- Includes 500 hours of runtime

---

### Option 2: Render

Similar to Railway, good for Puppeteer.

#### Steps:

1. **Go to [Render.com](https://render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure:**
   - **Name**: `lead-scrapper`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm run deploy:build`
   - **Start Command**: `npm run start:prod`

5. **Environment Variables:**
   ```
   NODE_ENV=production
   ```

6. **Click "Create Web Service"**

7. **Get your URL**: `https://lead-scrapper.onrender.com`

#### Cost:
- **Free tier available** (spins down after inactivity)
- **$7/month** for always-on

---

### Option 3: Vercel (May have Puppeteer limitations)

Vercel is great for static sites but has limitations with Puppeteer due to serverless function size limits.

#### Steps:

1. **Go to [Vercel.com](https://vercel.com)**

2. **Import your GitHub repository**

3. **Configure:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run deploy:build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**

5. **Note**: Puppeteer might fail due to:
   - 50MB serverless function limit
   - 10-second execution timeout
   - Memory constraints

If Vercel fails, use Railway or Render instead.

---

## How It Works

### Development Mode (`npm start`):
```
Frontend (Vite) → http://localhost:3000
Backend (Express) → http://localhost:5000
```
- Frontend makes API calls to `http://localhost:5000/api/...`
- Configured via `VITE_BACKEND_URL` in `.env.local`

### Production Mode (`npm run start:prod`):
```
Unified Server → http://localhost:5000
├── /api/* → Backend API endpoints
├── /health → Backend health check
├── /proxy → Backend proxy endpoint
└── /* → Frontend (React app from dist/)
```
- Everything served from ONE server
- Frontend makes API calls to `/api/...` (relative URLs)
- No CORS issues!

---

## Environment Variables

### Development (`.env.local`):
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_key_here (optional)
VITE_GOOGLE_PLACES_API_KEY=your_key_here (optional)
```

### Production (Railway/Render):
```env
NODE_ENV=production
PORT=5000
```

**Note**: In production, `VITE_BACKEND_URL` is NOT needed because frontend and backend are on the same domain!

---

## Testing Your Deployment

1. **Check if server is running:**
   ```bash
   curl https://your-app-url.com/health
   ```
   Should return: `{"status":"ok","message":"Backend server is running"}`

2. **Check if frontend loads:**
   Visit `https://your-app-url.com` in browser

3. **Test directory scraping:**
   - Go to Engine Room
   - Select country, city, industry
   - Click "Initialize Automated Run"
   - Check browser console for errors

---

## Troubleshooting

### "Application Error" or "500 Internal Server Error"

**Check logs** in your deployment platform:
- **Railway**: Project → Deployments → View Logs
- **Render**: Dashboard → Your Service → Logs

Common issues:
- Puppeteer failed to launch (use Railway/Render, not Vercel)
- Missing dependencies (check build logs)
- Port configuration (should be from `process.env.PORT`)

### Frontend loads but API calls fail

- Check browser console (F12) for errors
- Verify `/health` endpoint works
- Check if API routes are correct (`/api/directories/search`)

### "No results found" from directory scraping

This is normal - directory websites often:
- Change their structure
- Block scrapers
- Have anti-bot measures

The backend is working, but the specific directory might not return results.

---

## File Structure

```
Lead Scrapper/
├── server.js              # Unified server (frontend + backend)
├── backend/
│   └── server.js          # Old backend (kept for reference)
├── dist/                  # Built frontend (created by npm run build)
├── src/                   # Frontend source code
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment config
└── .env.local             # Local environment variables
```

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Choose deployment platform (Railway recommended)
- [ ] Connect GitHub repository
- [ ] Configure build and start commands
- [ ] Set environment variables
- [ ] Deploy!
- [ ] Test `/health` endpoint
- [ ] Test frontend loads
- [ ] Test directory scraping

---

## Next Steps

1. **Deploy to Railway** (recommended)
2. **Test your deployment**
3. **Share your live URL!** 🎉

---

## Need Help?

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

---

**Deployment made simple!** 🚀

One command, one deployment, one URL.
