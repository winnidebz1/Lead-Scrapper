# Project Structure After Merge

```
Lead Scrapper/
│
├── 📁 backend/                      # Backend Server (NEW!)
│   ├── server.js                    # Express + Puppeteer server
│   ├── package.json                 # Backend dependencies
│   ├── package-lock.json           # Backend lock file
│   ├── node_modules/               # Backend dependencies
│   └── README.md                   # Backend documentation
│
├── 📁 components/                   # React Components
│   ├── Dashboard.tsx
│   ├── EngineRoom.tsx
│   ├── LeadDatabase.tsx
│   ├── Navbar.tsx
│   ├── Settings.tsx
│   └── Sidebar.tsx
│
├── 📁 services/                     # Frontend Services
│   ├── aiService.ts                # AI integration
│   ├── directoryService.ts         # Directory scraping (uses backend)
│   ├── googlePlacesService.ts      # Google Places API
│   └── ... (other services)
│
├── 📁 utils/                        # Utility Functions
│   ├── csvExport.ts
│   └── leadScoring.ts
│
├── 📁 node_modules/                 # Frontend Dependencies
│
├── 📄 App.tsx                       # Main React App
├── 📄 index.tsx                     # Entry Point
├── 📄 index.html                    # HTML Template
├── 📄 vite.config.ts               # Vite Configuration
├── 📄 tsconfig.json                # TypeScript Config
├── 📄 package.json                 # Main Package.json (UPDATED!)
├── 📄 package-lock.json            # Frontend Lock File
│
├── 📄 .env.local                   # Environment Variables
├── 📄 .gitignore                   # Git Ignore (UPDATED!)
│
├── 📄 README.md                    # Main README (UPDATED!)
├── 📄 MERGED_PROJECT_GUIDE.md      # Merge Guide (NEW!)
├── 📄 BACKEND_MERGE_SUMMARY.md     # Merge Summary (NEW!)
│
├── 📄 start.sh                     # Quick Start (Unix) (NEW!)
├── 📄 start.ps1                    # Quick Start (Windows) (NEW!)
│
└── 📄 ... (other documentation files)
```

## 🔄 What Changed?

### Before Merge
```
📁 Lead Scrapper/          (Frontend only)
📁 lead-scrapper-backend/  (Separate backend)
```

### After Merge
```
📁 Lead Scrapper/
   ├── 📁 backend/         (Backend integrated)
   └── ... (frontend files)
```

## 🚀 Running the Application

### Old Way (Two Separate Projects)
```bash
# Terminal 1
cd "Lead Scrapper"
npm run dev

# Terminal 2
cd lead-scrapper-backend
node server.js
```

### New Way (Merged Project)
```bash
# Single command!
cd "Lead Scrapper"
npm start
```

## 📦 Dependencies

### Frontend Dependencies (package.json)
- React 19
- TypeScript
- Vite
- Lucide React
- Recharts
- Express (for potential server-side features)
- Puppeteer (for potential client-side scraping)
- **concurrently** (NEW! - runs both servers)

### Backend Dependencies (backend/package.json)
- Express
- CORS
- Puppeteer

## 🔧 New Scripts

| Script | What It Does |
|--------|-------------|
| `npm start` | 🚀 Starts BOTH frontend and backend |
| `npm run dev` | Starts frontend only |
| `npm run backend` | Starts backend only |
| `npm run install:all` | Installs all dependencies |
| `npm run backend:install` | Installs backend dependencies |

## 🌐 Ports

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📡 API Endpoints

The backend provides:

1. **GET /health**
   - Health check endpoint
   - Returns: `{ status: 'ok', message: 'Backend server is running' }`

2. **POST /api/directories/search**
   - Scrapes business directories
   - Body: `{ country, industry, city }`
   - Returns: `{ results: [...] }`

3. **POST /proxy**
   - CORS proxy for API requests
   - Body: `{ url, method, headers }`
   - Returns: Proxied response

## 🎯 Benefits

✅ **Single Repository** - Everything in one place
✅ **Unified Scripts** - One command to rule them all
✅ **Better Organization** - Clear separation of concerns
✅ **Easier Deployment** - Deploy from one repo
✅ **Simplified Development** - No need to manage two projects

## 📝 Environment Variables

The `.env.local` file should contain:

```env
# Backend URL
BACKEND_URL=http://localhost:5000

# Optional: AI API Key
VITE_GOOGLE_API_KEY=your_key_here

# Optional: Google Places API Key
GOOGLE_PLACES_API_KEY=your_key_here
```

## 🔐 Git Ignore

The `.gitignore` now includes:
- `node_modules` (frontend)
- `backend/node_modules` (backend)
- `backend/package-lock.json` (backend)
- `.env.local` (environment variables)

## 📚 Documentation Files

- `README.md` - Main project README
- `MERGED_PROJECT_GUIDE.md` - Complete guide for merged project
- `BACKEND_MERGE_SUMMARY.md` - Summary of merge changes
- `BACKEND_SETUP.md` - Backend architecture details
- `SETUP.md` - Setup instructions
- `TROUBLESHOOTING.md` - Common issues
- And more...

## 🎉 Ready to Go!

The project is now fully merged and ready to use. Just run:

```bash
npm start
```

And you're good to go! 🚀
