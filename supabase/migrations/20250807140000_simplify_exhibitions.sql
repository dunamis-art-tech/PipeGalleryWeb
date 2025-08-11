-- Exhibition System Simplification
-- Remove unnecessary exhibition-artwork relationships and simplify exhibition model

-- Drop the exhibition_artworks junction table as it's not needed
DROP TABLE IF EXISTS exhibition_artworks;

-- Drop related indexes
DROP INDEX IF EXISTS idx_exhibition_artworks_exhibition_id;
DROP INDEX IF EXISTS idx_exhibition_artworks_artwork_id; 
DROP INDEX IF EXISTS idx_exhibition_artworks_display_order;

-- Ensure exhibition_images table has proper constraints for poster images
-- Add constraint to ensure only one poster per exhibition
CREATE UNIQUE INDEX IF NOT EXISTS idx_exhibition_poster_unique 
ON exhibition_images(exhibition_id) 
WHERE image_type = 'poster';

-- Update exhibition_images to ensure poster is always display_order 0
CREATE OR REPLACE FUNCTION ensure_poster_display_order()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a poster image, set display_order to 0
  IF NEW.image_type = 'poster' THEN
    NEW.display_order = 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for poster display order
DROP TRIGGER IF EXISTS ensure_poster_display_order_trigger ON exhibition_images;
CREATE TRIGGER ensure_poster_display_order_trigger
  BEFORE INSERT OR UPDATE ON exhibition_images
  FOR EACH ROW EXECUTE FUNCTION ensure_poster_display_order();

-- Add helper function to get exhibition poster
CREATE OR REPLACE FUNCTION get_exhibition_poster(exhibition_uuid uuid)
RETURNS text AS $$
DECLARE
  poster_url text;
BEGIN
  SELECT image_url INTO poster_url 
  FROM exhibition_images 
  WHERE exhibition_id = exhibition_uuid 
    AND image_type = 'poster' 
  LIMIT 1;
  
  RETURN poster_url;
END;
$$ LANGUAGE plpgsql;

-- Add helper function to set exhibition poster
CREATE OR REPLACE FUNCTION set_exhibition_poster(exhibition_uuid uuid, new_image_url text, alt_text_param text DEFAULT NULL)
RETURNS uuid AS $$
DECLARE
  new_poster_id uuid;
BEGIN
  -- Remove existing poster
  DELETE FROM exhibition_images 
  WHERE exhibition_id = exhibition_uuid 
    AND image_type = 'poster';
  
  -- Insert new poster
  INSERT INTO exhibition_images (exhibition_id, image_url, alt_text, image_type, display_order)
  VALUES (exhibition_uuid, new_image_url, alt_text_param, 'poster', 0)
  RETURNING id INTO new_poster_id;
  
  RETURN new_poster_id;
END;
$$ LANGUAGE plpgsql;

-- Update exhibitions table to have a direct poster_image_url reference (optional optimization)
ALTER TABLE exhibitions 
ADD COLUMN IF NOT EXISTS poster_image_url text;

-- Create trigger to sync poster_image_url with exhibition_images
CREATE OR REPLACE FUNCTION sync_exhibition_poster()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update exhibitions table when poster is added/updated
    IF NEW.image_type = 'poster' THEN
      UPDATE exhibitions 
      SET poster_image_url = NEW.image_url 
      WHERE id = NEW.exhibition_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Clear poster URL when poster is deleted
    IF OLD.image_type = 'poster' THEN
      UPDATE exhibitions 
      SET poster_image_url = NULL 
      WHERE id = OLD.exhibition_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for poster sync
DROP TRIGGER IF EXISTS sync_exhibition_poster_trigger ON exhibition_images;
CREATE TRIGGER sync_exhibition_poster_trigger
  AFTER INSERT OR UPDATE OR DELETE ON exhibition_images
  FOR EACH ROW EXECUTE FUNCTION sync_exhibition_poster();

-- Add comment explaining the simplified model
COMMENT ON TABLE exhibitions IS 'Exhibitions are independent entities. They can have images but are not directly linked to specific artworks in the database.';
COMMENT ON TABLE exhibition_images IS 'Images related to exhibitions. poster type should have only one image per exhibition.';
COMMENT ON COLUMN exhibitions.poster_image_url IS 'Cached poster image URL for quick access, automatically synced with exhibition_images table.';