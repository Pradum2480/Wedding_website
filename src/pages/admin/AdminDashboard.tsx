import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWedding } from '../../context/WeddingContext';
import { fetchRSVPsAdmin } from '../../services/weddingService';
import { WeddingRSVP } from '../../types/wedding';
import { 
  Heart, 
  Calendar, 
  Images, 
  FolderHeart, 
  Users, 
  UserCheck, 
  UserX, 
  ArrowUpRight, 
  Sparkles, 
  Clock, 
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { settings, events, photos, albums } = useWedding();
  const [rsvps, setRsvps] = useState<WeddingRSVP[]>([]);
  const [loadingRSVPs, setLoadingRSVPs] = useState(true);

  useEffect(() => {
    fetchRSVPsAdmin().then(res => {
      setRsvps(res.data);
      setLoadingRSVPs(false);
    });
  }, []);

  // Compute metrics
  const totalPublishedPhotos = photos.filter(p => p.is_published && p.category !== 'after_wedding').length;
  const totalAfterWeddingPhotos = photos.filter(p => p.is_published && p.category === 'after_wedding').length;
  const totalEvents = events.length;
  const totalRSVPs = rsvps.length;
  const confirmedAttendees = rsvps
    .filter(r => r.attendance_status === 'attending')
    .reduce((sum, r) => sum + (r.attendees_count || 1), 0);
  const declinedResponses = rsvps.filter(r => r.attendance_status === 'declined').length;

  const upcomingEvents = events
    .filter(e => e.is_published)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 3);

  const statsCards = [
    { label: 'Total RSVPs', value: totalRSVPs, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Confirmed Guests', value: confirmedAttendees, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Declined Responses', value: declinedResponses, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Wedding Events', value: totalEvents, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Gallery Photos', value: totalPublishedPhotos, icon: Images, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'After-Wedding Photos', value: totalAfterWeddingPhotos, icon: FolderHeart, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-maroon via-maroon-rich to-maroon text-cream rounded-2xl p-6 sm:p-8 border border-gold/40 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-gold text-xs font-heading font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Wedding Command Center</span>
          </div>
          <h1 className="font-couple text-2xl sm:text-4xl font-bold text-cream mb-2">
            {settings.groom_name} &amp; {settings.bride_name}
          </h1>
          <p className="font-heading text-xs sm:text-sm text-cream/80 max-w-xl">
            Manage your wedding details, ceremonies, photographs, and guest RSVP confirmations seamlessly from one unified dashboard.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/wedding-details"
              className="btn-royal-gold px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Edit Couple &amp; Wedding</span>
            </Link>
            <Link
              to="/admin/gallery"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cream border border-cream/20 inline-flex items-center space-x-1.5"
            >
              <Images className="w-3.5 h-3.5 text-gold" />
              <span>Upload Photos</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cream border border-cream/20 inline-flex items-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold" />
              <span>Preview Website</span>
            </a>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statsCards.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {st.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${st.bg} flex items-center justify-center ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-couple">
                {st.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Shortcuts & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Action Shortcuts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="font-couple text-xl font-bold text-maroon mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/wedding-details"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">Wedding Details</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>

            <Link
              to="/admin/events"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">Manage Events</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>

            <Link
              to="/admin/gallery"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Images className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">Wedding Gallery</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>

            <Link
              to="/admin/after-wedding"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <FolderHeart className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">After-Wedding Photos</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>

            <Link
              to="/admin/rsvps"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">Guest RSVPs</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>

            <Link
              to="/admin/settings"
              className="p-3.5 rounded-xl border border-gray-100 hover:border-gold hover:bg-cream/40 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-maroon" />
                <span className="text-xs font-medium text-gray-800">Website &amp; Audio</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
            </Link>
          </div>
        </div>

        {/* Upcoming Events Preview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-couple text-xl font-bold text-maroon">
                Scheduled Ceremonies
              </h2>
              <Link to="/admin/events" className="text-xs font-semibold text-gold-deep hover:text-maroon">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900">
                      {event.event_name}
                    </h3>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gold-deep" />
                        <span>{event.event_date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gold-deep" />
                        <span>{event.start_time}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-maroon hover:text-gold-deep flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add another ceremony / event</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
