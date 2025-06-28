
import React, { useState, useEffect } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicContext';

const HeroSection: React.FC = () => {
  const { play, isPlaying, currentSong } = useMusicPlayer();
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase(1), 300);
    const timer2 = setTimeout(() => setAnimationPhase(2), 800);
    const timer3 = setTimeout(() => setAnimationPhase(3), 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handlePlayClick = () => {
    if (!currentSong) {
      // Play first available song or handle no songs case
      console.log('No song available to play');
      return;
    }
    play(currentSong);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/20 animate-gradient-shift"></div>
      
      {/* Music Visualizer Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Circular Pulse Visualizer */}
        <div className="absolute">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-indigo-200/30 animate-pulse-ring"
              style={{
                width: `${120 + i * 80}px`,
                height: `${120 + i * 80}px`,
                left: `${-60 - i * 40}px`,
                top: `${-60 - i * 40}px`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
        
        {/* Waveform Visualizer */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex items-end space-x-1">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-indigo-300/40 to-purple-300/40 rounded-full animate-wave"
              style={{
                width: '4px',
                height: `${Math.random() * 40 + 20}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.5 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Music Notes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-indigo-300/20 text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            ♪
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Headline */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Serenata
          </span>
        </h1>

        {/* Subheadline */}
        <p 
          className={`text-xl md:text-2xl text-gray-600 mb-12 transition-all duration-1000 delay-300 ${
            animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Experience music like never before with premium streaming
        </p>

        {/* Play Button */}
        <div 
          className={`transition-all duration-1000 delay-500 ${
            animationPhase >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <button
            onClick={handlePlayClick}
            className="group relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse-gentle"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-pulse blur-sm scale-110" />
            
            {/* Play Icon */}
            <Play 
              className="w-8 h-8 md:w-10 md:h-10 text-indigo-600 ml-1 relative z-10 group-hover:text-white transition-colors duration-300" 
              fill="currentColor"
            />
            
            {/* Pulse Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-indigo-300/50 animate-ping opacity-75 group-hover:border-white/50" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-300/30 animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
          </button>
        </div>

        {/* Additional Info */}
        <div 
          className={`mt-16 transition-all duration-1000 delay-700 ${
            animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm text-gray-500 mb-8">
            Premium playlists • High-quality streaming • Seamless experience
          </p>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${
          animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center animate-bounce-slow">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full blur-xl animate-float-slow opacity-60" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-xl animate-float-slow opacity-40" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;
