import React, { useState, useEffect } from 'react';
import { Search, User, MoreHorizontal, Bookmark, Settings, LogOut, ChevronDown, Menu, X, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Nex-Brief.png'

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [showTrendingDropdown, setShowTrendingDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfileMenu(false);
    setIsOpen(false);
  };

  const handleProtectedRoute = (route) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(route);
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', isProtected: false },
    { name: 'Breaking News', path: '/breaking-news', isProtected: false },
    { name: 'Geo-Politics', path: '/category/geopolitics', isProtected: false },
    { name: 'Sports', path: '/category/sports', isProtected: false },
    { name: 'AI-Summary', path: '/summary', isProtected: true },
  ];

  const trendingTopics = [
    { name: 'Technology', path: '/category/technology' },
    { name: 'Politics', path: '/category/politics' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Business', path: '/category/business' },
    { name: 'Health', path: '/category/health' },
  ];

  const handleNavClick = (name) => {
    setActiveNav(name);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
        isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-4'
      }`}
    >
      <div 
        className={`mx-4 transition-all duration-700 ease-out ${
          isScrolled 
            ? 'bg-white/8 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Logo left, hamburger right, no right icons */}
            <div className="flex md:hidden flex-1 items-center justify-between w-full">
              <a href="/" className="flex-shrink-0">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110">
                      <img 
                        src={logo} 
                        alt="Logo" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                  <span className="text-lg font-semibold text-white/90 group-hover:text-white transition-all duration-300 tracking-tight whitespace-nowrap">
                    NexBrief
                  </span>
                </div>
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white/70 hover:text-white p-2.5 rounded-xl hover:bg-white/8 transition-all duration-300 ease-out ml-2"
              >
                {isOpen ? (
                  <X className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Menu className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {/* Desktop: Standard layout */}
            <div className="hidden md:flex items-center justify-between w-full">
              {/* Left: Logo */}
              <div className="flex items-center min-w-[140px] flex-shrink-0">
                <a href="/" className="flex-shrink-0">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-xl overflow-hidden transition-all duration-500 group-hover:scale-110">
                        <img 
                          src={logo} 
                          alt="Logo" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </div>
                    <span className="text-lg font-semibold text-white/90 group-hover:text-white transition-all duration-300 tracking-tight whitespace-nowrap">
                      NexBrief
                    </span>
                  </div>
                </a>
              </div>
              {/* Center: Nav Items */}
              <div className="flex-1 flex justify-center px-4">
                <div className="flex items-center gap-x-2 xl:gap-x-4">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.isProtected) {
                          handleProtectedRoute(item.path);
                        } else {
                          navigate(item.path);
                        }
                        handleNavClick(item.name);
                      }}
                      className={`relative px-3 xl:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap ${
                        activeNav === item.name
                          ? 'text-white bg-white/12 backdrop-blur-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <span className="relative z-10 tracking-wide">
                        {item.name}
                      </span>
                      {activeNav === item.name && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/15 to-white/5 border border-white/10"></div>
                      )}
                    </button>
                  ))}
                  {/* Trending Topics Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTrendingDropdown((prev) => !prev)}
                      onBlur={() => setTimeout(() => setShowTrendingDropdown(false), 150)}
                      className={`relative px-3 xl:px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out flex items-center gap-1 whitespace-nowrap ${
                        activeNav === 'Trending Topics'
                          ? 'text-white bg-white/12 backdrop-blur-sm'
                          : 'text-white/70 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <span className="relative z-10 tracking-wide">
                        Trending Topics
                      </span>
                      <ChevronDown size={14} />
                    </button>
                    {showTrendingDropdown && (
                      <div className="absolute left-0 mt-2 w-48 bg-white/95 backdrop-blur-2xl text-black rounded-2xl shadow-2xl z-50 border border-white/20">
                        {trendingTopics.map((topic) => (
                          <button
                            key={topic.name}
                            onClick={() => {
                              navigate(topic.path);
                              setActiveNav('Trending Topics');
                              setShowTrendingDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm hover:bg-white/20 transition-all duration-200 rounded-xl whitespace-nowrap"
                          >
                            {topic.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Right: Icons + Auth */}
              <div className="flex items-center gap-x-2 min-w-[200px] justify-end flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleProtectedRoute('/bookmark')}
                    className="text-white/60 hover:text-white p-2.5 rounded-xl hover:bg-white/8 transition-all duration-300 ease-out"
                  >
                    <Bookmark size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-white/60 hover:text-white p-2.5 rounded-xl hover:bg-white/8 transition-all duration-300 ease-out"
                  >
                    <Mail size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleProtectedRoute('/profile')}
                    className="text-white/60 hover:text-white p-2.5 rounded-xl hover:bg-white/8 transition-all duration-300 ease-out"
                  >
                    <User size={18} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="ml-4 pl-4 border-l border-white/8">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          className="relative bg-white/12 backdrop-blur-sm hover:bg-white/16 text-white px-4 xl:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out border border-white/10 hover:border-white/20 whitespace-nowrap"
                        >
                          <span className="relative z-10 tracking-wide truncate max-w-[120px] block">
                            {user?.name || user?.email || 'Profile'}
                          </span>
                        </button>
                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                          <div className="absolute top-full right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl text-black rounded-2xl shadow-2xl z-50 border border-white/20">
                            <div className="py-2">
                              <Link
                                to="/profile"
                                className="block px-4 py-3 text-sm hover:bg-white/20 transition-all duration-200 rounded-xl mx-2"
                                onClick={() => setShowProfileMenu(false)}
                              >
                                <div className="flex items-center space-x-3">
                                  <User size={16} strokeWidth={1.5} />
                                  <span className="font-medium">Profile</span>
                                </div>
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-3 text-sm hover:bg-white/20 transition-all duration-200 rounded-xl mx-2"
                              >
                                <div className="flex items-center space-x-3">
                                  <LogOut size={16} strokeWidth={1.5} />
                                  <span className="font-medium">Logout</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="relative bg-white text-black hover:bg-white/95 px-4 xl:px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      <span className="relative z-10 tracking-wide">Sign In</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-500 ease-out ${
            isOpen 
              ? 'max-h-[calc(100vh-4rem)] opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-6 pb-6 space-y-2 bg-white/8 backdrop-blur-2xl border-t border-white/8">
            
            {/* Mobile Navigation Items */}
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  if (item.isProtected) {
                    handleProtectedRoute(item.path);
                  } else {
                    navigate(item.path);
                  }
                  handleNavClick(item.name);
                }}
                className={`block w-full text-left px-4 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out whitespace-nowrap ${
                  activeNav === item.name
                    ? 'text-white bg-white/12 backdrop-blur-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {item.name}
                {activeNav === item.name && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/15 to-white/5 border border-white/10"></div>
                )}
              </button>
            ))}

            {/* Mobile Trending Topics Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTrendingDropdown((prev) => !prev)}
                className={`block w-full text-left px-4 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out flex items-center gap-1 whitespace-nowrap ${
                  activeNav === 'Trending Topics'
                    ? 'text-white bg-white/12 backdrop-blur-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
              >
                Trending Topics 
                <ChevronDown size={18} />
              </button>
              
              {showTrendingDropdown && (
                <div className="mt-2 w-full bg-white/95 backdrop-blur-2xl text-black rounded-2xl shadow-2xl z-50 border border-white/20">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic.name}
                      onClick={() => {
                        navigate(topic.path);
                        setActiveNav('Trending Topics');
                        setShowTrendingDropdown(false);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-base hover:bg-white/20 transition-all duration-200 rounded-xl whitespace-nowrap"
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile Authentication Section */}
            <div className="pt-4 border-t border-white/8 space-y-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setIsOpen(false);
                    }}
                    className="block w-full bg-white/12 backdrop-blur-sm hover:bg-white/16 text-white px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out text-center border border-white/10 hover:border-white/20 whitespace-nowrap truncate"
                  >
                    {user?.name || user?.email || 'Profile'}
                  </button>
                  
                  <button
                    onClick={() => navigate('/contact')}
                    className="block w-full border border-white/20 text-white/80 hover:bg-white/8 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out text-center flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Mail size={18} strokeWidth={1.5} /> 
                    Contact
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full border border-white/20 text-white/80 hover:bg-white/8 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out text-center whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-white text-black hover:bg-white/95 px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 ease-out text-center shadow-lg whitespace-nowrap"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;