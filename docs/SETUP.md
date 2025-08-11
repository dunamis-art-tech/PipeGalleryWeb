# PipeGallery Complete Setup Guide

## 🚀 1. Development Setup

### Quick Start
```bash
npm install
npm run dev
```

### Environment Configuration

#### Local Development (Default)
```bash
# .env.local - No Supabase connection needed for UI development
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

#### Production Setup
1. Create Supabase project: https://supabase.com/dashboard
2. Update environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```
3. Run database migrations:
```bash
npx supabase db push
```

### Available Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
npm run type-check   # TypeScript validation
```

---

## 📦 2. Supabase Storage Setup

### Storage Buckets Structure

#### **exhibitions** bucket
- **Purpose**: Exhibition posters, artwork images, installation views, opening reception photos
- **Organization**: `exhibition_{id}/` folders for each exhibition
- **File Types**: poster_, artwork_, installation_, detail_, opening_, space_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

#### **artists** bucket  
- **Purpose**: Artist profile photos, portfolio images, CV documents
- **Organization**: `artist_{id}/` folders for each artist
- **File Types**: profile_, portfolio_, cv_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

#### **artworks** bucket
- **Purpose**: High-resolution artwork images with multiple views and details
- **Organization**: `artwork_{id}/` folders for each artwork
- **File Types**: primary_, detail_
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

#### **general** bucket
- **Purpose**: Site assets, logos, general files
- **Organization**: Flexible folder structure
- **Max Size**: 50MB per file
- **Public Access**: Yes (read-only for public users)

### Storage Setup Steps

#### Step 1: Run Storage Setup SQL

1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/storage_setup.sql`

```sql
-- This will create:
-- ✅ 4 storage buckets with proper configuration
-- ✅ RLS policies for authenticated admin access
-- ✅ Helper functions for file management
```

#### Step 2: Verify Bucket Creation

Check that all buckets are created:
- Go to Storage → Buckets in Supabase dashboard
- Verify these buckets exist:
  - `exhibitions`
  - `artists` 
  - `artworks`
  - `general`

#### Step 3: Test Storage Functionality

1. Visit `/admin/storage-test` in your application
2. Click "Test Buckets" to verify connectivity
3. Upload a test image to verify upload functionality
4. Check Supabase Storage dashboard to see uploaded files

### Security Policies

#### Public Access (Read Only)
- All buckets allow public read access for displaying images on the website
- No authentication required for viewing images

#### Admin Access (Full CRUD)
- Authenticated users (admins) have full access:
  - **CREATE**: Upload new files
  - **READ**: View all files
  - **UPDATE**: Replace existing files
  - **DELETE**: Remove files

### Usage in Code

#### Basic Upload
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

#### Batch Upload
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

---

## 🚀 3. Production Deployment

### Vercel Deployment

1. **GitHub Repository**: https://github.com/dunamis-art-tech/PipeGalleryWeb
2. **Vercel Dashboard**: Connect GitHub repository
3. **Environment Variables**: Set Supabase credentials in Vercel dashboard
4. **Deploy**: Automatic deployment on every push

### Environment Variables (Production)

Set these in your Vercel dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Post-Deployment Steps

1. Test all pages work correctly
2. Configure Supabase environment variables
3. Test storage system functionality
4. Re-enable admin functionality:
   ```bash
   mv src/app/_admin_temp src/app/(admin)
   ```
5. Implement proper authentication system

---

## 📁 4. Project Structure

```
src/
├── app/                 # Next.js 15 App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utilities and services
└── types/               # TypeScript definitions
```

---

## 🔧 5. Troubleshooting

### Development Issues

#### Issue: CSS not loading
**Solution**: Ensure `postcss.config.js` exists with TailwindCSS configuration

#### Issue: Build errors
**Solution**: Run `npm run build` to identify and fix TypeScript/ESLint errors

### Storage Issues

#### Bucket Access Denied
- Verify RLS policies are applied correctly
- Check authentication status
- Ensure bucket names match exactly

#### File Upload Fails
- Check file size (max 50MB)
- Verify file type is supported (JPEG, PNG, WebP, GIF)
- Ensure user is authenticated for admin operations

#### Public URLs Not Working
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

---

## 🎯 Current Status

- ✅ Build successful
- ✅ All pages working
- ✅ Storage system implemented
- ✅ Ready for deployment
- 📦 Deployed: [GitHub Repository](https://github.com/dunamis-art-tech/PipeGalleryWeb)

---

## 📚 Additional Documentation

For detailed architecture and technical planning, see **Planning.md** and **ARCHITECTURE.md**