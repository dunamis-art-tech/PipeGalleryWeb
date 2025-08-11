export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          name: string
          profile_image_url: string | null
          biography: string | null
          artist_statement: string | null
          education: Json
          exhibitions: Json
          awards: Json
          representation_status: 'represented' | 'exhibited' | 'emerging'
          social_links: Json
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          profile_image_url?: string | null
          biography?: string | null
          artist_statement?: string | null
          education?: Json
          exhibitions?: Json
          awards?: Json
          representation_status?: 'represented' | 'exhibited' | 'emerging'
          social_links?: Json
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          profile_image_url?: string | null
          biography?: string | null
          artist_statement?: string | null
          education?: Json
          exhibitions?: Json
          awards?: Json
          representation_status?: 'represented' | 'exhibited' | 'emerging'
          social_links?: Json
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      exhibitions: {
        Row: {
          id: string
          title: string
          artist_name: string
          description: string | null
          start_date: string
          end_date: string
          status: 'draft' | 'scheduled' | 'live' | 'archived'
          poster_image_url: string | null
          images: string[]
          created_by: string | null
          published_at: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_name: string
          description?: string | null
          start_date: string
          end_date: string
          status?: 'draft' | 'scheduled' | 'live' | 'archived'
          poster_image_url?: string | null
          images?: string[]
          created_by?: string | null
          published_at?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: 'draft' | 'scheduled' | 'live' | 'archived'
          poster_image_url?: string | null
          images?: string[]
          created_by?: string | null
          published_at?: string | null
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          youtube_url: string
          youtube_id: string
          thumbnail_url: string | null
          category: string | null
          related_exhibition_id: string | null
          related_artist_id: string | null
          is_visible: boolean
          publish_date: string
          status: 'draft' | 'published' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          youtube_url: string
          youtube_id: string
          thumbnail_url?: string | null
          category?: string | null
          related_exhibition_id?: string | null
          related_artist_id?: string | null
          is_visible?: boolean
          publish_date?: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          youtube_url?: string
          youtube_id?: string
          thumbnail_url?: string | null
          category?: string | null
          related_exhibition_id?: string | null
          related_artist_id?: string | null
          is_visible?: boolean
          publish_date?: string
          status?: 'draft' | 'published' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      news_posts: {
        Row: {
          id: string
          instagram_post_id: string | null
          caption: string | null
          image_urls: string[]
          instagram_url: string | null
          post_date: string | null
          category: 'press_release' | 'feature' | 'external'
          is_featured: boolean
          is_visible: boolean
          publish_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instagram_post_id?: string | null
          caption?: string | null
          image_urls?: string[]
          instagram_url?: string | null
          post_date?: string | null
          category?: 'press_release' | 'feature' | 'external'
          is_featured?: boolean
          is_visible?: boolean
          publish_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instagram_post_id?: string | null
          caption?: string | null
          image_urls?: string[]
          instagram_url?: string | null
          post_date?: string | null
          category?: 'press_release' | 'feature' | 'external'
          is_featured?: boolean
          is_visible?: boolean
          publish_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string
          is_active?: boolean
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
      exhibition_images: {
        Row: {
          id: string
          exhibition_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          image_type: 'poster' | 'artwork' | 'installation' | 'detail' | 'opening' | 'space'
          created_at: string
        }
        Insert: {
          id?: string
          exhibition_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          image_type?: 'poster' | 'artwork' | 'installation' | 'detail' | 'opening' | 'space'
          created_at?: string
        }
        Update: {
          id?: string
          exhibition_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          image_type?: 'poster' | 'artwork' | 'installation' | 'detail' | 'opening' | 'space'
          created_at?: string
        }
      }
      artist_images: {
        Row: {
          id: string
          artist_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
      }
      exhibition_artists: {
        Row: {
          id: string
          exhibition_id: string
          artist_id: string
          created_at: string
        }
        Insert: {
          id?: string
          exhibition_id: string
          artist_id: string
          created_at?: string
        }
        Update: {
          id?: string
          exhibition_id?: string
          artist_id?: string
          created_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: string | null
          meta_title: string | null
          meta_description: string | null
          template_type: string
          is_published: boolean
          created_by: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          template_type?: string
          is_published?: boolean
          created_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          template_type?: string
          is_published?: boolean
          created_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_library: {
        Row: {
          id: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          alt_text: string | null
          tags: string[]
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          alt_text?: string | null
          tags?: string[]
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          alt_text?: string | null
          tags?: string[]
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'curator' | 'editor'
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'curator' | 'editor'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'curator' | 'editor'
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      content_audit: {
        Row: {
          id: string
          table_name: string
          record_id: string
          action: 'create' | 'update' | 'delete'
          changes: Json | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          table_name: string
          record_id: string
          action: 'create' | 'update' | 'delete'
          changes?: Json | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          table_name?: string
          record_id?: string
          action?: 'create' | 'update' | 'delete'
          changes?: Json | null
          user_id?: string | null
          created_at?: string
        }
      }
      artworks: {
        Row: {
          id: string
          artist_id: string
          title: string
          year: number | null
          materials: string | null
          dimensions: string | null
          description: string | null
          is_featured: boolean
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          year?: number | null
          materials?: string | null
          dimensions?: string | null
          description?: string | null
          is_featured?: boolean
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          year?: number | null
          materials?: string | null
          dimensions?: string | null
          description?: string | null
          is_featured?: boolean
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artwork_images: {
        Row: {
          id: string
          artwork_id: string
          image_url: string
          alt_text: string | null
          is_primary: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          artwork_id: string
          image_url: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          artwork_id?: string
          image_url?: string
          alt_text?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
        }
      }
      // exhibition_artworks table removed - exhibitions are independent entities
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}