import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { Link } from 'react-router-dom';
import { Heart, Lock, RotateCcw, Sparkles, Phone } from 'lucide-react';

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

        <h3 className="font-couple text-2xl sm:text-3xl font-bold text-gold tracking-tight mb-2 break-words">
          {settings.groom_name} &amp; {settings.bride_name}
        </h3>

        <p className="font-script text-2xl text-gold-light mb-4">
          Together Forever
        </p>

        {settings.footer_message && (
          <p className="font-heading text-sm sm:text-base text-cream/90 max-w-lg mx-auto italic mb-6 break-words">
            "{settings.footer_message}"
          </p>
        )}

        <RoyalDivider theme="light" />

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-heading font-medium text-cream/70 mt-6 mb-4">
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
        </div>

        {/* Admin Portal & Contact Information */}
        <div className="inline-flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2.5 px-4 sm:px-6 py-2 rounded-2xl sm:rounded-full bg-maroon-deep/70 border border-gold/35 shadow-sm text-xs font-heading my-4">
          <Link
            to="/admin/login"
            className="text-gold/80 hover:text-gold transition-colors inline-flex items-center space-x-1.5 font-medium"
            title="Administrator Portal"
          >
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Admin Portal</span>
          </Link>

          <span className="text-gold/40 hidden sm:inline">&bull;</span>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-cream/90">
            <span className="text-cream/70">Admin:</span>
            <span className="text-gold font-semibold tracking-wide">+91 7620 598 347</span>

            <div className="inline-flex items-center space-x-1.5 ml-0.5">
              {/* Normal Phone Call Button */}
              <a
                href="tel:+917620598347"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold hover:text-gold-light transition-all shadow-xs group cursor-pointer"
                title="Call +91 7620 598 347"
                aria-label="Direct Phone Call"
              >
                <Phone className="w-3 h-3 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium">Call</span>
              </a>

              {/* WhatsApp Chat Button */}
              <a
                href="https://wa.me/917620598347?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20the%20royal%20wedding%20invitation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] hover:text-[#42ec7f] transition-all shadow-xs group cursor-pointer"
                title="Chat on WhatsApp (+91 7620 598 347)"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-3 h-3 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="text-[11px] font-medium">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-cream/50 font-heading mt-2">
          With warmest gratitude from the {settings.groom_family_name || 'Groom'} &amp; {settings.bride_family_name || 'Bride'} Families.
        </p>

      </div>
    </footer>
  );
};
