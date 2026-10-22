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
  
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [hasOpenedInvitation, setHasOpenedInvitation] = useState(false);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [settingsRes, eventsRes, albumsRes, photosRes, websiteRes] = await Promise.all([
        fetchWeddingSettings(),
        fetchWeddingEvents(true),
        fetchWeddingAlbums(true),
        fetchWeddingPhotos(undefined, undefined, true),
        fetchWebsiteSettings()
      ]);

      setSettings(settingsRes.data);
      setEvents(eventsRes.data);
      setAlbums(albumsRes.data);
      setPhotos(photosRes.data);
      setWebsiteSettings(websiteRes.data);

      setIsCached(settingsRes.isCached && eventsRes.isCached);
    } catch (e) {
      console.warn('Error loading wedding data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
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
