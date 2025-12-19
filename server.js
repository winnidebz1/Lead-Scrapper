const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'dist' folder (production build)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes (keep all your existing API routes)
// Directory scraping endpoint
app.post('/api/directories/search', async (req, res) => {
    const { country, industry, city } = req.body;

    console.log(`[${new Date().toISOString()}] Searching directories: ${industry} in ${city}, ${country}`);

    if (!country || !industry || !city) {
        return res.status(400).json({
            error: 'Missing required parameters: country, industry, city',
            results: []
        });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set a reasonable timeout
        page.setDefaultTimeout(30000);

        let results = [];

        // ============================================
        // GHANA DIRECTORIES
        // ============================================
        if (country === 'Ghana') {
            // BusinessGhana Directory
            try {
                console.log('Scraping BusinessGhana...');
                const bgUrl = `https://www.businessghana.com/site/directory?search=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
                await page.goto(bgUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForTimeout(2000); // Wait for content to load

                const bgBusinesses = await page.evaluate(() => {
                    // Try multiple selectors as directory structures vary
                    const selectors = [
                        '.directory-item',
                        '.listing-item',
                        '.business-item',
                        '.company-item',
                        'article',
                        '.result-item',
                        '[class*="listing"]',
                        '[class*="directory"]'
                    ];

                    let items = [];
                    for (const selector of selectors) {
                        const found = document.querySelectorAll(selector);
                        if (found.length > 0) {
                            items = Array.from(found);
                            break;
                        }
                    }

                    return items.slice(0, 15).map(item => {
                        // Try to find name
                        const nameSelectors = ['h3', 'h2', '.name', '.title', '.business-name', '[class*="name"]'];
                        let name = '';
                        for (const sel of nameSelectors) {
                            const el = item.querySelector(sel);
                            if (el && el.textContent.trim()) {
                                name = el.textContent.trim();
                                break;
                            }
                        }

                        // Try to find phone
                        const phoneSelectors = ['.phone', '.tel', '[class*="phone"]', '[href^="tel:"]'];
                        let phone = '';
                        for (const sel of phoneSelectors) {
                            const el = item.querySelector(sel);
                            if (el) {
                                phone = el.textContent?.trim() || el.getAttribute('href')?.replace('tel:', '') || '';
                                if (phone) break;
                            }
                        }

                        // Try to find email
                        const emailSelectors = ['.email', '[class*="email"]', '[href^="mailto:"]'];
                        let email = '';
                        for (const sel of emailSelectors) {
                            const el = item.querySelector(sel);
                            if (el) {
                                email = el.textContent?.trim() || el.getAttribute('href')?.replace('mailto:', '') || '';
                                if (email) break;
                            }
                        }

                        // Try to find address
                        const addressSelectors = ['.address', '.location', '[class*="address"]', '[class*="location"]'];
                        let address = '';
                        for (const sel of addressSelectors) {
                            const el = item.querySelector(sel);
                            if (el && el.textContent.trim()) {
                                address = el.textContent.trim();
                                break;
                            }
                        }

                        return {
                            name: name,
                            phone: phone,
                            email: email || null,
                            address: address,
                            website: null, // We want businesses without websites
                        };
                    }).filter(b => b.name && b.name.length > 2);
                });

                results.push(...bgBusinesses.map(b => ({
                    ...b,
                    source: 'BusinessGhana',
                })));

                console.log(`Found ${bgBusinesses.length} businesses from BusinessGhana`);
            } catch (error) {
                console.error('BusinessGhana scraping error:', error.message);
            }

            // Yellow Pages Ghana
            try {
                console.log('Scraping Yellow Pages Ghana...');
                const ypUrl = `https://www.yellowpagesghana.com/search?q=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
                await page.goto(ypUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForTimeout(2000);

                const ypBusinesses = await page.evaluate(() => {
                    const selectors = ['.listing', '.business-listing', '.result-item', '.search-result', '[class*="listing"]'];
                    let items = [];
                    for (const selector of selectors) {
                        const found = document.querySelectorAll(selector);
                        if (found.length > 0) {
                            items = Array.from(found);
                            break;
                        }
                    }

                    return items.slice(0, 10).map(item => {
                        const nameEl = item.querySelector('h2, h3, .name, .business-name, [class*="name"]');
                        const phoneEl = item.querySelector('.phone, .tel, [class*="phone"]');
                        const emailEl = item.querySelector('.email, [href^="mailto:"]');
                        const addressEl = item.querySelector('.address, .location, [class*="address"]');

                        return {
                            name: nameEl?.textContent?.trim() || '',
                            phone: phoneEl?.textContent?.trim() || phoneEl?.getAttribute('href')?.replace('tel:', '') || '',
                            email: emailEl?.textContent?.trim() || emailEl?.getAttribute('href')?.replace('mailto:', '') || null,
                            address: addressEl?.textContent?.trim() || '',
                            website: null,
                        };
                    }).filter(b => b.name && b.name.length > 2);
                });

                results.push(...ypBusinesses.map(b => ({
                    ...b,
                    source: 'Yellow Pages Ghana',
                })));

                console.log(`Found ${ypBusinesses.length} businesses from Yellow Pages Ghana`);
            } catch (error) {
                console.error('Yellow Pages Ghana scraping error:', error.message);
            }
        }

        // ============================================
        // UNITED KINGDOM DIRECTORIES
        // ============================================
        if (country === 'United Kingdom') {
            // Yell.com
            try {
                console.log('Scraping Yell.com...');
                const yellUrl = `https://www.yell.com/ucs/UcsSearchAction.do?keywords=${encodeURIComponent(industry)}&location=${encodeURIComponent(city)}`;
                await page.goto(yellUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForTimeout(2000);

                const yellBusinesses = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.businessCapsule, .listing, .result-item'));
                    return items.slice(0, 15).map(item => {
                        const nameEl = item.querySelector('h2, .business-name, [class*="name"]');
                        const phoneEl = item.querySelector('.phoneNumber, .tel, [class*="phone"]');
                        const addressEl = item.querySelector('.address, [class*="address"]');

                        return {
                            name: nameEl?.textContent?.trim() || '',
                            phone: phoneEl?.textContent?.trim() || '',
                            email: null,
                            address: addressEl?.textContent?.trim() || '',
                            website: null,
                        };
                    }).filter(b => b.name && b.name.length > 2);
                });

                results.push(...yellBusinesses.map(b => ({
                    ...b,
                    source: 'Yell.com',
                })));

                console.log(`Found ${yellBusinesses.length} businesses from Yell.com`);
            } catch (error) {
                console.error('Yell.com scraping error:', error.message);
            }
        }

        // ============================================
        // UNITED STATES DIRECTORIES
        // ============================================
        if (country === 'United States') {
            // Yellow Pages
            try {
                console.log('Scraping Yellow Pages...');
                const ypUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(industry)}&geo_location_terms=${encodeURIComponent(city)}`;
                await page.goto(ypUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForTimeout(2000);

                const ypBusinesses = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.result, .srp-listing, .business-listing'));
                    return items.slice(0, 15).map(item => {
                        const nameEl = item.querySelector('h2 a, .business-name, [class*="name"]');
                        const phoneEl = item.querySelector('.phone, .phones, [class*="phone"]');
                        const addressEl = item.querySelector('.adr, .address, [class*="address"]');

                        return {
                            name: nameEl?.textContent?.trim() || '',
                            phone: phoneEl?.textContent?.trim() || '',
                            email: null,
                            address: addressEl?.textContent?.trim() || '',
                            website: null,
                        };
                    }).filter(b => b.name && b.name.length > 2);
                });

                results.push(...ypBusinesses.map(b => ({
                    ...b,
                    source: 'Yellow Pages',
                })));

                console.log(`Found ${ypBusinesses.length} businesses from Yellow Pages`);
            } catch (error) {
                console.error('Yellow Pages scraping error:', error.message);
            }
        }

        // ============================================
        // AUSTRALIA DIRECTORIES
        // ============================================
        if (country === 'Australia') {
            // Yellow Pages AU
            try {
                console.log('Scraping Yellow Pages AU...');
                const ypUrl = `https://www.yellowpages.com.au/search/listings?clue=${encodeURIComponent(industry)}&locationClue=${encodeURIComponent(city)}`;
                await page.goto(ypUrl, { waitUntil: 'networkidle2', timeout: 30000 });
                await page.waitForTimeout(2000);

                const ypBusinesses = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('.listing, .result, [class*="listing"]'));
                    return items.slice(0, 15).map(item => {
                        const nameEl = item.querySelector('h3, h2, .name, [class*="name"]');
                        const phoneEl = item.querySelector('.phone, .tel, [class*="phone"]');
                        const addressEl = item.querySelector('.address, [class*="address"]');

                        return {
                            name: nameEl?.textContent?.trim() || '',
                            phone: phoneEl?.textContent?.trim() || '',
                            email: null,
                            address: addressEl?.textContent?.trim() || '',
                            website: null,
                        };
                    }).filter(b => b.name && b.name.length > 2);
                });

                results.push(...ypBusinesses.map(b => ({
                    ...b,
                    source: 'Yellow Pages AU',
                })));

                console.log(`Found ${ypBusinesses.length} businesses from Yellow Pages AU`);
            } catch (error) {
                console.error('Yellow Pages AU scraping error:', error.message);
            }
        }

        await browser.close();

        // Remove duplicates based on name
        const uniqueResults = [];
        const seenNames = new Set();
        for (const result of results) {
            const normalizedName = result.name.toLowerCase().trim();
            if (!seenNames.has(normalizedName)) {
                seenNames.add(normalizedName);
                uniqueResults.push(result);
            }
        }

        console.log(`[${new Date().toISOString()}] Returning ${uniqueResults.length} unique results`);

        res.json({ results: uniqueResults });

    } catch (error) {
        console.error('Scraping error:', error);
        if (browser) {
            await browser.close();
        }
        res.status(500).json({
            error: error.message,
            results: []
        });
    }
});

// Google Places API proxy endpoint (for CORS)
app.post('/proxy', async (req, res) => {
    const { url, method = 'GET', headers = {} } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                ...headers,
            },
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend for all other routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Unified server running on http://localhost:${PORT}`);
    console.log('📋 Endpoints:');
    console.log(`   GET  /health - Health check`);
    console.log(`   POST /api/directories/search - Search directories`);
    console.log(`   POST /proxy - Proxy API requests (for CORS)`);
    console.log(`   GET  /* - Serve frontend (React app)`);
    console.log('='.repeat(50));
    console.log('✅ Ready to serve frontend and backend!');
    console.log('');
});
