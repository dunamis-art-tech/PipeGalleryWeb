import { z } from 'zod';
import { EXHIBITION_IMAGE_TYPES } from '@/lib/api/exhibition-images';

// Exhibition image type validation
export const exhibitionImageTypeSchema = z.enum([
  'poster',
  'artwork', 
  'installation',
  'detail',
  'opening',
  'space'
]);

// Exhibition image creation schema
export const exhibitionImageCreateSchema = z.object({
  exhibition_id: z.string().uuid('유효하지 않은 전시 ID입니다.'),
  image_url: z.string().url('유효하지 않은 이미지 URL입니다.'),
  alt_text: z.string().optional(),
  display_order: z.number().int().min(0, '표시 순서는 0 이상이어야 합니다.').optional(),
  image_type: exhibitionImageTypeSchema
});

// Exhibition image update schema
export const exhibitionImageUpdateSchema = z.object({
  alt_text: z.string().optional(),
  display_order: z.number().int().min(0, '표시 순서는 0 이상이어야 합니다.').optional(),
  image_type: exhibitionImageTypeSchema.optional()
});

// Bulk upload schema
export const exhibitionImageBulkUploadSchema = z.object({
  exhibition_id: z.string().uuid('유효하지 않은 전시 ID입니다.'),
  uploads: z.array(z.object({
    image_type: exhibitionImageTypeSchema,
    alt_text: z.string().optional(),
    display_order: z.number().int().min(0).optional()
  })).min(1, '최소 하나의 이미지를 업로드해야 합니다.')
});

// Image reorder schema
export const exhibitionImageReorderSchema = z.object({
  image_ids: z.array(z.string().uuid()).min(1, '최소 하나의 이미지 ID가 필요합니다.'),
  new_orders: z.array(z.number().int().min(0)).min(1, '최소 하나의 순서가 필요합니다.')
}).refine(data => data.image_ids.length === data.new_orders.length, {
  message: '이미지 ID와 순서 배열의 길이가 일치해야 합니다.'
});

// Search parameters schema
export const exhibitionImageSearchSchema = z.object({
  exhibition_id: z.string().uuid('유효하지 않은 전시 ID입니다.'),
  image_type: exhibitionImageTypeSchema.optional(),
  sort_by: z.enum(['display_order', 'created_at', 'image_type']).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional()
});

// Copy images schema
export const exhibitionImageCopySchema = z.object({
  from_exhibition_id: z.string().uuid('유효하지 않은 원본 전시 ID입니다.'),
  to_exhibition_id: z.string().uuid('유효하지 않은 대상 전시 ID입니다.'),
  image_types: z.array(exhibitionImageTypeSchema).optional()
});

// Image type form data
export const exhibitionImageFormSchema = z.object({
  alt_text: z.string().max(255, 'Alt 텍스트는 255자를 초과할 수 없습니다.').optional(),
  display_order: z.coerce.number().int().min(0, '표시 순서는 0 이상이어야 합니다.').optional(),
  image_type: exhibitionImageTypeSchema
});

// Form validation error messages
export const exhibitionImageErrorMessages = {
  required: '필수 항목입니다.',
  invalidUrl: '유효하지 않은 URL입니다.',
  invalidUuid: '유효하지 않은 ID 형식입니다.',
  invalidImageType: '유효하지 않은 이미지 타입입니다.',
  minOrder: '표시 순서는 0 이상이어야 합니다.',
  maxAltText: 'Alt 텍스트는 255자를 초과할 수 없습니다.',
  arrayLengthMismatch: '이미지 ID와 순서 배열의 길이가 일치해야 합니다.',
  minImages: '최소 하나의 이미지가 필요합니다.',
  maxLimit: '한 번에 최대 100개까지 조회할 수 있습니다.'
} as const;

// Type exports for use in components
export type ExhibitionImageFormData = z.infer<typeof exhibitionImageFormSchema>;
export type ExhibitionImageCreateData = z.infer<typeof exhibitionImageCreateSchema>;
export type ExhibitionImageUpdateData = z.infer<typeof exhibitionImageUpdateSchema>;
export type ExhibitionImageBulkUploadData = z.infer<typeof exhibitionImageBulkUploadSchema>;
export type ExhibitionImageSearchParams = z.infer<typeof exhibitionImageSearchSchema>;

// Image type options for forms
export const imageTypeOptions = [
  { value: 'poster', label: '포스터', description: '전시 메인 포스터 이미지' },
  { value: 'artwork', label: '작품', description: '전시된 작품 이미지' },
  { value: 'installation', label: '설치 뷰', description: '작품 설치 전경 이미지' },
  { value: 'detail', label: '세부', description: '작품 상세 부분 이미지' },
  { value: 'opening', label: '오프닝', description: '오프닝 행사 이미지' },
  { value: 'space', label: '공간', description: '전시 공간 이미지' }
] as const;