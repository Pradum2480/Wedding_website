import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Crown, Award } from 'lucide-react';

interface InvitationCoverProps {
  onOpen: () => void;
}

export const InvitationCover: React.FC<InvitationCoverProps> = ({ onOpen }) => {
  const { settings, setMusicPlaying } = useWedding();
  const [stage, setStage] = useState<'sealed' | 'breaking_seal' | 'unfolding' | 'letter_rise' | 'finished'>('sealed');

  const formattedDate = settings.wedding_date ? new Date(settings.wedding_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'The Auspicious Day';

  const handleOpenInvitation = () => {
    if (stage !== 'sealed') return;

    // Stage 1: Breaking wax seal with royal confetti burst
    setStage('breaking_seal');

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#D4AF37', '#FFDF73', '#B8860B', '#6D1427', '#FFF8E7'],
      disableForReducedMotion: true,
    });

    // Start background music on user gesture
    if (settings.music_enabled) {
      setMusicPlaying(true);
    }

    // Stage 2: Flap rotates back in 3D
    setTimeout(() => {
      setStage('unfolding');
    }, 450);

    // Stage 3: Invitation letter glides upward
    setTimeout(() => {
      setStage('letter_rise');
    }, 950);

    // Stage 4: Crossfade into website
    setTimeout(() => {
      setStage('finished');
      onOpen();
    }, 2200);
  };

  const isFlapOpen = stage === 'unfolding' || stage === 'letter_rise' || stage === 'finished';
  const isLetterUp = stage === 'letter_rise' || stage === 'finished';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-1000 bg-mandala-pattern ${
        stage === 'finished' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 50%, #4A0E1B 0%, #2B060F 60%, #170207 100%)',
      }}
    >
      {/* Ambient Bokeh & Golden Dust Glow Behind Envelope */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/15 blur-[120px] aura-pulse" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-maroon-rich/30 blur-3xl" />
      </div>

      {/* 3D Envelope Container with Perspective */}
      <div className="relative w-full max-w-xl mx-auto perspective-1200 z-10 py-8">
        
        {/* Top Hint / Invitation Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/40 bg-maroon-deep/80 text-gold-light backdrop-blur-sm shadow-md animate-float-gentle">
            <Crown className="w-3.5 h-3.5 text-gold" />
            <span className="font-heading uppercase tracking-[0.25em] text-[11px] sm:text-xs font-semibold">
              Royal Wedding Invitation
            </span>
            <Crown className="w-3.5 h-3.5 text-gold" />
          </div>
        </div>

        {/* =========================================================================
            THE 3D ROYAL ENVELOPE
           ========================================================================= */}
        <div 
          onClick={handleOpenInvitation}
          className="relative w-full max-w-md mx-auto aspect-[1.38/1] cursor-pointer group select-none transition-transform duration-500 hover:scale-[1.01]"
          title="Click to break the royal wax seal and open invitation"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenInvitation(); }}
          aria-label="Royal wedding envelope. Tap to break the wax seal and open invitation."
        >
          {/* Envelope Back Base */}
          <div className="absolute inset-0 bg-[#350812] border-2 border-gold/60 rounded-2xl shadow-gold-glow-lg overflow-hidden">
            {/* Rich gold damask lining inside envelope */}
            <div className="absolute inset-0 bg-mandala-pattern opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* =========================================================================
              THE INNER INVITATION CARD (Slides out smoothly in 3D)
             ========================================================================= */}
          <div 
            className={`absolute left-3 right-3 top-3 bottom-3 bg-[#FFFDF9] rounded-xl border-2 border-gold shadow-2xl p-5 sm:p-7 flex flex-col justify-between text-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLetterUp 
                ? '-translate-y-28 sm:-translate-y-36 scale-105 z-30 shadow-gold-glow-lg' 
                : 'translate-y-0 z-10'
            }`}
          >
            {/* Corner flourishes on card */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-gold" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-gold" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-gold" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-gold" />

            {/* Top Monogram */}
            <div className="text-center pt-1 min-w-0">
              <span className="font-heading uppercase tracking-[0.25em] text-[10px] sm:text-xs text-gold-deep font-bold block truncate">
                {settings.invitation_heading || 'Cordially Inviting You'}
              </span>
              <p className="font-script text-xl sm:text-2xl text-maroon mt-0.5 truncate">
                The Wedding Celebration of
              </p>
            </div>

            {/* Couple Names on Card */}
            <div className="my-2 min-w-0">
              <h2 className="font-couple text-xl sm:text-3xl font-bold text-maroon tracking-tight break-words">
                {settings.groom_name}
              </h2>
              <div className="flex items-center justify-center my-1 text-gold">
                <span className="h-[1px] w-8 bg-gold/50" />
                <Heart className="w-3.5 h-3.5 mx-1.5 fill-gold text-gold flex-shrink-0" />
                <span className="h-[1px] w-8 bg-gold/50" />
              </div>
              <h2 className="font-couple text-xl sm:text-3xl font-bold text-maroon tracking-tight break-words">
                {settings.bride_name}
              </h2>
            </div>

            {/* Date & Venue Snippet */}
            <div className="pt-2 border-t border-gold/30 min-w-0">
              <p className="font-heading text-xs sm:text-sm font-semibold text-dark-text truncate">
                {formattedDate}
              </p>
              <p className="text-[11px] text-maroon-rich font-medium uppercase tracking-wider mt-0.5 truncate">
                {settings.venue_name}, {settings.city}
              </p>
            </div>
          </div>

          {/* Envelope Pocket Front (Triangular folds on left, right and bottom) */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl overflow-hidden">
            {/* Bottom Pocket Flap */}
            <div 
              className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#4A0E1B] to-[#5b1122] border-t border-gold/50 shadow-md"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 28%)',
              }}
            />
            {/* Left Pocket Flap */}
            <div 
              className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#3e0b16] to-[#4A0E1B] border-r border-gold/30"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
              }}
            />
            {/* Right Pocket Flap */}
            <div 
              className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#3e0b16] to-[#4A0E1B] border-l border-gold/30"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
              }}
            />
          </div>

          {/* =========================================================================
              THE 3D TOP FOLDING FLAP (Hinged at top, opens backward 180 degrees)
             ========================================================================= */}
          <div 
            className="absolute inset-x-0 top-0 h-3/5 z-25 transform-style-3d will-change-transform origin-top transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              transform: isFlapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
              pointerEvents: isFlapOpen ? 'none' : 'auto',
            }}
          >
            {/* Front of Flap (with golden border and downward triangle) */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#5b1122] to-[#4A0E1B] border-b-2 border-gold shadow-xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            >
              {/* Gold rim along triangle fold */}
              <div 
                className="absolute inset-0 border-t-2 border-gold/70 pointer-events-none" 
              />
            </div>

            {/* Backside of Flap (visible when folded open) */}
            <div 
              className="absolute inset-0 bg-[#350812] border-2 border-gold/40 backface-hidden"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: 'rotateX(180deg)',
              }}
            />

            {/* =========================================================================
                THE EMBOSSED ROYAL WAX SEAL
               ========================================================================= */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 top-[76%] -translate-y-1/2 z-30 transition-all duration-300 ${
                stage === 'breaking_seal' ? 'scale-125 opacity-70 rotate-12' : 'scale-100 opacity-100'
              }`}
            >
              <div className="wax-seal w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center text-gold relative group-hover:scale-110">
                {/* Concentric Gold Filigree Rings */}
                <div className="absolute inset-1.5 border border-gold/50 rounded-full pointer-events-none" />
                <div className="absolute inset-2.5 border border-dashed border-gold/30 rounded-full pointer-events-none" />
                
                {/* Monogram Initials */}
                <span className="font-couple text-xl sm:text-2xl font-bold tracking-wider text-gold drop-shadow-md">
                  {settings.groom_name?.[0] || 'D'}&amp;{settings.bride_name?.[0] || 'P'}
                </span>

                <span className="text-[8px] font-heading uppercase tracking-[0.2em] text-gold-light -mt-1 font-semibold">
                  Royal Seal
                </span>

                {/* Shimmering pulse aura around seal */}
                <div className="absolute -inset-2 border border-gold/40 rounded-full animate-ping opacity-40 pointer-events-none" />
              </div>
            </div>

          </div>

        </div>

        {/* Action Prompt Below Envelope */}
        <div className="text-center mt-8">
          <button
            onClick={handleOpenInvitation}
            disabled={stage !== 'sealed'}
            className="btn-royal-gold px-8 py-3.5 rounded-full inline-flex items-center space-x-3 text-sm sm:text-base font-bold shadow-gold-glow cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Break royal wax seal and open invitation"
          >
            <Sparkles className="w-5 h-5 text-dark-text animate-spin-slow" />
            <span>
              {stage === 'sealed' ? 'Break Seal & Open Invitation' : 'Opening Royal Auspicious Invitation...'}
            </span>
            <Sparkles className="w-5 h-5 text-dark-text animate-spin-slow" />
          </button>
          
          <p className="text-xs text-cream/70 mt-3 font-heading italic tracking-wide">
            Tap the wax seal or button &bull; Background celebration music will begin
          </p>
        </div>

      </div>
    </div>
  );
};
