import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
import { TiltCard } from '../common/TiltCard';
import { RevealOnScroll } from '../common/RevealOnScroll';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from 'lucide-react';

export const EventsTimeline: React.FC = () => {
  const { events, websiteSettings } = useWedding();

  if (!websiteSettings.show_events_section) return null;

  const publishedEvents = events.filter(e => e.is_published);

  if (publishedEvents.length === 0) {
    return null;
  }

  const getGoogleMapsLink = (event: typeof publishedEvents[0]) => {
    if (event.google_maps_url && event.google_maps_url.trim().length > 0) {
      return event.google_maps_url;
    }
    const query = encodeURIComponent(`${event.venue_name}, ${event.full_address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="events" className="py-20 px-4 relative z-10 bg-gradient-to-b from-transparent via-[#FFF8E7]/40 to-transparent">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <RevealOnScroll variant="fade-up">
          <div className="text-center mb-14">
            <p className="font-heading uppercase tracking-[0.25em] text-xs font-bold text-gold-deep mb-2">
              Ceremonies &amp; Celebrations
            </p>
            <h2 className="font-couple text-3xl sm:text-5xl text-maroon font-bold">
              Wedding Itinerary
            </h2>
            <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
              Join us in the sacred rituals, colorful celebrations, and joyous feasts.
            </p>
            <RoyalDivider />
          </div>
        </RevealOnScroll>

        {/* Events Cards Grid with 3D Tilt & Staggered Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-9">
          {publishedEvents.map((event, index) => {
            const mapsLink = getGoogleMapsLink(event);
            const isSangeet = /sangeet|sangeeth/i.test(event.event_name);
            return (
              <RevealOnScroll 
                key={event.id}
                variant="fade-up" 
                delayMs={index * 140}
                className="h-full"
              >
                <TiltCard maxTilt={5} className="h-full">
                  <div className="royal-card corner-flourish rounded-2xl overflow-hidden border-2 border-gold/40 bg-[#FFFDF9] flex flex-col justify-between h-full shadow-card-luxury group">
                    
                    {/* Event Cover Photo if available */}
                    {event.cover_photo_url && (
                      <div className="relative h-48 sm:h-56 overflow-hidden bg-cream">
                        <img
                          src={event.cover_photo_url}
                          alt={event.event_name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-text/80 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Order Badge with Pulse */}
                        <div className="absolute top-3 left-3 bg-maroon text-gold border-2 border-gold rounded-full w-9 h-9 flex items-center justify-center font-couple font-bold text-sm shadow-gold-glow group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>

                        {/* Date & Time Tag over Image */}
                        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5 text-white text-xs font-heading font-medium">
                          <div className="flex items-center space-x-1.5 bg-maroon-deep/85 backdrop-blur-md px-3 py-1 rounded-full border border-gold/50 shadow">
                            <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                            <span className="truncate">{formatEventDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 bg-maroon-deep/85 backdrop-blur-md px-3 py-1 rounded-full border border-gold/50 shadow">
                            <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                            <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Event Content */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {!event.cover_photo_url && (
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-heading font-bold text-gold-deep mb-3">
                            <div className="flex items-center space-x-1.5 bg-cream/80 px-3 py-1 rounded-full border border-gold/30">
                              <Calendar className="w-3.5 h-3.5 text-gold-deep flex-shrink-0" />
                              <span>{formatEventDate(event.event_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 bg-cream/80 px-3 py-1 rounded-full border border-gold/30">
                              <Clock className="w-3.5 h-3.5 text-gold-deep flex-shrink-0" />
                              <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                            </div>
                          </div>
                        )}

                        <h3 className="font-couple text-xl sm:text-2xl font-bold text-maroon mb-2 group-hover:text-gold-deep transition-colors break-words">
                          {event.event_name}
                        </h3>

                        {event.description && (
                          <p className="font-heading text-sm text-dark-text/85 mb-4 leading-relaxed break-words">
                            {event.description}
                          </p>
                        )}

                        {/* Sangeet Special WhatsApp Participation Field */}
                        {isSangeet && (
                          <div className="my-4">
                            <a
                              href="https://wa.me/917620598347?text=I%20am%20interested"
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Send WhatsApp message: I am interested"
                              className="group/wa relative flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#25D366]/10 via-[#FFF9EE] to-[#25D366]/15 border border-[#25D366]/40 hover:border-[#25D366] shadow-sm hover:shadow-md transition-all duration-300 block cursor-pointer overflow-hidden"
                            >
                              {/* Background sheen on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/wa:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-heading font-bold text-sm text-dark-text group-hover/wa:text-[#128C7E] transition-colors leading-tight break-words">
                                    I am interested
                                  </p>
                                  <p className="text-[11px] text-dark-muted font-heading mt-0.5 break-words">
                                    Tap to connect for Sangeet participation
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                <span className="text-[11px] font-heading font-semibold text-[#128C7E] hidden sm:inline">
                                  WhatsApp
                                </span>
                                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover/wa:scale-110 group-hover/wa:bg-[#20ba59] transition-transform duration-200">
                                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                  </svg>
                                </div>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Venue & Location Button */}
                      <div className="pt-4 border-t border-gold/20 mt-4">
                        <div className="flex items-start space-x-2 text-xs text-dark-muted mb-4">
                          <MapPin className="w-4 h-4 text-gold-deep flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-dark-text text-sm break-words">
                              {event.venue_name}
                            </p>
                            <p className="text-dark-muted break-words">
                              {event.full_address}
                            </p>
                          </div>
                        </div>

                        <a
                          href={mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-royal-maroon w-full py-2.5 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98"
                        >
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span>View Location on Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>

                  </div>
                </TiltCard>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
};
