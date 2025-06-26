import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import NewsCard from '../Components/NewsCard';
import Sidebar from '../Components/Sidebar';
import BreakingNews from '../Components/BreakingNews';
import Footer from '../Components/Footer';
import { Loader2 } from 'lucide-react';
import Background from '../assets/Back.png'
import { useAuth } from '../context/AuthContext';
import config from '../config/config';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [loadingBreaking, setLoadingBreaking] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [bookmarksMap, setBookmarksMap] = useState(new Map());

  // Check if backend URL is configured
  if (!config.isValidBackendUrl()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12 text-center">
          <p className="text-white/80 font-medium">Backend URL not configured. Please check your environment variables.</p>
          <p className="text-white/60 text-sm mt-2">Set VITE_BACKEND_URL in your environment</p>
        </div>
      </div>
    );
  }

  const fetchNews = async (pageNum, force = false) => {
    try {
      const newsUrl = config.getApiUrl(config.API_ENDPOINTS.NEWS.GET);
      const url = `${newsUrl}?page=${pageNum}${force ? '&force=true' : ''}`;
      const response = await axios.get(url);
      const { articles, totalPages: total } = response.data;
      setNews(prevNews => (pageNum === 1 || force) ? articles : [...prevNews, ...articles]);
      setTotalPages(total);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    }
  };

  const fetchBreakingNews = async (force = false) => {
    setLoadingBreaking(true);
    try {
      const breakingUrl = config.getApiUrl(config.API_ENDPOINTS.NEWS.BREAKING);
      const url = `${breakingUrl}${force ? '?force=true' : ''}`;
      const response = await axios.get(url);
      setBreakingNews(response.data);
    } catch (err) {
      console.error('Error fetching breaking news:', err);
      setBreakingNews([]); // Reset on error
    } finally {
      setLoadingBreaking(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!token) {
      setBookmarksMap(new Map());
      return;
    }
    try {
      const bookmarksUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.GET);
      const response = await axios.get(bookmarksUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newMap = new Map(response.data.map(b => [b.sourceUrl, b._id]));
      setBookmarksMap(newMap);
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await Promise.all([
        fetchNews(1),
        fetchBreakingNews(),
        fetchBookmarks()
      ]);
      setLoading(false);
    };
    initialFetch();
  }, [token]);

  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchNews(1, true),
      fetchBreakingNews(true)
    ]);
    setLoading(false);
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      setLoadingMore(true);
      await fetchNews(page + 1);
      setLoadingMore(false);
    }
  };
  
  const handleBookmark = async (article) => {
    if (!token) {
      toast.error('Please log in to bookmark articles.');
      return;
    }
    try {
      const bookmarksUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.CREATE);
      const response = await axios.post(bookmarksUrl, article, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newBookmark = response.data;
      setBookmarksMap(prev => new Map(prev).set(newBookmark.sourceUrl, newBookmark._id));
      toast.success('Article bookmarked!');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('You have already bookmarked this article.');
      } else {
        toast.error('Failed to bookmark article.');
      }
    }
  };

  const handleRemoveBookmark = async (article) => {
    if (!token) return;
    const bookmarkId = bookmarksMap.get(article.sourceUrl);
    if (!bookmarkId) return;

    try {
      const deleteUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.DELETE(bookmarkId));
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarksMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(article.sourceUrl);
        return newMap;
      });
      toast.success('Bookmark removed!');
    } catch (error) {
      console.error('Failed to remove bookmark', error);
      toast.error('Failed to remove bookmark.');
    }
  };

  const toggleBookmark = async (articleId, article) => {
    if (!token) {
      toast.error('Please log in to bookmark articles.');
      return;
    }
    const isBookmarked = bookmarksMap.has(article.sourceUrl);
    if (isBookmarked) {
      await handleRemoveBookmark(article);
    } else {
      await handleBookmark(article);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12">
          <div className="flex items-center gap-4 text-white/90">
            <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} />
            <span className="font-medium text-lg tracking-wide">Loading latest news...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12 text-center">
          <p className="text-white/80 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-black'>
 

    <div className="relative min-h-screen flex flex-col">
      <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/80"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-24 flex-1 flex flex-col">
          <BreakingNews breakingNews={breakingNews || []} isLoading={loadingBreaking} />
          
          <div className="flex flex-col lg:flex-row gap-8 flex-1">
            <div className="flex-1 flex flex-col">
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-semibold text-white tracking-wide">Latest News</h1>
                    <p className="text-white/60 text-sm mt-1">Stay updated with the latest stories</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="bg-white/12 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 flex items-center gap-2"
                  >
                    <Loader2 size={18} strokeWidth={1.5} />
                    Refresh Feed
                  </button>
                </div>
                
                {news && news.length > 0 ? (
                  <div className="space-y-6 flex-1">
                    {news.map((article, index) => {
                      const isBookmarked = bookmarksMap.has(article.sourceUrl);
                      return (
                        <div 
                          key={article.id || article.sourceUrl}
                          style={{ animationDelay: `${index * 100}ms` }}
                          className="animate-fade-in"
                        >
                          <NewsCard 
                            article={article} 
                            onBookmark={toggleBookmark}
                            isBookmarked={isBookmarked}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 flex-1 flex items-center justify-center">
                    <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-8 border border-white/10 inline-block">
                      <p className="text-white/60 font-medium">No news articles are available at the moment. Please try again later.</p>
                    </div>
                  </div>
                )}
                
                {page < totalPages && (
                  <div className="text-center mt-8">
                    <button 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-white/12 backdrop-blur-sm text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" strokeWidth={1.5} />
                          Loading...
                        </>
                      ) : (
                        'Load More Articles'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-80">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
     
    </div>
    <Footer />
    </div>
  );
};

export default HomePage;
