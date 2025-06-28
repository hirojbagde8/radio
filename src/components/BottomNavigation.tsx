
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Music } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 transition-colors ${
            location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Home size={20} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link
          to="/playlists"
          className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 transition-colors ${
            location.pathname === '/playlists' ? 'text-indigo-600' : 'text-gray-600'
          }`}
        >
          <Music size={20} />
          <span className="text-xs font-medium">Playlists</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
