import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { MapPin, Calendar, Heart, Send, Sparkles, RotateCcw, Flame } from 'lucide-react';

interface HeroSectionProps {
  onReplayCover: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReplayCover }) => {
  const { settings } = useWedding();

  const formattedDate = settings.wedding_date ? new Date(settings.wedding_date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'The Wedding Day';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      
      {/* Dynamic Golden Aura & Sacred Mandala Rings in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Breathing Gold Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-gold/10 blur-[130px] aura-pulse" />
        
        {/* Subtle Rotating Sacred Celestial Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-gold/20 animate-orbit-cw pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border border-dashed border-gold/15 animate-orbit-ccw pointer-events-none" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        
        {/* Top Auspicious Sloka / Royal Tag */}
        <RevealOnScroll variant="fade-up" delayMs={100}>
          <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-gold/50 bg-cream/90 backdrop-blur-md text-gold-deep mb-6 shadow-sm hover:shadow-gold-glow transition-shadow duration-300">
            <Sparkles className="w-3.5 h-3.5 fill-gold-deep animate-spin-slow" />
            <span className="font-heading uppercase tracking-[0.25em] text-[11px] sm:text-xs font-bold">
              {settings.wedding_title || 'The Royal Wedding Celebration'}
            </span>
            <Sparkles className="w-3.5 h-3.5 fill-gold-deep animate-spin-slow" />
          </div>
        </RevealOnScroll>

        {/* Invitation Heading */}
        <RevealOnScroll variant="fade-up" delayMs={200}>
          <p className="font-heading text-base sm:text-xl text-dark-muted font-medium mb-2 tracking-wide">
            {settings.invitation_heading || 'You Are Cordially Invited to Celebrate the Wedding of'}
          </p>
        </RevealOnScroll>

        {/* Main Royal Couple Names with Liquid Gold Sheen */}
        <RevealOnScroll variant="scale-up" delayMs={300} durationMs={1000}>
          <div className="my-6 relative px-2">
            <h1 className="font-couple text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight text-maroon hover:text-gold-deep transition-colors break-words">
              {settings.groom_name}
            </h1>
            
            <div className="flex items-center justify-center my-3 text-gold">
              <span className="h-[1px] w-20 sm:w-36 bg-gradient-to-r from-transparent via-gold to-gold" />
              <div className="mx-4 p-2.5 rounded-full border-2 border-gold/60 bg-ivory shadow-gold-glow animate-float-gentle">
                <Heart className="w-5 h-5 fill-maroon text-maroon animate-pulse" />
              </div>
              <span className="h-[1px] w-20 sm:w-36 bg-gradient-to-l from-transparent via-gold to-gold" />
            </div>

            <h1 className="font-couple text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight text-maroon hover:text-gold-deep transition-colors break-words">
              {settings.bride_name}
            </h1>
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delayMs={450}>
          <RoyalDivider />
        </RevealOnScroll>

        {/* Auspicious Invitation Message */}
        <RevealOnScroll variant="fade-up" delayMs={550}>
          <p className="font-heading text-base sm:text-xl text-dark-text max-w-2xl mx-auto italic font-normal leading-relaxed mb-8 px-4 break-words">
            "{settings.invitation_message || 'With joyful hearts and the blessings of our parents, we invite you to share our happiest day.'}"
          </p>
        </RevealOnScroll>

        {/* Interactive 3D Tilt Date & Venue Badges with Specular Light */}
        <RevealOnScroll variant="fade-up" delayMs={650}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
            
            <TiltCard maxTilt={8}>
              <div className="royal-card rounded-xl p-4 flex items-center space-x-3 text-left border border-gold/50 bg-[#FFFDF9]/95 backdrop-blur-sm shadow-sm h-full">
                <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-maroon flex-shrink-0 shadow-inner">
                  <Calendar className="w-5 h-5 text-maroon" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-heading uppercase tracking-wider text-gold-deep font-bold">
                    Wedding Date
                  </p>
                  <p className="font-heading text-sm sm:text-base font-bold text-dark-text truncate">
                    {formattedDate}
                  </p>
                  <p className="text-xs text-dark-muted truncate">
                    From {settings.wedding_start_time || '18:30'} onwards
                  </p>
                </div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={8}>
              <div className="royal-card rounded-xl p-4 flex items-center space-x-3 text-left border border-gold/50 bg-[#FFFDF9]/95 backdrop-blur-sm shadow-sm h-full">
                <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-maroon flex-shrink-0 shadow-inner">
                  <MapPin className="w-5 h-5 text-maroon" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-heading uppercase tracking-wider text-gold-deep font-bold">
                    Wedding Venue
                  </p>
                  <p className="font-heading text-sm sm:text-base font-bold text-dark-text truncate" title={settings.venue_name}>
                    {settings.venue_name}
                  </p>
                  <p className="text-xs text-dark-muted truncate">
                    {settings.city}, {settings.state}
                  </p>
                </div>
              </div>
            </TiltCard>

          </div>
        </RevealOnScroll>

        {/* Quick Action Navigation Buttons */}
        <RevealOnScroll variant="fade-up" delayMs={750}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => scrollTo('rsvp')}
              className="btn-royal-maroon px-7 py-3.5 rounded-full text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4 text-gold" />
              <span>RSVP to Attend</span>
            </button>

            <button
              onClick={() => scrollTo('events')}
              className="btn-royal-gold px-7 py-3.5 rounded-full text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Calendar className="w-4 h-4 text-dark-text" />
              <span>Wedding Events</span>
            </button>

            <button
              onClick={onReplayCover}
              className="px-5 py-3.5 rounded-full text-xs font-heading font-semibold text-dark-text border border-gold/50 bg-white/80 hover:bg-gold/15 inline-flex items-center space-x-2 transition-all cursor-pointer shadow-sm hover:scale-105 group"
              title="Replay 3D Envelope Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gold-deep group-hover:-rotate-90 transition-transform duration-500" />
              <span>Replay Invitation</span>
            </button>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
