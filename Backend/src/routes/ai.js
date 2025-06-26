const express = require('express');
const router = express.Router();
const axios = require('axios');
const { extract } = require('@extractus/article-extractor');

const TOGETHER_API_KEY = process.env.TOGETHER_API; // Set this in your .env
// Use a serverless model that's readily available
const TOGETHER_MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo'; // Current serverless model

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

router.post('/summary', async (req, res) => {
  const { url, lang = 'en', title = '', summary = '' } = req.body;
  if (!url && !title && !summary) {
    return res.status(400).json({ error: 'URL or text is required' });
  }

  let text = '';
  let fullArticle = '';
  if (url) {
    try {
      const article = await extract(url);
      fullArticle = stripHtml(article?.content || article?.text || article?.title || '');
      text = fullArticle;
    } catch (err) {
      console.warn('Extraction failed, falling back to summary/title.');
      return res.json({ error: 'EXTRACTION_FAILED' });
    }
  }
  if (!text) {
    text = stripHtml(summary || title || 'No content available.');
    fullArticle = text;
  }

  // If still no text, return a fallback summary
  if (!text) {
    return res.json({ summary: 'No summary available.', fullArticle: '' });
  }

  // Try Together AI with proper error handling
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: TOGETHER_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes news articles. Provide concise summaries under 100 words in ${lang === 'en' ? 'English' : lang} language.`
          },
          {
            role: 'user',
            content: `Please summarize this news article in 2-4 lines: ${text.substring(0, 2000)}` // Limit input length
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const aiSummary = response.data.choices?.[0]?.message?.content?.trim();
    if (aiSummary) {
      return res.json({ summary: aiSummary, fullArticle });
    }
    // If AI returns nothing, fallback
    return res.json({ summary: text.substring(0, 300) + '...', fullArticle });
  } catch (error) {
    // Enhanced error logging
    console.error('AI Summary error:', {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      message: error.message
    });
    
    // Check for specific error types
    if (error?.response?.status === 401) {
      console.error('Authentication failed - check your TOGETHER_API key');
    } else if (error?.response?.status === 429) {
      console.error('Rate limit exceeded');
    } else if (error?.response?.data?.error?.code === 'model_not_available') {
      console.error('Model not available - trying alternative approach');
    }
    
    // Fallback: return the extracted or provided text as a summary
    const fallbackSummary = text.length > 300 ? text.substring(0, 300) + '...' : text;
    return res.json({ 
      summary: fallbackSummary, 
      fullArticle,
      note: 'AI summarization temporarily unavailable, showing extracted content'
    });
  }
});

module.exports = router;