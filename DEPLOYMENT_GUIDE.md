# Deployment Guide - Lead Scrapper

## Overview

Your Lead Scrapper application has **two parts** that need to be deployed:

1. **Frontend** (React/Vite) - The user interface
2. **Backend** (Node.js/Express) - The directory scraping server

## Current Issue

✅ **Frontend works** on your hosted site  
❌ **Backend is missing** - causing directory scraping to fail

## Solution: Deploy Both Parts

---

## Option 1: Deploy Backend to Vercel (Recommended)

### Step 1: Deploy Backend

1. **Go to [Vercel](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your GitHub repository**: `winnidebz1/Lead-Scrapper`
4. **Configure the project:**
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Click "Deploy"**

6. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 2: Update Frontend Environment Variable

1. **Go to your frontend Vercel project** (the main Lead Scrapper deployment)
2. **Go to Settings → Environment Variables**
3. **Add a new variable:**
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `https://your-backend.vercel.app` (your backend URL from Step 1)
4. **Click "Save"**
5. **Redeploy your frontend** (Settings → Deployments → click "..." → Redeploy)

### Step 3: Test

Visit your hosted site and try directory scraping - it should now work! 🎉

---

## Option 2: Deploy Backend to Railway (Alternative)

Railway is better for long-running processes like Puppeteer.

### Step 1: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**: `winnidebz1/Lead-Scrapper`
5. **Configure:**
   - **Root Directory**: `backend`
   - **Start Command**: `node server.js`
6. **Add environment variable:**
   - **Name**: `PORT`
   - **Value**: `5000`
7. **Deploy**

8. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)

### Step 2: Update Frontend

Same as Option 1, Step 2 - add `VITE_BACKEND_URL` with your Railway URL.

---

## Option 3: Deploy Backend to Render

### Step 1: Deploy to Render

1. **Go to [Render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Name**: `lead-scrapper-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Click "Create Web Service"**

6. **Copy your Render URL** (e.g., `https://lead-scrapper-backend.onrender.com`)

### Step 2: Update Frontend

Same as above - add `VITE_BACKEND_URL` with your Render URL.

---

## Important Notes

### ⚠️ Puppeteer on Serverless

Puppeteer (used for web scraping) can be problematic on serverless platforms like Vercel due to:
- Large bundle size
- Memory limits
- Execution time limits

**If Vercel fails**, use **Railway** or **Render** instead - they support long-running processes better.

### 🔒 CORS Configuration

The backend is already configured to accept requests from any origin (`cors()` middleware). If you need to restrict it to your frontend only, update `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app'
}));
```

### 💰 Cost

- **Vercel**: Free tier (with limits)
- **Railway**: $5/month (free trial available)
- **Render**: Free tier (spins down after inactivity)

---

## Quick Reference

### Environment Variables Needed

**Frontend (Vercel/Netlify):**
```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_GEMINI_API_KEY=your_key_here (optional)
VITE_GOOGLE_PLACES_API_KEY=your_key_here (optional)
```

**Backend (Railway/Render/Vercel):**
```env
PORT=5000 (usually auto-set)
NODE_ENV=production
```

---

## Testing Your Deployment

1. **Check backend health:**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return: `{"status":"ok","message":"Backend server is running"}`

2. **Test directory scraping:**
   - Go to your hosted frontend
   - Navigate to Engine Room
   - Select country, city, industry
   - Click "Initialize Automated Run"
   - Check browser console for errors

---

## Troubleshooting

### "Failed to fetch" error
- Backend is not deployed or URL is wrong
- Check `VITE_BACKEND_URL` in frontend environment variables

### "500 Internal Server Error" from backend
- Puppeteer failed to launch (try Railway/Render instead of Vercel)
- Check backend logs in your deployment platform

### "No results found"
- Backend is working but directory websites changed structure
- This is expected - directory scraping is fragile

---

## Need Help?

Check the logs in your deployment platform:
- **Vercel**: Project → Deployments → Click deployment → View Function Logs
- **Railway**: Project → Deployments → View Logs
- **Render**: Dashboard → Your Service → Logs

---

**Next Steps:**
1. Choose a deployment platform for your backend (Railway recommended)
2. Deploy the backend
3. Update `VITE_BACKEND_URL` in your frontend
4. Redeploy frontend
5. Test! 🚀
