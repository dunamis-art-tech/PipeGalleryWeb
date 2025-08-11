import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import type { ArtistFormData, ArtistUpdateData, ArtistSearchData } from '@/lib/validations/artist';

type Artist = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];

export class ArtistService {
  async getAll(params?: ArtistSearchData): Promise<Artist[]> {
    let query = supabase
      .from('artists')
      .select('*');

    // Apply search filter
    if (params?.query) {
      query = query.or(
        `name.ilike.%${params.query}%,biography.ilike.%${params.query}%`
      );
    }

    // Apply sorting
    if (params?.sort_by === 'created_at') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
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

  async getById(id: string): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getBySlug(slug: string): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getWithImages(artistId: string) {
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        artist_images(*)
      `)
      .eq('id', artistId)
      .single();

    if (error) throw error;
    return data;
  }

  async getWithExhibitions(artistId: string) {
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        exhibition_artists!inner(
          exhibitions(*)
        )
      `)
      .eq('id', artistId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(artistData: ArtistFormData): Promise<Artist> {
    const insertData: ArtistInsert = {
      ...artistData,
      education: artistData.education || [],
      exhibitions: artistData.exhibitions || [],
      awards: artistData.awards || [],
    };

    const { data, error } = await supabase
      .from('artists')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: ArtistUpdateData): Promise<Artist> {
    const { data, error } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async searchByName(name: string): Promise<Artist[]> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .ilike('name', `%${name}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getFeaturedArtists(limit: number = 6): Promise<Artist[]> {
    // Get artists who have recent exhibitions or are most recently added
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        exhibition_artists!left(
          exhibitions!inner(
            id,
            status,
            start_date
          )
        )
      `)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addImage(artistId: string, imageUrl: string, altText?: string, displayOrder?: number) {
    const { data, error } = await supabase
      .from('artist_images')
      .insert({
        artist_id: artistId,
        image_url: imageUrl,
        alt_text: altText,
        display_order: displayOrder || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async removeImage(imageId: string): Promise<void> {
    const { error } = await supabase
      .from('artist_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  }

  async updateEducation(artistId: string, education: any[]): Promise<Artist> {
    return this.update(artistId, { education });
  }

  async updateExhibitions(artistId: string, exhibitions: any[]): Promise<Artist> {
    return this.update(artistId, { exhibitions });
  }

  async updateAwards(artistId: string, awards: any[]): Promise<Artist> {
    return this.update(artistId, { awards });
  }

  async getStats() {
    const { data, error } = await supabase
      .from('artists')
      .select('id');

    if (error) throw error;

    return {
      total: data?.length || 0,
    };
  }
}

// Client-side instance
export const artistService = new ArtistService();