<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BizDiscover AI - Automated Lead Engine

An AI-powered lead generation tool that discovers businesses without professional websites. Perfect for web developers, digital agencies, and marketers looking for potential clients.

## ✨ Features

- **Multi-Source Discovery**: Searches Google Places, business directories (Yelp, Yellow Pages, etc.), and AI
- **Real Business Data**: Integrates with Google Places API for actual business discovery
- **Business Directories**: Searches Yelp (US), Yellow Pages, and country-specific directories
- **AI-Powered Discovery**: Falls back to Google Gemini AI when needed
- **Data Persistence**: Automatically saves leads to browser localStorage
- **Smart Filtering**: Search, filter, and sort leads by multiple criteria
- **Export to CSV**: Download leads with all information
- **Pagination**: Handle large datasets efficiently
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Modern, beautiful UI built with React and Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- **At least ONE API key** (see below)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/winnidebz1/Lead-Scrapper.git
   cd "Lead Scrapper"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Create .env.local file
   ```
   
   Then add your API key (at minimum, you need GEMINI_API_KEY):
   ```env
   # REQUIRED: For AI-powered discovery (works immediately, no backend needed)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # OPTIONAL: For real business data (requires backend proxy due to CORS)
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

### ⚠️ Important Note About Google Places API

**Google Places API requires a backend proxy** due to CORS restrictions. If you don't have a backend set up:
- ✅ **Use AI Discovery**: Just add `GEMINI_API_KEY` - it works immediately!
- ❌ **Google Places won't work** from browser directly - you'll see CORS errors

**Recommended for quick start:** Just use `GEMINI_API_KEY` for AI discovery. It works perfectly without any backend!

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup guide and API key instructions
- **[WORKING_WITHOUT_AI.md](WORKING_WITHOUT_AI.md)** - How to use the app without AI APIs
- **[DIRECTORIES.md](DIRECTORIES.md)** - Business directory integration guide
- **[AI_PROVIDERS.md](AI_PROVIDERS.md)** - AI provider options (optional)
- **[RECOMMENDATIONS.md](RECOMMENDATIONS.md)** - Future improvements and roadmap
- **[CHANGELOG.md](CHANGELOG.md)** - List of all improvements made

## 🔑 Getting API Keys

### Google Gemini API (Required for AI Discovery)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create an API key
3. Add to `.env.local` as `GEMINI_API_KEY`

### Google Places API (Recommended for Real Data)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Places API"
3. Create an API key
4. Add to `.env.local` as `GOOGLE_PLACES_API_KEY`

**Note**: Google provides $200/month free credit for Places API.

### Yelp API (Optional - for US Business Directory Searches)
1. Go to [Yelp Developers](https://www.yelp.com/developers)
2. Create an app and get your API key
3. Add to `.env.local` as `YELP_API_KEY`

**Note**: Yelp API is currently only used for United States searches. See [DIRECTORIES.md](DIRECTORIES.md) for more information.

## 💡 How It Works

1. **Select Parameters**: Choose country, city, and industry
2. **Run Discovery**: Click "Initialize Automated Run"
3. **Multi-Source Search** (AI is optional!): 
   - **Primary**: Searches Google Places API for real businesses
   - **Primary**: Searches business directories (Yelp, Yellow Pages, etc.) - **No AI needed!**
   - **Optional**: Falls back to AI discovery only if directories return no results
4. **Smart Deduplication**: Combines results and removes duplicates
5. **Filter & Export**: Search, filter, and export your leads

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Maps**: Google Places API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Features Overview

### Dashboard
- Statistics overview
- Leads by country chart
- Recent high-value leads
- Discovery activity log

### Engine Room
- Configure discovery parameters
- Run automated discovery
- Real-time progress updates

### Lead Database
- Search and filter leads
- Sort by score, date, or reviews
- Pagination support
- Export to CSV

## 🔒 Privacy & Compliance

- ✅ GDPR/CCPA compliant
- ✅ No auto-outreach
- ✅ No cold emails
- ✅ No data manipulation
- ✅ Data stored locally (browser)

## 🐛 Troubleshooting

**Having issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for comprehensive solutions.

### Quick Fixes:

**"Discovery doesn't work" or "Nothing happens":**
- ✅ Check you have `GEMINI_API_KEY` in `.env.local`
- ✅ Restart dev server after adding API key
- ✅ Check browser console (F12) for errors

**"CORS error" or "Google Places doesn't work":**
- ✅ This is normal! Google Places requires a backend proxy
- ✅ **Solution**: Just use AI discovery with `GEMINI_API_KEY` instead
- ✅ AI discovery works perfectly without any backend

**"No leads found":**
- ✅ Try different cities or industries
- ✅ Use AI discovery (more reliable)
- ✅ Check browser console for detailed errors

**See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.**

## 📦 Build for Production

```bash
npm run build
```

The `dist` folder contains the production build ready for deployment.

## 🤝 Contributing

This is a production-ready application. For suggestions and improvements, see [RECOMMENDATIONS.md](RECOMMENDATIONS.md).

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Google Gemini AI for AI-powered discovery
- Google Places API for real business data
- Built with React and modern web technologies
