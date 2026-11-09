import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  WeddingSettings, 
  WeddingEvent, 
  WeddingAlbum, 
  WeddingPhoto, 
  WebsiteSettings 
} from '../types/wedding';
import { 
  fetchWeddingSettings, 
  fetchWeddingEvents, 
  fetchWeddingAlbums, 
  fetchWeddingPhotos, 
  fetchWebsiteSettings 
} from '../services/weddingService';
import { 
  defaultWeddingSettings, 
  defaultEvents, 
  defaultAlbums, 
  defaultPhotos, 
  defaultWebsiteSettings 
} from '../data/defaultData';

interface WeddingContextType {
  settings: WeddingSettings;
  events: WeddingEvent[];
  albums: WeddingAlbum[];
  photos: WeddingPhoto[];
  websiteSettings: WebsiteSettings;
  isCached: boolean;
  isLoading: boolean;
  fetchError: string | null;
  refreshData: () => Promise<void>;
  musicPlaying: boolean;
  toggleMusic: () => void;
  setMusicPlaying: (playing: boolean) => void;
  hasOpenedInvitation: boolean;
  setHasOpenedInvitation: (opened: boolean) => void;
}

const WeddingContext = createContext<WeddingContextType>({
  settings: defaultWeddingSettings,
  events: defaultEvents,
  albums: defaultAlbums,
  photos: defaultPhotos,
  websiteSettings: defaultWebsiteSettings,
  isCached: true,
  isLoading: true,
  fetchError: null,
  refreshData: async () => {},
  musicPlaying: false,
  toggleMusic: () => {},
  setMusicPlaying: () => {},
  hasOpenedInvitation: false,
  setHasOpenedInvitation: () => {},
});

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WeddingSettings>(defaultWeddingSettings);
  const [events, setEvents] = useState<WeddingEvent[]>(defaultEvents);
  const [albums, setAlbums] = useState<WeddingAlbum[]>(defaultAlbums);
  const [photos, setPhotos] = useState<WeddingPhoto[]>(defaultPhotos);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(defaultWebsiteSettings);
  const [isCached, setIsCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [hasOpenedInvitation, setHasOpenedInvitation] = useState(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [settingsRes, eventsRes, albumsRes, photosRes, websiteRes] = await Promise.all([
        fetchWeddingSettings(),
        fetchWeddingEvents(false),
        fetchWeddingAlbums(false),
        fetchWeddingPhotos(undefined, undefined, false),
        fetchWebsiteSettings()
      ]);

      setSettings(settingsRes.data);
      setEvents(eventsRes.data);
      setAlbums(albumsRes.data);
      setPhotos(photosRes.data);
      setWebsiteSettings(websiteRes.data);

      setIsCached(settingsRes.isCached && eventsRes.isCached);

      // Dynamic document title update with actual couple names
      if (typeof document !== 'undefined' && settingsRes.data.groom_name && settingsRes.data.bride_name) {
        document.title = `${settingsRes.data.groom_name} & ${settingsRes.data.bride_name} | Royal Wedding Invitation`;
      }
    } catch (e: any) {
      console.warn('Error loading wedding data:', e);
      setFetchError(e.message || 'Failed to load wedding details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Automatically re-sync data when the user switches back to this tab
    const handleFocus = () => {
      loadAllData();
    };

    // Re-sync if data was updated in another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('wedding_cached_')) {
        loadAllData();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadAllData]);

  const toggleMusic = () => {
    setMusicPlaying(prev => !prev);
  };

  return (
    <WeddingContext.Provider value={{
      settings,
      events,
      albums,
      photos,
      websiteSettings,
      isCached,
      isLoading,
      fetchError,
      refreshData: loadAllData,
      musicPlaying,
      toggleMusic,
      setMusicPlaying,
      hasOpenedInvitation,
      setHasOpenedInvitation
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => useContext(WeddingContext);
