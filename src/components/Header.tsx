
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Search, Menu, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-out ${
        isScrolled ? 'translate-y-0' : 'translate-y-0'
      } animate-fade-in hidden md:block`}>
        <nav className={`glassmorphism-nav px-8 py-4 rounded-full transition-all duration-500 hover:backdrop-blur-xl ${
          isScrolled ? 'bg-white/70 backdrop-blur-lg shadow-xl' : 'bg-white/60 backdrop-blur-md shadow-lg'
        }`}>
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <Music className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-all duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                Serenata
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={`nav-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'bg-indigo-100/80 text-indigo-700 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                Home
              </Link>
              <Link
                to="/playlists"
                className={`nav-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/playlists' 
                    ? 'bg-indigo-100/80 text-indigo-700 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                Playlists
              </Link>
              <button className="nav-item p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all duration-300 hover:scale-110">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-4 left-4 right-4 z-50 md:hidden animate-fade-in">
        <nav className={`glassmorphism-nav px-6 py-3 rounded-full transition-all duration-500 ${
          isScrolled ? 'bg-white/70 backdrop-blur-lg shadow-xl' : 'bg-white/60 backdrop-blur-md shadow-lg'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">Serenata</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="glassmorphism-nav mt-4 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-lg shadow-xl animate-scale-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-item px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'bg-indigo-100/80 text-indigo-700 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                Home
              </Link>
              <Link
                to="/playlists"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-item px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/playlists' 
                    ? 'bg-indigo-100/80 text-indigo-700 shadow-sm' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60'
                }`}
              >
                Playlists
              </Link>
              <button className="nav-item flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all duration-300">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
