import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Share2, Clock, Trash2 } from 'lucide-react';
import { fetchAISummary } from '../Pages/Summary';

const NewsCard = ({ article, onBookmark, isBookmarked, onRemoveBookmark }) => {
  const [showShareMessage, setShowShareMessage] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.summary,
      url: article.sourceUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(article.sourceUrl);
        setShowShareMessage(true);
        setTimeout(() => setShowShareMessage(false), 2000);
      }
    } catch (err) {
      console.error("Share/Copy failed:", err);
    }
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark(article.id, article);
  };

  const handleAISummaryClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingSummary(true);
    const response = await fetchAISummary(
      article.sourceUrl,
      'en',
      article.title,
      article.summary
    );
    setAiSummary(response.summary || 'No summary available.');
    setLoadingSummary(false);
    setShowFullSummary(true);
  };

  return (
    <Link 
      to={`/article/${article.id}`}
      state={{ article }}
      className="group block bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 hover:border-white/20 transition-all duration-500 ease-out overflow-hidden"
    >
      <div className="relative">
        <img
          src={imgError ? '/placeholder.png' : (article.imageUrl || '/placeholder.png')}
          alt={article.title}
          className="w-full h-48 object-cover transition-all duration-500 ease-out group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
            <Clock size={12} strokeWidth={1.5} />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-semibold text-white mb-3 leading-tight tracking-wide group-hover:text-white/90 transition-colors duration-300">
          {article.title}
        </h2>

        <p className="text-white/70 text-sm mb-6 leading-relaxed whitespace-pre-line max-h-none overflow-visible">
          {showFullSummary
            ? (aiSummary || article.summary || "No summary available.")
            : (article.summary?.length > 1200
                ? article.summary.slice(0, 1200) + "..."
                : article.summary || "No summary available.")
          }
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            {article.summary?.length > 1200 && (
              <button
                className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-300"
                onClick={e => {
                  e.stopPropagation();
                  setShowFullSummary(prev => !prev);
                }}
              >
                {showFullSummary ? 'Show less' : 'Read more →'}
              </button>
            )}

            <button
              className="bg-white/12 backdrop-blur-sm text-white px-4 py-2 text-xs font-medium rounded-xl hover:bg-white/16 transition-all duration-300 ease-out border border-white/10 hover:border-white/20"
              onClick={handleAISummaryClick}
              disabled={loadingSummary}
            >
              {loadingSummary ? 'Summarizing...' : 'AI Summary'}
            </button>
          </div>

          <div className="flex items-center gap-3 relative">
            {isBookmarked && onRemoveBookmark ? (
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveBookmark(article);
                }}
                className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-white/8"
                aria-label="Remove bookmark"
                title="Remove Bookmark"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            ) : (
              <button 
                onClick={handleBookmarkClick}
                className="text-white/60 hover:text-white transition-all duration-300 ease-out p-2 rounded-xl hover:bg-white/8"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark size={18} strokeWidth={1.5} className={isBookmarked ? 'fill-current text-white' : ''} />
              </button>
            )}

            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShare();
              }}
              className="text-white/60 hover:text-white transition-all duration-300 ease-out p-2 rounded-xl hover:bg-white/8"
              aria-label="Share article"
            >
              <Share2 size={18} strokeWidth={1.5} />
            </button>

            {showShareMessage && (
              <div className="absolute bottom-full -right-2 mb-3 bg-black/80 backdrop-blur-sm text-white text-xs rounded-xl py-2 px-3 shadow-2xl border border-white/10">
                Link copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard; 