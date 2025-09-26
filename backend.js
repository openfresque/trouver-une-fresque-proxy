const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const NodeCache = require('node-cache')

const PORT = 8000;
const API_BASE = "https://xztalmhvgcwkflpwtzls.supabase.co";

dotenv.config()

const app = express();
app.use(cors());

// In-memory cache: default TTL 24 hours (86400 seconds). We rely on per-entry TTL only
// (no scheduled global flush). Expired entries are removed on access or by the
// internal check period.
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 86400
const cache = new NodeCache({ stdTTL: CACHE_TTL_SECONDS, checkperiod: 600 });

app.get('/events', async (req, response) => {
    try {
        // Use the full originalUrl (path + query) as the cache key so different query params
        // would result in different cache entries. Please note that the API returns all events
        // regardless of criteria; filtering is performed on the client side.
        const cacheKey = req.originalUrl || req.url || '/events';

        const cached = cache.get(cacheKey);
        if (cached) {
            // Return cached response
            return response.json(cached);
        }

        const headers = {
            'apikey': process.env.API_KEY,
            'Content-Type': 'application/json'
        };

        const fetch = await import('node-fetch'); // Use dynamic import for ES module
        const fetchResponse = await fetch.default(`${API_BASE}/rest/v1/events?select=workshop_type,title,online,training,sold_out,kids,start_date,end_date,zip_code,latitude,longitude,source_link,department,city,address,location_name,full_location,scrape_date&start_date=gte.now`, {
            method: 'GET',
            headers: headers,
            cache: 'no-cache'
        });

        if (!fetchResponse.ok) {
            throw new Error('Fetch request failed');
        }

        const data = await fetchResponse.json();

        // Store successful responses in cache with explicit TTL (redundant with stdTTL but explicit)
        cache.set(cacheKey, data, CACHE_TTL_SECONDS);

        response.json(data);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'An error occurred in the backend.' });
    }
});

app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
