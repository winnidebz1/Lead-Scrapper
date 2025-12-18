# Quick Start Guide

## ✅ Backend Server Status

**Backend is RUNNING!** 🎉

- **URL**: http://localhost:5000
- **Status**: ✅ Active
- **Health Check**: ✅ Passing

## 🚀 How to Use

### Step 1: Start Frontend (if not running)

Open a terminal and run:
```bash
cd "C:\Users\Cornelius Debpuur\Desktop\Web Projects\Lead Scrapper"
npm run dev
```

### Step 2: Use Directory Scraping

1. Open http://localhost:3000 in your browser
2. Go to **"Engine Room"** tab
3. Select:
   - **Country**: Ghana, UK, US, or Australia
   - **City**: Any city
   - **Industry**: Any of the 50+ categories
4. Click **"Initialize Automated Run"**

### Step 3: Watch It Work!

The app will now:
- ✅ Scrape real directories (BusinessGhana, Yellow Pages, etc.)
- ✅ Find actual businesses without websites
- ✅ Validate and verify all data
- ✅ Show you real leads!

## 🎯 What's Working Now

- ✅ **Backend Server**: Running on port 5000
- ✅ **Directory Scraping**: BusinessGhana, Yellow Pages, Yell.com
- ✅ **Data Validation**: Phone, email, name validation
- ✅ **Lead Verification**: Cross-verification and quality scoring
- ✅ **50+ Industries**: All categories from BusinessGhana

## 📊 Expected Results

When you run discovery:
- **Ghana**: Will scrape BusinessGhana and Yellow Pages Ghana
- **UK**: Will scrape Yell.com
- **US**: Will scrape Yellow Pages
- **Australia**: Will scrape Yellow Pages AU

All results are **real businesses** from actual directories!

## 🔧 Troubleshooting

**If directory scraping doesn't work:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok"}`

2. **Check .env.local has BACKEND_URL:**
   ```env
   BACKEND_URL=http://localhost:5000
   ```

3. **Restart frontend** after adding BACKEND_URL

4. **Check browser console** for errors (F12)

## 🎉 You're All Set!

The backend is running and ready to scrape directories. Just restart your frontend and start discovering leads!

