import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { Link } from 'react-router-dom';
import { Heart, Lock, RotateCcw, Sparkles } from 'lucide-react';

interface FooterProps {
  onReplayCover: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayCover }) => {
  const { settings } = useWedding();

  return (
    <footer className="relative bg-mandala-pattern text-cream pt-16 pb-12 px-4 border-t-2 border-gold/40">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Monogram */}
        <div className="w-16 h-16 rounded-full bg-maroon-deep border-2 border-gold flex items-center justify-center mx-auto mb-4 text-gold shadow-gold-glow">
          <span className="font-couple text-2xl font-bold tracking-wider">
            {settings.groom_name?.[0] || 'D'} &amp; {settings.bride_name?.[0] || 'P'}
          </span>
        </div>

        <h3 className="font-couple text-2xl sm:text-3xl font-bold text-gold tracking-tight mb-2">
          {settings.groom_name} &amp; {settings.bride_name}
        </h3>

        <p className="font-script text-2xl text-gold-light mb-4">
          Together Forever
        </p>

        {settings.footer_message && (
          <p className="font-heading text-sm sm:text-base text-cream/90 max-w-lg mx-auto italic mb-6">
            "{settings.footer_message}"
          </p>
        )}

        <RoyalDivider theme="light" />

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-heading font-medium text-cream/70 my-6">
          <button
            onClick={onReplayCover}
            className="hover:text-gold transition-colors inline-flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Invitation Cover</span>
          </button>
          
          <span>&bull;</span>

          <a href="#countdown" className="hover:text-gold transition-colors">
            Live Countdown
          </a>

          <span>&bull;</span>

          <a href="#events" className="hover:text-gold transition-colors">
            Itinerary
          </a>

          <span>&bull;</span>

          <a href="#rsvp" className="hover:text-gold transition-colors">
            RSVP
          </a>

          <span>&bull;</span>

          {/* Discreet Admin Link */}
          <Link
            to="/admin/login"
            className="hover:text-gold transition-colors inline-flex items-center space-x-1 text-gold/60"
            title="Administrator Portal"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Portal</span>
          </Link>
        </div>

        <p className="text-[11px] text-cream/50 font-heading">
          With warmest gratitude from the {settings.groom_family_name || 'Groom'} &amp; {settings.bride_family_name || 'Bride'} Families.
        </p>

      </div>
    </footer>
  );
};
