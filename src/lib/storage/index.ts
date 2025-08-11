// Storage service for PipeGallery
// Centralized storage management with bucket-specific operations

import { supabase } from '@/lib/supabase/client';
import { 
  uploadFile, 
  uploadFiles, 
  deleteFile, 
  validateImageFile,
  generateFileName,
  STORAGE_BUCKETS,
  type UploadResult 
} from '@/lib/utils/upload';

// Storage service class for organized bucket operations
export class StorageService {
  
  // Exhibition storage operations
  static async uploadExhibitionImage(
    file: File, 
    exhibitionId: string, 
    imageType?: 'poster' | 'artwork' | 'installation' | 'detail' | 'opening' | 'space'
  ): Promise<UploadResult> {
    const folder = `exhibition_${exhibitionId}`;
    const prefix = imageType ? `${imageType}` : 'image';
    const fileName = generateFileName(file.name, prefix);
    
    return uploadFile(file, STORAGE_BUCKETS.EXHIBITIONS, fileName, folder);
  }

  static async uploadMultipleExhibitionImages(
    files: File[], 
    exhibitionId: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const folder = `exhibition_${exhibitionId}`;
    return uploadFiles(files, STORAGE_BUCKETS.EXHIBITIONS, folder, onProgress);
  }

  static async deleteExhibitionImage(filePath: string): Promise<boolean> {
    return deleteFile(STORAGE_BUCKETS.EXHIBITIONS, filePath);
  }

  // Artist storage operations
  static async uploadArtistImage(
    file: File, 
    artistId: string, 
    imageType?: 'profile' | 'portfolio' | 'cv'
  ): Promise<UploadResult> {
    const folder = `artist_${artistId}`;
    const prefix = imageType || 'image';
    const fileName = generateFileName(file.name, prefix);
    
    return uploadFile(file, STORAGE_BUCKETS.ARTISTS, fileName, folder);
  }

  static async uploadMultipleArtistImages(
    files: File[], 
    artistId: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const folder = `artist_${artistId}`;
    return uploadFiles(files, STORAGE_BUCKETS.ARTISTS, folder, onProgress);
  }

  static async deleteArtistImage(filePath: string): Promise<boolean> {
    return deleteFile(STORAGE_BUCKETS.ARTISTS, filePath);
  }

  // Artwork storage operations
  static async uploadArtworkImage(
    file: File, 
    artworkId: string, 
    isPrimary: boolean = false
  ): Promise<UploadResult> {
    const folder = `artwork_${artworkId}`;
    const prefix = isPrimary ? 'primary' : 'detail';
    const fileName = generateFileName(file.name, prefix);
    
    return uploadFile(file, STORAGE_BUCKETS.ARTWORKS, fileName, folder);
  }

  static async uploadMultipleArtworkImages(
    files: File[], 
    artworkId: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const folder = `artwork_${artworkId}`;
    return uploadFiles(files, STORAGE_BUCKETS.ARTWORKS, folder, onProgress);
  }

  static async deleteArtworkImage(filePath: string): Promise<boolean> {
    return deleteFile(STORAGE_BUCKETS.ARTWORKS, filePath);
  }

  // General storage operations
  static async uploadGeneralFile(
    file: File, 
    folder?: string
  ): Promise<UploadResult> {
    return uploadFile(file, STORAGE_BUCKETS.GENERAL, undefined, folder);
  }

  static async deleteGeneralFile(filePath: string): Promise<boolean> {
    return deleteFile(STORAGE_BUCKETS.GENERAL, filePath);
  }

  // Bucket management operations
  static async listBucketFiles(bucket: string, folder?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '');

      if (error) {
        console.error(`Failed to list files in ${bucket}:`, error);
        return { success: false, error: error.message };
      }

      return { success: true, files: data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Storage list error:', error);
      return { success: false, error: errorMessage };
    }
  }

  static async getBucketSize(bucket: string): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const { data: files, error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 1000 });

      if (error || !files) {
        return { totalSize: 0, fileCount: 0 };
      }

      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      return { totalSize, fileCount: files.length };
    } catch (error) {
      console.error('Storage size calculation error:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  // File validation helper
  static validateFile(file: File) {
    return validateImageFile(file);
  }

  // Check if buckets exist and are accessible
  static async checkBucketHealth(): Promise<{
    exhibitions: boolean;
    artists: boolean;
    artworks: boolean;
    general: boolean;
  }> {
    const buckets = Object.values(STORAGE_BUCKETS);
    const health = {
      exhibitions: false,
      artists: false,
      artworks: false,
      general: false
    };

    for (const bucket of buckets) {
      try {
        const { error } = await supabase.storage.from(bucket).list('', { limit: 1 });
        health[bucket as keyof typeof health] = !error;
      } catch (error) {
        console.error(`Bucket ${bucket} health check failed:`, error);
        health[bucket as keyof typeof health] = false;
      }
    }

    return health;
  }
}

// Export convenience functions for common operations
export const exhibitionStorage = {
  upload: StorageService.uploadExhibitionImage,
  uploadMultiple: StorageService.uploadMultipleExhibitionImages,
  delete: StorageService.deleteExhibitionImage,
};

export const artistStorage = {
  upload: StorageService.uploadArtistImage,
  uploadMultiple: StorageService.uploadMultipleArtistImages,  
  delete: StorageService.deleteArtistImage,
};

export const artworkStorage = {
  upload: StorageService.uploadArtworkImage,
  uploadMultiple: StorageService.uploadMultipleArtworkImages,
  delete: StorageService.deleteArtworkImage,
};

export const generalStorage = {
  upload: StorageService.uploadGeneralFile,
  delete: StorageService.deleteGeneralFile,
};

// Re-export utilities
export * from '@/lib/utils/upload';