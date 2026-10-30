-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO ENABLE PHOTO UPLOADS & STORAGE
-- ==============================================================================

-- 1. Create the Public Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-media', 'wedding-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Bucket Policies (Allow public view & upload/delete)
DROP POLICY IF EXISTS "Public can view wedding media" ON storage.objects;
CREATE POLICY "Public can view wedding media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wedding-media');

DROP POLICY IF EXISTS "Admins can upload wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload wedding media" ON storage.objects;
CREATE POLICY "Allow upload wedding media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'wedding-media');

DROP POLICY IF EXISTS "Admins can update wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update wedding media" ON storage.objects;
CREATE POLICY "Allow update wedding media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'wedding-media');

DROP POLICY IF EXISTS "Admins can delete wedding media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete wedding media" ON storage.objects;
CREATE POLICY "Allow delete wedding media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'wedding-media');

-- 3. Database Table Permissions (Allow saving photos, events, albums, settings)
DROP POLICY IF EXISTS "Admins full access to wedding photos" ON public.wedding_photos;
DROP POLICY IF EXISTS "Full access to wedding photos" ON public.wedding_photos;
CREATE POLICY "Full access to wedding photos"
    ON public.wedding_photos FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to wedding albums" ON public.wedding_albums;
DROP POLICY IF EXISTS "Full access to wedding albums" ON public.wedding_albums;
CREATE POLICY "Full access to wedding albums"
    ON public.wedding_albums FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to wedding events" ON public.wedding_events;
DROP POLICY IF EXISTS "Full access to wedding events" ON public.wedding_events;
CREATE POLICY "Full access to wedding events"
    ON public.wedding_events FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to wedding settings" ON public.wedding_settings;
DROP POLICY IF EXISTS "Full access to wedding settings" ON public.wedding_settings;
CREATE POLICY "Full access to wedding settings"
    ON public.wedding_settings FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to website settings" ON public.website_settings;
DROP POLICY IF EXISTS "Full access to website settings" ON public.website_settings;
CREATE POLICY "Full access to website settings"
    ON public.website_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. RSVP Responses Permissions (Allow public submit and admin view/delete)
ALTER TABLE IF EXISTS public.wedding_rsvps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.wedding_rsvps;
DROP POLICY IF EXISTS "Admins full access to RSVPs" ON public.wedding_rsvps;
DROP POLICY IF EXISTS "Full access to wedding rsvps" ON public.wedding_rsvps;
CREATE POLICY "Full access to wedding rsvps"
    ON public.wedding_rsvps FOR ALL
    USING (true)
    WITH CHECK (true);

