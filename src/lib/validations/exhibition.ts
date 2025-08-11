import { z } from 'zod';

export const exhibitionSchema = z.object({
  title: z.string().min(1, '전시회 제목은 필수입니다').max(200, '제목은 200자 이내로 입력해주세요'),
  artist_name: z.string().min(1, '작가명은 필수입니다').max(100, '작가명은 100자 이내로 입력해주세요'),
  description: z.string().optional(),
  start_date: z.string().min(1, '시작 날짜는 필수입니다'),
  end_date: z.string().min(1, '종료 날짜는 필수입니다'),
  status: z.enum(['live', 'scheduled', 'archived', 'draft']).optional(),
  poster_image_url: z.string().url().optional().or(z.literal('')),
  slug: z.string().min(1, 'URL 슬러그는 필수입니다').max(100, '슬러그는 100자 이내로 입력해주세요'),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return startDate <= endDate;
}, {
  message: '종료 날짜는 시작 날짜보다 늦어야 합니다',
  path: ['end_date'],
});

export const exhibitionUpdateSchema = z.object({
  title: z.string().min(1, '전시회 제목은 필수입니다').max(200, '제목은 200자 이내로 입력해주세요').optional(),
  artist_name: z.string().min(1, '작가명은 필수입니다').max(100, '작가명은 100자 이내로 입력해주세요').optional(),
  description: z.string().optional(),
  start_date: z.string().min(1, '시작 날짜는 필수입니다').optional(),
  end_date: z.string().min(1, '종료 날짜는 필수입니다').optional(),
  status: z.enum(['live', 'scheduled', 'archived', 'draft']).optional(),
  poster_image_url: z.string().url().optional().or(z.literal('')),
  slug: z.string().min(1, 'URL 슬러그는 필수입니다').max(100, '슬러그는 100자 이내로 입력해주세요').optional(),
});

export const exhibitionImageSchema = z.object({
  exhibition_id: z.string().uuid(),
  image_url: z.string().url(),
  alt_text: z.string().optional(),
  display_order: z.number().min(0).optional(),
});

export const exhibitionSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['all', 'live', 'scheduled', 'archived', 'draft']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export type ExhibitionFormData = z.infer<typeof exhibitionSchema>;
export type ExhibitionUpdateData = z.infer<typeof exhibitionUpdateSchema>;
export type ExhibitionImageData = z.infer<typeof exhibitionImageSchema>;
export type ExhibitionSearchData = z.infer<typeof exhibitionSearchSchema>;