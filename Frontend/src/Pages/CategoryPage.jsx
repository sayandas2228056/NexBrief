import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Newspaper, LoaderCircle, AlertTriangle, Bookmark, Share2 } from 'lucide-react';
import NewsCard from '../Components/NewsCard';
import Footer from '../Components/Footer';
import { useAuth } from '../context/AuthContext';
import Background from '../assets/Back.png';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const fetchNews = useCallback(async (pageNum, force = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${backendurl}/api/news/${categoryName}?page=${pageNum}${force ? '&force=true' : ''}`;
      const response = await axios.get(url);
      const { articles: fetchedArticles, totalPages: newTotalPages } = response.data;
      
      setArticles(prev => (pageNum === 1 || force) ? fetchedArticles : [...prev, ...fetchedArticles]);
      setTotalPages(newTotalPages);
      setPage(pageNum);
      
    } catch (err) {
      console.error(`Error fetching ${categoryName} news:`, err);
      setError(`Failed to load ${categoryName} news. Please check your connection or try again later.`);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews(1, true);
  };

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${backendurl}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarkedArticles(new Set(data.map(b => b.articleId)));
    } catch (error) {
      console.error('Failed to fetch bookmarks on category page:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      setPage(nextPage);
      fetchNews(nextPage);
    }
  };

  const toggleBookmark = useCallback(async (articleId, articleData) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const isBookmarked = bookmarkedArticles.has(articleId);

    try {
      if (isBookmarked) {
        // Find the bookmark ID to delete it
        const { data: bookmarks } = await axios.get(`${backendurl}/api/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const bookmarkToDelete = bookmarks.find(b => b.articleId === articleId);
        if (bookmarkToDelete) {
            await axios.delete(`${backendurl}/api/bookmarks/${bookmarkToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        setBookmarkedArticles(prev => {
            const newSet = new Set(prev);
            newSet.delete(articleId);
            return newSet;
        });
      } else {
        // Add a new bookmark
        await axios.post(`${backendurl}/api/bookmarks`, articleData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarkedArticles(prev => new Set(prev).add(articleId));
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
      // Optionally, show a user-facing error message
    }
  }, [user, bookmarkedArticles, navigate]);

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
                  <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-white tracking-wide">
                      {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                    </h1>
                    <p className="text-white/60 text-sm mt-1">Latest updates in this category</p>
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

          <div className="space-y-6">
            {articles.map((article, index) => (
              <div 
                key={article.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in"
              >
                <NewsCard 
                  article={article} 
                  onBookmark={toggleBookmark} 
                  isBookmarked={bookmarkedArticles.has(article.id)}
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
          
          {!loading && page < totalPages && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-white/12 backdrop-blur-sm text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20"
              >
                Load More
              </button>
            </div>
          )}

          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12 inline-block">
                <div className="w-16 h-16 bg-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Newspaper size={32} className="text-white/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2 tracking-wide">No articles found</h3>
                <p className="text-white/60">Check back later for updates in this category</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage; 