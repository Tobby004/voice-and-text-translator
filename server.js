const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());

app.get('/translate', async (req, res) => {
    const { q, langpair } = req.query;
    const endpoint = `https://api.mymemory.translated.net/get?q=${q}&langpair=${langpair}`;

    try {
        const apiResponse = await fetch(endpoint);
        const data = await apiResponse.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch translation' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
