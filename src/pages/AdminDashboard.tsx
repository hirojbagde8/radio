
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Music, PlayCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [playlistsResult, songsResult] = await Promise.all([
        supabase.from('playlists').select('id', { count: 'exact', head: true }),
        supabase.from('songs').select('id', { count: 'exact', head: true })
      ]);

      const { data: recentPlaylists } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalPlaylists: playlistsResult.count || 0,
        totalSongs: songsResult.count || 0,
        recentPlaylists: recentPlaylists || []
      };
    },
    enabled: !!user,
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back to the Serenata admin panel</p>
          </header>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Music className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Playlists</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalPlaylists}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <PlayCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Songs</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalSongs}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recent Playlists</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.recentPlaylists.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Playlists */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recently Added Playlists</h2>
                </div>
                <div className="p-6">
                  {stats?.recentPlaylists.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No playlists created yet</p>
                  ) : (
                    <div className="space-y-4">
                      {stats?.recentPlaylists.map((playlist) => (
                        <div key={playlist.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Music className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                            <p className="text-sm text-gray-500">
                              Created {new Date(playlist.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
