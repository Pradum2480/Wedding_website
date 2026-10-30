import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Sparkles, Heart } from 'lucide-react';

export const CoupleSection: React.FC = () => {
  const { settings, websiteSettings } = useWedding();

  if (!websiteSettings.show_couple_section) return null;

  return (
    <section id="couple" className="py-20 px-4 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-14">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              The Blessed Union
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold tracking-tight">
              Groom &amp; Bride
            </h2>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Couple Cards Grid with 3D Tilt & Celestial Dual Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Groom Card */}
          <RevealOnScroll variant="slide-left" delayMs={150}>
            <TiltCard maxTilt={6} className="h-full">
              <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-9 bg-[#FFFDF9] border-2 border-gold/50 flex flex-col items-center text-center h-full shadow-card-luxury relative overflow-hidden group">
                
                {/* Background Ambient Glow on Hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500 pointer-events-none" />

                {/* Photo with Celestial Dual Orbiting Filigree Rings */}
                <div className="relative mb-7 select-none">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold shadow-gold-glow relative z-10 bg-cream">
                    <img
                      src={settings.groom_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                      alt={settings.groom_name}
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Outer Ring 1: Clockwise with decorative star gems */}
                  <div className="absolute -inset-3.5 border border-gold/50 rounded-full pointer-events-none animate-orbit-cw">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gold rounded-full shadow-gold-glow" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold-deep rounded-full" />
                  </div>

                  {/* Outer Ring 2: Counter-Clockwise dashed filigree */}
                  <div className="absolute -inset-6 border border-dashed border-gold/30 rounded-full pointer-events-none animate-orbit-ccw" />
                </div>

                <span className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-1">
                  The Royal Groom
                </span>

                <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-1 break-words max-w-full">
                  {settings.groom_name}
                </h3>

                {settings.groom_nickname && (
                  <p className="font-script text-xl text-gold-deep mb-3 break-words max-w-full">
                    "{settings.groom_nickname}"
                  </p>
                )}

                {settings.groom_bio && (
                  <p className="font-heading text-sm text-dark-muted leading-relaxed mb-6 italic max-w-sm break-words">
                    "{settings.groom_bio}"
                  </p>
                )}

                {/* Family Details if enabled */}
                {websiteSettings.show_family_details && (settings.groom_father_name || settings.groom_mother_name) && (
                  <div className="mt-auto w-full pt-4 border-t border-gold/20 text-xs text-dark-text break-words">
                    <p className="font-heading uppercase tracking-wider font-bold text-gold-deep mb-1">
                      Son of
                    </p>
                    <p className="font-semibold text-dark-text break-words">
                      {settings.groom_mother_name} &amp; {settings.groom_father_name}
                    </p>
                    {settings.groom_family_name && (
                      <p className="text-[11px] text-maroon font-bold mt-0.5 break-words">
                        ({settings.groom_family_name})
                      </p>
                    )}
                  </div>
                )}

              </div>
            </TiltCard>
          </RevealOnScroll>

          {/* Bride Card */}
          <RevealOnScroll variant="slide-right" delayMs={250}>
            <TiltCard maxTilt={6} className="h-full">
              <div className="royal-card corner-flourish rounded-2xl p-6 sm:p-9 bg-[#FFFDF9] border-2 border-gold/50 flex flex-col items-center text-center h-full shadow-card-luxury relative overflow-hidden group">
                
                {/* Background Ambient Glow on Hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500 pointer-events-none" />

                {/* Photo with Celestial Dual Orbiting Filigree Rings */}
                <div className="relative mb-7 select-none">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gold shadow-gold-glow relative z-10 bg-cream">
                    <img
                      src={settings.bride_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt={settings.bride_name}
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>

                  {/* Outer Ring 1: Clockwise with decorative star gems */}
                  <div className="absolute -inset-3.5 border border-gold/50 rounded-full pointer-events-none animate-orbit-cw">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gold rounded-full shadow-gold-glow" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold-deep rounded-full" />
                  </div>

                  {/* Outer Ring 2: Counter-Clockwise dashed filigree */}
                  <div className="absolute -inset-6 border border-dashed border-gold/30 rounded-full pointer-events-none animate-orbit-ccw" />
                </div>

                <span className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-1">
                  The Royal Bride
                </span>

                <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-1 break-words max-w-full">
                  {settings.bride_name}
                </h3>

                {settings.bride_nickname && (
                  <p className="font-script text-xl text-gold-deep mb-3 break-words max-w-full">
                    "{settings.bride_nickname}"
                  </p>
                )}

                {settings.bride_bio && (
                  <p className="font-heading text-sm text-dark-muted leading-relaxed mb-6 italic max-w-sm break-words">
                    "{settings.bride_bio}"
                  </p>
                )}

                {/* Family Details if enabled */}
                {websiteSettings.show_family_details && (settings.bride_father_name || settings.bride_mother_name) && (
                  <div className="mt-auto w-full pt-4 border-t border-gold/20 text-xs text-dark-text break-words">
                    <p className="font-heading uppercase tracking-wider font-bold text-gold-deep mb-1">
                      Daughter of
                    </p>
                    <p className="font-semibold text-dark-text break-words">
                      {settings.bride_mother_name} &amp; {settings.bride_father_name}
                    </p>
                    {settings.bride_family_name && (
                      <p className="text-[11px] text-maroon font-bold mt-0.5 break-words">
                        ({settings.bride_family_name})
                      </p>
                    )}
                  </div>
                )}

              </div>
            </TiltCard>
          </RevealOnScroll>

        </div>

      </div>
    </section>
  );
};
