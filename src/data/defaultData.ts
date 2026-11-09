import { WeddingSettings, WeddingEvent, WeddingAlbum, WeddingPhoto, WebsiteSettings } from '../types/wedding';

// Calculate future dates relative to current runtime
const today = new Date();
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const defaultWeddingSettings: WeddingSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  groom_name: '',
  groom_nickname: '',
  groom_photo_url: '',
  groom_father_name: '',
  groom_mother_name: '',
  groom_family_name: '',
  groom_bio: '',
  
  bride_name: '',
  bride_nickname: '',
  bride_photo_url: '',
  bride_father_name: '',
  bride_mother_name: '',
  bride_family_name: '',
  bride_bio: '',

  wedding_title: 'The Royal Wedding Celebration',
  invitation_heading: 'You Are Cordially Invited to Celebrate',
  invitation_message: 'With joyful hearts and the blessings of our parents, we invite you to celebrate the beginning of our forever together.',
  wedding_date: addDays(45),
  wedding_start_time: '18:30',
  wedding_end_time: '23:30',
  time_zone: 'Asia/Kolkata',
  venue_name: '',
  address_line: '',
  city: '',
  state: '',
  postal_code: '',
  google_maps_url: '',
  footer_message: 'Bless our new beginning with your presence and love.',

  cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
  music_url: '/music/wedding-music.mp3',
  music_title: 'The Mountain Wedding Melody',
  music_enabled: true
};

export const defaultEvents: WeddingEvent[] = [
  {
    id: '00000000-0000-0000-0001-000000000001',
    event_name: 'Ganesh Sthapana & Mehendi',
    description: 'An auspicious commencement with sacred prayers seeking divine blessings, followed by vibrant henna designs, traditional Rajasthani folk music, and joyous dance.',
    event_date: addDays(43),
    start_time: '15:00',
    end_time: '19:00',
    time_zone: 'Asia/Kolkata',
    venue_name: 'Courtyard of Royal Palms',
    full_address: 'Lake Pichola Road, Udaipur, Rajasthan 313001',
    google_maps_url: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    cover_photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_published: true
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    event_name: 'Haldi Ceremony',
    description: 'A sun-drenched morning bathed in golden turmeric, yellow marigold petals, music, joyful laughter, and heartfelt blessings for the bride and groom.',
    event_date: addDays(44),
    start_time: '10:00',
    end_time: '13:00',
    time_zone: 'Asia/Kolkata',
    venue_name: 'Sunken Garden Lawn',
    full_address: 'The Grand Palace Heritage, Lake Pichola, Udaipur',
    google_maps_url: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    cover_photo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_published: true
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    event_name: 'Sangeet & Cocktail Night',
    description: 'An enchanting musical evening under chandeliers with choreographed family performances, cocktails, live band, and non-stop celebration on the royal dance floor.',
    event_date: addDays(44),
    start_time: '19:30',
    end_time: '00:00',
    time_zone: 'Asia/Kolkata',
    venue_name: 'Crystal Ballroom & Terraces',
    full_address: 'The Grand Palace Heritage, Udaipur',
    google_maps_url: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    cover_photo_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_published: true
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    event_name: 'Royal Wedding Ceremony (Pheras)',
    description: 'The sacred Vedic rites, traditional Baraat arrival, Varmala exchange under a canopy of royal flowers, and eternal vows around the sacred fire beneath the stars.',
    event_date: addDays(45),
    start_time: '18:30',
    end_time: '23:30',
    time_zone: 'Asia/Kolkata',
    venue_name: 'Lakeview Royal Mandap',
    full_address: 'The Grand Palace Heritage Resort, Udaipur',
    google_maps_url: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    cover_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    is_published: true
  },
  {
    id: '00000000-0000-0000-0001-000000000005',
    event_name: 'Grand Royal Reception',
    description: 'A grand banquet to celebrate the newly married couple. Savor royal culinary delights, celebratory champagne toasts, and heartfelt moments of companionship.',
    event_date: addDays(46),
    start_time: '19:00',
    end_time: '23:30',
    time_zone: 'Asia/Kolkata',
    venue_name: 'Imperial Banquets & Mughal Gardens',
    full_address: 'The Grand Palace Heritage Resort, Udaipur',
    google_maps_url: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    cover_photo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    is_published: true
  }
];

