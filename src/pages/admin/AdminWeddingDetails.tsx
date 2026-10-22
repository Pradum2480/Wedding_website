import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { updateWeddingSettings, uploadMediaFile } from '../../services/weddingService';
import { WeddingSettings } from '../../types/wedding';
import { 
  Heart, 
  Save, 
  ExternalLink, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';

export const AdminWeddingDetails: React.FC = () => {
  const { settings, refreshData } = useWedding();
  const [formData, setFormData] = useState<WeddingSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);

  const handleChange = (field: keyof WeddingSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'groom' | 'bride') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'groom') setUploadingGroom(true);
    if (target === 'bride') setUploadingBride(true);

    const res = await uploadMediaFile(file, 'couple');
    if (res.success && res.url) {
      if (target === 'groom') handleChange('groom_photo_url', res.url);
      if (target === 'bride') handleChange('bride_photo_url', res.url);
    } else {
      setErrorMessage(res.error || 'Photo upload failed');
    }

    if (target === 'groom') setUploadingGroom(false);
    if (target === 'bride') setUploadingBride(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    if (!formData.groom_name.trim() || !formData.bride_name.trim()) {
      setErrorMessage('Groom and Bride names are required.');
      setIsSaving(false);
      return;
    }

    if (!formData.wedding_date || !formData.venue_name.trim()) {
      setErrorMessage('Wedding Date and Venue Name are required.');
      setIsSaving(false);
      return;
    }

    const res = await updateWeddingSettings(formData);
    if (res.success) {
      setSaveSuccess(true);
      await refreshData();
      setTimeout(() => setSaveSuccess(false), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to save changes.');
    }

    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
            Wedding &amp; Couple Details
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-heading">
            Update couple profiles, auspicious date, time zone, venue, and invitation texts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 inline-flex items-center space-x-1.5 shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-deep" />
            <span>Preview Website</span>
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Wedding details saved successfully! Your public invitation has been updated immediately.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Groom & Bride Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GROOM DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-gold-deep" />
              <h2 className="font-couple text-lg font-bold text-maroon">
                Groom's Details
              </h2>
            </div>

            {/* Groom Photo Preview & Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border-2 border-gold overflow-hidden bg-cream flex-shrink-0">
                <img
                  src={formData.groom_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
                  alt="Groom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-heading font-semibold text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-2">
                  <label className="btn-royal-maroon px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer inline-flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{uploadingGroom ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, 'groom')}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.groom_name}
                onChange={(e) => handleChange('groom_name', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nickname <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.groom_nickname || ''}
                onChange={(e) => handleChange('groom_nickname', e.target.value)}
                placeholder="e.g. Dev"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.groom_father_name || ''}
                  onChange={(e) => handleChange('groom_father_name', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  value={formData.groom_mother_name || ''}
                  onChange={(e) => handleChange('groom_mother_name', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Family Name / Title
              </label>
              <input
                type="text"
                value={formData.groom_family_name || ''}
                onChange={(e) => handleChange('groom_family_name', e.target.value)}
                placeholder="e.g. Sharma Family"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Biography / Words
              </label>
              <textarea
                rows={2}
                value={formData.groom_bio || ''}
                onChange={(e) => handleChange('groom_bio', e.target.value)}
                placeholder="A few words about the groom..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>

          {/* BRIDE DETAILS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-gold-deep" />
              <h2 className="font-couple text-lg font-bold text-maroon">
                Bride's Details
              </h2>
            </div>

            {/* Bride Photo Preview & Upload */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border-2 border-gold overflow-hidden bg-cream flex-shrink-0">
                <img
                  src={formData.bride_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                  alt="Bride"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-heading font-semibold text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-2">
                  <label className="btn-royal-maroon px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer inline-flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{uploadingBride ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, 'bride')}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.bride_name}
                onChange={(e) => handleChange('bride_name', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nickname <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.bride_nickname || ''}
                onChange={(e) => handleChange('bride_nickname', e.target.value)}
                placeholder="e.g. Priya"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={formData.bride_father_name || ''}
                  onChange={(e) => handleChange('bride_father_name', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  value={formData.bride_mother_name || ''}
                  onChange={(e) => handleChange('bride_mother_name', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Family Name / Title
              </label>
              <input
                type="text"
                value={formData.bride_family_name || ''}
                onChange={(e) => handleChange('bride_family_name', e.target.value)}
                placeholder="e.g. Verma Family"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Short Biography / Words
              </label>
              <textarea
                rows={2}
                value={formData.bride_bio || ''}
                onChange={(e) => handleChange('bride_bio', e.target.value)}
                placeholder="A few words about the bride..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Wedding Event Dates, Venue & Texts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-gold-deep" />
            <h2 className="font-couple text-lg font-bold text-maroon">
              Wedding Date, Venue &amp; Invitation Content
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Wedding Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.wedding_date}
                onChange={(e) => handleChange('wedding_date', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.wedding_start_time}
                onChange={(e) => handleChange('wedding_start_time', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Time Zone
              </label>
              <input
                type="text"
                value={formData.time_zone}
                onChange={(e) => handleChange('time_zone', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Wedding Celebration Title
              </label>
              <input
                type="text"
                value={formData.wedding_title}
                onChange={(e) => handleChange('wedding_title', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Invitation Heading
              </label>
              <input
                type="text"
                value={formData.invitation_heading}
                onChange={(e) => handleChange('invitation_heading', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Invitation Message
            </label>
            <textarea
              rows={2}
              value={formData.invitation_message}
              onChange={(e) => handleChange('invitation_message', e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
            />
          </div>

          {/* Venue & Maps */}
          <div className="pt-3 border-t border-gray-100 space-y-4">
            <h3 className="text-xs font-heading uppercase tracking-wider font-bold text-gray-700">
              Venue Location &amp; Google Maps
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Venue Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.venue_name}
                onChange={(e) => handleChange('venue_name', e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Address Line
                </label>
                <input
                  type="text"
                  value={formData.address_line}
                  onChange={(e) => handleChange('address_line', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Maps Direct URL
              </label>
              <input
                type="url"
                value={formData.google_maps_url || ''}
                onChange={(e) => handleChange('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Leave empty to automatically generate a Google Maps search link from your venue name and address.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Footer Message
              </label>
              <input
                type="text"
                value={formData.footer_message || ''}
                onChange={(e) => handleChange('footer_message', e.target.value)}
                placeholder="Bless our new beginning with your presence and love."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-gold/50 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-royal-maroon px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Wedding Details'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
