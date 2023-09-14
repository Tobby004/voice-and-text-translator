const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");  // Allow all origins
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use(cors());  // Enable CORS for all routes
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
        console.error(error);
        res.status(500).json({ error: "Failed to fetch from DeepL" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.options('*', (req, res) => {
    res.sendStatus(200);
});
