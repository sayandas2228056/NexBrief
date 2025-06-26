import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import config from '../config/config';

export const useNews = (endpoint) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarksMap, setBookmarksMap] = useState(new Map());
  const { token } = useAuth();

  const fetchNews = useCallback(async (pageNum, force = false) => {
    setLoading(true);
    if (pageNum === 1) setArticles([]);
    try {
      const newsUrl = config.getApiUrl(`${config.API_ENDPOINTS.NEWS.GET}${endpoint}`);
      if (!newsUrl) {
        throw new Error('Backend URL not configured');
      }
      
      const url = `${newsUrl}?page=${pageNum}${force ? '&force=true' : ''}`;
      const response = await axios.get(url);
      const { articles: newArticles, totalPages: newTotalPages } = response.data;
      setArticles(prev => (pageNum === 1 ? newArticles : [...prev, ...newArticles]));
      setTotalPages(newTotalPages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const fetchBookmarks = useCallback(async () => {
    if (!token) return;
    try {
      const bookmarksUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.GET);
      if (!bookmarksUrl) {
        throw new Error('Backend URL not configured');
      }
      
      const response = await axios.get(bookmarksUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newMap = new Map(response.data.map(b => [b.sourceUrl, b._id]));
      setBookmarksMap(newMap);
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
    }
  }, [token]);

  const toggleBookmark = async (article) => {
    if (!token) return;
    const isBookmarked = bookmarksMap.has(article.sourceUrl);
    try {
      if (isBookmarked) {
        const bookmarkId = bookmarksMap.get(article.sourceUrl);
        const deleteUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.DELETE(bookmarkId));
        if (!deleteUrl) {
          throw new Error('Backend URL not configured');
        }
        
        await axios.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarksMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(article.sourceUrl);
          return newMap;
        });
      } else {
        const createUrl = config.getApiUrl(config.API_ENDPOINTS.BOOKMARKS.CREATE);
        if (!createUrl) {
          throw new Error('Backend URL not configured');
        }
        
        const response = await axios.post(createUrl, article, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newBookmark = response.data;
        setBookmarksMap(prev => new Map(prev).set(newBookmark.sourceUrl, newBookmark._id));
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  useEffect(() => {
    fetchNews(1);
    fetchBookmarks();
  }, [fetchNews, fetchBookmarks]);

  return { 
    articles, 
    loading, 
    error, 
    page, 
    totalPages, 
    bookmarksMap, 
    fetchNews, 
    toggleBookmark 
  };
}; 