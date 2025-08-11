import { z } from 'zod';

// Base artwork validation schema
export const artworkSchema = z.object({
  artist_id: z.string().uuid('유효한 작가 ID를 입력해주세요.'),
  title: z.string()
    .min(1, '작품 제목을 입력해주세요.')
    .max(200, '제목은 200자 이하로 입력해주세요.'),
  year: z.number()
    .int('연도는 정수로 입력해주세요.')
    .min(1800, '1800년 이후 연도를 입력해주세요.')
    .max(new Date().getFullYear(), '미래 연도는 입력할 수 없습니다.')
    .optional(),
  materials: z.string()
    .max(500, '재료/기법은 500자 이하로 입력해주세요.')
    .optional(),
  dimensions: z.string()
    .max(100, '크기는 100자 이하로 입력해주세요.')
    .optional(),
  description: z.string()
    .max(2000, '작품 설명은 2000자 이하로 입력해주세요.')
    .optional(),
  is_featured: z.boolean().optional()
});

// Artwork creation form data
export const artworkCreateSchema = artworkSchema;

// Artwork update form data (all fields optional except required ones)
export const artworkUpdateSchema = artworkSchema.partial();

// Artwork search parameters
export const artworkSearchSchema = z.object({
  query: z.string().optional(),
  artist_id: z.string().uuid().optional(),
  year: z.number().int().optional(),
  is_featured: z.boolean().optional(),
  materials: z.string().optional(),
  sort_by: z.enum(['title', 'year', 'created_at', 'featured']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional()
});

// Artwork image upload schema
export const artworkImageSchema = z.object({
  file: z.instanceof(File, { message: '유효한 파일을 선택해주세요.' }),
  alt_text: z.string()
    .max(200, 'Alt text는 200자 이하로 입력해주세요.')
    .optional(),
  is_primary: z.boolean().optional(),
  display_order: z.number().int().min(0).optional()
});

// Artwork image update schema
export const artworkImageUpdateSchema = z.object({
  alt_text: z.string()
    .max(200, 'Alt text는 200자 이하로 입력해주세요.')
    .optional(),
  is_primary: z.boolean().optional(),
  display_order: z.number().int().min(0).optional()
});

// Exhibition-artwork linking schema
export const exhibitionArtworkSchema = z.object({
  artwork_id: z.string().uuid('유효한 작품 ID를 입력해주세요.'),
  exhibition_id: z.string().uuid('유효한 전시 ID를 입력해주세요.'),
  display_order: z.number().int().min(0).optional(),
  is_featured: z.boolean().optional()
});

// File upload validation
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: '파일 크기는 10MB 이하여야 합니다.'
    })
    .refine((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    }, {
      message: '지원되는 이미지 형식: JPEG, PNG, WebP'
    })
});

// Multiple file upload schema
export const multipleImageUploadSchema = z.object({
  files: z.array(imageFileSchema.shape.file)
    .min(1, '최소 1개의 이미지를 업로드해주세요.')
    .max(10, '최대 10개의 이미지까지 업로드 가능합니다.')
});

// Export TypeScript types
export type ArtworkFormData = z.infer<typeof artworkCreateSchema>;
export type ArtworkUpdateData = z.infer<typeof artworkUpdateSchema>;
export type ArtworkSearchData = z.infer<typeof artworkSearchSchema>;
export type ArtworkImageData = z.infer<typeof artworkImageSchema>;
export type ArtworkImageUpdateData = z.infer<typeof artworkImageUpdateSchema>;
export type ExhibitionArtworkData = z.infer<typeof exhibitionArtworkSchema>;

// Validation helper functions
export const validateArtworkForm = (data: unknown) => artworkCreateSchema.safeParse(data);
export const validateArtworkUpdate = (data: unknown) => artworkUpdateSchema.safeParse(data);
export const validateArtworkSearch = (data: unknown) => artworkSearchSchema.safeParse(data);
export const validateImageUpload = (data: unknown) => imageFileSchema.safeParse(data);
export const validateMultipleImageUpload = (data: unknown) => multipleImageUploadSchema.safeParse(data);

// Featured options for UI
export const featuredOptions = [
  { value: true, label: '추천 작품' },
  { value: false, label: '일반 작품' }
] as const;

// Sort options for UI
export const sortOptions = [
  { value: 'title', label: '제목순' },
  { value: 'year', label: '제작연도순' },
  { value: 'created_at', label: '등록일순' },
  { value: 'featured', label: '추천작품순' }
] as const;