const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');  // Add this line
const app = express();
const PORT = 8080;

app.use(cors());  // Add this line to enable CORS for all routes
app.use(express.json());

app.post('/translate', async (req, res) => {
    const DEEPL_API_ENDPOINT = "https://api-free.deepl.com/v2/translate";
    try {
        const response = await fetch(DEEPL_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch from DeepL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
