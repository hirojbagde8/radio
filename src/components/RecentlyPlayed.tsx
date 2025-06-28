
import React from 'react';
import { Clock, Play, Pause } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicContext';
import { CurrentSong } from '@/types/music';

const RecentlyPlayed: React.FC = () => {
  const { recentlyPlayed, currentSong, isPlaying, play, pause } = useMusicPlayer();

  if (recentlyPlayed.length === 0) return null;

  const handlePlaySong = (song: CurrentSong) => {
    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recently Played</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentlyPlayed.slice(0, 8).map((song, index) => (
          <div
            key={`${song.id}-${index}`}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white/80 transition-all duration-300 group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handlePlaySong(song)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                <span className="text-indigo-600 font-bold text-sm">
                  {song.name.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause size={16} className="text-white" />
                  ) : (
                    <Play size={16} className="text-white ml-0.5" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${
                  currentSong?.id === song.id ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  {song.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">{song.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayed;
