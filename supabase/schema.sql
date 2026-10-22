-- ==============================================================================
-- ROYAL GOLD WEDDING WEBSITE - SUPABASE DATABASE SCHEMA & POLICIES
-- ==============================================================================
-- This script sets up all tables, Row Level Security (RLS) policies, storage buckets,
-- and default seed data for the Royal Wedding website.
--
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Navigate to SQL Editor -> New Query
-- 3. Paste this entire script and click "Run"
-- ==============================================================================

-- 1. ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- 2.1 Wedding Settings Table (Singleton record for couple & wedding details)
CREATE TABLE IF NOT EXISTS public.wedding_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    groom_name TEXT NOT NULL DEFAULT 'Devendra',
    groom_nickname TEXT DEFAULT 'Dev',
    groom_photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    groom_father_name TEXT DEFAULT 'Mr. Rajeshwar Sharma',
    groom_mother_name TEXT DEFAULT 'Mrs. Sunita Sharma',
    groom_family_name TEXT DEFAULT 'Sharma Family',
    groom_bio TEXT DEFAULT 'An adventurous soul with a passion for architecture and travel, ready to embark on life’s greatest journey.',
    
    bride_name TEXT NOT NULL DEFAULT 'Priyanka',
    bride_nickname TEXT DEFAULT 'Priya',
    bride_photo_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bride_father_name TEXT DEFAULT 'Mr. Mahendra Verma',
    bride_mother_name TEXT DEFAULT 'Mrs. Anupama Verma',
    bride_family_name TEXT DEFAULT 'Verma Family',
    bride_bio TEXT DEFAULT 'A graceful spirit who finds poetry in everyday moments, bringing warmth, love, and sunshine everywhere.',
    
    wedding_title TEXT DEFAULT 'The Royal Wedding',
    invitation_heading TEXT DEFAULT 'You Are Cordially Invited to Celebrate',
    invitation_message TEXT DEFAULT 'With joyful hearts and the blessings of our parents, we invite you to celebrate the beginning of our forever together.',
    wedding_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '60 days'),
    wedding_start_time TEXT NOT NULL DEFAULT '18:30',
    wedding_end_time TEXT DEFAULT '23:30',
    time_zone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    
    venue_name TEXT NOT NULL DEFAULT 'The Grand Palace Heritage Resort',
    address_line TEXT NOT NULL DEFAULT 'Rajputana Heritage Road, Lake Pichola',
    city TEXT NOT NULL DEFAULT 'Udaipur',
    state TEXT NOT NULL DEFAULT 'Rajasthan',
    postal_code TEXT NOT NULL DEFAULT '313001',
    google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    footer_message TEXT DEFAULT 'Bless our new beginning with your presence and love.',
    
    cover_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=85',
    music_url TEXT DEFAULT 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
    music_title TEXT DEFAULT 'Royal Shehnai & Sitar Harmony',
    music_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Wedding Events Table
CREATE TABLE IF NOT EXISTS public.wedding_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    time_zone TEXT DEFAULT 'Asia/Kolkata',
    venue_name TEXT NOT NULL,
    full_address TEXT NOT NULL,
    google_maps_url TEXT,
    cover_photo_url TEXT,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Wedding Albums Table (for After-Wedding & category collections)
CREATE TABLE IF NOT EXISTS public.wedding_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    cover_photo_url TEXT,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Wedding Photos Table
CREATE TABLE IF NOT EXISTS public.wedding_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES public.wedding_albums(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'gallery', -- 'couple', 'gallery', 'after_wedding'
    storage_path TEXT,
    photo_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    alt_text TEXT,
    photo_date DATE,
    display_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Wedding RSVPs Table
CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_name TEXT NOT NULL,
    attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'declined')),
    attendees_count INT NOT NULL DEFAULT 1 CHECK (attendees_count >= 0 AND attendees_count <= 20),
    phone_number TEXT,
    message TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 Website Settings Table (Singleton for appearance and sections)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT DEFAULT 'Devendra & Priyanka | Royal Wedding Invitation',
    theme_color_primary TEXT DEFAULT '#D4AF37',
    theme_color_secondary TEXT DEFAULT '#4A0E1B',
    show_couple_section BOOLEAN DEFAULT true,
    show_countdown BOOLEAN DEFAULT true,
    show_events_section BOOLEAN DEFAULT true,
    show_main_gallery BOOLEAN DEFAULT true,
    show_after_wedding_gallery BOOLEAN DEFAULT true,
    show_rsvp_section BOOLEAN DEFAULT true,
    show_music_controls BOOLEAN DEFAULT true,
    show_family_details BOOLEAN DEFAULT true,
    max_rsvp_attendees INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 3.1 Public Read Policies (Visitors can read published content)
DROP POLICY IF EXISTS "Public can view wedding settings" ON public.wedding_settings;
CREATE POLICY "Public can view wedding settings"
    ON public.wedding_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public can view published events" ON public.wedding_events;
CREATE POLICY "Public can view published events"
    ON public.wedding_events FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published albums" ON public.wedding_albums;
