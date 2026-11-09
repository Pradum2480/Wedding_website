import { getSupabaseClient } from './supabase';
import { 
  WeddingSettings, 
  WeddingEvent, 
  WeddingAlbum, 
  WeddingPhoto, 
  WeddingRSVP, 
  WebsiteSettings 
} from '../types/wedding';
import { 
  defaultWeddingSettings, 
  defaultEvents, 
  defaultAlbums, 
  defaultPhotos, 
  defaultWebsiteSettings 
} from '../data/defaultData';

// Cache keys
const CACHE_KEY_SETTINGS = 'wedding_cached_settings';
const CACHE_KEY_EVENTS = 'wedding_cached_events';
const CACHE_KEY_ALBUMS = 'wedding_cached_albums';
const CACHE_KEY_PHOTOS = 'wedding_cached_photos';
const CACHE_KEY_WEBSITE = 'wedding_cached_website';

// Helper to get cached item
const getCachedItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Error reading cache ${key}:`, e);
    return fallback;
  }
};

// Helper to set cached item
const setCachedItem = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error setting cache ${key}:`, e);
  }
};

// ==========================================
// UUID & DATA NORMALIZATION HELPERS
// ==========================================
export const isValidUUID = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
};

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateMediaFile = (file: File, type: 'image' | 'audio' = 'image'): FileValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'The selected file is empty or corrupted (0 bytes).' };
  }

  if (type === 'image') {
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_IMAGE_SIZE) {
      return { 
        isValid: false, 
        error: `File size exceeds 10MB limit (selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.` 
      };
    }

    const acceptedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png') || lowerName.endsWith('.webp');

    if (!acceptedMimes.includes(file.type.toLowerCase()) && !hasValidExt) {
      return { 
        isValid: false, 
        error: 'Unsupported file format. Please upload JPEG, PNG, or WebP photographs.' 
      };
    }
  } else if (type === 'audio') {
    const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_AUDIO_SIZE) {
      return { 
        isValid: false, 
        error: 'Audio file size exceeds 25MB limit. Please choose a smaller audio file.' 
      };
    }

    const lowerName = file.name.toLowerCase();
    const hasValidAudioExt = lowerName.endsWith('.mp3') || lowerName.endsWith('.wav') || lowerName.endsWith('.aac') || lowerName.endsWith('.m4a');
    if (!file.type.startsWith('audio/') && !hasValidAudioExt) {
      return { 
        isValid: false, 
        error: 'Unsupported audio format. Please upload an MP3 or WAV file.' 
      };
    }
  }

  return { isValid: true };
};

// ==========================================
// EVENT SEQUENTIAL REORDERING LOGIC
// ==========================================
export const reorderWeddingEventsList = (
  existingList: WeddingEvent[],
  targetEvent: WeddingEvent,
  requestedPosition: number
): WeddingEvent[] => {
  // 1. Separate the target event from remaining list
  const remaining = existingList
    .filter(e => e.id !== targetEvent.id)
    .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));

  // 2. Clamp requested position strictly between 1 and remaining.length + 1
  const cleanPos = Math.max(1, Math.min(remaining.length + 1, Math.floor(Number(requestedPosition) || 1)));
  const insertIndex = cleanPos - 1;

  // 3. Insert targetEvent at the exact requested position
  const combined = [
    ...remaining.slice(0, insertIndex),
    { ...targetEvent, display_order: cleanPos },
    ...remaining.slice(insertIndex)
  ];

  // 4. Normalize all display_order values strictly to sequential integers (1, 2, 3, ... N)
  return combined.map((evt, idx) => ({
    ...evt,
    display_order: idx + 1
  }));
};

// ==========================================
// 1. WEDDING SETTINGS
// ==========================================
export const fetchWeddingSettings = async (): Promise<{ data: WeddingSettings; isCached: boolean; error?: string }> => {
  const cached = getCachedItem<WeddingSettings>(CACHE_KEY_SETTINGS, defaultWeddingSettings);
  const client = getSupabaseClient();

  if (!client) {
    return { data: cached, isCached: true, error: 'Database client not initialized' };
  }

  try {
    const { data, error } = await client
      .from('wedding_settings')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.warn('Supabase fetch error, using cached settings:', error.message);
      return { data: cached, isCached: true, error: error.message };
    }

    if (data) {
      setCachedItem(CACHE_KEY_SETTINGS, data);
      return { data, isCached: false };
    }

    return { data: cached, isCached: true };
  } catch (err: any) {
    console.warn('Network exception while fetching settings:', err.message);
    return { data: cached, isCached: true, error: err.message };
  }
};

