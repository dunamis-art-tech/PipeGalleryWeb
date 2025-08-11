import { supabase } from '@/lib/supabase/client';

// Supported image types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'] as const;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Bucket names
export const STORAGE_BUCKETS = {
  EXHIBITIONS: 'exhibitions',
  ARTISTS: 'artists', 
  ARTWORKS: 'artworks',
  GENERAL: 'general'
} as const;

// File upload result type
export interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  filePath?: string;
}

// Validate file before upload
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드 가능합니다.` 
    };
  }

  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
    return { 
      valid: false, 
      error: '지원하지 않는 파일 형식입니다. JPEG, PNG, WebP, GIF 파일만 업로드 가능합니다.' 
    };
  }

  return { valid: true };
}

// Generate unique filename
export function generateFileName(originalName: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase();
  const baseName = originalName.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
  
  const fileName = prefix 
    ? `${prefix}_${baseName}_${timestamp}_${random}.${extension}`
    : `${baseName}_${timestamp}_${random}.${extension}`;
    
  return fileName;
}

// Upload single file to Supabase Storage
export async function uploadFile(
  file: File, 
  bucket: string, 
  fileName?: string,
  folder?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate filename if not provided
    const finalFileName = fileName || generateFileName(file.name);
    const filePath = folder ? `${folder}/${finalFileName}` : finalFileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { 
      success: true, 
      publicUrl, 
      filePath 
    };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.' 
    };
  }
}

// Upload multiple files
export async function uploadFiles(
  files: File[],
  bucket: string,
  folder?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await uploadFile(file, bucket, undefined, folder);
    results.push(result);
    
    // Call progress callback
    onProgress?.(i + 1, files.length);
  }

  return results;
}

// Delete file from Supabase Storage
export async function deleteFile(bucket: string, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('File deletion failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}

// Extract file path from public URL
export function extractFilePathFromUrl(publicUrl: string, bucket: string): string | null {
  try {
    const url = new URL(publicUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucket);
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch (error) {
    console.error('URL parsing error:', error);
    return null;
  }
}

// Get file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Image optimization helpers
export function createImageThumbnail(file: File, maxWidth: number = 300, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailFile = new File([blob], file.name, { type: file.type });
          resolve(thumbnailFile);
        } else {
          reject(new Error('썸네일 생성에 실패했습니다.'));
        }
      }, file.type, quality);
    };
    
    img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
    img.src = URL.createObjectURL(file);
  });
}

// Batch operations for cleanup
export async function cleanupUnusedFiles(bucket: string, usedFilePaths: string[]): Promise<number> {
  try {
    // Get all files in bucket
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list();

    if (error || !files) return 0;

    // Find unused files
    const unusedFiles = files
      .map(file => file.name)
      .filter(fileName => !usedFilePaths.some(usedPath => usedPath.includes(fileName)));

    // Delete unused files
    if (unusedFiles.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove(unusedFiles);

      if (deleteError) {
        console.error('Cleanup failed:', deleteError);
        return 0;
      }
    }

    return unusedFiles.length;
  } catch (error) {
    console.error('Cleanup error:', error);
    return 0;
  }
}