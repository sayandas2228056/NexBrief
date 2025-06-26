import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Nex-Brief.png';

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'Breaking News', path: '/breaking-news' },
  { name: 'Geo-Politics', path: '/category/geopolitics' },
  { name: 'Sports', path: '/category/sports' },
  { name: 'AI-Summary', path: '/summary' },
  { name: 'Bookmarks', path: '/bookmark' },
  { name: 'Profile', path: '/profile' },
];

const Footer = () => (
  <footer className="w-full bg-neutral-900/95 border-t border-white/10 py-6 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
      {/* Left: Logo and Name */}
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <img src={logo} alt="NexBrief Logo" className="w-7 h-7 rounded-xl object-cover" />
        <span className="text-base font-semibold text-white/90 tracking-tight">NexBrief</span>
      </div>
      {/* Center: Navigation Links */}
      <nav className="flex flex-wrap justify-center gap-4 text-white/70 text-sm font-medium mb-2 md:mb-0">
        {footerLinks.map(link => (
          <Link
            key={link.name}
            to={link.path}
            className="hover:text-white transition-colors duration-200 px-2"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      {/* Right: Copyright */}
      <div className="text-white/50 text-xs text-center md:text-right">
        © 2024 NexBrief. Made by <span className="font-semibold text-white">Sayan Das</span>.
      </div>
    </div>
  </footer>
);

export default Footer;