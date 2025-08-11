import { z } from 'zod';

export const educationSchema = z.object({
  school: z.string().min(1, '학교명은 필수입니다'),
  degree: z.string().min(1, '학위는 필수입니다'),
  year: z.string().min(4, '연도를 정확히 입력해주세요').max(4, '연도를 정확히 입력해주세요'),
});

export const exhibitionEntrySchema = z.object({
  title: z.string().min(1, '전시회 제목은 필수입니다'),
  year: z.string().min(4).max(4),
  venue: z.string().min(1, '전시 장소는 필수입니다'),
  type: z.enum(['solo', 'group']).optional(),
});

export const awardSchema = z.object({
  title: z.string().min(1, '상명은 필수입니다'),
  year: z.string().min(4).max(4),
  organization: z.string().min(1, '주최 기관은 필수입니다'),
});

export const artistSchema = z.object({
  name: z.string().min(1, '작가명은 필수입니다').max(100, '작가명은 100자 이내로 입력해주세요'),
  profile_image_url: z.string().url().optional().or(z.literal('')),
  biography: z.string().max(2000, '작가 소개는 2000자 이내로 입력해주세요').optional(),
  education: z.array(educationSchema).optional(),
  exhibitions: z.array(exhibitionEntrySchema).optional(),
  awards: z.array(awardSchema).optional(),
  slug: z.string().min(1, 'URL 슬러그는 필수입니다').max(100, '슬러그는 100자 이내로 입력해주세요'),
});

export const artistUpdateSchema = artistSchema.partial();

export const artistImageSchema = z.object({
  artist_id: z.string().uuid(),
  image_url: z.string().url(),
  alt_text: z.string().optional(),
  display_order: z.number().min(0).optional(),
});

export const artistSearchSchema = z.object({
  query: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
  sort_by: z.enum(['name', 'created_at']).optional(),
});

export type ArtistFormData = z.infer<typeof artistSchema>;
export type ArtistUpdateData = z.infer<typeof artistUpdateSchema>;
export type ArtistImageData = z.infer<typeof artistImageSchema>;
export type ArtistSearchData = z.infer<typeof artistSearchSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type ExhibitionEntryData = z.infer<typeof exhibitionEntrySchema>;
export type AwardData = z.infer<typeof awardSchema>;