export const updateWeddingSettings = async (settings: Partial<WeddingSettings>): Promise<{ success: boolean; data?: WeddingSettings; error?: string }> => {
  const client = getSupabaseClient();
  const current = getCachedItem<WeddingSettings>(CACHE_KEY_SETTINGS, defaultWeddingSettings);
  const updated: WeddingSettings = { ...current, ...settings, updated_at: new Date().toISOString() };

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  try {
    // Singleton record ID
    const id = current.id || '00000000-0000-0000-0000-000000000001';
    const { data, error } = await client
      .from('wedding_settings')
      .upsert({ ...updated, id })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    setCachedItem(CACHE_KEY_SETTINGS, data);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 2. WEDDING EVENTS
// ==========================================
export const fetchWeddingEvents = async (publishedOnly = true): Promise<{ data: WeddingEvent[]; isCached: boolean; error?: string }> => {
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);
  const client = getSupabaseClient();

  if (!client) {
    const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
    return { data: filtered.sort((a, b) => a.display_order - b.display_order), isCached: true, error: 'Database client not initialized' };
  }

  try {
    let query = client
      .from('wedding_events')
      .select('*')
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetchWeddingEvents error:', error.message);
      const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
      return { data: filtered.sort((a, b) => a.display_order - b.display_order), isCached: true, error: error.message };
    }

    const eventList = data || [];
    if (!publishedOnly) {
      setCachedItem(CACHE_KEY_EVENTS, eventList);
    }
    return { data: eventList, isCached: false };
  } catch (err: any) {
    console.warn('Network exception while fetching events:', err.message);
    const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
    return { data: filtered.sort((a, b) => a.display_order - b.display_order), isCached: true, error: err.message };
  }
};

export const saveWeddingEvent = async (event: Partial<WeddingEvent>): Promise<{ success: boolean; data?: WeddingEvent; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  // 1. Prepare target event
  const isExisting = Boolean(event.id && cached.some(e => e.id === event.id));
  const eventId = event.id || generateUUID();
  const rawOrder = event.display_order !== undefined && !isNaN(Number(event.display_order))
    ? Math.max(1, Math.floor(Number(event.display_order)))
    : (isExisting ? (cached.find(e => e.id === event.id)?.display_order || cached.length) : cached.length + 1);

  const targetEvent: WeddingEvent = {
    ...(isExisting ? cached.find(e => e.id === event.id)! : {}),
    ...event,
    id: eventId,
    display_order: rawOrder,
    is_published: event.is_published ?? true,
    updated_at: new Date().toISOString()
  } as WeddingEvent;

  // 2. Perform sequential reordering across the event collection
  const reorderedEvents = reorderWeddingEventsList(cached, targetEvent, rawOrder);

  try {
    // Ensure valid UUID records for Supabase to prevent PostgreSQL syntax errors
    const finalTargetId = isValidUUID(updatedTargetId(targetEvent.id)) ? updatedTargetId(targetEvent.id) : generateUUID();
    const dbPayload = { ...targetEvent, id: finalTargetId };
    const normalizedEvents = reorderedEvents.map(e => e.id === targetEvent.id ? { ...e, id: finalTargetId } : e);

    const { data, error } = await client
      .from('wedding_events')
      .upsert(dbPayload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase event save error:', error.message);
      return { success: false, error: error.message };
    }

    // Sync updated reordered positions to Supabase for all other valid events
    const otherValidEvents = normalizedEvents.filter(e => e.id !== finalTargetId && isValidUUID(e.id));
    if (otherValidEvents.length > 0) {
      try {
        await client.from('wedding_events').upsert(otherValidEvents);
      } catch (upsertErr) {
        console.warn('Reordered positions sync note:', upsertErr);
      }
    }

    // Merge into local cache
    const finalCached = normalizedEvents.map(e => e.id === data.id ? data : e);
    setCachedItem(CACHE_KEY_EVENTS, finalCached);

    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase event save exception:', err);
    return { success: false, error: err.message || 'Failed to save event.' };
  }
};

const updatedTargetId = (id?: string) => (id && isValidUUID(id) ? id : generateUUID());

