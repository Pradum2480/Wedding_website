import React, { useState, useEffect } from 'react';
import { fetchRSVPsAdmin, deleteRSVP, exportRSVPsToCSV } from '../../services/weddingService';
import { WeddingRSVP } from '../../types/wedding';
import { 
  Users, 
  Search, 
  Download, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Phone, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';

export const AdminRSVPs: React.FC = () => {
  const [rsvps, setRsvps] = useState<WeddingRSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined'>('all');

  const loadRSVPs = async () => {
    setLoading(true);
    const res = await fetchRSVPsAdmin();
    setRsvps(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRSVPs();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete RSVP submission for "${name}"?`)) return;
    const res = await deleteRSVP(id);
    if (res.success) {
      setRsvps(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleExportCSV = () => {
    exportRSVPsToCSV(filteredRSVPs);
  };

  // Metrics
  const totalSubmissions = rsvps.length;
  const attendingSubmissions = rsvps.filter(r => r.attendance_status === 'attending');
  const totalGuestsAttending = attendingSubmissions.reduce((sum, r) => sum + (r.attendees_count || 1), 0);
  const totalDeclined = rsvps.filter(r => r.attendance_status === 'declined').length;

  // Filtered
  const filteredRSVPs = rsvps.filter(r => {
    if (statusFilter !== 'all' && r.attendance_status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = r.guest_name.toLowerCase().includes(q);
      const phoneMatch = r.phone_number?.toLowerCase().includes(q);
      const msgMatch = r.message?.toLowerCase().includes(q);
      return nameMatch || phoneMatch || msgMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
            RSVP Responses &amp; Guest Registry
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-heading">
            Review attendee counts, personal blessings, phone numbers, and download CSV report.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadRSVPs}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filteredRSVPs.length === 0}
            className="btn-royal-maroon px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 shadow cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Responses</span>
          <p className="text-2xl font-bold text-gray-900 font-couple mt-1">{totalSubmissions}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-green-700 font-medium">Attending Parties</span>
          <p className="text-2xl font-bold text-green-700 font-couple mt-1">{attendingSubmissions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gold-deep font-medium">Total Guests Confirmed</span>
          <p className="text-2xl font-bold text-maroon font-couple mt-1">{totalGuestsAttending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-red-600 font-medium">Declined</span>
          <p className="text-2xl font-bold text-red-600 font-couple mt-1">{totalDeclined}</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, phone, or message..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="all">All Responses ({rsvps.length})</option>
            <option value="attending">Attending ({attendingSubmissions.length})</option>
            <option value="declined">Declined ({totalDeclined})</option>
          </select>
        </div>
      </div>

      {/* RSVPs Table / Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading RSVP responses...
          </div>
        ) : filteredRSVPs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Count</th>
                  <th className="py-3.5 px-4 font-semibold">Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Message &amp; Blessings</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRSVPs.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {rsvp.guest_name}
                    </td>
                    <td className="py-3.5 px-4">
                      {rsvp.attendance_status === 'attending' ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Attending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declined</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {rsvp.attendance_status === 'attending' ? `${rsvp.attendees_count} Guest(s)` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      {rsvp.phone_number ? (
                        <span className="inline-flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gold-deep" />
                          <span>{rsvp.phone_number}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-700 max-w-xs truncate" title={rsvp.message}>
                      {rsvp.message ? (
                        <span className="italic">"{rsvp.message}"</span>
                      ) : (
                        <span className="text-gray-400 italic">No note left</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(rsvp.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(rsvp.id, rsvp.guest_name)}
                        className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Delete RSVP"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">
            No RSVP submissions match your search criteria.
          </div>
        )}
      </div>

    </div>
  );
};
