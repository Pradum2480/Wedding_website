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
// 1. WEDDING SETTINGS
// ==========================================
export const fetchWeddingSettings = async (): Promise<{ data: WeddingSettings; isCached: boolean; error?: string }> => {
  const cached = getCachedItem<WeddingSettings>(CACHE_KEY_SETTINGS, defaultWeddingSettings);
  const client = getSupabaseClient();

  if (!client) {
    return { data: cached, isCached: true };
  }

  try {
    const { data, error } = await client
      .from('wedding_settings')
      .select('*')
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
  setCachedItem(CACHE_KEY_SETTINGS, updated);

  if (!client) {
    return { success: true, data: updated };
  }

  try {
    // If id exists, update, else insert or upsert
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
export const fetchWeddingEvents = async (publishedOnly = true): Promise<{ data: WeddingEvent[]; isCached: boolean }> => {
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);
  const client = getSupabaseClient();

  if (!client) {
    const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
    return { data: filtered.sort((a, b) => a.display_order - b.display_order), isCached: true };
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

    if (error || !data || data.length === 0) {
      const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
      return { data: filtered, isCached: true };
    }

    if (!publishedOnly) {
      setCachedItem(CACHE_KEY_EVENTS, data);
    }
    return { data, isCached: false };
  } catch {
    const filtered = publishedOnly ? cached.filter(e => e.is_published) : cached;
    return { data: filtered, isCached: true };
  }
};

export const saveWeddingEvent = async (event: Partial<WeddingEvent>): Promise<{ success: boolean; data?: WeddingEvent; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);

  if (!client) {
    let updatedList: WeddingEvent[];
    let targetEvent: WeddingEvent;
    if (event.id) {
      targetEvent = { ...cached.find(e => e.id === event.id)!, ...event } as WeddingEvent;
      updatedList = cached.map(e => e.id === event.id ? targetEvent : e);
    } else {
      targetEvent = {
        ...event,
        id: 'event_' + Date.now(),
        display_order: event.display_order ?? cached.length + 1,
        is_published: event.is_published ?? true
      } as WeddingEvent;
      updatedList = [...cached, targetEvent];
    }
    setCachedItem(CACHE_KEY_EVENTS, updatedList);
    return { success: true, data: targetEvent };
  }

  try {
    const { data, error } = await client
      .from('wedding_events')
      .upsert(event)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    
    // Update local cache
    const newCached = cached.filter(e => e.id !== data.id).concat(data);
    setCachedItem(CACHE_KEY_EVENTS, newCached);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const deleteWeddingEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingEvent[]>(CACHE_KEY_EVENTS, defaultEvents);
  setCachedItem(CACHE_KEY_EVENTS, cached.filter(e => e.id !== id));

  if (!client) return { success: true };

  try {
    const { error } = await client
      .from('wedding_events')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 3. ALBUMS & AFTER-WEDDING
// ==========================================
export const fetchWeddingAlbums = async (publishedOnly = true): Promise<{ data: WeddingAlbum[]; isCached: boolean }> => {
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);
  const client = getSupabaseClient();

  if (!client) {
    const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
    return { data: filtered.sort((a, b) => a.display_order - b.display_order), isCached: true };
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
    if (error || !data || data.length === 0) {
      const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
      return { data: filtered, isCached: true };
    }

    if (!publishedOnly) {
      setCachedItem(CACHE_KEY_ALBUMS, data);
    }
    return { data, isCached: false };
  } catch {
    const filtered = publishedOnly ? cached.filter(a => a.is_published) : cached;
    return { data: filtered, isCached: true };
  }
};

export const saveWeddingAlbum = async (album: Partial<WeddingAlbum>): Promise<{ success: boolean; data?: WeddingAlbum; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);

  if (!client) {
    let target: WeddingAlbum;
    let list: WeddingAlbum[];
    if (album.id) {
      target = { ...cached.find(a => a.id === album.id)!, ...album } as WeddingAlbum;
      list = cached.map(a => a.id === album.id ? target : a);
    } else {
      target = {
        ...album,
        id: 'album_' + Date.now(),
        display_order: album.display_order ?? cached.length + 1,
        is_published: album.is_published ?? true
      } as WeddingAlbum;
      list = [...cached, target];
    }
    setCachedItem(CACHE_KEY_ALBUMS, list);
    return { success: true, data: target };
  }

  try {
    const { data, error } = await client
      .from('wedding_albums')
      .upsert(album)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    const newCached = cached.filter(a => a.id !== data.id).concat(data);
    setCachedItem(CACHE_KEY_ALBUMS, newCached);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const deleteWeddingAlbum = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingAlbum[]>(CACHE_KEY_ALBUMS, defaultAlbums);
  setCachedItem(CACHE_KEY_ALBUMS, cached.filter(a => a.id !== id));

  if (!client) return { success: true };

  try {
    const { error } = await client
      .from('wedding_albums')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 4. WEDDING PHOTOS
// ==========================================
export const fetchWeddingPhotos = async (category?: string, albumId?: string, publishedOnly = true): Promise<{ data: WeddingPhoto[]; isCached: boolean }> => {
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);
  const client = getSupabaseClient();

  const filterMemory = (list: WeddingPhoto[]) => {
    return list.filter(p => {
      if (publishedOnly && !p.is_published) return false;
      if (category && p.category !== category) return false;
      if (albumId && p.album_id !== albumId) return false;
      return true;
    }).sort((a, b) => a.display_order - b.display_order);
  };

  if (!client) {
    return { data: filterMemory(cached), isCached: true };
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
    if (error || !data || data.length === 0) {
      return { data: filterMemory(cached), isCached: true };
    }

    // Merge into local cache
    const existing = cached.filter(p => !data.some(d => d.id === p.id));
    setCachedItem(CACHE_KEY_PHOTOS, [...existing, ...data]);

    return { data, isCached: false };
  } catch {
    return { data: filterMemory(cached), isCached: true };
  }
};

export const saveWeddingPhoto = async (photo: Partial<WeddingPhoto>): Promise<{ success: boolean; data?: WeddingPhoto; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);

  if (!client) {
    let target: WeddingPhoto;
    let list: WeddingPhoto[];
    if (photo.id) {
      target = { ...cached.find(p => p.id === photo.id)!, ...photo } as WeddingPhoto;
      list = cached.map(p => p.id === photo.id ? target : p);
    } else {
      target = {
        ...photo,
        id: 'photo_' + Date.now(),
        display_order: photo.display_order ?? cached.length + 1,
        is_published: photo.is_published ?? true,
        is_cover: photo.is_cover ?? false
      } as WeddingPhoto;
      list = [...cached, target];
    }
    setCachedItem(CACHE_KEY_PHOTOS, list);
    return { success: true, data: target };
  }

  try {
    const { data, error } = await client
      .from('wedding_photos')
      .upsert(photo)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    const newCached = cached.filter(p => p.id !== data.id).concat(data);
    setCachedItem(CACHE_KEY_PHOTOS, newCached);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const deleteWeddingPhoto = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  const cached = getCachedItem<WeddingPhoto[]>(CACHE_KEY_PHOTOS, defaultPhotos);
  setCachedItem(CACHE_KEY_PHOTOS, cached.filter(p => p.id !== id));

  if (!client) return { success: true };

  try {
    const { error } = await client
      .from('wedding_photos')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// 5. RSVPs
// ==========================================
export const submitRSVP = async (rsvp: Omit<WeddingRSVP, 'id' | 'submitted_at'>): Promise<{ success: boolean; message: string }> => {
  if (!rsvp.guest_name || rsvp.guest_name.trim().length === 0) {
    return { success: false, message: 'Please enter your name.' };
  }

  const client = getSupabaseClient();
  const submissionTimestamp = new Date().toISOString();

  // Prevent accidental duplicates in local storage
  const submittedKey = `rsvp_submitted_${rsvp.guest_name.trim().toLowerCase()}`;
  if (typeof window !== 'undefined' && localStorage.getItem(submittedKey)) {
    return { success: false, message: 'You have already submitted an RSVP response. Thank you!' };
  }

  if (!client) {
    // In mock/offline mode, store in localStorage for admin viewing
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
    return { success: true, message: 'Your RSVP response has been recorded with gratitude!' };
  }

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
      return { success: false, message: error.message };
    }

    if (typeof window !== 'undefined') localStorage.setItem(submittedKey, 'true');
    return { success: true, message: 'Your RSVP has been received with warm gratitude!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Submission failed. Please check network connection.' };
  }
};

export const fetchRSVPsAdmin = async (): Promise<{ data: WeddingRSVP[]; error?: string }> => {
  const client = getSupabaseClient();
  const offlineRSVPs = getCachedItem<WeddingRSVP[]>('wedding_offline_rsvps', [
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
      message: 'So thrilled for Devendra and Priyanka! Wishing you both a lifetime of love and joy.',
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
  ]);

  if (!client) {
    return { data: offlineRSVPs };
  }

  try {
    const { data, error } = await client
      .from('wedding_rsvps')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      return { data: offlineRSVPs, error: error.message };
    }
    return { data: data || [] };
  } catch (err: any) {
    return { data: offlineRSVPs, error: err.message };
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

    if (error) return { success: false, error: error.message };
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
  setCachedItem(CACHE_KEY_WEBSITE, updated);

  if (!client) {
    return { success: true, data: updated };
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

export const uploadMediaFile = async (
  file: File, 
  folder = 'photos'
): Promise<{ success: boolean; url?: string; error?: string }> => {
  const client = getSupabaseClient();
  const fileExt = file.type.startsWith('audio/') ? 'mp3' : 'webp';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // If no Supabase connection, generate a Local Data URL / Object URL for demonstration
  if (!client) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target?.result as string
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Local preview generation failed.'
        });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    let uploadPayload: Blob = file;
    if (file.type.startsWith('image/')) {
      uploadPayload = await compressImage(file, 1920, 0.85);
    }

    const { data, error } = await client.storage
      .from('wedding-media')
      .upload(fileName, uploadPayload, {
        contentType: file.type.startsWith('image/') ? 'image/webp' : file.type,
        upsert: true
      });

    if (error) {
      return { success: false, error: `Upload to Supabase Storage failed: ${error.message}` };
    }

    const { data: publicData } = client.storage
      .from('wedding-media')
      .getPublicUrl(data.path);

    return { success: true, url: publicData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'File upload failed' };
  }
};
