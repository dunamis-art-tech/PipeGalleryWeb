import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import type { NewsletterSubscriptionData, NewsletterUnsubscribeData } from '@/lib/validations/newsletter';

type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
type NewsletterInsert = Database['public']['Tables']['newsletter_subscribers']['Insert'];

export class NewsletterService {

  async subscribe(data: NewsletterSubscriptionData): Promise<NewsletterSubscriber> {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', data.email)
      .single();

    if (existing) {
      if (existing.is_active) {
        throw new Error('이미 구독 중인 이메일입니다.');
      } else {
        // Reactivate existing subscription
        const { data: updated, error } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, subscribed_at: new Date().toISOString() })
          .eq('email', data.email)
          .select()
          .single();

        if (error) throw error;
        return updated;
      }
    }

    // Create new subscription
    const insertData: NewsletterInsert = {
      email: data.email,
      is_active: true,
    };

    const { data: newSubscriber, error } = await supabase
      .from('newsletter_subscribers')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return newSubscriber;
  }

  async unsubscribe(data: NewsletterUnsubscribeData): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ is_active: false })
      .eq('email', data.email);

    if (error) throw error;
  }

  async getAll(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getActive(): Promise<NewsletterSubscriber[]> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { data: total, error: totalError } = await supabase
      .from('newsletter_subscribers')
      .select('id');

    if (totalError) throw totalError;

    const { data: active, error: activeError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('is_active', true);

    if (activeError) throw activeError;

    // Get recent subscribers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recent, error: recentError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .gte('subscribed_at', thirtyDaysAgo.toISOString())
      .eq('is_active', true);

    if (recentError) throw recentError;

    return {
      total: total?.length || 0,
      active: active?.length || 0,
      recent: recent?.length || 0,
      inactive: (total?.length || 0) - (active?.length || 0),
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async bulkUpdate(ids: string[], updates: Partial<NewsletterSubscriber>): Promise<void> {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update(updates)
      .in('id', ids);

    if (error) throw error;
  }

  async exportSubscribers(activeOnly: boolean = true): Promise<NewsletterSubscriber[]> {
    let query = supabase
      .from('newsletter_subscribers')
      .select('*');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    query = query.order('subscribed_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async isSubscribed(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('is_active')
      .eq('email', email)
      .single();

    if (error) return false;
    return data?.is_active || false;
  }
}

// Client-side instance
export const newsletterService = new NewsletterService();