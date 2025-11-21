const http = require('http');
const url = require('url');

// ==================== CONFIG =====================
const YOUR_API_KEYS = ["7139757137"];
const TARGET_API = "https://ox-tawny.vercel.app/search_mobile";
// =================================================

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

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${TARGET_API}?mobile=${encodeURIComponent(mobile)}&api_key=gavravrandigey`);
        
        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Enhance response
        const finalData = {
            ...data,
            credit_by: "splexx",
            developer: "splexxo",
            powered_by: "Splexxo Info API"
        };

        res.end(JSON.stringify(finalData));

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
    console.log(`🚀 Splexxo Info API running on port ${PORT}`);
});
