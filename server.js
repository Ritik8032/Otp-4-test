const express = require('express');
const app = express();
// Cloud platforms (jaise Render) apna PORT automatically dete hain, isliye process.env.PORT use karna zaroori hai
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
                'Accept-Language': 'en',
                'X-Device-Id': deviceId
            },
            body: JSON.stringify({ phone })
        });

        const data = await apiRes.json();
        res.json({ success: true, deviceId, api_response: data });
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
                'Accept-Language': 'en',
                'X-Device-Id': deviceId
            },
            body: JSON.stringify({ phone, otp })
        });

        const data = await apiRes.json();
        res.json({ success: true, deviceId, api_response: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
          
