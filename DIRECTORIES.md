# Business Directories Integration

## Overview

BizDiscover AI now includes business directory integration to expand lead discovery sources beyond Google Places API.

## Supported Directories by Country

### United Kingdom
- **Yell.com** - UK's leading business directory
- **Thomson Local** - Local business directory
- **192.com** - UK business and people directory
- **FreeIndex** - UK business reviews and directory

### United States
- **Yellow Pages** - Traditional business directory
- **Yelp** - Business reviews and directory (API available)
- **Better Business Bureau** - Business accreditation and directory
- **Angi (Angie's List)** - Home services directory

### Australia
- **Yellow Pages AU** - Australian business directory
- **TrueLocal** - Australian local business directory
- **Hotfrog** - Australian business directory

### Ghana
- **Yellow Pages Ghana** - Official Yellow Pages directory for Ghana
- **GhanaWeb Business** - Ghana business directory
- **Jumia Business** - E-commerce and business directory
- **Tonaton** - Ghana classifieds and business directory

## Current Implementation

### Available Now

1. **Yelp API Integration** (United States only)
   - Requires `YELP_API_KEY` in `.env.local`
   - Direct API integration
   - No backend required
   - Get your API key from [Yelp Developers](https://www.yelp.com/developers)

### Requires Backend (Future Implementation)

Most directories require backend services due to:
- CORS restrictions
- Anti-scraping measures
- Rate limiting
- Authentication requirements

**Directories that need backend:**
- All UK directories (Yell, Thomson Local, 192.com, FreeIndex)
- Yellow Pages (US and AU)
- Better Business Bureau
- Angi
- All Ghana directories

## How It Works

### Discovery Flow

1. **Google Places API** (Primary source)
   - Searches for businesses in the specified location
   - Filters for businesses without websites

2. **Business Directories** (Secondary source)
   - Searches relevant directories based on country
   - Yelp API for US (if API key provided)
   - Other directories require backend scraping

3. **AI Discovery** (Fallback)
   - Uses Google Gemini AI if other sources don't return enough results
   - Generates realistic business leads

4. **Deduplication & Merging**
   - All results are combined
   - Duplicates removed (based on name + city)
   - Leads scored and prioritized

## Setting Up Yelp API (US Only)

1. **Get API Key:**
   - Visit [Yelp Developers](https://www.yelp.com/developers)
   - Sign in or create account
   - Create a new app
   - Copy your API key

2. **Add to Environment:**
   ```env
   YELP_API_KEY=your_yelp_api_key_here
   ```

3. **Usage:**
   - Automatically used for US searches
   - Searches Yelp for businesses matching your criteria
   - Only includes businesses without websites

## Future Backend Implementation

To enable full directory scraping, you'll need a backend service that:

1. **Handles Scraping:**
   - Uses headless browsers (Puppeteer/Playwright)
   - Respects robots.txt and rate limits
   - Implements retry logic

2. **Provides API Endpoints:**
   ```
   POST /api/directories/search
   {
     "country": "United Kingdom",
     "industry": "Salons & spas",
     "city": "London"
   }
   ```

3. **Returns Structured Data:**
   ```json
   {
     "results": [
       {
         "name": "Business Name",
         "phone": "+44...",
         "email": "contact@business.com",
         "address": "123 Street",
         "website": null,
         "source": "Yell.com"
       }
     ]
   }
   ```

## Directory Priority

When multiple directories are available, the system:
1. Tries API-based directories first (Yelp)
2. Falls back to backend scraping services
3. Uses AI discovery if directories don't return results

## Benefits

- **More Lead Sources**: Access to multiple business directories
- **Better Coverage**: Find businesses not listed on Google Maps
- **Higher Quality**: Directory data often includes verified business information
- **Country-Specific**: Uses directories relevant to each country

## Limitations

- **CORS Restrictions**: Most directories require backend scraping
- **API Availability**: Only Yelp API is currently integrated
- **Rate Limits**: Directory APIs may have usage limits
- **Data Quality**: Varies by directory

## Next Steps

1. **For US Users**: Get Yelp API key for immediate directory access
2. **For Other Countries**: Wait for backend implementation or use Google Places + AI discovery
3. **Backend Development**: See `RECOMMENDATIONS.md` for backend architecture suggestions

## Support

For questions about directory integration:
- Check the browser console for errors
- Verify API keys are correctly configured
- Review `SETUP.md` for API key setup instructions