export const deleteWeddingEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);
  
  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  // Remove and re-index remaining events sequentially 1..N
  const remaining = cached
    .filter(e => e.id !== id)
    .sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0))
    .map((e, idx) => ({ ...e, display_order: idx + 1 }));

  try {
    if (isValidUUID(id)) {
      const { error } = await client.from('wedding_events').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }

      const validRemaining = remaining.filter(e => isValidUUID(e.id));
      if (validRemaining.length > 0) {
        try {
          await client.from('wedding_events').upsert(validRemaining);
        } catch (upsertErr) {
          console.warn('Delete reorder sync note:', upsertErr);
        }
      }
    }
    setCachedItem(CACHE_KEY_EVENTS, remaining);
    return { success: true };
  } catch (err: any) {
    console.warn('Supabase deleteWeddingEvent error:', err);
    return { success: false, error: err.message || 'Failed to delete event.' };
  }
};

// ==========================================
// 3. ALBUMS & AFTER-WEDDING
// ==========================================
export const fetchWeddingAlbums = async (publishedOnly = true): Promise<{ data: WeddingAlbum[]; isCached: boolean; error?: string }> => {
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);
  const client = getSupabaseClient();

  if (!client) {
    const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
    return { data: filtered.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0)), isCached: true, error: 'Database client not initialized' };
  }

  try {
    let query = client
      .from('wedding_albums')
      .select('*')
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetchWeddingAlbums error:', error.message);
      const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
      return { data: filtered.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0)), isCached: true, error: error.message };
    }

    const albumList = data || [];
    if (!publishedOnly) {
      setCachedItem(CACHE_KEY_ALBUMS, albumList);
    }
    return { data: albumList, isCached: false };
  } catch (err: any) {
    const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
    return { data: filtered.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0)), isCached: true, error: err.message };
  }
};

export const saveWeddingAlbum = async (album: Partial<WeddingAlbum>): Promise<{ success: boolean; data?: WeddingAlbum; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  const albumId = album.id || generateUUID();
  const displayOrder = album.display_order !== undefined && !isNaN(Number(album.display_order))
    ? Math.max(1, Math.floor(Number(album.display_order)))
    : cached.length + 1;

  const targetAlbum: WeddingAlbum = {
    ...(album.id ? cached.find(a => a.id === album.id) : {}),
    ...album,
    id: albumId,
    display_order: displayOrder,
    is_published: album.is_published ?? true,
    updated_at: new Date().toISOString()
  } as WeddingAlbum;

  const updatedList = album.id && cached.some(a => a.id === album.id)
    ? cached.map(a => a.id === album.id ? targetAlbum : a)
    : [...cached, targetAlbum];

  const sortedList = updatedList.sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));

  try {
    const dbPayload = isValidUUID(targetAlbum.id) ? targetAlbum : { ...targetAlbum, id: generateUUID() };
    const { data, error } = await client
      .from('wedding_albums')
      .upsert(dbPayload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase album save error:', error.message);
      return { success: false, error: error.message };
    }

    const finalCached = sortedList.map(a => a.id === data.id ? data : a);
    setCachedItem(CACHE_KEY_ALBUMS, finalCached);
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase album save exception:', err);
    return { success: false, error: err.message || 'Failed to save album.' };
  }
};

