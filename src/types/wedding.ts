export interface WeddingSettings {
  id?: string;
  groom_name: string;
  groom_nickname?: string;
  groom_photo_url?: string;
  groom_father_name?: string;
  groom_mother_name?: string;
  groom_family_name?: string;
  groom_bio?: string;
  
  bride_name: string;
  bride_nickname?: string;
  bride_photo_url?: string;
  bride_father_name?: string;
  bride_mother_name?: string;
  bride_family_name?: string;
  bride_bio?: string;

  wedding_title: string;
  invitation_heading: string;
  invitation_message: string;
  wedding_date: string; // YYYY-MM-DD
  wedding_start_time: string; // HH:mm
  wedding_end_time?: string;
  time_zone: string;
  venue_name: string;
  address_line: string;
  city: string;
  state: string;
  postal_code?: string;
  google_maps_url?: string;
  footer_message?: string;

  cover_image_url?: string;
  music_url?: string;
  music_title?: string;
  music_enabled: boolean;
  
  created_at?: string;
  updated_at?: string;
}

export interface WeddingEvent {
  id: string;
  event_name: string;
  description?: string;
  event_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time?: string;
  time_zone: string;
  venue_name: string;
  full_address: string;
  google_maps_url?: string;
  cover_photo_url?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WeddingAlbum {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  photo_count?: number;
}

export interface WeddingPhoto {
  id: string;
  album_id?: string | null;
  category: 'couple' | 'gallery' | 'after_wedding';
  storage_path?: string;
  photo_url: string;
  thumbnail_url?: string;
  caption?: string;
  alt_text?: string;
  photo_date?: string;
  display_order: number;
  is_published: boolean;
  is_cover: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WeddingRSVP {
  id: string;
  guest_name: string;
  attendance_status: 'attending' | 'declined';
  attendees_count: number;
  phone_number?: string;
  message?: string;
  submitted_at: string;
}

export interface WebsiteSettings {
  id?: string;
  site_title: string;
  theme_color_primary: string;
  theme_color_secondary: string;
  show_couple_section: boolean;
  show_countdown: boolean;
  show_events_section: boolean;
  show_main_gallery: boolean;
  show_after_wedding_gallery: boolean;
  show_rsvp_section: boolean;
  show_music_controls: boolean;
  show_family_details: boolean;
  max_rsvp_attendees: number;
  updated_at?: string;
}
