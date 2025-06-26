import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Clock, Calendar, Copy } from 'lucide-react';
import Background from '../assets/Back.png'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Footer from '../Components/Footer';

// Import the AI summary function from Summary page
import { fetchAISummary } from './Summary';

const ArticlePage = () => {
  const location = useLocation();
  const article = location.state?.article;
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const { token, isAuthenticated } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCustomSummary, setShowCustomSummary] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  if (!article) {
    return (
      <div className="relative min-h-screen">
        <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
        <div className="fixed inset-0 bg-black/80"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/8 backdrop-blur-2xl p-8 rounded-2xl border border-white/12 text-center">
            <h1 className="text-2xl font-semibold text-white mb-4 tracking-wide">Article not found</h1>
            <p className="text-white/70 mb-6 leading-relaxed">
              The article you are looking for is not available. This can happen if you navigate to the URL directly.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out hover:bg-white/16 border border-white/10 hover:border-white/20"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch AI summary on demand
  const handleFetchSummary = async () => {
    setLoadingSummary(true);
    setShowCustomSummary(false);
    setCustomSummary('');
    setCustomText('');
    const result = await fetchAISummary(
      article.sourceUrl,
      'en',
      article.title,
      article.summary
    );
    if (result.error) {
      if (result.error === 'EXTRACTION_FAILED') {
        setAiSummary('Failed to extract article content. Please paste the article text below to get a summary.');
        setShowCustomSummary(true);
      } else {
        setAiSummary(result.error || 'Failed to generate summary.');
      }
    } else {
      setAiSummary(result.summary || 'No summary available.');
    }
    setLoadingSummary(false);
  };

  // Copy article URL
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(article.sourceUrl);
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 1500);
  };

  // Replace handleBookmark with real logic:
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      setCopyMsg('Please log in to bookmark.');
      setTimeout(() => setCopyMsg(''), 2000);
      return;
    }
    try {
      await axios.post(`${backendurl}/api/bookmarks`, article, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsBookmarked(true);
      setCopyMsg('Bookmarked!');
      setTimeout(() => setCopyMsg(''), 2000);
    } catch {
      setCopyMsg('Already bookmarked or error.');
      setTimeout(() => setCopyMsg(''), 2000);
    }
  };

  // Dummy share handler
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: article.sourceUrl, title: article.title });
    } else {
      await handleCopyUrl();
    }
  };

  // Custom summary handler for pasted text
  const handleCustomSummarize = async () => {
    setCustomLoading(true);
    setCustomSummary('');
    const response = await fetch(`${backendurl}/api/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: customText, lang: 'en' }),
    });
    const data = await response.json();
    setCustomSummary(data.summary || 'No summary available.');
    setCustomLoading(false);
  };

  return (
    <div className="relative min-h-screen">
       <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/80"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 pt-24 flex flex-col lg:flex-row gap-8">
        {/* Left: Full Article */}
        <div className="flex-1">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all duration-300 ease-out group"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium tracking-wide">Back to News</span>
          </Link>
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 overflow-hidden">
            {article.imageUrl && (
              <div className="relative h-96">
                <img
                  src={article.imageUrl || '/placeholder.png'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}
            
            <div className="p-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight tracking-wide">
                {article.title}
              </h1>

              {/* AI Summary Button (main section) */}
              <div className="mb-8">
                <button
                  className="bg-white/12 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50"
                  onClick={handleFetchSummary}
                  disabled={loadingSummary}
                >
                  {loadingSummary ? 'Summarizing...' : 'AI Summary'}
                </button>
                {aiSummary && (
                  <div className="bg-white/8 backdrop-blur-sm p-6 rounded-2xl text-white/90 whitespace-pre-line mt-4 border border-white/10">
                    {aiSummary}
                  </div>
                )}
                {/* Fallback for manual text input if extraction fails */}
                {showCustomSummary && (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-4 rounded-xl bg-white/8 backdrop-blur-sm text-white border border-white/10 focus:border-white/20 transition-all duration-300 resize-none"
                      rows={4}
                      value={customText}
                      onChange={e => setCustomText(e.target.value)}
                      placeholder="Paste the article text here..."
                    />
                    <button
                      className="bg-white/12 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50 mt-2"
                      onClick={handleCustomSummarize}
                      disabled={customLoading || !customText.trim()}
                    >
                      {customLoading ? 'Summarizing...' : 'Summarize'}
                    </button>
                    {customSummary && (
                      <div className="mt-4 p-4 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 text-white/90">
                        {customSummary}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 text-white/60 mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar size={16} strokeWidth={1.5} />
                  <span className="text-sm font-medium">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={1.5} />
                  <span className="text-sm font-medium">
                    {new Date(article.publishedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out ${
                      isBookmarked 
                        ? 'bg-white/12 backdrop-blur-sm border border-white/10 text-white' 
                        : 'bg-white/12 backdrop-blur-sm border border-white/10 text-white hover:bg-white/16 hover:border-white/20'
                    }`}
                    onClick={handleBookmark}
                  >
                    <Bookmark size={18} strokeWidth={1.5} /> 
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button className="flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300 ease-out px-4 py-3 rounded-xl hover:bg-white/8">
                    <Share2 size={20} strokeWidth={1.5} />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
                <a 
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300"
                >
                  View Original Source
                </a>
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed">
                <p>{article.summary}</p>
                {/* NewsAPI free tier doesn't provide full content, so we display the summary/description as the main body. */}
              </div>
            </div>
          </div>
        </div>
        {/* Right: AI Summary & Actions */}
        <div className="lg:w-96 w-full flex flex-col gap-6">
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">AI Summary</h2>
            <button
              className="bg-white/12 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50 w-full mb-6"
              onClick={handleFetchSummary}
              disabled={loadingSummary}
            >
              {loadingSummary ? 'Summarizing...' : 'Get AI Summary'}
            </button>
            {aiSummary && (
              <div className="bg-white/8 backdrop-blur-sm p-4 rounded-xl text-white/90 whitespace-pre-line border border-white/10">
                {aiSummary}
              </div>
            )}
            {/* Fallback for manual text input if extraction fails (sidebar) */}
            {showCustomSummary && (
              <div className="mt-4">
                <textarea
                  className="w-full p-4 rounded-xl bg-white/8 backdrop-blur-sm text-white border border-white/10 focus:border-white/20 transition-all duration-300 resize-none"
                  rows={4}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Paste the article text here..."
                />
                <button
                  className="bg-white/12 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50 mt-2"
                  onClick={handleCustomSummarize}
                  disabled={customLoading || !customText.trim()}
                >
                  {customLoading ? 'Summarizing...' : 'Summarize'}
                </button>
                {customSummary && (
                  <div className="mt-4 p-4 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 text-white/90">
                    {customSummary}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-6 flex flex-col gap-4">
            <button
              className="flex items-center justify-center gap-2 bg-white/12 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20"
              onClick={handleShare}
            >
              <Share2 size={18} strokeWidth={1.5} /> Share
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-white/12 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20"
              onClick={handleCopyUrl}
            >
              <Copy size={18} strokeWidth={1.5} /> Copy URL
            </button>
            {copyMsg && (
              <div className="text-center text-white/80 font-medium mt-2">{copyMsg}</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArticlePage; 