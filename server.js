const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

const PEXELS_API_KEY = '4yHfWT4ezaTjLRkvUTzZLEawiGPtiKKZpepaX7zRKvqakYbRoOKZ4tda';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const searchUrl = `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=15`;

    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'Free-Image-Search/1.0'
      },
      timeout: 30000
    });

    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ error: 'API authentication failed' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }
      return res.status(response.status).json({ error: `API error: ${response.statusText}` });
    }

    const data = await response.json();
    res.set('Cache-Control', 'public, max-age=300');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.options('*', cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0');