# Lead Scrapper - Merged Project Guide

## 🎉 Project Structure

The backend has been successfully merged into the main Lead Scrapper project! The project now has the following structure:

```
Lead Scrapper/
├── backend/                 # Backend server for directory scraping
│   ├── server.js           # Express server with Puppeteer
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend-specific documentation
├── components/             # React components
├── services/              # Frontend services
├── utils/                 # Utility functions
├── App.tsx               # Main React application
├── package.json          # Main package.json with unified scripts
└── ... (other frontend files)
```

## 🚀 Quick Start

### First Time Setup

1. **Install all dependencies** (frontend + backend):
   ```bash
   npm run install:all
   ```

   Or install separately:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   ```

2. **Configure environment variables**:
   
   Create or update `.env.local` in the root directory:
   ```env
   BACKEND_URL=http://localhost:5000
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   ```

### Running the Application

#### Option 1: Run Both Frontend and Backend Together (Recommended)
```bash
npm start
```
This will start:
- Frontend dev server on `http://localhost:5173`
- Backend server on `http://localhost:5000`

#### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run backend
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server only |
| `npm run backend` | Start backend server only |
| `npm start` | Start both frontend and backend concurrently |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run install:all` | Install all dependencies (frontend + backend) |
| `npm run backend:install` | Install backend dependencies only |

## 🔧 Backend API Endpoints

The backend server provides the following endpoints:

### Health Check
```
GET http://localhost:5000/health
```
Returns server status.

### Directory Search
```
POST http://localhost:5000/api/directories/search
Content-Type: application/json

{
  "country": "Ghana",
  "industry": "IT Companies",
  "city": "Accra"
}
```
Scrapes business directories and returns lead data.

### Proxy (for CORS)
```
POST http://localhost:5000/proxy
Content-Type: application/json

{
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": {}
}
```
Proxies API requests to avoid CORS issues.

## 🌍 Supported Countries

The backend currently supports directory scraping for:

- **Ghana**: BusinessGhana, Yellow Pages Ghana
- **United Kingdom**: Yell.com
- **United States**: Yellow Pages
- **Australia**: Yellow Pages AU

## 🛠️ Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Lucide React (icons)
- Recharts (analytics)

### Backend
- Node.js
- Express
- Puppeteer (web scraping)
- CORS middleware

## 📝 Development Workflow

1. **Make changes** to frontend or backend code
2. **Test locally** using `npm start`
3. **Commit changes** to git
4. **Push to repository**

## 🐛 Troubleshooting

### Backend won't start
- Ensure backend dependencies are installed: `npm run backend:install`
- Check if port 5000 is available
- Look for errors in the terminal

### Frontend can't connect to backend
- Verify `BACKEND_URL` in `.env.local` is set to `http://localhost:5000`
- Ensure backend server is running
- Check browser console for CORS errors

### Puppeteer errors
- Puppeteer downloads Chromium automatically
- If it fails, try: `cd backend && npx puppeteer browsers install chrome`
- Ensure you have enough disk space and memory

### "No results" from directory scraping
- Directory websites may have changed their structure
- Try different search terms
- Check backend console logs for specific errors

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable `BACKEND_URL` to your backend URL

### Backend Deployment (Railway/Render)
1. Deploy the `backend` folder
2. Set PORT environment variable (usually automatic)
3. Ensure Puppeteer dependencies are installed

### Recommended Platforms
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Railway, Render, Heroku, AWS Lambda

## 🔐 Environment Variables

### Frontend (.env.local)
```env
BACKEND_URL=http://localhost:5000
VITE_GOOGLE_API_KEY=your_api_key
```

### Backend (backend/.env) - Optional
```env
PORT=5000
NODE_ENV=development
```

## 📚 Additional Documentation

- `BACKEND_SETUP.md` - Detailed backend setup guide
- `QUICK_START.md` - Quick start guide
- `TROUBLESHOOTING.md` - Common issues and solutions
- `backend/README.md` - Backend-specific documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

## 🙋 Support

For issues or questions:
- Check the troubleshooting guides
- Review the documentation files
- Open an issue on GitHub

---

**Happy Lead Scraping! 🎯**
