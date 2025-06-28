
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Song, CurrentSong } from '@/types/music';
import { useMusicPlayer } from '@/contexts/MusicContext';

interface SongListProps {
  songs: Song[];
  playlist?: any;
}

const SongList: React.FC<SongListProps> = ({ songs, playlist }) => {
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();

  const handlePlaySong = (song: Song) => {
    const currentSongData: CurrentSong = {
      ...song,
      playlist,
    };

    if (currentSong?.id === song.id && isPlaying) {
      pause();
    } else {
      play(currentSongData, songs);
    }
  };

  return (
    <div className="space-y-2">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer ${
            currentSong?.id === song.id ? 'bg-indigo-50' : ''
          }`}
          onClick={() => handlePlaySong(song)}
          style={{ animationDelay: `${index * 50}ms` }}
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
  );
};

export default SongList;
