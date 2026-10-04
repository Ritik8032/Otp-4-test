const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS allow karne ke liye middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Frontend (HTML) files ko serve karne ke liye 'public' folder link kiya gaya hai
app.use(express.static('public'));

// Random Device ID generator
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Send OTP Route
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        const deviceId = generateUUID();

        const apiRes = await fetch("https://affiliateguru.in/api/v1/auth/send-otp", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://affiliateguru.in/',
                'X-Device-Id': deviceId
            },
            body: JSON.stringify({ phone })
        });

        const text = await apiRes.text();
        try {
            const data = JSON.parse(text);
            res.json({ success: true, deviceId, api_response: data });
        } catch (e) {
            res.status(500).json({ success: false, raw_response: text, error: "Target server returned non-JSON response" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Verify OTP Route
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const deviceId = generateUUID();

        const apiRes = await fetch("https://affiliateguru.in/api/v1/auth/verify-otp", {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://affiliateguru.in/',
                'X-Device-Id': deviceId
            },
            body: JSON.stringify({ phone, otp })
        });

        const text = await apiRes.text();
        try {
            const data = JSON.parse(text);
            res.json({ success: true, deviceId, api_response: data });
        } catch (e) {
            res.status(500).json({ success: false, raw_response: text, error: "Target server returned non-JSON response" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
