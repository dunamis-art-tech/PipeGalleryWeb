import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type ExhibitionImage = Database['public']['Tables']['exhibition_images']['Row'];
type ExhibitionImageInsert = Database['public']['Tables']['exhibition_images']['Insert'];
type ExhibitionImageUpdate = Database['public']['Tables']['exhibition_images']['Update'];

// Image type constants
export const EXHIBITION_IMAGE_TYPES = {
  POSTER: 'poster',
  ARTWORK: 'artwork', 
  INSTALLATION: 'installation',
  DETAIL: 'detail',
  OPENING: 'opening',
  SPACE: 'space'
} as const;

export const EXHIBITION_IMAGE_TYPE_LABELS = {
  poster: '포스터',
  artwork: '작품',
  installation: '설치 뷰',
  detail: '세부',
  opening: '오프닝',
  space: '공간'
} as const;

// Search and filter parameters
interface ExhibitionImageSearchParams {
  exhibition_id: string;
  image_type?: keyof typeof EXHIBITION_IMAGE_TYPES;
  sort_by?: 'display_order' | 'created_at' | 'image_type';
  limit?: number;
  offset?: number;
}

// Grouped images by type
interface GroupedExhibitionImages {
  poster: ExhibitionImage[];
  artwork: ExhibitionImage[];
  installation: ExhibitionImage[];
  detail: ExhibitionImage[];
  opening: ExhibitionImage[];
  space: ExhibitionImage[];
  all: ExhibitionImage[];
  count: {
    poster: number;
    artwork: number;
    installation: number;
    detail: number;
    opening: number;
    space: number;
    total: number;
  };
}

