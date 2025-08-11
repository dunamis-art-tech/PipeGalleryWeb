import { z } from 'zod';

export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .min(1, '이메일은 필수입니다')
    .email('올바른 이메일 주소를 입력해주세요')
    .max(255, '이메일 주소가 너무 깁니다'),
});

export const newsletterUnsubscribeSchema = z.object({
  email: z
    .string()
    .email('올바른 이메일 주소를 입력해주세요'),
});

export const newsletterBulkActionSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete']),
  subscriber_ids: z.array(z.string().uuid()).min(1, '최소 하나의 구독자를 선택해주세요'),
});

export type NewsletterSubscriptionData = z.infer<typeof newsletterSubscriptionSchema>;
export type NewsletterUnsubscribeData = z.infer<typeof newsletterUnsubscribeSchema>;
export type NewsletterBulkActionData = z.infer<typeof newsletterBulkActionSchema>;