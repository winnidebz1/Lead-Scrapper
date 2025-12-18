# Lead Scrapper Backend

Backend server for scraping business directories.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Server will run on:** http://localhost:5000

## Endpoints

### Health Check
```
GET /health
```

### Search Directories
```
POST /api/directories/search
Body: {
  "country": "Ghana",
  "industry": "IT Companies",
  "city": "Accra"
}
```

### API Proxy (for CORS)
```
POST /proxy
Body: {
  "url": "https://api.example.com/endpoint",
  "method": "GET",
  "headers": {}
}
```

## Supported Directories

- **Ghana**: BusinessGhana, Yellow Pages Ghana
- **United Kingdom**: Yell.com
- **United States**: Yellow Pages
- **Australia**: Yellow Pages AU

## Configuration

Set `BACKEND_URL=http://localhost:5000` in your frontend `.env.local` file.

## Troubleshooting

- Make sure port 5000 is not in use
- Check that Puppeteer/Chromium is installed
- Review server logs for scraping errors

