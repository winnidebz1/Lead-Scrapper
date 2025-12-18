# Setup Guide for BizDiscover AI

This guide will help you set up and run the BizDiscover AI application.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- API keys (see below)

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   ```env
   # Required: At least one of these must be set
   GEMINI_API_KEY=your_gemini_api_key_here
   GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```

## Getting API Keys

### Google Gemini API Key (Required for AI Discovery)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to `.env.local`

**Note**: The free tier provides generous usage limits for development.

### Google Places API Key (Required for Real Business Data)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Places API" (New) or "Places API"
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "API Key"
6. Copy the key and add it to `.env.local`
7. (Recommended) Restrict the API key to only "Places API" for security

**Pricing**: Google provides $200/month free credit. Each Places API request costs approximately $0.017-0.032 depending on the endpoint.

### Yelp API Key (Optional - for US Business Directory Searches)

1. Go to [Yelp Developers](https://www.yelp.com/developers)
2. Sign in or create an account
3. Create a new app
4. Copy the API key
5. Add to `.env.local` as `YELP_API_KEY`

**Note**: Yelp API is currently only used for United States searches. Other directories require backend services for scraping.

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

### Data Persistence
- All discovered leads are automatically saved to browser localStorage
- Data persists across page refreshes
- Export to CSV for backup

### Discovery Modes

The application uses a **multi-source discovery approach**:

#### Mode 1: Google Places API (Primary)
- Uses real business data from Google Maps
- Finds actual businesses without websites
- More accurate and reliable
- Requires `GOOGLE_PLACES_API_KEY`

#### Mode 2: Business Directories (Secondary)
- Searches business directories like Yelp, Yellow Pages, etc.
- **United States**: Yelp API integration (requires `YELP_API_KEY`)
- **Other Countries**: Directory scraping requires backend services
- Finds businesses from multiple directory sources

#### Mode 3: AI-Powered Discovery (Fallback)
- Uses Google Gemini AI to generate realistic business leads
- Activated when other sources don't return enough results
- Requires `GEMINI_API_KEY`

**Discovery Flow**: The app tries Google Places first, then searches directories, and finally uses AI if needed. All results are combined and deduplicated.

## Usage Tips

1. **Start with a specific search:**
   - Select a country, city, and industry
   - Click "Initialize Automated Run"
   - Wait for results (usually 5-30 seconds)

2. **Filter and search leads:**
   - Use the search bar to find specific leads
   - Toggle filters for "No Website" or "Has Email"
   - Sort by Score, Date, or Reviews

3. **Export your leads:**
   - Click "Export CSV" to download all filtered leads
   - The CSV includes all lead information

4. **Manage storage:**
   - Leads are stored in browser localStorage (~5MB limit)
   - If you see storage warnings, export and clear old leads
   - Use "Clear All" to remove all leads

## Troubleshooting

### "GEMINI_API_KEY is not configured" Error
- Make sure `.env.local` exists in the root directory
- Verify the API key is correct (no extra spaces)
- Restart the dev server after adding the key

### "Google Places API error"
- Verify your API key is correct
- Check that Places API is enabled in Google Cloud Console
- Ensure you have billing enabled (even with free tier)
- Check API quota limits

### No leads found
- Try different cities or industries
- Some locations may have fewer businesses without websites
- Check browser console for detailed error messages

### Storage quota exceeded
- Export your leads to CSV
- Clear old leads using "Clear All"
- Consider implementing a backend database for larger datasets

## Production Deployment

For production deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - Vercel (recommended for React apps)
   - Netlify
   - GitHub Pages
   - Any static hosting service

3. **Set environment variables** in your hosting platform's dashboard

4. **Important**: Never commit `.env.local` to version control!

## Next Steps

- Consider adding a backend API for multi-user support
- Implement real email discovery from social media
- Add more data sources (Yelp, Yellow Pages, etc.)
- Set up monitoring and analytics

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all API keys are correctly configured
3. Review the RECOMMENDATIONS.md file for advanced features