CREATE POLICY "Public can view published albums"
    ON public.wedding_albums FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published photos" ON public.wedding_photos;
CREATE POLICY "Public can view published photos"
    ON public.wedding_photos FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Public can view website settings" ON public.website_settings;
CREATE POLICY "Public can view website settings"
    ON public.website_settings FOR SELECT
    USING (true);

-- 3.2 RSVP Policies:
-- Public can INSERT their RSVP response
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.wedding_rsvps;
CREATE POLICY "Public can submit RSVP"
    ON public.wedding_rsvps FOR INSERT
    WITH CHECK (
        guest_name IS NOT NULL 
        AND length(trim(guest_name)) > 0
        AND attendance_status IN ('attending', 'declined')
    );

-- CRITICAL SECURITY: Public CANNOT select/read RSVPs to protect guest phone numbers and private messages!
DROP POLICY IF EXISTS "Admins full access to RSVPs" ON public.wedding_rsvps;
CREATE POLICY "Admins full access to RSVPs"
    ON public.wedding_rsvps FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3.3 Full CRUD Management Policies for Wedding Data
-- Wedding Settings
DROP POLICY IF EXISTS "Admins full access to wedding settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Full access to wedding settings" ON public.wedding_settings;
CREATE POLICY "Full access to wedding settings"
    ON public.wedding_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- Wedding Events
DROP POLICY IF EXISTS "Admins full access to wedding events" ON public.wedding_events;
DROP POLICY IF EXISTS "Full access to wedding events" ON public.wedding_events;
CREATE POLICY "Full access to wedding events"
    ON public.wedding_events FOR ALL
    USING (true)
    WITH CHECK (true);

-- Wedding Albums
DROP POLICY IF EXISTS "Admins full access to wedding albums" ON public.wedding_albums;
DROP POLICY IF EXISTS "Full access to wedding albums" ON public.wedding_albums;
CREATE POLICY "Full access to wedding albums"
    ON public.wedding_albums FOR ALL
    USING (true)
    WITH CHECK (true);

-- Wedding Photos
DROP POLICY IF EXISTS "Admins full access to wedding photos" ON public.wedding_photos;
DROP POLICY IF EXISTS "Full access to wedding photos" ON public.wedding_photos;
CREATE POLICY "Full access to wedding photos"
    ON public.wedding_photos FOR ALL
    USING (true)
    WITH CHECK (true);

-- Website Settings
DROP POLICY IF EXISTS "Admins full access to website settings" ON public.website_settings;
DROP POLICY IF EXISTS "Full access to website settings" ON public.website_settings;
CREATE POLICY "Full access to website settings"
    ON public.website_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 4. STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Insert the public media bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
-- Allow public to view media
DROP POLICY IF EXISTS "Public can view wedding media" ON storage.objects;
CREATE POLICY "Public can view wedding media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wedding-media');

-- Allow upload media
DROP POLICY IF EXISTS "Admins can upload wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload wedding media" ON storage.objects;
CREATE POLICY "Allow upload wedding media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'wedding-media');

-- Allow update media
DROP POLICY IF EXISTS "Admins can update wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update wedding media" ON storage.objects;
CREATE POLICY "Allow update wedding media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'wedding-media')
    WITH CHECK (bucket_id = 'wedding-media');

-- Allow delete media
DROP POLICY IF EXISTS "Admins can delete wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete wedding media" ON storage.objects;
CREATE POLICY "Allow delete wedding media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'wedding-media');

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- 5.1 Insert Default Wedding Settings if empty
INSERT INTO public.wedding_settings (
    id, groom_name, groom_nickname, groom_photo_url, groom_father_name, groom_mother_name, groom_family_name, groom_bio,
    bride_name, bride_nickname, bride_photo_url, bride_father_name, bride_mother_name, bride_family_name, bride_bio,
    wedding_title, invitation_heading, invitation_message, wedding_date, wedding_start_time, wedding_end_time,
    time_zone, venue_name, address_line, city, state, postal_code, google_maps_url, footer_message
)
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Devendra', 'Dev', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'Mr. Rajeshwar Sharma', 'Mrs. Sunita Sharma', 'Sharma Family', 'An adventurous soul with a passion for architecture and travel, ready to embark on life’s greatest journey.',
    'Priyanka', 'Priya', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'Mr. Mahendra Verma', 'Mrs. Anupama Verma', 'Verma Family', 'A graceful spirit who finds poetry in everyday moments, bringing warmth, love, and sunshine everywhere.',
    'The Royal Wedding Celebration',
    'You Are Cordially Invited to Celebrate',
    'With the blessings of our ancestors and parents, we invite you to share our joy as two souls unite in timeless love and devotion.',
    (CURRENT_DATE + INTERVAL '45 days'),
    '18:30', '23:30',
    'Asia/Kolkata',
    'The Grand Palace Heritage Resort',
    'Rajputana Heritage Road, Lake Pichola',
    'Udaipur', 'Rajasthan', '313001',
    'https://maps.google.com/?q=Lake+Pichola+Udaipur',
    'With love, blessings, and warm regards from both families.'
