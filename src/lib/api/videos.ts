import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Video = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];

export interface VideoFormData {
  title: string;
  description?: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url?: string;
  category?: string;
  related_exhibition_id?: string;
  related_artist_id?: string;
  is_visible?: boolean;
}

export interface VideoUpdateData {
  title?: string;
  description?: string;
  youtube_url?: string;
  youtube_id?: string;
  thumbnail_url?: string;
  category?: string;
  related_exhibition_id?: string;
  related_artist_id?: string;
  is_visible?: boolean;
}

export interface VideoSearchData {
  query?: string;
  category?: string;
  related_exhibition_id?: string;
  related_artist_id?: string;
  is_visible?: boolean;
  limit?: number;
  offset?: number;
}

export class VideoService {
  async getAll(params?: VideoSearchData): Promise<Video[]> {
    let query = supabase
      .from('videos')
      .select('*');

    // Apply search filter
    if (params?.query) {
      query = query.or(
        `title.ilike.%${params.query}%,description.ilike.%${params.query}%`
      );
    }

    // Filter by category
    if (params?.category) {
      query = query.eq('category', params.category);
    }

    // Filter by exhibition
    if (params?.related_exhibition_id) {
      query = query.eq('related_exhibition_id', params.related_exhibition_id);
    }

    // Filter by artist
    if (params?.related_artist_id) {
      query = query.eq('related_artist_id', params.related_artist_id);
    }

    // Filter by visibility
    if (params?.is_visible !== undefined) {
      query = query.eq('is_visible', params.is_visible);
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    // Default sorting by created date descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getByYoutubeId(youtubeId: string): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('youtube_id', youtubeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(videoData: VideoFormData): Promise<Video> {
    const insertData: VideoInsert = {
      ...videoData,
      is_visible: videoData.is_visible ?? true,
    };

    const { data, error } = await supabase
      .from('videos')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: VideoUpdateData): Promise<Video> {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getByArtist(artistId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('related_artist_id', artistId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getByCategory(category: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('category', category)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getFeatured(limit: number = 6): Promise<Video[]> {
    // Get most recent videos as featured
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async updateCategory(id: string, category: string): Promise<Video> {
    return this.update(id, { category });
  }

  async setVisibility(id: string, isVisible: boolean): Promise<Video> {
    return this.update(id, { is_visible: isVisible });
  }

  async searchByTitle(title: string, visibleOnly: boolean = true): Promise<Video[]> {
    let query = supabase
      .from('videos')
      .select('*')
      .ilike('title', `%${title}%`)
      .order('created_at', { ascending: false });

    if (visibleOnly) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { data, error } = await supabase
      .from('videos')
      .select('id');

    if (error) throw error;

    return {
      total: data?.length || 0,
    };
  }

  async getAllCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('category')
      .eq('is_visible', true);

    if (error) throw error;

    // Extract unique categories
    const categories = data
      ?.map((video) => video.category)
      .filter((category): category is string => category !== null)
      .filter((category, index, array) => array.indexOf(category) === index)
      .sort();

    return categories || [];
  }

  async getByExhibition(exhibitionId: string): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('related_exhibition_id', exhibitionId)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

// Client-side instance
export const videoService = new VideoService();