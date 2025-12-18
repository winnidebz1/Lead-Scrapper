# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Discovery doesn't work" or "No leads found"

#### Problem 1: Missing API Keys

**Symptoms:**
- No leads are discovered
- Error messages about missing API keys
- Toast notifications saying "API key not configured"

**Solution:**
1. Create a `.env.local` file in the root directory
2. Add at least one of these API keys:
   ```env
   GEMINI_API_KEY=your_key_here
   GOOGLE_PLACES_API_KEY=your_key_here
   ```
3. Restart the development server (`npm run dev`)
4. Try discovery again

**Note:** You need at least ONE API key for discovery to work:
- `GEMINI_API_KEY` - For AI-powered discovery (works immediately)
- `GOOGLE_PLACES_API_KEY` - For real business data (requires backend proxy due to CORS)

---

#### Problem 2: Google Places API CORS Error

**Symptoms:**
- Error message: "Google Places API requires a backend proxy due to CORS restrictions"
- Google Places searches fail
- Only AI discovery works

**Why This Happens:**
Google Places API doesn't allow direct calls from browsers due to CORS (Cross-Origin Resource Sharing) restrictions. This is a security feature.

**Solutions:**

**Option A: Use AI Discovery Only (Easiest)**
- Just use `GEMINI_API_KEY` 
- AI discovery works without any backend
- This is the recommended approach for quick setup

**Option B: Set Up Backend Proxy (For Google Places)**
1. Create a simple backend server (Node.js/Express or Python/FastAPI)
2. Create a proxy endpoint that calls Google Places API
3. Set `VITE_API_PROXY_URL` in `.env.local` pointing to your backend

**Example Backend Proxy (Node.js/Express):**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Proxy server running on port 5000');
});
```

Then in `.env.local`:
```env
VITE_API_PROXY_URL=http://localhost:5000
```

---

#### Problem 3: API Key Invalid or Not Enabled

**Symptoms:**
- Error: "REQUEST_DENIED" or "API key not valid"
- Error: "This API project is not authorized to use this API"

**Solution:**
1. **For Google Places API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Places API" (not "Places API (New)")
   - Check that your API key is correct
   - Verify billing is enabled (even with free tier)

2. **For Gemini API:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Verify your API key is correct
   - Check if you've exceeded rate limits

---

#### Problem 4: No Results Found

**Symptoms:**
- Discovery runs but returns 0 leads
- Toast says "No leads found"

**Possible Causes:**
1. **Too specific search**: Try a larger city or different industry
2. **All businesses have websites**: The app filters for businesses WITHOUT websites
3. **Location not found**: Try a different city name

**Solution:**
- Try different cities
- Try different industries
- Use broader search terms
- Check browser console for detailed error messages

---

#### Problem 5: Discovery Hangs or Times Out

**Symptoms:**
- Discovery button stays in "loading" state
- No results after waiting
- Browser becomes unresponsive

**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Verify your internet connection
3. Check if API keys are valid
4. Try refreshing the page
5. Check if you've exceeded API rate limits

---

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages in red
4. Copy error messages for troubleshooting

### Step 2: Check Environment Variables
1. Verify `.env.local` exists in root directory
2. Check that API keys are correct (no extra spaces)
3. Restart dev server after changing `.env.local`

### Step 3: Test API Keys Individually

**Test Gemini API:**
```bash
# In browser console, try:
const testKey = 'your_gemini_key';
console.log('Gemini key exists:', !!testKey);
```

**Test Google Places API:**
- This requires backend proxy or will show CORS error
- If you see CORS error, that's expected - use AI discovery instead

### Step 4: Check Network Tab
1. Open DevTools → Network tab
2. Run discovery
3. Look for failed requests (red)
4. Check request/response details

---

## Quick Fixes

### "Nothing happens when I click discover"
- ✅ Check browser console for errors
- ✅ Verify at least one API key is set
- ✅ Restart dev server

### "CORS error"
- ✅ Use AI discovery (GEMINI_API_KEY) instead
- ✅ Or set up backend proxy for Google Places

### "API key not found"
- ✅ Create `.env.local` file
- ✅ Add `GEMINI_API_KEY=your_key`
- ✅ Restart dev server

### "No leads found"
- ✅ Try different city/industry
- ✅ Check if businesses in that area have websites
- ✅ Use AI discovery which always returns results

---

## Still Having Issues?

1. **Check the browser console** - Most errors are logged there
2. **Verify API keys** - Make sure they're correct and active
3. **Try AI discovery first** - It's the most reliable (just needs GEMINI_API_KEY)
4. **Check SETUP.md** - For detailed setup instructions
5. **Review error messages** - They usually tell you exactly what's wrong

---

## Recommended Setup for Quick Start

For the fastest setup without backend:

1. **Get Gemini API Key:**
   - Visit https://makersuite.google.com/app/apikey
   - Create API key
   - Add to `.env.local`: `GEMINI_API_KEY=your_key`

2. **Skip Google Places** (requires backend)
   - Just use AI discovery
   - It works immediately

3. **Run the app:**
   ```bash
   npm install
   npm run dev
   ```

4. **Test discovery:**
   - Select country, city, industry
   - Click "Initialize Automated Run"
   - Should get AI-generated leads

This setup works 100% without any backend!

