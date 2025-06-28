
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Playlist, Song } from '@/types/music';

interface SearchResult {
  playlists: Playlist[];
  songs: Song[];
}

interface SearchBarProps {
  onResults: (results: SearchResult) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return { playlists: [], songs: [] };

      const [playlistsResponse, songsResponse] = await Promise.all([
        supabase
          .from('playlists')
          .select('*')
          .ilike('name', `%${searchTerm}%`)
          .order('created_at', { ascending: false }),
        supabase
          .from('songs')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })
      ]);

      if (playlistsResponse.error) throw playlistsResponse.error;
      if (songsResponse.error) throw songsResponse.error;

      return {
        playlists: playlistsResponse.data as Playlist[],
        songs: songsResponse.data as Song[]
      };
    },
    enabled: searchTerm.length > 0,
  });

  useEffect(() => {
    if (searchResults) {
      onResults(searchResults);
    } else if (!searchTerm) {
      onClear();
    }
  }, [searchResults, searchTerm, onResults, onClear]);

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search playlists, songs, or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-300"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
