import React from 'react';
import { TrendingUp, LoaderCircle, AlertTriangle } from 'lucide-react';
import NewsCard from '../Components/NewsCard';
import Footer from '../Components/Footer';
import Background from '../assets/Back.png';
import { useNews } from '../context/useNews';

const TrendingPage = () => {
  const { 
    articles, 
    loading, 
    error, 
    page, 
    totalPages, 
    bookmarksMap, 
    fetchNews, 
    toggleBookmark 
  } = useNews('');

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchNews(page + 1);
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
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-white tracking-wide">Trending News</h1>
                  <p className="text-white/60 text-sm mt-1">Most popular stories right now</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-500/20 backdrop-blur-sm text-red-300 p-4 rounded-xl border border-red-500/20 mt-6">
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
                  <TrendingUp size={32} className="text-white/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2 tracking-wide">No trending news</h3>
                <p className="text-white/60">Check back later for trending stories</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrendingPage; 