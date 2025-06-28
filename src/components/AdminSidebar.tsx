
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, Plus, Upload, List, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigationItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/create-playlist', icon: Plus, label: 'Create Playlist' },
    { path: '/admin/upload-songs', icon: Upload, label: 'Upload Songs' },
    { path: '/admin/manage-playlists', icon: List, label: 'Manage Playlists' },
    { path: '/admin/manage-songs', icon: Settings, label: 'Manage Songs' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
      <div className="p-6">
        <Link to="/admin" className="flex items-center space-x-2 group">
          <Music className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
          <span className="text-xl font-bold text-gray-900">Serenata Admin</span>
        </Link>
      </div>

      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full flex items-center space-x-2"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
