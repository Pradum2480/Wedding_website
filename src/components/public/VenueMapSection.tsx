import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { MapPin, Navigation, ExternalLink, Building2 } from 'lucide-react';

export const VenueMapSection: React.FC = () => {
  const { settings } = useWedding();

  const googleMapsUrl = settings.google_maps_url && settings.google_maps_url.trim().length > 0
    ? settings.google_maps_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${settings.venue_name}, ${settings.address_line}, ${settings.city}, ${settings.state}`)}`;

  return (
    <section id="venue" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-10">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              The Royal Destination
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold">
              Venue &amp; Location
            </h2>
            <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
              We eagerly look forward to welcoming you to the magnificent celebration grounds.
            </p>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Venue Information Card with 3D Tilt */}
        <RevealOnScroll variant="scale-up" delayMs={150}>
          <TiltCard maxTilt={5}>
            <div className="royal-card corner-flourish rounded-2xl overflow-hidden border-2 border-gold/50 bg-[#FFFDF9] shadow-card-luxury p-6 sm:p-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Venue Details */}
                <div className="min-w-0 break-words">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 text-gold-deep text-xs font-heading font-bold uppercase tracking-wider mb-4 border border-gold/30">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Wedding Venue</span>
                  </div>

                  <h3 className="font-couple text-2xl sm:text-3xl font-bold text-maroon mb-3 break-words">
                    {settings.venue_name}
                  </h3>

                  <div className="space-y-2 text-dark-text font-heading text-sm sm:text-base mb-6 leading-relaxed break-words">
                    <p className="font-semibold text-dark-text break-words">
                      {settings.address_line}
                    </p>
                    <p className="text-dark-muted break-words">
                      {settings.city}, {settings.state} {settings.postal_code ? `- ${settings.postal_code}` : ''}
                    </p>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-royal-maroon px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-gold" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold" />
                  </a>
                </div>

                {/* Visual Destination Frame */}
                <div className="relative rounded-xl overflow-hidden border-2 border-gold/40 shadow-md aspect-video sm:aspect-square bg-cream group">
                  <img
                    src={settings.cover_image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
                    alt={settings.venue_name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-text/80 via-transparent to-transparent flex items-end p-5">
                    <div className="flex items-center space-x-2 text-white text-xs font-heading font-medium">
                      <MapPin className="w-4 h-4 text-gold flex-shrink-0 animate-bounce" />
                      <span className="truncate">{settings.city}, {settings.state}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </TiltCard>
        </RevealOnScroll>

      </div>
    </section>
  );
};
