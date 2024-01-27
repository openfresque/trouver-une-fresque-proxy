const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const PORT = 8000;
const API_BASE = "https://xztalmhvgcwkflpwtzls.supabase.co";

dotenv.config()

const app = express();
app.use(cors());

app.get('/events', async (req, response) => {
    try {
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
        response.json(data);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'An error occurred in the backend.' });
    }
});

app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
