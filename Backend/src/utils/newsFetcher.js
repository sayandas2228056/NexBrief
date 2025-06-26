const axios = require('axios');
const NewsCache = require('../models/NewsCache');

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

async function getNews(query, page = 1, forceRefresh = false) {
  const key = `${query}_page_${page}`;
  const existing = await NewsCache.findOne({ key });

  const now = Date.now();

  if (!forceRefresh && existing && (now - new Date(existing.timestamp).getTime()) < CACHE_DURATION) {
    console.log(`✅ Serving '${key}' from MongoDB cache`);
    return existing.data;
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
  const response = await axios.get(url);
  const data = response.data;

  // Upsert to MongoDB
  await NewsCache.findOneAndUpdate(
    { key },
    { data, timestamp: new Date() },
    { upsert: true }
  );

  console.log(`📝 Fetched & cached '${key}' from NewsAPI`);
  return data;
}

module.exports = getNews; 