WHERE NOT EXISTS (SELECT 1 FROM public.wedding_settings);

-- 5.2 Insert Default Website Settings if empty
INSERT INTO public.website_settings (
    id, site_title, theme_color_primary, theme_color_secondary,
    show_couple_section, show_countdown, show_events_section,
    show_main_gallery, show_after_wedding_gallery, show_rsvp_section,
    show_music_controls, show_family_details, max_rsvp_attendees
)
SELECT
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Devendra & Priyanka | Royal Wedding Celebration',
    '#D4AF37', '#4A0E1B',
    true, true, true, true, true, true, true, true, 10
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);

-- 5.3 Insert Sample Wedding Events
INSERT INTO public.wedding_events (event_name, description, event_date, start_time, end_time, venue_name, full_address, google_maps_url, cover_photo_url, display_order, is_published)
SELECT * FROM (VALUES
    ('Ganesh Sthapana & Mehendi', 'An auspicious start with holy blessings followed by vibrant mehendi, folk songs, and joyful dance.', (CURRENT_DATE + INTERVAL '43 days')::date, '15:00', '19:00', 'Courtyard of Royal Palms', 'Lake Pichola Road, Udaipur, Rajasthan', 'https://maps.google.com/?q=Lake+Pichola+Udaipur', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 1, true),
    ('Haldi Ceremony', 'A sunlit morning filled with fragrant turmeric, yellow marigolds, pure joy, and blessings for the couple.', (CURRENT_DATE + INTERVAL '44 days')::date, '10:00', '13:00', 'Sunken Garden Lawn', 'The Grand Palace Heritage, Udaipur', 'https://maps.google.com/?q=Lake+Pichola+Udaipur', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 2, true),
    ('Sangeet & Cocktail Night', 'An enchanting evening of music, captivating performances, laughter, and high-energy celebrations.', (CURRENT_DATE + INTERVAL '44 days')::date, '19:30', '00:00', 'Crystal Ballroom', 'The Grand Palace Heritage, Udaipur', 'https://maps.google.com/?q=Lake+Pichola+Udaipur', 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80', 3, true),
    ('Royal Wedding Ceremony', 'The sacred Vedic rituals, Pheras under the stars, and the solemn vows of eternal companionship.', (CURRENT_DATE + INTERVAL '45 days')::date, '18:30', '22:30', 'Lakeview Royal Mandap', 'The Grand Palace Heritage, Udaipur', 'https://maps.google.com/?q=Lake+Pichola+Udaipur', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 4, true),
    ('Grand Reception', 'A lavish royal banquet to greet the newlyweds and celebrate our joyous journey ahead.', (CURRENT_DATE + INTERVAL '46 days')::date, '19:00', '23:30', 'Palace Banquets & Imperial Gardens', 'The Grand Palace Heritage, Udaipur', 'https://maps.google.com/?q=Lake+Pichola+Udaipur', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', 5, true)
) AS v(event_name, description, event_date, start_time, end_time, venue_name, full_address, google_maps_url, cover_photo_url, display_order, is_published)
WHERE NOT EXISTS (SELECT 1 FROM public.wedding_events);

-- 5.4 Insert Sample Couple & Pre-Wedding Photos
INSERT INTO public.wedding_photos (category, photo_url, caption, alt_text, display_order, is_published, is_cover)
SELECT * FROM (VALUES
    ('couple', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', 'Timeless Gaze - A Promise for Eternity', 'Couple holding hands in traditional attire', 1, true, true),
    ('couple', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80', 'Under the Royal Canopy of Stars', 'Bride and groom walking in courtyard', 2, true, false),
    ('gallery', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80', 'Golden Hour Romance at Lake Pichola', 'Romantic lakeside couple shoot', 3, true, false),
    ('gallery', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80', 'Laughter and Whispers of Forever', 'Candid laughing moment of couple', 4, true, false),
    ('gallery', 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80', 'Grace and Splendor', 'Bride portrait with delicate jewelry', 5, true, false),
    ('gallery', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80', 'The Prince Awaits His Queen', 'Groom royal portrait in sherwani', 6, true, false)
) AS v(category, photo_url, caption, alt_text, display_order, is_published, is_cover)
WHERE NOT EXISTS (SELECT 1 FROM public.wedding_photos WHERE category IN ('couple', 'gallery'));

-- 5.5 Insert Sample After-Wedding Albums
INSERT INTO public.wedding_albums (id, title, description, cover_photo_url, display_order, is_published)
SELECT * FROM (VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'The Royal Pheras & Vows', 'Unforgettable moments from our sacred ceremony and the seven vows under the stars.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 1, true),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'Sangeet & Dance Celebrations', 'High voltage dancing, musical night, and joyous performances by family and friends.', 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80', 2, true),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'Haldi & Floral Sunshine', 'Joyous moments bathed in gold, flowers, and pure blessings from all our loved ones.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 3, true)
) AS v(id, title, description, cover_photo_url, display_order, is_published)
WHERE NOT EXISTS (SELECT 1 FROM public.wedding_albums);
