
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SongList from '@/components/SongList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Playlist, Song } from '@/types/music';

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: playlist, isLoading: playlistLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Playlist;
    },
    enabled: !!id,
  });

  const { data: songs, isLoading: songsLoading } = useQuery({
    queryKey: ['playlist-songs', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('playlist_id', id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Song[];
    },
    enabled: !!id,
  });

  if (playlistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
        <Header />
        <div className="pt-16 text-center py-16">
          <p className="text-gray-500 text-lg">Playlist not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      <Header />
      
      <main className="pt-16 pb-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Playlist Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8 mb-12">
            <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
              {playlist.cover_image_url ? (
                <img
                  src={playlist.cover_image_url}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Music className="h-24 w-24 text-indigo-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Playlist</p>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{playlist.name}</h1>
              <p className="text-gray-600">
                {songs?.length || 0} song{songs?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Songs List */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Songs</h2>
            
            {songsLoading ? (
              <LoadingSpinner />
            ) : songs && songs.length > 0 ? (
              <SongList songs={songs} playlist={playlist} />
            ) : (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No songs in this playlist yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default PlaylistDetail;
