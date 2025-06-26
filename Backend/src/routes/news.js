const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const GNEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';
const PAGE_SIZE = 10;

let breakingNewsCache = null;
let breakingNewsCacheTime = 0;
const BREAKING_NEWS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper to fetch news from GNews
async function fetchGNews({ endpoint, params }) {
  if (!GNEWS_API_KEY) {
    throw new Error('GNews API key is missing');
  }
  const url = `${GNEWS_BASE_URL}${endpoint}`;
  const response = await axios.get(url, {
    params: { ...params, token: GNEWS_API_KEY, lang: 'en', max: PAGE_SIZE },
  });
  return response.data;
}

// --- Breaking News Route ---
router.get('/breaking', async (req, res) => {
  const now = Date.now();
  if (breakingNewsCache && (now - breakingNewsCacheTime < BREAKING_NEWS_CACHE_DURATION)) {
    return res.json(breakingNewsCache);
  }
  try {
    const data = await fetchGNews({
      endpoint: '/top-headlines',
      params: { topic: 'breaking-news' },
    });
    const articles = (data.articles || []).map(article => ({
      title: article.title,
      summary: article.description || 'No summary available.',
      imageUrl: article.image,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      id: Buffer.from(article.url).toString('base64'),
    }));
    breakingNewsCache = articles;
    breakingNewsCacheTime = now;
    res.json(articles);
  } catch (error) {
    console.error('❌ Breaking News Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch breaking news.' });
  }
});

// --- Main Route for General News ---
router.get('/', async (req, res) => {
  try {
    const data = await fetchGNews({
      endpoint: '/top-headlines',
      params: {},
    });
    const articles = (data.articles || []).map(article => ({
      title: article.title,
      summary: article.description || 'No summary available.',
      imageUrl: article.image,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      id: Buffer.from(article.url).toString('base64'),
    }));
    res.json({
      articles,
      totalPages: 1,
      currentPage: 1,
    });
  } catch (error) {
    console.error('❌ News Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// --- Dynamic Category Route ---
router.get('/:category', async (req, res) => {
  const category = req.params.category;
  try {
    const data = await fetchGNews({
      endpoint: '/top-headlines',
      params: { topic: category },
    });
    const articles = (data.articles || []).map(article => ({
      title: article.title,
      summary: article.description || 'No summary available.',
      imageUrl: article.image,
      sourceUrl: article.url,
      publishedAt: article.publishedAt,
      id: Buffer.from(article.url).toString('base64'),
    }));
    res.json({
      articles,
      totalPages: 1,
      currentPage: 1,
    });
  } catch (error) {
    console.error(`❌ News Fetch Error for category ${category}:`, error.message);
    res.status(500).json({ error: `Failed to fetch ${category} news.` });
  }
});

module.exports = router; 
