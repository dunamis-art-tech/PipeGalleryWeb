-- Artwork Management System
-- This migration adds comprehensive artwork management functionality

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  year integer,
  materials text, -- 재료/기법 (예: "Oil on canvas", "Mixed media")
  dimensions text, -- 크기 (예: "100 x 80 cm", "가변크기")
  description text,
  is_featured boolean DEFAULT false,
  slug text UNIQUE, -- URL용 슬러그
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create artwork_images table
CREATE TABLE IF NOT EXISTS artwork_images (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false, -- 대표 이미지 여부
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create exhibition_artworks junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS exhibition_artworks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  exhibition_id uuid REFERENCES exhibitions(id) ON DELETE CASCADE NOT NULL,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE NOT NULL,
  display_order integer DEFAULT 0, -- 전시 내 작품 순서
  is_featured boolean DEFAULT false, -- 전시 대표 작품 여부
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(exhibition_id, artwork_id)
);

-- Enhance exhibition_images table with image types
ALTER TABLE exhibition_images 
ADD COLUMN IF NOT EXISTS image_type text CHECK (image_type IN ('poster', 'artwork', 'installation', 'detail', 'opening', 'space')) DEFAULT 'artwork';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_is_featured ON artworks(is_featured);
CREATE INDEX IF NOT EXISTS idx_artworks_year ON artworks(year);
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON artworks(slug);

CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id ON artwork_images(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_images_is_primary ON artwork_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_artwork_images_display_order ON artwork_images(display_order);

CREATE INDEX IF NOT EXISTS idx_exhibition_artworks_exhibition_id ON exhibition_artworks(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_artworks_artwork_id ON exhibition_artworks(artwork_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_artworks_display_order ON exhibition_artworks(display_order);

CREATE INDEX IF NOT EXISTS idx_exhibition_images_type ON exhibition_images(image_type);

-- Add triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_artworks_updated_at 
  BEFORE UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add function to generate artwork slug
CREATE OR REPLACE FUNCTION generate_artwork_slug(artwork_title text, artist_name text, artwork_year integer)
RETURNS text AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Create base slug from artist name, title, and year
  base_slug := lower(regexp_replace(
    artist_name || '-' || artwork_title || COALESCE('-' || artwork_year::text, ''), 
    '[^a-zA-Z0-9가-힣]', '-', 'g'
  ));
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM artworks WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-generate slug
CREATE OR REPLACE FUNCTION auto_generate_artwork_slug()
RETURNS TRIGGER AS $$
DECLARE
  artist_name_val text;
BEGIN
  -- Get artist name
  SELECT name INTO artist_name_val FROM artists WHERE id = NEW.artist_id;
  
  -- Generate slug if not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_artwork_slug(NEW.title, artist_name_val, NEW.year);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS auto_generate_artwork_slug_trigger
  BEFORE INSERT OR UPDATE ON artworks
  FOR EACH ROW EXECUTE FUNCTION auto_generate_artwork_slug();

-- Sample data for testing (optional)
-- INSERT INTO artworks (artist_id, title, year, materials, dimensions, description)
-- SELECT id, 'Sample Artwork', 2024, 'Oil on canvas', '100 x 80 cm', 'A beautiful contemporary artwork'
-- FROM artists LIMIT 1;