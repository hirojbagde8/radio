
import React from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playlist, Song, CurrentSong } from '@/types/music';
import { useMusicPlayer } from '@/contexts/MusicContext';

interface SearchResultsProps {
  playlists: Playlist[];
  songs: Song[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ playlists, songs }) => {
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();

  const handlePlaySong = (song: Song) => {
    const currentSongData: CurrentSong = {
      ...song,
    };

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(currentSongData, [song]);
    }
  };

  const hasResults = playlists.length > 0 || songs.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-16">
        <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Playlists Results */}
      {playlists.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Playlists ({playlists.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playlists.map((playlist, index) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square mb-4 rounded-xl overflow-hidden">
                    {playlist.cover_image_url ? (
                      <img
                        src={playlist.cover_image_url}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Music className="h-12 w-12 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center group-hover:text-indigo-600 transition-colors">
                    {playlist.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Songs Results */}
      {songs.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Songs ({songs.length})
          </h3>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-2">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className={`flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer animate-fade-in-up ${
                  currentSong?.id === song.id ? 'bg-indigo-50' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePlaySong(song)}
              >
                <button className="flex-shrink-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition-colors group-hover:scale-110 transform duration-200">
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} className="ml-0.5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${
                    currentSong?.id === song.id ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {song.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchResults;
