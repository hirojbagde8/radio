
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { CurrentSong, Song } from '@/types/music';

interface MusicContextType {
  currentSong: CurrentSong | null;
  isPlaying: boolean;
  volume: number;
  isLooping: boolean;
  isShuffled: boolean;
  currentPlaylist: Song[];
  currentIndex: number;
  recentlyPlayed: CurrentSong[];
  play: (song: CurrentSong, playlist?: Song[]) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [isLooping, setIsLooping] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<CurrentSong[]>([]);
  const [shuffledIndexes, setShuffledIndexes] = useState<number[]>([]);
  const [shufflePosition, setShufflePosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addToRecentlyPlayed = (song: CurrentSong) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 10); // Keep only last 10
    });
  };

  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const play = (song: CurrentSong, playlist: Song[] = []) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    const index = playlist.findIndex(s => s.id === song.id);
    setCurrentIndex(index !== -1 ? index : 0);
    setIsPlaying(true);
    addToRecentlyPlayed(song);

    // Initialize shuffle if enabled
    if (isShuffled && playlist.length > 0) {
      const indexes = Array.from({ length: playlist.length }, (_, i) => i);
      const shuffled = shuffleArray(indexes);
      setShuffledIndexes(shuffled);
      setShufflePosition(shuffled.indexOf(index !== -1 ? index : 0));
    }
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const toggle = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const getNextIndex = () => {
    if (currentPlaylist.length === 0) return 0;
    
    if (isShuffled) {
      const nextPos = (shufflePosition + 1) % shuffledIndexes.length;
      setShufflePosition(nextPos);
      return shuffledIndexes[nextPos];
    } else {
      return (currentIndex + 1) % currentPlaylist.length;
    }
  };

  const getPreviousIndex = () => {
    if (currentPlaylist.length === 0) return 0;
    
    if (isShuffled) {
      const prevPos = shufflePosition > 0 ? shufflePosition - 1 : shuffledIndexes.length - 1;
      setShufflePosition(prevPos);
      return shuffledIndexes[prevPos];
    } else {
      return currentIndex > 0 ? currentIndex - 1 : currentPlaylist.length - 1;
    }
  };

  const next = () => {
    if (currentPlaylist.length > 0) {
      const nextIndex = getNextIndex();
      setCurrentIndex(nextIndex);
      const nextSong = currentPlaylist[nextIndex] as CurrentSong;
      setCurrentSong(nextSong);
      addToRecentlyPlayed(nextSong);
    }
  };

  const previous = () => {
    if (currentPlaylist.length > 0) {
      const prevIndex = getPreviousIndex();
      setCurrentIndex(prevIndex);
      const prevSong = currentPlaylist[prevIndex] as CurrentSong;
      setCurrentSong(prevSong);
      addToRecentlyPlayed(prevSong);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    const newShuffled = !isShuffled;
    setIsShuffled(newShuffled);
    
    if (newShuffled && currentPlaylist.length > 0) {
      const indexes = Array.from({ length: currentPlaylist.length }, (_, i) => i);
      const shuffled = shuffleArray(indexes);
      setShuffledIndexes(shuffled);
      setShufflePosition(shuffled.indexOf(currentIndex));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = false; // We handle looping manually
      
      const handleEnded = () => {
        if (isLooping && currentPlaylist.length > 0) {
          next();
        }
      };

      audioRef.current.addEventListener('ended', handleEnded);
      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [volume, isLooping, currentPlaylist.length, currentIndex, isShuffled]);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        isLooping,
        isShuffled,
        currentPlaylist,
        currentIndex,
        recentlyPlayed,
        play,
        pause,
        toggle,
        next,
        previous,
        setVolume,
        toggleLoop,
        toggleShuffle,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={currentSong?.file_url} />
    </MusicContext.Provider>
  );
};
