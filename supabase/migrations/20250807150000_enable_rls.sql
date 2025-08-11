-- Enable Row Level Security (RLS) for all tables
-- This migration enables RLS and creates policies for authenticated admin users

-- Enable RLS on all tables
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_audit ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user is authenticated
CREATE OR REPLACE FUNCTION auth.is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public read access policies for public-facing content
-- Exhibitions - public read, authenticated admin full access
CREATE POLICY "Public can view published exhibitions" ON exhibitions
  FOR SELECT TO anon, authenticated
  USING (status IN ('live', 'archived'));

CREATE POLICY "Authenticated users full access to exhibitions" ON exhibitions
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Artists - public read, authenticated admin full access
CREATE POLICY "Public can view artists" ON artists
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to artists" ON artists
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Artworks - public read, authenticated admin full access
CREATE POLICY "Public can view artworks" ON artworks
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to artworks" ON artworks
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Artwork Images - public read, authenticated admin full access
CREATE POLICY "Public can view artwork images" ON artwork_images
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to artwork images" ON artwork_images
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Exhibition Images - public read, authenticated admin full access
CREATE POLICY "Public can view exhibition images" ON exhibition_images
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to exhibition images" ON exhibition_images
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Artist Images - public read, authenticated admin full access
CREATE POLICY "Public can view artist images" ON artist_images
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to artist images" ON artist_images
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Exhibition Artists - public read, authenticated admin full access
CREATE POLICY "Public can view exhibition artists" ON exhibition_artists
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users full access to exhibition artists" ON exhibition_artists
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Videos - public read for visible videos, authenticated admin full access
CREATE POLICY "Public can view published videos" ON videos
  FOR SELECT TO anon, authenticated
  USING (is_visible = true AND status = 'published');

CREATE POLICY "Authenticated users full access to videos" ON videos
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- News Posts - public read for visible posts, authenticated admin full access
CREATE POLICY "Public can view published news posts" ON news_posts
  FOR SELECT TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Authenticated users full access to news posts" ON news_posts
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Pages - public read for published pages, authenticated admin full access
CREATE POLICY "Public can view published pages" ON pages
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users full access to pages" ON pages
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Admin-only tables - authenticated access only
CREATE POLICY "Authenticated users full access to newsletter subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

CREATE POLICY "Authenticated users full access to site settings" ON site_settings
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

CREATE POLICY "Authenticated users full access to media library" ON media_library
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

CREATE POLICY "Authenticated users full access to user roles" ON user_roles
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

CREATE POLICY "Authenticated users full access to content audit" ON content_audit
  FOR ALL TO authenticated
  USING (auth.is_authenticated())
  WITH CHECK (auth.is_authenticated());

-- Special policy for newsletter signup (allow anonymous inserts)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;