export const deleteWeddingAlbum = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  try {
    if (isValidUUID(id)) {
      const { error } = await client
        .from('wedding_albums')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    setCachedItem(CACHE_KEY_ALBUMS, cached.filter(a => a.id !== id));

    // Clean up photos associated with this album
    const cachedPhotos = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);
    setCachedItem(CACHE_KEY_PHOTOS, cachedPhotos.filter(p => p.album_id !== id));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 4. WEDDING PHOTOS
// ==========================================
export const fetchWeddingPhotos = async (category?: string, albumId?: string, publishedOnly = true): Promise<{ data: WeddingPhoto[]; isCached: boolean; error?: string }> => {
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);
  const client = getSupabaseClient();

  const filterMemory = (list: WeddingPhoto[]) => {
    return list.filter(p => {
      if (publishedOnly && !p.is_published) return false;
      if (category && p.category !== category) return false;
      if (albumId && p.album_id !== albumId) return false;
      return true;
    }).sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
  };

  if (!client) {
    return { data: filterMemory(cached), isCached: true, error: 'Database client not initialized' };
  }

  try {
    let query = client
      .from('wedding_photos')
      .select('*')
      .order('display_order', { ascending: true });

    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (albumId) {
      query = query.eq('album_id', albumId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetchWeddingPhotos error:', error.message);
      return { data: filterMemory(cached), isCached: true, error: error.message };
    }

    const photoList = data || [];
    if (!category && !albumId && !publishedOnly) {
      setCachedItem(CACHE_KEY_PHOTOS, photoList);
    } else {
      const existing = cached.filter(p => !photoList.some(d => d.id === p.id));
      setCachedItem(CACHE_KEY_PHOTOS, [...existing, ...photoList]);
    }

    return { data: photoList, isCached: false };
  } catch (err: any) {
    return { data: filterMemory(cached), isCached: true, error: err.message };
  }
};

export const saveWeddingPhoto = async (photo: Partial<WeddingPhoto>): Promise<{ success: boolean; data?: WeddingPhoto; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  const photoId = photo.id || generateUUID();
  const displayOrder = photo.display_order !== undefined && !isNaN(Number(photo.display_order))
    ? Math.max(1, Math.floor(Number(photo.display_order)))
    : cached.length + 1;

  const targetPhoto: WeddingPhoto = {
    ...(photo.id ? cached.find(p => p.id === photo.id) : {}),
    ...photo,
    id: photoId,
    display_order: displayOrder,
    is_published: photo.is_published ?? true,
    is_cover: photo.is_cover ?? false,
    updated_at: new Date().toISOString()
  } as WeddingPhoto;

  const updatedList = photo.id && cached.some(p => p.id === photo.id)
    ? cached.map(p => p.id === photo.id ? targetPhoto : p)
    : [...cached, targetPhoto];

  try {
    const albumId = photo.album_id && isValidUUID(photo.album_id) ? photo.album_id : null;
    const dbPayload = {
      ...targetPhoto,
      id: isValidUUID(targetPhoto.id) ? targetPhoto.id : generateUUID(),
      album_id: albumId
    };

    const { data, error } = await client
      .from('wedding_photos')
      .upsert(dbPayload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase photo save error:', error.message);
      return { success: false, error: error.message };
    }

    const finalCached = updatedList.map(p => p.id === data.id ? data : p);
    setCachedItem(CACHE_KEY_PHOTOS, finalCached);
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase photo save exception:', err);
    return { success: false, error: err.message || 'Failed to save photo.' };
  }
};

export const deleteWeddingPhoto = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);
  const targetPhoto = cached.find(p => p.id === id);

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  try {
    if (isValidUUID(id)) {
      const { error } = await client
        .from('wedding_photos')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    setCachedItem(CACHE_KEY_PHOTOS, cached.filter(p => p.id !== id));

    if (targetPhoto?.photo_url && targetPhoto.photo_url.includes('wedding-media/')) {
      const match = targetPhoto.photo_url.split('wedding-media/')[1];
      if (match) {
        try {
          await client.storage.from('wedding-media').remove([decodeURIComponent(match)]);
        } catch {
          // Ignore storage cleanup failures
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 5. RSVPs
// ==========================================
const defaultDemoRSVPs: WeddingRSVP[] = [
  {
    id: 'r1',
    guest_name: 'Vikram & Ananya Rathore',
    attendance_status: 'attending',
    attendees_count: 2,
    phone_number: '+91 98765 43210',
    message: 'Warmest congratulations to the royal couple! Can not wait to celebrate with everyone in Udaipur.',
    submitted_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'r2',
    guest_name: 'Dr. Siddharth Malhotra',
    attendance_status: 'attending',
    attendees_count: 1,
    phone_number: '+91 98111 22334',
    message: 'So thrilled for the royal couple! Wishing you both a lifetime of love and joy.',
    submitted_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'r3',
    guest_name: 'Meera & Kabir Kapoor',
    attendance_status: 'declined',
    attendees_count: 0,
    phone_number: '+91 99222 33445',
    message: 'Heartiest congratulations! Unfortunately we will be traveling abroad, but sending all our prayers and blessings.',
    submitted_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const submitRSVP = async (rsvp: Omit<WeddingRSVP, 'id' | 'submitted_at'>): Promise<{ success: boolean; message: string }> => {
  if (!rsvp.guest_name || rsvp.guest_name.trim().length === 0) {
    return { success: false, message: 'Please enter your name.' };
  }

  const client = getSupabaseClient();
  const submissionTimestamp = new Date().toISOString();

  // Prevent accidental rapid duplicate in local storage
  const submittedKey = `rsvp_submitted_${rsvp.guest_name.trim().toLowerCase()}`;
  if (typeof window !== 'undefined' && localStorage.getItem(submittedKey)) {
    return { success: false, message: 'You have already submitted an RSVP response. Thank you!' };
  }

  // 1. ALWAYS persist to local cache immediately so responses are never lost
  const storedRSVPs = getCachedItem<WeddingRSVP[]>('wedding_offline_rsvps', []);
  const newRSVP: WeddingRSVP = {
    id: 'rsvp_' + Date.now(),
    guest_name: rsvp.guest_name.trim(),
    attendance_status: rsvp.attendance_status,
    attendees_count: rsvp.attendance_status === 'attending' ? Number(rsvp.attendees_count || 1) : 0,
    phone_number: rsvp.phone_number?.trim(),
    message: rsvp.message?.trim(),
    submitted_at: submissionTimestamp
  };
  setCachedItem('wedding_offline_rsvps', [newRSVP, ...storedRSVPs]);
  if (typeof window !== 'undefined') localStorage.setItem(submittedKey, 'true');

  if (!client) {
    return { success: true, message: 'Your RSVP response has been recorded with gratitude!' };
  }

  // 2. Also persist to Supabase if client is configured
  try {
    const { error } = await client
      .from('wedding_rsvps')
      .insert({
        guest_name: rsvp.guest_name.trim(),
        attendance_status: rsvp.attendance_status,
        attendees_count: rsvp.attendance_status === 'attending' ? Number(rsvp.attendees_count || 1) : 0,
        phone_number: rsvp.phone_number?.trim() || null,
        message: rsvp.message?.trim() || null,
        submitted_at: submissionTimestamp
      });

    if (error) {
      console.warn('Supabase RSVP insert note (saved to local backup):', error.message);
      return { success: true, message: 'Your RSVP has been received with warm gratitude!' };
    }

    return { success: true, message: 'Your RSVP has been received with warm gratitude!' };
  } catch (err: any) {
    console.warn('Supabase RSVP insert exception (saved to local backup):', err);
    return { success: true, message: 'Your RSVP has been received with warm gratitude!' };
  }
};

export const fetchRSVPsAdmin = async (): Promise<{ 
  data: WeddingRSVP[]; 
  error?: string; 
  source?: 'supabase' | 'local' | 'merged' 
}> => {
  const client = getSupabaseClient();
  const offlineRSVPs = getCachedItem<WeddingRSVP[]>('wedding_offline_rsvps', []);

  if (!client) {
    const fallbackList = offlineRSVPs.length > 0 ? offlineRSVPs : defaultDemoRSVPs;
    return { data: fallbackList, source: 'local' };
  }

  try {
    const { data, error } = await client
      .from('wedding_rsvps')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchRSVPs error:', error.message);
      const fallbackList = offlineRSVPs.length > 0 ? offlineRSVPs : defaultDemoRSVPs;
      return { data: fallbackList, error: error.message, source: 'local' };
    }

    // Merge Supabase entries with any local entries (e.g. recent submissions)
    const supabaseData: WeddingRSVP[] = data || [];
    const mergedMap = new Map<string, WeddingRSVP>();

    supabaseData.forEach(r => {
      const key = `${r.guest_name.trim().toLowerCase()}_${r.submitted_at?.split('T')[0] || ''}`;
      mergedMap.set(key, r);
    });

    offlineRSVPs.forEach(r => {
      const key = `${r.guest_name.trim().toLowerCase()}_${r.submitted_at?.split('T')[0] || ''}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, r);
      }
    });

    const mergedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.submitted_at || '').getTime() - new Date(a.submitted_at || '').getTime()
    );

    return { 
      data: mergedList.length > 0 ? mergedList : defaultDemoRSVPs, 
      source: supabaseData.length > 0 ? 'supabase' : 'local' 
    };
  } catch (err: any) {
    console.warn('Supabase fetchRSVPs exception:', err);
    const fallbackList = offlineRSVPs.length > 0 ? offlineRSVPs : defaultDemoRSVPs;
    return { data: fallbackList, error: err.message, source: 'local' };
  }
};

export const deleteRSVP = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const offlineRSVPs = getCachedItem<WeddingRSVP[]>('wedding_offline_rsvps', []);
  setCachedItem('wedding_offline_rsvps', offlineRSVPs.filter(r => r.id !== id));

  if (!client) return { success: true };

  try {
    const { error } = await client
      .from('wedding_rsvps')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase deleteRSVP warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const exportRSVPsToCSV = (rsvps: WeddingRSVP[]): void => {
  const headers = ['Guest Name', 'Attendance Status', 'Attendees Count', 'Phone Number', 'Message', 'Submission Date'];
  const rows = rsvps.map(r => [
    `"${r.guest_name.replace(/"/g, '""')}"`,
    `"${r.attendance_status}"`,
    r.attendees_count,
    `"${(r.phone_number || '').replace(/"/g, '""')}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    `"${new Date(r.submitted_at).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Wedding_RSVPs_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==========================================
// 6. WEBSITE SETTINGS
// ==========================================
export const fetchWebsiteSettings = async (): Promise<{ data: WebsiteSettings; isCached: boolean }> => {
  const cached = getCachedItem<WebsiteSettings>(CACHE_KEY_WEBSITE, defaultWebsiteSettings);
  const client = getSupabaseClient();

  if (!client) {
    return { data: cached, isCached: true };
  }

  try {
    const { data, error } = await client
      .from('website_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return { data: cached, isCached: true };
    }

    setCachedItem(CACHE_KEY_WEBSITE, data);
    return { data, isCached: false };
  } catch {
    return { data: cached, isCached: true };
  }
};

export const updateWebsiteSettings = async (settings: Partial<WebsiteSettings>): Promise<{ success: boolean; data?: WebsiteSettings; error?: string }> => {
  const client = getSupabaseClient();
  const current = getCachedItem<WebsiteSettings>(CACHE_KEY_WEBSITE, defaultWebsiteSettings);
  const updated = { ...current, ...settings, updated_at: new Date().toISOString() };

  if (!client) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  try {
    const id = current.id || '00000000-0000-0000-0000-000000000002';
    const { data, error } = await client
      .from('website_settings')
      .upsert({ ...updated, id })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    setCachedItem(CACHE_KEY_WEBSITE, data);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 7. IMAGE COMPRESSION & STORAGE UPLOAD
// ==========================================
export const compressImage = async (file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // If SVG or audio, don't canvas compress
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
};

export const uploadMediaFile = async (
  file: File, 
  folder = 'photos'
): Promise<{ success: boolean; url?: string; error?: string; isLocalFallback?: boolean; warning?: string }> => {
  // 1. Strict validation for file type and size
  const validation = validateMediaFile(file, folder === 'audio' ? 'audio' : 'image');
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const client = getSupabaseClient();
  const fileExt = file.type.startsWith('audio/') ? 'mp3' : 'webp';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // 2. Prepare payload (compress images for fast loading and reduced storage footprint)
  let uploadPayload: Blob = file;
  if (file.type.startsWith('image/')) {
    try {
      uploadPayload = await compressImage(file, 1600, 0.82);
    } catch (e) {
      console.warn('Image compression note, using original file payload:', e);
      uploadPayload = file;
    }
  }

  // 3. If Supabase client is configured, upload to Supabase Storage
  if (client) {
    try {
      const { data, error } = await client.storage
        .from('wedding-media')
        .upload(fileName, uploadPayload, {
          contentType: file.type.startsWith('image/') ? 'image/webp' : file.type,
          upsert: true
        });

      if (!error && data?.path) {
        const { data: publicData } = client.storage
          .from('wedding-media')
          .getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          return { success: true, url: publicData.publicUrl };
        }
      }

      // If storage bucket upload failed (bucket missing, RLS policy, or offline),
      // gracefully fall back to local high-fidelity WebP Data URL so the application never breaks
      console.warn('Supabase Storage upload note (falling back to local session URL):', error?.message);
      const fallbackUrl = await blobToDataUrl(uploadPayload);
      return { 
        success: true, 
        url: fallbackUrl, 
        isLocalFallback: true, 
        warning: error ? `Storage note (${error.message}). Saved locally.` : undefined 
      };
    } catch (err: any) {
      console.warn('Supabase Storage exception (falling back to local preview):', err);
      const fallbackUrl = await blobToDataUrl(uploadPayload);
      return { 
        success: true, 
        url: fallbackUrl, 
        isLocalFallback: true,
        warning: `Network note (${err.message}). Saved locally.`
      };
    }
  }

  // 4. Offline / Demo Mode fallback
  try {
    const localUrl = await blobToDataUrl(uploadPayload);
    return { success: true, url: localUrl };
  } catch (err: any) {
    return { success: false, error: 'Local image preview generation failed.' };
  }
};
