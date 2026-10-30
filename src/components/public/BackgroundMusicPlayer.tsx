import React, { useEffect, useRef, useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

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

      {/* Floating Audio Badge with Revolving Royal Disc and Equalizer */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <button
          onClick={toggleMusic}
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-full shadow-gold-glow backdrop-blur-md transition-all duration-500 border-2 cursor-pointer group hover:scale-105 active:scale-95 ${
            musicPlaying
              ? 'bg-maroon text-gold border-gold shadow-gold-glow-lg'
              : 'bg-[#FFFDF9]/95 text-dark-text border-gold/40 hover:border-gold hover:text-maroon'
          }`}
          title={musicPlaying ? 'Pause Royal Wedding Music' : 'Play Royal Wedding Music'}
          aria-label={musicPlaying ? 'Pause Music' : 'Play Music'}
        >
          {musicPlaying ? (
            <>
              {/* Revolving Royal Vinyl / Disc */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Disc className="w-6 h-6 text-gold animate-orbit-cw" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold-light absolute" />
              </div>

              {/* Dynamic Dancing Audio Equalizer Bars */}
              <div className="flex items-end space-x-0.5 h-4.5 px-0.5" aria-hidden="true">
                <span className="w-1 bg-gold rounded-full eq-bar-1" />
                <span className="w-1 bg-gold-light rounded-full eq-bar-2" />
                <span className="w-1 bg-gold rounded-full eq-bar-3" />
                <span className="w-1 bg-gold-light rounded-full eq-bar-4" />
              </div>

              <span className="text-xs font-heading font-bold tracking-wide max-w-[120px] truncate hidden sm:inline text-gold">
                {settings.music_title || 'Royal Shehnai'}
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-dark-muted group-hover:text-maroon transition-colors" />
              <span className="text-xs font-heading font-semibold text-dark-muted group-hover:text-maroon transition-colors hidden sm:inline">
                Play Royal Music
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
