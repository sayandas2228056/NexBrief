import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';
import { Bookmark, Share2, ExternalLink, Loader2, Clock, Sparkles, Trash2 } from 'lucide-react';
import Background from '../assets/Back.png';

// Remove hardcoded API key - you should set this in environment variables
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API || '';
const backendurl = import.meta.env.VITE_BACKEND_URL;

export const fetchAISummary = async (url, lang = 'en', title = '', summary = '') => {
  try {
    const response = await fetch(`${backendurl}/api/ai/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, lang, title, summary }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Return the full response object
  } catch (error) {
    console.error('Failed to fetch AI summary:', error);
    return { error: 'Failed to fetch summary.' };
  }
};

const getSource = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'Unknown Source';
  }
};

const Summary = () => {
  const { token, isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customSummary, setCustomSummary] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [lang] = useState('en');
  const [shareMsg, setShareMsg] = useState('');

  // Utility function for formatting dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(response.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleSummarize = async (article) => {
    setSummaries(prev => ({ ...prev, [article._id]: 'Loading summary...' }));
    
    try {
      const response = await fetchAISummary(article.sourceUrl, lang, article.title, article.summary);
      
      if (response.error) {
        setSummaries(prev => ({ 
          ...prev, 
          [article._id]: response.error === 'EXTRACTION_FAILED' 
            ? 'Could not extract article content. Please try the original link.' 
            : 'Failed to generate summary. Please try again.' 
        }));
        return;
      }
      
      const summary = response.summary || 'No summary available.';
      setSummaries(prev => ({ ...prev, [article._id]: summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaries(prev => ({ 
        ...prev, 
        [article._id]: 'Error generating summary. Please try again.' 
      }));
    }
  };

  const handleCustomSummarize = async () => {
    setCustomLoading(true);
    setCustomSummary('');
    
    try {
      // Detect if input is a URL
      const isUrl = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/\S*)?$/.test(customText.trim());
      let requestBody;
      
      if (isUrl) {
        // For URLs, send url parameter
        requestBody = { 
          url: customText.trim().startsWith('http') ? customText.trim() : `https://${customText.trim()}`, 
          lang 
        };
      } else {
        // For direct text, send as summary parameter (backend will use it as fallback text)
        requestBody = { 
          summary: customText.trim(), 
          lang 
        };
      }
      
      const response = await fetch(`${backendurl}/api/ai/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      if (data.error && data.error === 'EXTRACTION_FAILED') {
        setCustomSummary('Failed to extract article from the URL. Please paste the article text instead.');
      } else {
        setCustomSummary(data.summary || 'No summary available.');
      }
    } catch (error) {
      console.error('Summary request failed:', error);
      setCustomSummary('Failed to generate summary. Please try again.');
    }
    
    setCustomLoading(false);
  };

  const handleBookmark = async (article) => {
    if (!isAuthenticated) {
      setShareMsg('Please log in to bookmark.');
      setTimeout(() => setShareMsg(''), 2000);
      return;
    }
    try {
      await axios.post(`${backendurl}/api/bookmarks`, article, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShareMsg('Bookmarked!');
      setTimeout(() => setShareMsg(''), 2000);
      fetchBookmarks();
    } catch {
      setShareMsg('Already bookmarked or error.');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  // Remove bookmark handler
  const handleRemoveBookmark = async (article) => {
    try {
      await axios.delete(`${backendurl}/api/bookmarks/${article._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(b => b._id !== article._id));
      setShareMsg('Bookmark removed!');
      setTimeout(() => setShareMsg(''), 2000);
    } catch {
      setShareMsg('Failed to remove bookmark.');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  const handleShare = async (url) => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg('Link copied!');
        setTimeout(() => setShareMsg(''), 2000);
      }
    } catch {
      setShareMsg('Share failed.');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div className="relative min-h-screen">
      <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/80"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-24 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8 mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white tracking-wide">News Summaries</h1>
                <p className="text-white/60 text-sm mt-1">AI-powered article summaries</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">Custom News Summary</h2>
              <div className="flex flex-col gap-4 mb-4">
                <textarea
                  className="w-full p-4 rounded-xl bg-white/8 backdrop-blur-sm text-white border border-white/10 focus:border-white/20 transition-all duration-300 resize-none"
                  rows={4}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="Paste or type a news article or URL here..."
                />
              </div>
              <button
                className="bg-white/12 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50"
                onClick={handleCustomSummarize}
                disabled={customLoading || !customText.trim()}
              >
                {customLoading ? 'Summarizing...' : 'Summarize'}
              </button>
              {customSummary && (
                <div className="mt-6 p-6 bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10">
                  <h3 className="font-semibold mb-3 text-lg text-white tracking-wide">Summary:</h3>
                  <p className="text-white/80 text-base leading-relaxed whitespace-pre-line break-words">{customSummary}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8">
            <h2 className="text-xl font-semibold mb-6 text-white tracking-wide">Bookmarked News Summaries</h2>
            {loading ? (
              <div className="flex items-center gap-3 text-white/90">
                <Loader2 className="animate-spin" strokeWidth={1.5} /> 
                <span className="font-medium">Loading bookmarks...</span>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bookmark size={32} className="text-white/40" strokeWidth={1.5} />
                </div>
                <p className="text-white/60 font-medium">No bookmarks found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bookmarks.map(article => (
                  <div key={article._id} className="bg-white/8 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                    {/* Image Section with Date Overlay */}
                    <div className="relative">
                      <img
                        src={article.imageUrl || '/placeholder.png'}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <div className="flex items-center gap-2 text-xs text-white font-medium">
                          <Clock size={12} strokeWidth={1.5} />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Container */}
                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {/* Source and Link */}
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <span className="font-medium">{getSource(article.sourceUrl)}</span>
                        <a 
                          href={article.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                        >
                          <ExternalLink size={12} strokeWidth={1.5} /> 
                          Original
                        </a>
                      </div>
                      
                      {/* Summary Container - Fixed Width and Height */}
                      <div className="w-full">
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-32 overflow-y-auto">
                          {summaries[article._id] === 'Loading summary...' ? (
                            <div className="flex items-center gap-2 text-white/60">
                              <Loader2 className="animate-spin h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
                              <span className="text-sm">Loading summary...</span>
                            </div>
                          ) : (
                            <div className="text-white/80 text-sm leading-relaxed">
                              <p className="break-words hyphens-auto overflow-wrap-anywhere">
                                {summaries[article._id] || article.summary}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20 disabled:opacity-50 text-sm"
                          onClick={() => handleSummarize(article)}
                          disabled={summaries[article._id] === 'Loading summary...'}
                        >
                          {summaries[article._id] === 'Loading summary...' ? 'Summarizing...' : 'Summarize'}
                        </button>
                        
                        <div className="flex items-center gap-1">
                          <button
                            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                            onClick={() => handleBookmark(article)}
                            title="Bookmark"
                          >
                            <Bookmark size={18} strokeWidth={1.5} />
                          </button>
                          <button
                            className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                            onClick={() => handleShare(article.sourceUrl)}
                            title="Share"
                          >
                            <Share2 size={18} strokeWidth={1.5} />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-white/5"
                            onClick={() => handleRemoveBookmark(article)}
                            title="Remove Bookmark"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {shareMsg && (
              <div className="mt-4 text-center text-white/80 font-medium">{shareMsg}</div>
            )}
          </div>
        </div>
        <div className="lg:w-80">
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Summary;