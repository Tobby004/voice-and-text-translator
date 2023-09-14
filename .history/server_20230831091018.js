const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 5000;

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
