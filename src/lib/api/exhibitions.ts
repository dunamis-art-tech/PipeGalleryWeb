import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import type { ExhibitionFormData, ExhibitionUpdateData, ExhibitionSearchData } from '@/lib/validations/exhibition';
import { getExhibitionStatus } from '@/lib/utils';

type Exhibition = Database['public']['Tables']['exhibitions']['Row'];
type ExhibitionInsert = Database['public']['Tables']['exhibitions']['Insert'];

export class ExhibitionService {
  async getAll(params?: ExhibitionSearchData): Promise<Exhibition[]> {
    let query = supabase
      .from('exhibitions')
      .select('*');

    // Apply filters
    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    if (params?.query) {
      query = query.or(
        `title.ilike.%${params.query}%,artist_name.ilike.%${params.query}%,description.ilike.%${params.query}%`
      );
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    // Default sorting by start date descending
    query = query.order('start_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<Exhibition | null> {
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getBySlug(slug: string): Promise<Exhibition | null> {
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getWithArtists(exhibitionId: string) {
    const { data, error } = await supabase
      .from('exhibitions')
      .select(`
        *,
        exhibition_artists!inner(
          artists(*)
        )
      `)
      .eq('id', exhibitionId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(exhibitionData: ExhibitionFormData): Promise<Exhibition> {
    // Auto-determine status based on dates
    const status = getExhibitionStatus(exhibitionData.start_date, exhibitionData.end_date);
    
    const insertData: ExhibitionInsert = {
      ...exhibitionData,
      status,
    };

    const { data, error } = await supabase
      .from('exhibitions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: ExhibitionUpdateData): Promise<Exhibition> {
    // Auto-update status if dates are being changed
    if (updates.start_date || updates.end_date) {
      const existing = await this.getById(id);
      if (existing) {
        const startDate = updates.start_date || existing.start_date;
        const endDate = updates.end_date || existing.end_date;
        updates.status = getExhibitionStatus(startDate, endDate);
      }
    }

    const { data, error } = await supabase
      .from('exhibitions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('exhibitions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getByStatus(status: 'live' | 'scheduled' | 'archived'): Promise<Exhibition[]> {
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('status', status)
      .order('start_date', { ascending: status === 'scheduled' });

    if (error) throw error;
    return data || [];
  }

  async getCurrentExhibitions(): Promise<Exhibition[]> {
    return this.getByStatus('live');
  }

  async getUpcomingExhibitions(): Promise<Exhibition[]> {
    return this.getByStatus('scheduled');
  }

  async getCurrentExhibitionWithPoster(): Promise<Exhibition | null> {
    // First try to get current live exhibition
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .eq('status', 'live')
      .order('start_date', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      return data;
    }

    // If no ongoing exhibition, get the most recent one
    const { data: recentData, error: recentError } = await supabase
      .from('exhibitions')
      .select('*')
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    if (recentError) return null;
    return recentData;
  }
}

// Client-side instance
export const exhibitionService = new ExhibitionService();