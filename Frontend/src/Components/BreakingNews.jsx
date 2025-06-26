import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ExternalLink, LoaderCircle } from 'lucide-react';

const BreakingNews = ({ breakingNews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 mb-8 border border-white/12">
        <div className="flex items-center justify-center gap-3 text-white/90">
          <LoaderCircle className="w-5 h-5 animate-spin" strokeWidth={1.5} />
          <span className="font-medium text-lg tracking-wide">Loading Breaking News...</span>
        </div>
      </div>
    );
  }

  if (!breakingNews || breakingNews.length === 0) {
    return (
      <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 mb-8 border border-white/12">
        <div className="flex items-center justify-center gap-3 text-white/70">
          <Flame className="w-5 h-5" strokeWidth={1.5} />
          <span className="font-medium text-lg tracking-wide">No breaking news available right now.</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-2xl text-white rounded-2xl p-8 mb-8 border border-red-500/20">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Flame className="w-4 h-4 text-red-400" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-lg tracking-wide">BREAKING NEWS</span>
        </div>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>
      
      <div className="space-y-4">
        {breakingNews.slice(0, 2).map((news) => (
          <div key={news.id || news.sourceUrl} className="group bg-white/8 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/12 transition-all duration-500 ease-out border border-white/8 hover:border-white/12">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-3 flex-shrink-0 animate-pulse"></div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-3 leading-tight tracking-wide group-hover:text-white transition-colors duration-300">
                  {news.title}
                </h3>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {news.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-medium">
                    {formatDate(news.publishedAt)}
                  </span>
                  <Link
                    to={`/article/${news.id}`}
                    state={{ article: news }}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 text-sm font-medium group/link"
                  >
                    <span>Read AI Summary</span>
                    <ExternalLink size={14} strokeWidth={1.5} className="group-hover/link:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreakingNews; 