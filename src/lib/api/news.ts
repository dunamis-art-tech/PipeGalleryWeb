import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type NewsPost = Database['public']['Tables']['news_posts']['Row'];
type NewsPostInsert = Database['public']['Tables']['news_posts']['Insert'];

export interface NewsPostFormData {
  instagram_post_id?: string;
  caption?: string;
  image_urls?: string[];
  instagram_url?: string;
  post_date?: string;
  is_visible: boolean;
}

export interface NewsPostUpdateData {
  instagram_post_id?: string;
  caption?: string;
  image_urls?: string[];
  instagram_url?: string;
  post_date?: string;
  is_visible?: boolean;
}

export interface NewsPostSearchData {
  query?: string;
  is_visible?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'post_date';
}

export class NewsPostService {
  async getAll(params?: NewsPostSearchData): Promise<NewsPost[]> {
    let query = supabase
      .from('news_posts')
      .select('*');

    // Apply search filter
    if (params?.query) {
      query = query.or(
        `caption.ilike.%${params.query}%,instagram_post_id.ilike.%${params.query}%`
      );
    }

    // Filter by visibility
    if (params?.is_visible !== undefined) {
      query = query.eq('is_visible', params.is_visible);
    }

    // Apply sorting
    if (params?.sort_by === 'post_date') {
      query = query.order('post_date', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getVisible(params?: Omit<NewsPostSearchData, 'is_visible'>): Promise<NewsPost[]> {
    return this.getAll({ ...params, is_visible: true });
  }

  async getHidden(params?: Omit<NewsPostSearchData, 'is_visible'>): Promise<NewsPost[]> {
    return this.getAll({ ...params, is_visible: false });
  }

  async getById(id: string): Promise<NewsPost | null> {
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getByInstagramId(instagramPostId: string, visibleOnly: boolean = true): Promise<NewsPost | null> {
    let query = supabase
      .from('news_posts')
      .select('*')
      .eq('instagram_post_id', instagramPostId);

    if (visibleOnly) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data;
  }

  async create(newsData: NewsPostFormData): Promise<NewsPost> {
    const insertData: NewsPostInsert = {
      ...newsData,
      image_urls: newsData.image_urls || [],
      is_visible: newsData.is_visible ?? true,
    };

    const { data, error } = await supabase
      .from('news_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: NewsPostUpdateData): Promise<NewsPost> {
    const { data, error } = await supabase
      .from('news_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('news_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async setVisibility(id: string, isVisible: boolean): Promise<NewsPost> {
    return this.update(id, { is_visible: isVisible });
  }

  async hide(id: string): Promise<NewsPost> {
    return this.setVisibility(id, false);
  }

  async show(id: string): Promise<NewsPost> {
    return this.setVisibility(id, true);
  }

  async getRecent(limit: number = 5, visibleOnly: boolean = true): Promise<NewsPost[]> {
    let query = supabase
      .from('news_posts')
      .select('*')
      .order('post_date', { ascending: false })
      .limit(limit);

    if (visibleOnly) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getFeatured(limit: number = 3, visibleOnly: boolean = true): Promise<NewsPost[]> {
    // Get most recent visible posts as featured
    return this.getRecent(limit, visibleOnly);
  }

  async searchByCaption(caption: string, visibleOnly: boolean = true): Promise<NewsPost[]> {
    let query = supabase
      .from('news_posts')
      .select('*')
      .ilike('caption', `%${caption}%`)
      .order('created_at', { ascending: false });

    if (visibleOnly) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getByDateRange(startDate: string, endDate: string, visibleOnly: boolean = true): Promise<NewsPost[]> {
    let query = supabase
      .from('news_posts')
      .select('*')
      .gte('post_date', startDate)
      .lte('post_date', endDate)
      .order('post_date', { ascending: false });

    if (visibleOnly) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { data: total, error: totalError } = await supabase
      .from('news_posts')
      .select('id');

    if (totalError) throw totalError;

    const { data: visible, error: visibleError } = await supabase
      .from('news_posts')
      .select('id')
      .eq('is_visible', true);

    if (visibleError) throw visibleError;

    const { data: hidden, error: hiddenError } = await supabase
      .from('news_posts')
      .select('id')
      .eq('is_visible', false);

    if (hiddenError) throw hiddenError;

    return {
      total: total?.length || 0,
      visible: visible?.length || 0,
      hidden: hidden?.length || 0,
    };
  }

  async updateImages(id: string, imageUrls: string[]): Promise<NewsPost> {
    return this.update(id, { image_urls: imageUrls });
  }

  async syncFromInstagram(instagramData: {
    instagram_post_id: string;
    caption?: string;
    image_urls: string[];
    instagram_url: string;
    post_date: string;
  }): Promise<NewsPost> {
    // Check if post already exists
    const existing = await this.getByInstagramId(instagramData.instagram_post_id, false);
    
    if (existing) {
      // Update existing post
      return this.update(existing.id, {
        caption: instagramData.caption,
        image_urls: instagramData.image_urls,
        instagram_url: instagramData.instagram_url,
        post_date: instagramData.post_date,
      });
    } else {
      // Create new post
      return this.create({
        instagram_post_id: instagramData.instagram_post_id,
        caption: instagramData.caption,
        image_urls: instagramData.image_urls,
        instagram_url: instagramData.instagram_url,
        post_date: instagramData.post_date,
        is_visible: true,
      });
    }
  }
}

// Client-side instance
export const newsService = new NewsPostService();