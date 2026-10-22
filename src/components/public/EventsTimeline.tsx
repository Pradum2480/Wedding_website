import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { RoyalDivider } from '../common/RoyalDivider';
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
    <section id="events" className="py-16 px-4 relative z-10 bg-gradient-to-b from-transparent via-[#FFF8E7]/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="font-heading uppercase tracking-[0.25em] text-xs font-semibold text-gold-deep mb-2">
            Ceremonies &amp; Celebrations
          </p>
          <h2 className="font-couple text-3xl sm:text-4xl text-maroon font-bold">
            Wedding Itinerary
          </h2>
          <p className="font-heading text-sm sm:text-base text-dark-muted max-w-lg mx-auto mt-2">
            Join us in the sacred rituals, colorful celebrations, and joyous feasts.
          </p>
          <RoyalDivider />
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {publishedEvents.map((event, index) => {
            const mapsLink = getGoogleMapsLink(event);
            return (
              <div 
                key={event.id}
                className="royal-card corner-flourish rounded-2xl overflow-hidden border border-gold/40 bg-[#FFFDF9] flex flex-col justify-between"
              >
                {/* Event Cover Photo if available */}
                {event.cover_photo_url && (
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-cream">
                    <img
                      src={event.cover_photo_url}
                      alt={event.event_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-text/70 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Order Badge */}
                    <div className="absolute top-3 left-3 bg-maroon/90 text-gold border border-gold/50 rounded-full w-8 h-8 flex items-center justify-center font-couple font-bold text-sm shadow">
                      {index + 1}
                    </div>

                    {/* Date Tag over Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-heading font-medium">
                      <div className="flex items-center space-x-1.5 bg-maroon-deep/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/40">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                        <span>{formatEventDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-maroon-deep/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/40">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {!event.cover_photo_url && (
                      <div className="flex items-center justify-between text-xs font-heading font-medium text-gold-deep mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>{formatEventDate(event.event_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                        </div>
                      </div>
                    )}

                    <h3 className="font-couple text-xl sm:text-2xl font-bold text-maroon mb-2">
                      {event.event_name}
                    </h3>

                    {event.description && (
                      <p className="font-heading text-sm text-dark-text/80 mb-5 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Venue & Location Button */}
                  <div className="pt-4 border-t border-gold/20 mt-4">
                    <div className="flex items-start space-x-2 text-xs text-dark-muted mb-4">
                      <MapPin className="w-4 h-4 text-gold-deep flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-dark-text text-sm">
                          {event.venue_name}
                        </p>
                        <p className="text-dark-muted">
                          {event.full_address}
                        </p>
                      </div>
                    </div>

                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-royal-maroon w-full py-2.5 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-sm hover:shadow"
                    >
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>View Location on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
