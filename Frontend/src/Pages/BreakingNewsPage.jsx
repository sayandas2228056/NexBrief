import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Flame, LoaderCircle, AlertTriangle } from 'lucide-react';
import NewsCard from '../Components/NewsCard';
import Footer from '../Components/Footer';
import { useAuth } from '../context/AuthContext';
import Background from '../assets/Back.png';

const BreakingNewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [bookmarksMap, setBookmarksMap] = useState(new Map());
  const navigate = useNavigate();
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const fetchBreakingNews = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${backendurl}/api/news/breaking${force ? '?force=true' : ''}`;
      const response = await axios.get(url);
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching breaking news:', err);
      setError('Failed to load breaking news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendurl}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newMap = new Map(response.data.map(b => [b.sourceUrl, b._id]));
      setBookmarksMap(newMap);
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
    }
  }, [token]);

  useEffect(() => {
    fetchBreakingNews();
    fetchBookmarks();
  }, [fetchBreakingNews, fetchBookmarks]);

  const handleRefresh = () => {
    fetchBreakingNews(true);
  };

  const toggleBookmark = async (article) => {
    if (!token) {
      navigate('/login');
      return;
    }
    const isBookmarked = bookmarksMap.has(article.sourceUrl);
    try {
      if (isBookmarked) {
        const bookmarkId = bookmarksMap.get(article.sourceUrl);
        await axios.delete(`${backendurl}/api/bookmarks/${bookmarkId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarksMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(article.sourceUrl);
          return newMap;
        });
      } else {
        const response = await axios.post(`${backendurl}/api/bookmarks`, article, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newBookmark = response.data;
        setBookmarksMap(prev => new Map(prev).set(newBookmark.sourceUrl, newBookmark._id));
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/80"></div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mt-10 mb-8">
            <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <Flame className="h-6 w-6 text-red-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-white tracking-wide">Breaking News</h1>
                    <p className="text-white/60 text-sm mt-1">Latest urgent updates</p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="bg-white/12 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 flex items-center gap-2"
                >
                  <LoaderCircle size={18} strokeWidth={1.5} />
                  Refresh News
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-500/20 backdrop-blur-sm text-red-300 p-4 rounded-xl border border-red-500/20">
                  <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articles.map((article, index) => (
              <div 
                key={article.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in"
              >
                <NewsCard 
                  article={article} 
                  onBookmark={() => toggleBookmark(article)} 
                  isBookmarked={bookmarksMap.has(article.sourceUrl)}
                />
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center items-center mt-12">
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12">
                <div className="flex items-center gap-4 text-white/90">
                  <LoaderCircle className="w-8 h-8 animate-spin" strokeWidth={1.5} />
                  <span className="font-medium text-lg tracking-wide">Loading news...</span>
                </div>
              </div>
            </div>
          )}
          
          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12 inline-block">
                <div className="w-16 h-16 bg-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Flame size={32} className="text-white/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2 tracking-wide">No breaking news</h3>
                <p className="text-white/60">Check back later for updates</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BreakingNewsPage; 