import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Artwork = Database['public']['Tables']['artworks']['Row'];
type ArtworkInsert = Database['public']['Tables']['artworks']['Insert'];
type ArtworkUpdate = Database['public']['Tables']['artworks']['Update'];
type ArtworkImage = Database['public']['Tables']['artwork_images']['Row'];
type ArtworkImageInsert = Database['public']['Tables']['artwork_images']['Insert'];

// Artwork search and filter parameters
interface ArtworkSearchData {
  query?: string;
  artist_id?: string;
  year?: number;
  is_featured?: boolean;
  materials?: string;
  sort_by?: 'title' | 'year' | 'created_at' | 'featured';
  limit?: number;
  offset?: number;
}

// Artwork form data for creation/updates
interface ArtworkFormData {
  artist_id: string;
  title: string;
  year?: number;
  materials?: string;
  dimensions?: string;
  description?: string;
  is_featured?: boolean;
}

// Extended artwork data with images and artist info
interface ArtworkWithImages extends Artwork {
  images: ArtworkImage[];
  artist?: {
    id: string;
    name: string;
    profile_image_url?: string;
  };
}

export class ArtworkService {
  // Get all artworks with optional filtering
  async getAll(params?: ArtworkSearchData): Promise<ArtworkWithImages[]> {
    let query = supabase
      .from('artworks')
      .select(`
        *,
        artist:artists(id, name, profile_image_url),
        images:artwork_images(*)
      `);

    // Apply search filter
    if (params?.query) {
      query = query.or(
        `title.ilike.%${params.query}%,description.ilike.%${params.query}%,materials.ilike.%${params.query}%`
      );
    }

    // Apply artist filter
    if (params?.artist_id) {
      query = query.eq('artist_id', params.artist_id);
    }

    // Apply year filter
    if (params?.year) {
      query = query.eq('year', params.year);
    }

    // Apply featured filter
    if (params?.is_featured !== undefined) {
      query = query.eq('is_featured', params.is_featured);
    }

    // Apply materials filter
    if (params?.materials) {
      query = query.ilike('materials', `%${params.materials}%`);
    }

    // Apply sorting
    switch (params?.sort_by) {
      case 'year':
        query = query.order('year', { ascending: false });
        break;
      case 'created_at':
        query = query.order('created_at', { ascending: false });
        break;
      case 'featured':
        query = query.order('is_featured', { ascending: false }).order('title');
        break;
      default:
        query = query.order('title', { ascending: true });
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get artwork by ID with images and artist info
  async getById(id: string): Promise<ArtworkWithImages | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artist:artists(id, name, profile_image_url),
        images:artwork_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Get artwork by slug
  async getBySlug(slug: string): Promise<ArtworkWithImages | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artist:artists(id, name, profile_image_url),
        images:artwork_images(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  // Create new artwork
  async create(artworkData: ArtworkFormData): Promise<Artwork> {
    const { data, error } = await supabase
      .from('artworks')
      .insert({
        ...artworkData,
        is_featured: artworkData.is_featured || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update artwork
  async update(id: string, updates: Partial<ArtworkFormData>): Promise<Artwork> {
    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete artwork
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Create image record in database
  async createImageRecord(artworkId: string, imageData: {
    image_url: string;
    alt_text?: string;
    is_primary?: boolean;
    display_order?: number;
  }): Promise<ArtworkImage> {
    const { data, error } = await supabase
      .from('artwork_images')
      .insert({
        artwork_id: artworkId,
        ...imageData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Upload artwork images
  async uploadImages(artworkId: string, images: File[]): Promise<ArtworkImage[]> {
    const uploadPromises = images.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${artworkId}_${Date.now()}_${index}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

      // Save image record to database
      const { data: imageData, error: dbError } = await supabase
        .from('artwork_images')
        .insert({
          artwork_id: artworkId,
          image_url: publicUrl,
          alt_text: `${file.name}`,
          display_order: index,
          is_primary: index === 0 // First image is primary by default
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return imageData;
    });

    return Promise.all(uploadPromises);
  }

  // Update image metadata
  async updateImage(imageId: string, updates: {
    alt_text?: string;
    display_order?: number;
    is_primary?: boolean;
  }): Promise<ArtworkImage> {
    const { data, error } = await supabase
      .from('artwork_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete image
  async deleteImage(imageId: string): Promise<void> {
    // First get the image to delete from storage
    const { data: image, error: fetchError } = await supabase
      .from('artwork_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError) throw fetchError;

    // Extract file path from URL and delete from storage
    const filePath = image.image_url.split('/').pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('artworks')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion failed:', storageError);
    }

    // Delete image record from database
    const { error } = await supabase
      .from('artwork_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  }

  // Get artworks by artist ID
  async getByArtistId(artistId: string): Promise<ArtworkWithImages[]> {
    return this.getAll({ artist_id: artistId });
  }

  // Get featured artworks
  async getFeatured(limit = 6): Promise<ArtworkWithImages[]> {
    return this.getAll({ is_featured: true, limit });
  }

  // Exhibition-artwork relationships removed - exhibitions are independent entities
}

// Export singleton instance
export const artworkService = new ArtworkService();