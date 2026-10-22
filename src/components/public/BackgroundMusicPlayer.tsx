import React, { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Volume2, VolumeX, Music, AlertCircle } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const { settings, websiteSettings, musicPlaying, toggleMusic, setMusicPlaying } = useWedding();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadError, setLoadError] = useState(false);

  const isEnabled = settings.music_enabled && websiteSettings.show_music_controls && settings.music_url;

  useEffect(() => {
    if (!audioRef.current || !settings.music_url) return;

    if (musicPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented by browser:', err);
          setMusicPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying, settings.music_url, setMusicPlaying]);

  if (!isEnabled) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={settings.music_url}
        loop
        preload="auto"
        onError={() => setLoadError(true)}
      />

      {/* Floating Audio Badge */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={toggleMusic}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-full shadow-gold-glow backdrop-blur-md transition-all duration-300 border cursor-pointer ${
            musicPlaying
              ? 'bg-maroon/95 text-gold border-gold scale-105'
              : 'bg-[#FFFDF9]/95 text-dark-text border-gold/40 hover:border-gold'
          }`}
          title={musicPlaying ? 'Pause Background Music' : 'Play Royal Wedding Music'}
          aria-label={musicPlaying ? 'Pause Music' : 'Play Music'}
        >
          {musicPlaying ? (
            <>
              <div className="relative">
                <Volume2 className="w-4 h-4 text-gold animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold animate-ping" />
              </div>
              <span className="text-[11px] font-heading font-semibold max-w-[120px] truncate hidden sm:inline">
                {settings.music_title || 'Royal Shehnai'}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-dark-muted" />
              <span className="text-[11px] font-heading font-medium text-dark-muted hidden sm:inline">
                Play Music
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
