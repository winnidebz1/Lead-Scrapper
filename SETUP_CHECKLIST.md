# Setup Checklist

## ✅ Completed Setup Steps

### 1. Prerequisites ✅
- [x] Node.js v24.11.1 installed
- [x] npm 11.6.2 installed
- [x] Dependencies installed (175 packages)

### 2. Environment Configuration

**Status**: `.env.local` file exists

**Next Steps - Add Your API Keys:**

1. **Open `.env.local` file** in the root directory

2. **Add at least ONE API key** (minimum required):

   **Option A: Google Gemini (Recommended - Free)**
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
   - Get key from: https://makersuite.google.com/app/apikey
   - Free tier available
   - Works immediately

   **Option B: OpenAI GPT (Paid)**
   ```
   OPENAI_API_KEY=your_actual_key_here
   ```
   - Get key from: https://platform.openai.com/api-keys
   - Requires paid account

   **Option C: Other AI Providers**
   - See AI_PROVIDERS.md for options

3. **Optional - Add Directory APIs:**

   **Yelp API (US searches only)**
   ```
   YELP_API_KEY=your_actual_key_here
   ```
   - Get key from: https://www.yelp.com/developers
   - Works for US business searches

   **Google Places API (Requires backend proxy)**
   ```
   GOOGLE_PLACES_API_KEY=your_actual_key_here
   BACKEND_URL=http://localhost:5000
   ```
   - Get key from: https://console.cloud.google.com/apis/credentials
   - Requires backend for CORS

### 3. Running the Application

Once you've added your API keys:

```bash
npm run dev
```

Then open: http://localhost:3000

## Quick Start (Minimum Setup)

**Fastest way to get started:**

1. Get Gemini API key: https://makersuite.google.com/app/apikey
2. Add to `.env.local`:
   ```
   GEMINI_API_KEY=paste_your_key_here
   ```
3. Save the file
4. Run: `npm run dev`
5. Open: http://localhost:3000

That's it! The app will work with AI discovery.

## What's Already Set Up

✅ Node.js and npm installed  
✅ All dependencies installed  
✅ `.env.local` file created  
✅ Project structure ready  
✅ Git repository initialized  

## What You Need to Do

1. **Add API keys** to `.env.local` (see above)
2. **Run the app**: `npm run dev`
3. **Test discovery**: Select country/city/industry and click "Initialize Automated Run"

## Need Help?

- See `SETUP.md` for detailed instructions
- See `TROUBLESHOOTING.md` for common issues
- See `WORKING_WITHOUT_AI.md` if you want to skip AI APIs
- See `AI_PROVIDERS.md` for AI provider options

## Next Steps After Setup

1. ✅ Add API keys to `.env.local`
2. ✅ Run `npm run dev`
3. ✅ Test the discovery feature
4. ✅ Export leads to CSV
5. ✅ (Optional) Set up backend for directory scraping

