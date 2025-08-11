-- Storage Buckets and Policies Setup
-- Run this after Supabase is running to setup storage buckets and policies

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('exhibitions', 'exhibitions', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]), -- 50MB limit
  ('artists', 'artists', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]), -- 50MB limit
  ('artworks', 'artworks', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]), -- 50MB limit
  ('general', 'general', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]) -- 50MB limit
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for exhibitions bucket
-- Public read access
CREATE POLICY "Public read access on exhibitions" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'exhibitions');

-- Authenticated users can upload to exhibitions
CREATE POLICY "Authenticated users can upload exhibitions" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'exhibitions');

-- Authenticated users can update exhibitions
CREATE POLICY "Authenticated users can update exhibitions" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'exhibitions');

-- Authenticated users can delete exhibitions  
CREATE POLICY "Authenticated users can delete exhibitions" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'exhibitions');

-- Storage policies for artists bucket
-- Public read access
CREATE POLICY "Public read access on artists" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'artists');

-- Authenticated users can upload to artists
CREATE POLICY "Authenticated users can upload artists" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artists');

-- Authenticated users can update artists
CREATE POLICY "Authenticated users can update artists" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'artists');

-- Authenticated users can delete artists
CREATE POLICY "Authenticated users can delete artists" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'artists');

-- Storage policies for artworks bucket
-- Public read access
CREATE POLICY "Public read access on artworks" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'artworks');

-- Authenticated users can upload to artworks
CREATE POLICY "Authenticated users can upload artworks" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artworks');

-- Authenticated users can update artworks
CREATE POLICY "Authenticated users can update artworks" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'artworks');

-- Authenticated users can delete artworks
CREATE POLICY "Authenticated users can delete artworks" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'artworks');

-- Storage policies for general bucket
-- Public read access
CREATE POLICY "Public read access on general" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'general');

-- Authenticated users can upload to general
CREATE POLICY "Authenticated users can upload general" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'general');

-- Authenticated users can update general
CREATE POLICY "Authenticated users can update general" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'general');

-- Authenticated users can delete general
CREATE POLICY "Authenticated users can delete general" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'general');

-- Helper function to get file size in MB
CREATE OR REPLACE FUNCTION get_file_size_mb(file_size bigint)
RETURNS numeric AS $$
BEGIN
  RETURN round((file_size::numeric / 1024 / 1024), 2);
END;
$$ LANGUAGE plpgsql;

-- Helper function to validate image file types
CREATE OR REPLACE FUNCTION is_image_file(mime_type text)
RETURNS boolean AS $$
BEGIN
  RETURN mime_type = ANY(ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
END;
$$ LANGUAGE plpgsql;