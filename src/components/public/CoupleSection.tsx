import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { Heart, Sparkles, UserCheck } from 'lucide-react';

export const CoupleSection: React.FC = () => {
  const { settings, websiteSettings } = useWedding();

  if (!websiteSettings.show_couple_section) return null;

  return (
    <section id="couple" className="py-16 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-heading uppercase tracking-[0.25em] text-xs font-semibold text-gold-deep mb-2">
            The Blessed Souls
          </p>
          <h2 className="font-couple text-3xl sm:text-4xl text-maroon font-bold">
            Groom &amp; Bride
          </h2>
          <RoyalDivider />
        </div>

        {/* Couple Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Groom Card */}
          <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-8 bg-[#FFFDF9] border-2 border-gold/40 flex flex-col items-center text-center">
            
            {/* Photo with Royal Ornate Frame */}
            <div className="relative mb-6">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold shadow-gold-glow relative z-10 bg-cream">
                <img
                  src={settings.groom_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                  alt={settings.groom_name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 border border-gold/40 rounded-full pointer-events-none animate-spin-slow" />
            </div>

            <span className="font-heading uppercase tracking-[0.2em] text-xs font-bold text-gold-deep mb-1">
              The Royal Groom
            </span>

            <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-1">
              {settings.groom_name}
            </h3>

            {settings.groom_nickname && (
              <p className="font-script text-xl text-gold-deep mb-3">
                "{settings.groom_nickname}"
              </p>
            )}

            {settings.groom_bio && (
              <p className="font-heading text-sm text-dark-muted leading-relaxed mb-6 italic max-w-sm">
                "{settings.groom_bio}"
              </p>
            )}

            {/* Family Details if enabled */}
            {websiteSettings.show_family_details && (settings.groom_father_name || settings.groom_mother_name) && (
              <div className="mt-auto w-full pt-4 border-t border-gold/20 text-xs text-dark-text">
                <p className="font-heading uppercase tracking-wider font-semibold text-gold-deep mb-1">
                  Son of
                </p>
                <p className="font-medium text-dark-text">
                  {settings.groom_mother_name} &amp; {settings.groom_father_name}
                </p>
                {settings.groom_family_name && (
                  <p className="text-[11px] text-maroon font-semibold mt-0.5">
                    ({settings.groom_family_name})
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Bride Card */}
          <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-8 bg-[#FFFDF9] border-2 border-gold/40 flex flex-col items-center text-center">
            
            {/* Photo with Royal Ornate Frame */}
            <div className="relative mb-6">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold shadow-gold-glow relative z-10 bg-cream">
                <img
                  src={settings.bride_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                  alt={settings.bride_name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 border border-gold/40 rounded-full pointer-events-none animate-spin-slow" />
            </div>

            <span className="font-heading uppercase tracking-[0.2em] text-xs font-bold text-gold-deep mb-1">
              The Royal Bride
            </span>

            <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-1">
              {settings.bride_name}
            </h3>

            {settings.bride_nickname && (
              <p className="font-script text-xl text-gold-deep mb-3">
                "{settings.bride_nickname}"
              </p>
            )}

            {settings.bride_bio && (
              <p className="font-heading text-sm text-dark-muted leading-relaxed mb-6 italic max-w-sm">
                "{settings.bride_bio}"
              </p>
            )}

            {/* Family Details if enabled */}
            {websiteSettings.show_family_details && (settings.bride_father_name || settings.bride_mother_name) && (
              <div className="mt-auto w-full pt-4 border-t border-gold/20 text-xs text-dark-text">
                <p className="font-heading uppercase tracking-wider font-semibold text-gold-deep mb-1">
                  Daughter of
                </p>
                <p className="font-medium text-dark-text">
                  {settings.bride_mother_name} &amp; {settings.bride_father_name}
                </p>
                {settings.bride_family_name && (
                  <p className="text-[11px] text-maroon font-semibold mt-0.5">
                    ({settings.bride_family_name})
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
