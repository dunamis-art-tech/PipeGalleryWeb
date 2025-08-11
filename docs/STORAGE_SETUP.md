# Supabase Storage Setup Guide

## Overview
This guide explains how to set up Supabase Storage buckets for PipeGallery with proper policies and permissions.

## Storage Buckets Structure

### 1. **exhibitions** bucket
- **Purpose**: Exhibition posters, artwork images, installation views, opening reception photos
- **Organization**: `exhibition_{id}/` folders for each exhibition
- **File Types**: poster_, artwork_, installation_, detail_, opening_, space_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

### 2. **artists** bucket  
- **Purpose**: Artist profile photos, portfolio images, CV documents
- **Organization**: `artist_{id}/` folders for each artist
- **File Types**: profile_, portfolio_, cv_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

### 3. **artworks** bucket
- **Purpose**: High-resolution artwork images with multiple views and details
- **Organization**: `artwork_{id}/` folders for each artwork
- **File Types**: primary_, detail_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

### 4. **general** bucket
- **Purpose**: Site assets, logos, general files
- **Organization**: Flexible folder structure
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

## Setup Steps

### Step 1: Run Storage Setup SQL

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/storage_setup.sql`

```sql
-- This will create:
-- ✅ 4 storage buckets with proper configuration
-- ✅ RLS policies for authenticated admin access
-- ✅ Helper functions for file management
```

### Step 2: Verify Bucket Creation

Check that all buckets are created:
- Go to Storage → Buckets in Supabase dashboard
- Verify these buckets exist:
  - `exhibitions`
  - `artists` 
  - `artworks`
  - `general`

### Step 3: Test Storage Functionality

1. Visit `/admin/storage-test` in your application
2. Click "Test Buckets" to verify connectivity
3. Upload a test image to verify upload functionality
4. Check Supabase Storage dashboard to see uploaded files

## Security Policies

### Public Access (Read Only)
- All buckets allow public read access for displaying images on the website
- No authentication required for viewing images

### Admin Access (Full CRUD)
- Authenticated users (admins) have full access:
  - **CREATE**: Upload new files
  - **READ**: View all files
  - **UPDATE**: Replace existing files
  - **DELETE**: Remove files

### Policy Structure
```sql
-- Example policy for exhibitions bucket
CREATE POLICY "Public read access on exhibitions" 
ON storage.objects FOR SELECT TO public 
USING (bucket_id = 'exhibitions');

CREATE POLICY "Authenticated users can upload exhibitions" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'exhibitions');
```

## File Organization Best Practices

### Naming Convention
```
{prefix}_{original_name}_{timestamp}_{random}.{extension}

Examples:
- poster_spring_exhibition_1704716400000_a3b2c1.jpg
- primary_artwork_portrait_1704716400000_x9y8z7.png
- profile_artist_photo_1704716400000_m4n5p6.jpg
```

### Folder Structure
```
exhibitions/
  ├── exhibition_uuid1/
  │   ├── poster_image.jpg
  │   ├── artwork_detail1.jpg
  │   └── installation_view.jpg
  └── exhibition_uuid2/
      └── opening_reception.jpg

artists/
  ├── artist_uuid1/
  │   ├── profile_photo.jpg
  │   └── portfolio_work1.jpg
  └── artist_uuid2/
      └── cv_document.pdf
```

## Usage in Code

### Basic Upload
```typescript
import { StorageService } from '@/lib/storage';

// Upload exhibition image
const result = await StorageService.uploadExhibitionImage(
  file, 
  'exhibition-uuid', 
  'poster'
);

if (result.success) {
  console.log('Image uploaded:', result.publicUrl);
}
```

### Batch Upload
```typescript
// Upload multiple files with progress tracking
const results = await StorageService.uploadMultipleExhibitionImages(
  files,
  'exhibition-uuid',
  (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
);
```

### Delete Files
```typescript
// Delete specific file
const success = await StorageService.deleteExhibitionImage('path/to/file.jpg');
```

## Monitoring & Maintenance

### Health Checks
```typescript
// Check if all buckets are accessible
const health = await StorageService.checkBucketHealth();
console.log('Bucket health:', health);
```

### Storage Usage
```typescript
// Get bucket size information
const stats = await StorageService.getBucketSize('exhibitions');
console.log(`Files: ${stats.fileCount}, Size: ${stats.totalSize} bytes`);
```

### File Cleanup
```typescript
// Clean up unused files (advanced usage)
import { cleanupUnusedFiles } from '@/lib/utils/upload';

const deletedCount = await cleanupUnusedFiles('exhibitions', usedFilePaths);
console.log(`Cleaned up ${deletedCount} unused files`);
```

## Troubleshooting

### Common Issues

1. **Bucket Access Denied**
   - Verify RLS policies are applied correctly
   - Check authentication status
   - Ensure bucket names match exactly

2. **File Upload Fails**
   - Check file size (max 50MB)
   - Verify file type is supported (JPEG, PNG, WebP, GIF)
   - Ensure user is authenticated for admin operations

3. **Public URLs Not Working**
   - Verify bucket has public read policy
   - Check if files were uploaded successfully
   - Ensure proper file path structure

### Debug Tools

1. **Storage Test Page**: `/admin/storage-test`
   - Test bucket connectivity
   - Verify upload functionality
   - Check file validation

2. **Browser Developer Tools**
   - Check network requests to Supabase
   - Verify authentication headers
   - Monitor error messages

3. **Supabase Dashboard**
   - View uploaded files directly
   - Check storage usage statistics
   - Review policy configurations

## Environment Variables

Ensure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Production Considerations

1. **CDN Integration**: Consider CloudFront or similar for faster image delivery
2. **Image Optimization**: Implement automatic image resizing/compression
3. **Backup Strategy**: Regular backup of critical image assets
4. **Monitoring**: Set up alerts for storage usage and errors
5. **Cost Management**: Monitor storage costs and implement cleanup policies