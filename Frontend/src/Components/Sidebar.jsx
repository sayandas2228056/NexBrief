import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Bookmark, Hash, Flame } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const trendingTopics = [
    'Technology', 'Politics', 'Sports', 'Entertainment', 'Business', 'Health'
  ];

  const quickLinks = [
    { name: 'Breaking News', icon: Flame, color: 'text-red-400', path: '/breaking-news' },
    { name: 'My Bookmarks', icon: Bookmark, color: 'text-blue-400', path: '/bookmark' },
    { name: 'Trending', icon: TrendingUp, color: 'text-green-400', path: '/trending' },
  ];

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Quick Links */}
      <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Quick Access</h3>
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ease-out text-left group ${
                location.pathname === link.path 
                  ? 'bg-white/12 backdrop-blur-sm border border-white/10' 
                  : 'hover:bg-white/8 hover:border border-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/8 group-hover:bg-white/12 transition-all duration-300`}>
                <link.icon className={`w-4 h-4 ${link.color}`} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-white/90 group-hover:text-white transition-colors duration-300 tracking-wide">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Trending Topics</h3>
        <div className="space-y-2">
          {trendingTopics.map((topic) => (
            <Link
              key={topic}
              to={`/category/${topic.toLowerCase()}`}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ease-out cursor-pointer group ${
                location.pathname === `/category/${topic.toLowerCase()}` 
                  ? 'bg-white/12 backdrop-blur-sm border border-white/10' 
                  : 'hover:bg-white/8 hover:border border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/8 group-hover:bg-white/12 transition-all duration-300">
                  <Hash className="w-4 h-4 text-white/60" strokeWidth={1.5} />
                </div>
                <span className="font-medium text-white/90 group-hover:text-white transition-colors duration-300 tracking-wide">{topic}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 