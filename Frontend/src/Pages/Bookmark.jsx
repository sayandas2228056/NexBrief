import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../Components/NewsCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, Bookmark as BookmarkIcon, Trash2, Share2, ExternalLink } from 'lucide-react';
import Background from '../assets/Back.png';
import Footer from '../Components/Footer';
import { toast } from 'react-hot-toast';

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const backendurl=import.meta.env.VITE_BACKEND_URL;
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
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (article) => {
    try {
      await axios.delete(`${backendurl}/api/bookmarks/${article._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(b => b._id !== article._id));
      toast.success('Bookmark removed!');
    } catch (error) {
      console.error('Failed to remove bookmark', error);
      toast.error('Failed to remove bookmark.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12">
          <div className="flex items-center gap-4 text-white/90">
            <Loader2 className="w-6 h-6 animate-spin" strokeWidth={1.5} />
            <span className="font-medium text-lg tracking-wide">Loading bookmarks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <img src={Background} alt="Background" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-black/80"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
          <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8 mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
                <BookmarkIcon size={24} className="text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white tracking-wide">My Bookmarks</h1>
                <p className="text-white/60 text-sm mt-1">Your saved articles</p>
              </div>
            </div>
            
            {bookmarks.length > 0 ? (
              <div className="space-y-6">
                {bookmarks.map((bookmark, index) => (
                  <div 
                    key={bookmark._id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in"
                  >
                    <NewsCard 
                      article={bookmark}
                      onRemoveBookmark={handleRemoveBookmark}
                      isBookmarked={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookmarkIcon size={32} className="text-white/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2 tracking-wide">No bookmarks yet</h3>
                <p className="text-white/60">Start saving articles to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookmarkPage;
