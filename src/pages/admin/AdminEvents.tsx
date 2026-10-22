import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { saveWeddingEvent, deleteWeddingEvent, uploadMediaFile } from '../../services/weddingService';
import { WeddingEvent } from '../../types/wedding';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Clock, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  X,
  Save
} from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const { events, refreshData } = useWedding();
  const [editingEvent, setEditingEvent] = useState<Partial<WeddingEvent> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingEvent({
      event_name: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      start_time: '18:00',
      end_time: '22:00',
      time_zone: 'Asia/Kolkata',
      venue_name: '',
      full_address: '',
      google_maps_url: '',
      cover_photo_url: '',
      display_order: events.length + 1,
      is_published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: WeddingEvent) => {
    setEditingEvent({ ...event });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete event "${name}"?`)) return;
    const res = await deleteWeddingEvent(id);
    if (res.success) {
      setMessage({ text: 'Event deleted successfully.', type: 'success' });
      await refreshData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: res.error || 'Failed to delete event.', type: 'error' });
    }
  };

  const handleTogglePublish = async (event: WeddingEvent) => {
    const res = await saveWeddingEvent({
      id: event.id,
      is_published: !event.is_published
    });
    if (res.success) {
      await refreshData();
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;
    setUploadingCover(true);
    const res = await uploadMediaFile(file, 'events');
    if (res.success && res.url) {
      setEditingEvent(prev => ({ ...prev, cover_photo_url: res.url }));
    } else {
      alert(res.error || 'Upload failed');
    }
    setUploadingCover(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.event_name || !editingEvent?.venue_name || !editingEvent?.event_date) {
      alert('Event Name, Date, and Venue are required.');
      return;
    }
    setIsSaving(true);
    const res = await saveWeddingEvent(editingEvent);
    if (res.success) {
      setIsModalOpen(false);
      setMessage({ text: 'Event saved successfully!', type: 'success' });
      await refreshData();
      setTimeout(() => setMessage(null), 3000);
    } else {
      alert(res.error || 'Save failed');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
            Wedding Events &amp; Itinerary
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-heading">
            Add ceremonies, receptions, timings, addresses, and maps directions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-royal-maroon px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add New Ceremony / Event</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
              event.is_published ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-maroon font-bold text-xs flex items-center justify-center">
                      {event.display_order}
                    </span>
                    <h3 className="font-couple text-lg font-bold text-gray-900">
                      {event.event_name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1 pl-8">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-deep" />
                      <span>{event.event_date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gold-deep" />
                      <span>{event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePublish(event)}
                  className={`p-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    event.is_published 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                  title={event.is_published ? 'Published (Click to hide)' : 'Hidden (Click to publish)'}
                >
                  {event.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {event.description && (
                <p className="text-xs text-gray-600 line-clamp-2 mb-4 pl-8">
                  {event.description}
                </p>
              )}

              <div className="pl-8 text-xs text-gray-600 flex items-start space-x-1.5 mb-4">
                <MapPin className="w-3.5 h-3.5 text-gold-deep flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-800">{event.venue_name}</span>
                  <p className="text-gray-500">{event.full_address}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => handleOpenEdit(event)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium inline-flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-gold-deep" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(event.id, event.event_name)}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium inline-flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h2 className="font-couple text-xl font-bold text-maroon">
                {editingEvent.id ? 'Edit Event' : 'Add New Wedding Event'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.event_name || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_name: e.target.value })}
                  placeholder="e.g. Sangeet &amp; Cocktail Night"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Details of rituals, dress code, music..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editingEvent.event_date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={editingEvent.start_time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, start_time: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editingEvent.end_time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, end_time: e.target.value })}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.venue_name || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venue_name: e.target.value })}
                  placeholder="e.g. Royal Courtyard"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  value={editingEvent.full_address || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, full_address: e.target.value })}
                  placeholder="Street, Landmark, City"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={editingEvent.google_maps_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, google_maps_url: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cover Photo
                </label>
                <div className="flex items-center space-x-3">
                  <label className="btn-royal-maroon px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer inline-flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                  </label>
                  {editingEvent.cover_photo_url && (
                    <img
                      src={editingEvent.cover_photo_url}
                      alt="Cover"
                      className="w-10 h-10 object-cover rounded-lg border border-gold"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="eventPublish"
                    checked={editingEvent.is_published ?? true}
                    onChange={(e) => setEditingEvent({ ...editingEvent, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-maroon focus:ring-gold"
                  />
                  <label htmlFor="eventPublish" className="text-xs font-medium text-gray-700">
                    Publish immediately on website
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-gray-500">Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={editingEvent.display_order || 1}
                    onChange={(e) => setEditingEvent({ ...editingEvent, display_order: Number(e.target.value) })}
                    className="w-16 px-2 py-1 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-royal-maroon px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 shadow cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-gold" />
                  <span>{isSaving ? 'Saving...' : 'Save Ceremony'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