export class ExhibitionImageService {
  // Get all images for an exhibition
  async getByExhibitionId(params: ExhibitionImageSearchParams): Promise<ExhibitionImage[]> {
    let query = supabase
      .from('exhibition_images')
      .select('*')
      .eq('exhibition_id', params.exhibition_id);

    // Apply image type filter
    if (params.image_type) {
      query = query.eq('image_type', params.image_type);
    }

    // Apply sorting
    switch (params.sort_by) {
      case 'display_order':
        query = query.order('display_order', { ascending: true });
        break;
      case 'image_type':
        query = query.order('image_type').order('display_order');
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get images grouped by type
  async getGroupedByType(exhibitionId: string): Promise<GroupedExhibitionImages> {
    const images = await this.getByExhibitionId({
      exhibition_id: exhibitionId,
      sort_by: 'image_type'
    });

    const grouped: GroupedExhibitionImages = {
      poster: [],
      artwork: [],
      installation: [],
      detail: [],
      opening: [],
      space: [],
      all: images,
      count: {
        poster: 0,
        artwork: 0,
        installation: 0,
        detail: 0,
        opening: 0,
        space: 0,
        total: images.length
      }
    };

    // Group images by type
    images.forEach(image => {
      const type = image.image_type;
      if (type && type in grouped && Array.isArray(grouped[type as keyof typeof grouped])) {
        (grouped[type as keyof typeof grouped] as ExhibitionImage[]).push(image);
        grouped.count[type as keyof typeof grouped.count]++;
      }
    });

    return grouped;
  }

  // Create new exhibition image
  async create(imageData: ExhibitionImageInsert): Promise<ExhibitionImage> {
    const { data, error } = await supabase
      .from('exhibition_images')
      .insert(imageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update exhibition image
  async update(id: string, updates: ExhibitionImageUpdate): Promise<ExhibitionImage> {
    const { data, error } = await supabase
      .from('exhibition_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete exhibition image
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('exhibition_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Bulk upload images for exhibition
  async uploadImages(exhibitionId: string, uploads: Array<{
    file: File;
    imageType: keyof typeof EXHIBITION_IMAGE_TYPES;
    altText?: string;
    displayOrder?: number;
  }>): Promise<ExhibitionImage[]> {
    const uploadPromises = uploads.map(async (upload, index) => {
      const fileExt = upload.file.name.split('.').pop();
      const fileName = `${exhibitionId}_${upload.imageType}_${Date.now()}_${index}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('exhibitions')
        .upload(filePath, upload.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exhibitions')
        .getPublicUrl(filePath);

      // Save image record to database
      const { data: imageData, error: dbError } = await supabase
        .from('exhibition_images')
        .insert({
          exhibition_id: exhibitionId,
          image_url: publicUrl,
          alt_text: upload.altText || `${EXHIBITION_IMAGE_TYPE_LABELS[upload.imageType as keyof typeof EXHIBITION_IMAGE_TYPE_LABELS]} ${index + 1}`,
          display_order: upload.displayOrder ?? index,
          image_type: upload.imageType
        })
        .select()
        .single();

      if (dbError) throw dbError;
      return imageData;
    });

    return Promise.all(uploadPromises);
  }

  // Reorder images within a type
  async reorderImages(imageIds: string[], newOrders: number[]): Promise<void> {
    const updatePromises = imageIds.map((id, index) =>
      this.update(id, { display_order: newOrders[index] })
    );

    await Promise.all(updatePromises);
  }

  // Get poster image (main exhibition image)
  async getPosterImage(exhibitionId: string): Promise<ExhibitionImage | null> {
    const { data, error } = await supabase
      .from('exhibition_images')
      .select('*')
      .eq('exhibition_id', exhibitionId)
      .eq('image_type', 'poster')
      .order('display_order')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  // Set image as poster (main exhibition image)
  async setPosterImage(exhibitionId: string, imageId: string): Promise<ExhibitionImage> {
    // First, remove poster type from existing poster images
    await supabase
      .from('exhibition_images')
      .update({ image_type: 'artwork' })
      .eq('exhibition_id', exhibitionId)
      .eq('image_type', 'poster');

    // Set the new image as poster
    const { data, error } = await supabase
      .from('exhibition_images')
      .update({ 
        image_type: 'poster',
        display_order: 0
      })
      .eq('id', imageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get statistics for exhibition images
  async getImageStats(exhibitionId: string): Promise<{
    totalImages: number;
    imagesByType: Record<string, number>;
    recentlyAdded: number;
  }> {
    const images = await this.getByExhibitionId({ exhibition_id: exhibitionId });

    // Count images by type
    const imagesByType: Record<string, number> = {};
    Object.values(EXHIBITION_IMAGE_TYPES).forEach(type => {
      imagesByType[type] = images.filter(img => img.image_type === type).length;
    });

    // Count recently added (within last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentlyAdded = images.filter(img => 
      new Date(img.created_at) > oneDayAgo
    ).length;

    return {
      totalImages: images.length,
      imagesByType,
      recentlyAdded
    };
  }

  // Delete image from storage and database
  async deleteImageWithStorage(imageId: string): Promise<void> {
    // First get the image to delete from storage
    const { data: image, error: fetchError } = await supabase
      .from('exhibition_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError) throw fetchError;

    // Extract file path from URL and delete from storage
    const filePath = image.image_url.split('/').pop();
    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('exhibitions')
        .remove([filePath]);

      if (storageError) console.warn('Storage deletion failed:', storageError);
    }

    // Delete image record from database
    const { error } = await supabase
      .from('exhibition_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  }

  // Bulk delete images
  async bulkDelete(imageIds: string[]): Promise<void> {
    const deletePromises = imageIds.map(id => this.deleteImageWithStorage(id));
    await Promise.all(deletePromises);
  }

  // Copy images from one exhibition to another
  async copyImages(fromExhibitionId: string, toExhibitionId: string, imageTypes?: string[]): Promise<ExhibitionImage[]> {
    let query = supabase
      .from('exhibition_images')
      .select('*')
      .eq('exhibition_id', fromExhibitionId);

    if (imageTypes && imageTypes.length > 0) {
      query = query.in('image_type', imageTypes);
    }

    const { data: sourceImages, error } = await query;
    if (error) throw error;

    if (!sourceImages || sourceImages.length === 0) return [];

    // Create new image records with new exhibition ID
    const newImages = sourceImages.map(img => ({
      exhibition_id: toExhibitionId,
      image_url: img.image_url,
      alt_text: img.alt_text,
      display_order: img.display_order,
      image_type: img.image_type
    }));

    const { data: copiedImages, error: insertError } = await supabase
      .from('exhibition_images')
      .insert(newImages)
      .select();

    if (insertError) throw insertError;
    return copiedImages || [];
  }
}

// Export singleton instance
export const exhibitionImageService = new ExhibitionImageService();