import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart } from 'lucide-react';

interface InvitationCoverProps {
  onOpen: () => void;
}

export const InvitationCover: React.FC<InvitationCoverProps> = ({ onOpen }) => {
  const { settings, setMusicPlaying, hasOpenedInvitation } = useWedding();
  const [isOpening, setIsOpening] = useState(false);

  const formattedDate = settings.wedding_date ? new Date(settings.wedding_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'The Auspicious Day';

  const handleOpenInvitation = () => {
    setIsOpening(true);

    // Confetti burst with royal gold & burgundy colors
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#FFDF73', '#6D1427', '#FFF8E7', '#B8860B']
    });

    // Start background music on explicit user interaction if enabled
    if (settings.music_enabled) {
      setMusicPlaying(true);
    }

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 bg-mandala-pattern ${
        isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle floating gold particle lights in background */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/90 via-maroon-deep/95 to-maroon/95 backdrop-blur-sm pointer-events-none" />

      {/* Main Luxury Envelope / Invitation Card Container */}
      <div className="relative w-full max-w-xl mx-auto z-10">
        
        {/* Outer Gold Ornate Border */}
        <div className="relative bg-[#FFFDF9] border-2 border-gold rounded-2xl shadow-gold-glow-lg overflow-hidden p-6 sm:p-10 text-center">
          
          {/* Decorative Corner Flourishes */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold pointer-events-none" />

          {/* Inner Golden Dotted Frame */}
          <div className="border border-gold/30 border-dashed rounded-xl p-6 sm:p-8 relative">
            
            {/* Royal Monogram Crest / Seal */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-maroon border-2 border-gold shadow-md mx-auto mb-5 text-gold relative">
              <span className="font-couple text-2xl sm:text-3xl font-bold tracking-wider">
                {settings.groom_name?.[0] || 'D'} &amp; {settings.bride_name?.[0] || 'P'}
              </span>
              <div className="absolute -inset-1 border border-gold/40 rounded-full pointer-events-none animate-pulse-subtle" />
            </div>

            {/* Subtitle */}
            <p className="font-heading uppercase tracking-[0.25em] text-xs sm:text-sm text-gold-deep font-semibold mb-2">
              {settings.invitation_heading || 'You Are Invited to Celebrate'}
            </p>

            <p className="font-script text-2xl sm:text-3xl text-maroon mb-1">
              The Wedding Celebration of
            </p>

            {/* Couple Names */}
            <div className="my-4">
              <h1 className="font-couple text-3xl sm:text-5xl font-bold text-maroon tracking-tight leading-tight">
                {settings.groom_name}
              </h1>
              <div className="flex items-center justify-center my-1 text-gold">
                <span className="h-[1px] w-12 bg-gold/50" />
                <Heart className="w-4 h-4 mx-2 fill-gold text-gold" />
                <span className="h-[1px] w-12 bg-gold/50" />
              </div>
              <h1 className="font-couple text-3xl sm:text-5xl font-bold text-maroon tracking-tight leading-tight">
                {settings.bride_name}
              </h1>
            </div>

            {/* Date and Venue Snippet */}
            <div className="my-5 py-3 border-y border-gold/20">
              <p className="font-heading text-lg sm:text-xl text-dark-text font-medium tracking-wide">
                {formattedDate}
              </p>
              <p className="text-xs sm:text-sm text-maroon-rich font-medium tracking-wider uppercase mt-1">
                {settings.venue_name}, {settings.city}
              </p>
            </div>

            {/* Open Invitation Button */}
            <button
              onClick={handleOpenInvitation}
              disabled={isOpening}
              className="btn-royal-maroon w-full sm:w-auto px-8 py-3.5 rounded-full inline-flex items-center justify-center space-x-3 text-sm sm:text-base font-semibold group cursor-pointer transition-all duration-300"
              aria-label="Open wedding invitation"
            >
              <Mail className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              <span>{isOpening ? 'Opening Royal Invitation...' : 'Open Invitation'}</span>
              <Sparkles className="w-4 h-4 text-gold-light group-hover:rotate-12 transition-transform" />
            </button>

            <p className="text-[11px] text-maroon/70 mt-3 italic">
              Tap to enter the celebration &bull; Music will begin
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};
