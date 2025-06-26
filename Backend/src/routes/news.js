const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const cache = {};
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const getFromCache = (key) => {
  const cached = cache[key];
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
    console.log(`✅ Serving '${key}' from cache.`);
    return cached.data;
  }
  return null;
};

const setInCache = (key, data) => {
  console.log(`📝 Caching data for '${key}'.`);
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

// Reusable function to fetch news by category
const fetchNewsByCategory = async (req, res, category) => {
  const forceRefresh = req.query.force === 'true';
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const cacheKey = `category_${category}_page_${page}`;

  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
  }

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error(`❌ FATAL: NEWS_API_KEY is not defined. Cannot fetch news for category: ${category}.`);
    return res.status(500).json({ error: 'Server configuration error: Missing News API Key.' });
  }
  
  const url = `https://newsapi.org/v2/everything?q=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const { articles, totalResults } = response.data;
    
    console.log(`📰 Fetched ${articles.length} articles for category: "${category}", page: ${page}`);

    const formattedData = {
      articles: (articles || [])
        .filter(article => article.title && article.url)
        .map(article => ({
          title: article.title,
          summary: article.description || 'No summary available.',
          imageUrl: article.urlToImage,
          sourceUrl: article.url,
          publishedAt: article.publishedAt,
          id: Buffer.from(article.url).toString('base64')
        })),
      totalPages: Math.ceil(totalResults / pageSize),
      currentPage: page
    };

    setInCache(cacheKey, formattedData);
    res.json(formattedData);
  } catch (error) {
    console.error(`❌ NewsAPI Fetch Error for category ${category}:`, error.message);
    res.status(500).json({ error: `Failed to fetch ${category} news.` });
  }
};

// --- Breaking News Route ---
router.get('/breaking', async (req, res) => {
  const forceRefresh = req.query.force === 'true';
  const cacheKey = 'breaking_news';

  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing News API Key.' });
  }

  const url = `https://newsapi.org/v2/top-headlines?category=general&language=en&pageSize=5&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

    console.log(`🔥 Fetched ${articles.length} breaking news headlines.`);

    const formatted = (articles || [])
      .filter(article => article.title && article.url)
      .map(article => ({
        title: article.title,
        summary: article.description || 'No summary available.',
        imageUrl: article.urlToImage,
        sourceUrl: article.url,
        publishedAt: article.publishedAt,
        id: Buffer.from(article.url).toString('base64')
      }));
    
    setInCache(cacheKey, formatted);
    res.json(formatted);
  } catch (error) {
    console.error('❌ Breaking News Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch breaking news.' });
  }
});

// --- Main Route for General News ---
router.get('/', async (req, res) => {
  // For the main feed, we pick a random topic to make it more interesting
  const topics = [
    'cricket',
    'football',
    'india',
    'world politics',
    'geopolitics',
    'science',
    'technology',
    'bollywood',
    'hollywood',
    'business',
    'health',
    'startups',
  
    // 🔍 New Additions:
    'space exploration',
    'artificial intelligence',
    'cybersecurity',
    'education',
    'environment',
    'climate change',
    'economy',
    'stock market',
    'mental health',
    'gaming',
    'elections',
    'global conflicts',
    'travel',
    'lifestyle',
    'fashion',
    'music',
    'internet culture',
    'metaverse',
    'NFTs',
    'cryptocurrency',
    'women in tech',
    'innovation',
    'social justice',
    'human rights',
    'wildlife conservation',
    'ocean and marine life',
    'agriculture and food tech'
  ];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const forceRefresh = req.query.force === 'true';
  
  const cacheKey = `main_${randomTopic}_page_${page}`;
  
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
  }

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error('❌ FATAL: NEWS_API_KEY is not defined in your .env file. The server cannot fetch news.');
    return res.status(500).json({ error: 'Server configuration error: Missing News API Key.' });
  }

  const url = `https://newsapi.org/v2/everything?q=${randomTopic}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);
    const { articles, totalResults } = response.data;
    
    console.log(`📰 Fetched ${articles.length} articles from NewsAPI for query: "${randomTopic}", page: ${page}`);

    const formattedData = {
      articles: (articles || [])
        .filter(article => article.title && article.url)
        .map(article => ({
          title: article.title,
          summary: article.description || 'No summary available.',
          imageUrl: article.urlToImage,
          sourceUrl: article.url,
          publishedAt: article.publishedAt,
          id: Buffer.from(article.url).toString('base64')
        })),
      totalPages: Math.ceil(totalResults / pageSize),
      currentPage: page
    };

    setInCache(cacheKey, formattedData);
    res.json(formattedData);
  } catch (error) {
    console.error('❌ NewsAPI Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news from the provider.' });
  }
});

// --- Dynamic Category Route ---
router.get('/:category', (req, res) => {
  const { category } = req.params;
  
  // For specific, broader topics like 'geopolitics', you can map them to a list of more granular keywords
  const categoryKeywords = {
    geopolitics: [
      'russia ukraine war', 'israel palestine conflict', 'china taiwan tension', 
      'iran nuclear deal', 'south china sea dispute', 'us china relations',
      'north korea missile tests', 'nato expansion', 'india china border dispute',
      'brexit aftermath', 'us russia relations', 'sudan civil war'
    ],
    sports: [
      'cricket', 'football', 'basketball', 'tennis', 'formula 1', 'esports',
      'olympics', 'athletics', 'golf', 'mma'
    ],
    // Add other complex categories here
  };

  let finalQuery = category;
  if (categoryKeywords[category]) {
    const keywords = categoryKeywords[category];
    finalQuery = keywords[Math.floor(Math.random() * keywords.length)];
    console.log(`➡️ Mapped category '${category}' to random keyword: '${finalQuery}'`);
  }

  fetchNewsByCategory(req, res, finalQuery);
});

module.exports = router; 