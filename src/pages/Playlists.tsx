
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PlaylistCard from '@/components/PlaylistCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import { Playlist, Song } from '@/types/music';

interface SearchResult {
  playlists: Playlist[];
  songs: Song[];
}

const Playlists = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['all-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Playlist[];
    },
  });

  const handleSearchResults = (results: SearchResult) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
      <Header />
      
      <main className="pt-16 pb-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0 animate-fade-in">
              All Playlists
            </h1>
            <div className="max-w-md w-full md:w-auto">
              <SearchBar onResults={handleSearchResults} onClear={handleClearSearch} />
            </div>
          </div>

          {isSearching && searchResults ? (
            <SearchResults playlists={searchResults.playlists} songs={searchResults.songs} />
          ) : (
            <>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {playlists?.map((playlist, index) => (
                    <div
                      key={playlist.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PlaylistCard playlist={playlist} index={index} />
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && (!playlists || playlists.length === 0) && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No playlists available yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Playlists;
