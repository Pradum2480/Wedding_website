import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { MapPin, Calendar, Heart, Send, Sparkles, RotateCcw } from 'lucide-react';

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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      
      {/* Decorative Royal Palace Background Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-maroon/5 blur-2xl pointer-events-none" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        
        {/* Top Auspicious Sloka / Blessing Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold/40 bg-cream/80 backdrop-blur-sm text-gold-deep mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 fill-gold-deep" />
          <span className="font-heading uppercase tracking-[0.25em] text-[11px] sm:text-xs font-semibold">
            {settings.wedding_title || 'The Royal Wedding Celebration'}
          </span>
          <Sparkles className="w-3.5 h-3.5 fill-gold-deep" />
        </div>

        {/* Invitation Heading */}
        <p className="font-heading text-base sm:text-xl text-dark-muted font-medium mb-3 tracking-wide">
          {settings.invitation_heading || 'You Are Cordially Invited to Celebrate the Wedding of'}
        </p>

        {/* Main Royal Couple Names */}
        <div className="my-6">
          <h1 className="font-couple text-4xl sm:text-6xl md:text-7xl font-bold text-maroon tracking-tight leading-tight">
            {settings.groom_name}
          </h1>
          
          <div className="flex items-center justify-center my-3 text-gold">
            <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-gold" />
            <div className="mx-4 p-2 rounded-full border border-gold/40 bg-ivory shadow-sm">
              <Heart className="w-5 h-5 fill-maroon text-maroon animate-pulse" />
            </div>
            <span className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-gold" />
          </div>

          <h1 className="font-couple text-4xl sm:text-6xl md:text-7xl font-bold text-maroon tracking-tight leading-tight">
            {settings.bride_name}
          </h1>
        </div>

        <RoyalDivider />

        {/* Invitation Message */}
        <p className="font-heading text-base sm:text-xl text-dark-text max-w-2xl mx-auto italic font-normal leading-relaxed mb-8 px-4">
          "{settings.invitation_message || 'With joyful hearts and the blessings of our parents, we invite you to share our happiest day.'}"
        </p>

        {/* Key Wedding Date & Venue Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
          
          <div className="royal-card rounded-xl p-4 flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-maroon flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-heading uppercase tracking-wider text-gold-deep font-semibold">
                Wedding Date
              </p>
              <p className="font-heading text-sm sm:text-base font-semibold text-dark-text">
                {formattedDate}
              </p>
              <p className="text-xs text-dark-muted">
                From {settings.wedding_start_time || '18:30'} onwards
              </p>
            </div>
          </div>

          <div className="royal-card rounded-xl p-4 flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-maroon flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-heading uppercase tracking-wider text-gold-deep font-semibold">
                Wedding Venue
              </p>
              <p className="font-heading text-sm sm:text-base font-semibold text-dark-text truncate">
                {settings.venue_name}
              </p>
              <p className="text-xs text-dark-muted truncate">
                {settings.city}, {settings.state}
              </p>
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollTo('rsvp')}
            className="btn-royal-maroon px-7 py-3 rounded-full text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4 text-gold" />
            <span>RSVP to Attend</span>
          </button>

          <button
            onClick={() => scrollTo('events')}
            className="btn-royal-gold px-7 py-3 rounded-full text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-md"
          >
            <Calendar className="w-4 h-4 text-dark-text" />
            <span>Wedding Events</span>
          </button>

          <button
            onClick={onReplayCover}
            className="px-5 py-3 rounded-full text-xs font-heading font-semibold text-dark-text border border-gold/50 bg-white/70 hover:bg-gold/10 inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Replay Envelope Animation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gold-deep" />
            <span>Replay Cover</span>
          </button>
        </div>

      </div>
    </section>
  );
};
