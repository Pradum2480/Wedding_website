import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { 
  updateWebsiteSettings, 
  updateWeddingSettings, 
  uploadMediaFile 
} from '../../services/weddingService';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  resetSupabaseClient 
} from '../../services/supabase';
import { 
  Settings, 
  Music, 
  Volume2, 
  Upload, 
  Database, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  HelpCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { websiteSettings, settings, refreshData } = useWedding();
  const [siteForm, setSiteForm] = useState({ ...websiteSettings });
  const [musicForm, setMusicForm] = useState({
    music_url: settings.music_url || '',
    music_title: settings.music_title || 'Royal Shehnai Harmony',
    music_enabled: settings.music_enabled ?? true
  });

  // Supabase runtime credentials config
  const initialConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(initialConfig.anonKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleToggleSection = (key: keyof typeof siteForm) => {
    setSiteForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMusic(true);
    const res = await uploadMediaFile(file, 'audio');
    if (res.success && res.url) {
      setMusicForm(prev => ({
        ...prev,
        music_url: res.url!,
        music_title: file.name.replace(/\.[^/.]+$/, '')
      }));
      setMessage({ text: 'Audio file uploaded successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: res.error || 'Music upload failed', type: 'error' });
    }
    setUploadingMusic(false);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      // 1. Update website settings
      await updateWebsiteSettings(siteForm);

      // 2. Update music settings in wedding settings
      await updateWeddingSettings({
        music_url: musicForm.music_url,
        music_title: musicForm.music_title,
        music_enabled: musicForm.music_enabled
      });

      await refreshData();
      setMessage({ text: 'All appearance and music settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestAndSaveSupabase = async () => {
    setTestingConnection(true);
    setConnectionResult(null);

    const testRes = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setConnectionResult(testRes);

    if (testRes.success) {
      saveSupabaseConfig(supabaseUrl, supabaseKey);
      resetSupabaseClient();
      await refreshData();
    }
    setTestingConnection(false);
  };

  const handleResetToEnv = () => {
    clearSupabaseConfig();
    resetSupabaseClient();
    const cfg = getSupabaseConfig();
    setSupabaseUrl(cfg.url);
    setSupabaseKey(cfg.anonKey);
    setConnectionResult(null);
    refreshData();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-couple text-2xl sm:text-3xl font-bold text-maroon">
          Website Settings &amp; Audio Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-heading">
          Customize visible sections, audio soundtrack, RSVP guest limits, and Supabase database connection.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        
        {/* Section Visibility Toggles */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <Eye className="w-5 h-5 text-gold-deep" />
            <h2 className="font-couple text-lg font-bold text-maroon">
              Section Visibility
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Couple Profiles Section</span>
              <input
                type="checkbox"
                checked={siteForm.show_couple_section}
                onChange={() => handleToggleSection('show_couple_section')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Live Countdown Clock</span>
              <input
                type="checkbox"
                checked={siteForm.show_countdown}
                onChange={() => handleToggleSection('show_countdown')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Wedding Events / Itinerary</span>
              <input
                type="checkbox"
                checked={siteForm.show_events_section}
                onChange={() => handleToggleSection('show_events_section')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Couple Photo Gallery</span>
              <input
                type="checkbox"
                checked={siteForm.show_main_gallery}
                onChange={() => handleToggleSection('show_main_gallery')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">"Our Wedding Memories" (After-Wedding)</span>
              <input
                type="checkbox"
                checked={siteForm.show_after_wedding_gallery}
                onChange={() => handleToggleSection('show_after_wedding_gallery')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">RSVP Attendance Form</span>
              <input
                type="checkbox"
                checked={siteForm.show_rsvp_section}
                onChange={() => handleToggleSection('show_rsvp_section')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Family &amp; Parents Blessings</span>
              <input
                type="checkbox"
                checked={siteForm.show_family_details}
                onChange={() => handleToggleSection('show_family_details')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:bg-cream/30 cursor-pointer">
              <span className="text-xs font-semibold text-gray-800">Music Player Floating Button</span>
              <input
                type="checkbox"
                checked={siteForm.show_music_controls}
                onChange={() => handleToggleSection('show_music_controls')}
                className="w-4 h-4 text-maroon rounded focus:ring-gold"
              />
            </label>

          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Maximum RSVP Attendees Allowed per Submission
            </label>
            <input
              type="number"
              min="1"
              max="25"
              value={siteForm.max_rsvp_attendees || 10}
              onChange={(e) => setSiteForm({ ...siteForm, max_rsvp_attendees: Number(e.target.value) })}
              className="w-32 px-3 py-1.5 text-xs rounded-xl border border-gray-300"
            />
          </div>
        </div>

        {/* Background Music Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <Music className="w-5 h-5 text-gold-deep" />
            <h2 className="font-couple text-lg font-bold text-maroon">
              Background Music &amp; Audio
            </h2>
          </div>

          <div className="flex items-center space-x-3 mb-2">
            <input
              type="checkbox"
              id="musicEnabled"
              checked={musicForm.music_enabled}
              onChange={(e) => setMusicForm({ ...musicForm, music_enabled: e.target.checked })}
              className="w-4 h-4 text-maroon rounded focus:ring-gold"
            />
            <label htmlFor="musicEnabled" className="text-xs font-semibold text-gray-800">
              Enable background music on website
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Soundtrack Title
              </label>
              <input
                type="text"
                value={musicForm.music_title}
                onChange={(e) => setMusicForm({ ...musicForm, music_title: e.target.value })}
                placeholder="e.g. Royal Shehnai Melody"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Audio Stream / MP3 URL
              </label>
              <input
                type="url"
                value={musicForm.music_url}
                onChange={(e) => setMusicForm({ ...musicForm, music_url: e.target.value })}
                placeholder="https://.../music.mp3"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload Audio File (.mp3)
            </label>
            <label className="btn-royal-maroon px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 shadow cursor-pointer">
              <Upload className="w-4 h-4 text-gold" />
              <span>{uploadingMusic ? 'Uploading Audio...' : 'Upload MP3'}</span>
              <input
                type="file"
                accept="audio/mp3,audio/mpeg,audio/*"
                className="hidden"
                disabled={uploadingMusic}
                onChange={handleMusicUpload}
              />
            </label>
            <p className="text-[11px] text-gray-500 mt-1">
              Browser policies require user interaction (e.g. clicking "Open Invitation") before audio will play.
            </p>
          </div>
        </div>

        {/* Save Appearance Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="btn-royal-maroon px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold" />
            <span>{savingSettings ? 'Saving...' : 'Save Appearance &amp; Music'}</span>
          </button>
        </div>

      </form>

      {/* Supabase Free Tier Database Connection Manager */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-gold-deep" />
            <h2 className="font-couple text-lg font-bold text-maroon">
              Supabase Database &amp; Storage Connection
            </h2>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
            Free Plan Ready
          </span>
        </div>

        <p className="text-xs text-gray-600 font-heading leading-relaxed">
          The website currently works seamlessly with offline-first cached demo data. To connect your live free Supabase project, paste your Project URL and Anon Public Key below:
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Supabase Anon / Publishable API Key
            </label>
            <input
              type="text"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold/50 font-mono text-xs"
            />
          </div>
        </div>

        {connectionResult && (
          <div className={`p-4 rounded-xl text-xs flex items-start space-x-2 ${
            connectionResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            {connectionResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{connectionResult.success ? 'Connected!' : 'Notice'}</p>
              <p className="mt-0.5">{connectionResult.message}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetToEnv}
            className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
          >
            Reset to Environment Variables
          </button>

          <button
            type="button"
            onClick={handleTestAndSaveSupabase}
            disabled={testingConnection || !supabaseUrl || !supabaseKey}
            className="btn-royal-gold px-5 py-2 rounded-xl text-xs font-semibold inline-flex items-center space-x-2 shadow cursor-pointer disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5 text-dark-text" />
            <span>{testingConnection ? 'Testing Connection...' : 'Test &amp; Save Supabase Connection'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
          <p className="font-bold flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Supabase Free-Tier Availability Note:</span>
          </p>
          <p>
            Supabase Free tier projects automatically pause after 7 days of inactivity. If paused, log into your Supabase Dashboard and click <strong>"Restore Project"</strong>. The website's browser cache ensures the invitation card, countdown, and cached memories remain visible to guests even during temporary pauses.
          </p>
        </div>

      </div>

    </div>
  );
};
