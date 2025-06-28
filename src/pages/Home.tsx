
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PlaylistCard from '@/components/PlaylistCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import HeroSection from '@/components/HeroSection';
import { Playlist, Song } from '@/types/music';

interface SearchResult {
  playlists: Playlist[];
  songs: Song[];
}

const Home = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['featured-playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      
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
      
      {/* Hero Section */}
      <HeroSection />
      
      <main className="pb-32 md:pb-24">
        {/* Search Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onResults={handleSearchResults} onClear={handleClearSearch} />
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isSearching && searchResults ? (
            <SearchResults playlists={searchResults.playlists} songs={searchResults.songs} />
          ) : (
            <>
              {/* Recently Played */}
              <RecentlyPlayed />

              {/* Featured Playlists */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Playlists</h2>
                </div>

                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists?.map((playlist, index) => (
                      <div
                        key={playlist.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
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
              </section>
            </>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Home;
