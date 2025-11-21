const http = require('http');
const url = require('url');

// ==================== CONFIG =====================
const YOUR_API_KEYS = ["7139757137", "gavravrandigey"];
const TARGET_API = "https://ox-tawny.vercel.app/search_mobile";
const CACHE_TIME = 3600 * 1000; // 1 hour cache
// =================================================

const cache = new Map();

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    const parsedUrl = url.parse(req.url, true);
    const { mobile, key, api_key } = parsedUrl.query;

    // Parameter check
    if (!mobile) {
        return res.end(JSON.stringify({ 
            error: 'Missing mobile parameter',
            usage: '?mobile=9876543210&key=7139757137'
        }));
    }

    // API key check
    const userKey = key || api_key;
    if (userKey && !YOUR_API_KEYS.includes(userKey)) {
        return res.end(JSON.stringify({ error: 'Invalid API key' }));
    }

    // Cache check
    const now = Date.now();
    const cached = cache.get(mobile);
    if (cached && now - cached.timestamp < CACHE_TIME) {
        res.setHeader('X-Cache', 'HIT');
        return res.end(cached.response);
    }

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${TARGET_API}?mobile=${encodeURIComponent(mobile)}&api_key=gavravrandigey`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Clean and enhance response
        const finalData = {
            ...data,
            credit_by: "splexx",
            developer: "splexxo",
            powered_by: "Mobile Info API",
            timestamp: new Date().toISOString(),
            cached: false
        };

        const responseBody = JSON.stringify(finalData);

        // Save to cache
        cache.set(mobile, {
            timestamp: now,
            response: responseBody
        });

        res.setHeader('X-Cache', 'MISS');
        res.end(responseBody);

    } catch (error) {
        res.end(JSON.stringify({
            error: 'Request failed',
            details: error.message,
            credit_by: "splexx"
        }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`📱 Mobile Info API running on port ${PORT}`);
    console.log(`🔗 Usage: http://localhost:${PORT}/?mobile=9876543210`);
    console.log(`🔗 Usage: http://localhost:${PORT}/?mobile=9876543210&key=7139757137`);
});