export const defaultAlbums: WeddingAlbum[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'The Sacred Pheras & Vows',
    description: 'Eternal moments captured during the solemn seven steps around the holy fire and the joy of becoming husband and wife.',
    cover_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    is_published: true,
    photo_count: 6
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Sangeet & Dance Euphoria',
    description: 'Unfiltered laughter, rhythm, energetic performances by cousins, and unforgettable celebrations under the palace lights.',
    cover_photo_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    is_published: true,
    photo_count: 4
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Golden Haldi Sunshine',
    description: 'Laughter, marigold showers, and holy turmeric blessings shared with dearest family and friends.',
    cover_photo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    is_published: true,
    photo_count: 4
  }
];

export const defaultPhotos: WeddingPhoto[] = [
  {
    id: '00000000-0000-0000-0002-000000000001',
    category: 'couple',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    caption: 'A promise etched in time — Together forever',
    alt_text: 'Couple in royal wedding garments holding hands',
    display_order: 1,
    is_published: true,
    is_cover: true
  },
  {
    id: '00000000-0000-0000-0002-000000000002',
    category: 'couple',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    caption: 'Beneath the palace arches and twinkling sky',
    alt_text: 'Bride and groom walking together gracefully',
    display_order: 2,
    is_published: true,
    is_cover: false
  },
  {
    id: '00000000-0000-0000-0002-000000000003',
    category: 'gallery',
    photo_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden hour tranquility by Lake Pichola',
    alt_text: 'Lake view sunset portrait',
    display_order: 3,
    is_published: true,
    is_cover: false
  },
  {
    id: '00000000-0000-0000-0002-000000000004',
    category: 'gallery',
    photo_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    caption: 'Candid laughter, endless shared dreams',
    alt_text: 'Joyful couple smiling together',
    display_order: 4,
    is_published: true,
    is_cover: false
  },
  {
    id: '00000000-0000-0000-0002-000000000005',
    category: 'gallery',
    photo_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    caption: 'The radiance of the royal bride',
    alt_text: 'Bride close-up in traditional jewelry and lehenga',
    display_order: 5,
    is_published: true,
    is_cover: false
  },
  {
    id: '00000000-0000-0000-0002-000000000006',
    category: 'gallery',
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    caption: 'The groom awaits his queen',
    alt_text: 'Groom in regal sherwani and royal safa',
    display_order: 6,
    is_published: true,
    is_cover: false
  },
  // After wedding album photos
  {
    id: '00000000-0000-0000-0003-000000000001',
    album_id: '11111111-1111-1111-1111-111111111111',
    category: 'after_wedding',
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    caption: 'Taking the seven sacred vows (Saptapadi)',
    photo_date: addDays(-2),
    display_order: 1,
    is_published: true,
    is_cover: true
  },
  {
    id: '00000000-0000-0000-0003-000000000002',
    album_id: '11111111-1111-1111-1111-111111111111',
    category: 'after_wedding',
    photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    caption: 'The auspicious Sindoor & Mangalsutra moment',
    photo_date: addDays(-2),
    display_order: 2,
    is_published: true,
    is_cover: false
  },
  {
    id: '00000000-0000-0000-0003-000000000003',
    album_id: '22222222-2222-2222-2222-222222222222',
    category: 'after_wedding',
    photo_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
    caption: 'Couple dance on the palace deck',
    photo_date: addDays(-3),
    display_order: 1,
    is_published: true,
    is_cover: true
  },
  {
    id: '00000000-0000-0000-0003-000000000004',
    album_id: '33333333-3333-3333-3333-333333333333',
    category: 'after_wedding',
    photo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Yellow marigold flower showers',
    photo_date: addDays(-4),
    display_order: 1,
    is_published: true,
    is_cover: true
  }
];

export const defaultWebsiteSettings: WebsiteSettings = {
  id: '00000000-0000-0000-0000-000000000002',
  site_title: 'Royal Wedding Celebration',
  theme_color_primary: '#D4AF37',
  theme_color_secondary: '#4A0E1B',
  show_couple_section: true,
  show_countdown: true,
  show_events_section: true,
  show_main_gallery: true,
  show_after_wedding_gallery: true,
  show_rsvp_section: true,
  show_music_controls: true,
  show_family_details: true,
  max_rsvp_attendees: 10
};
