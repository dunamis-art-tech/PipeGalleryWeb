import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Database } from '@/types/database';

type Artist = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
type ArtistUpdate = Database['public']['Tables']['artists']['Update'];

interface ArtistStore {
  // State
  artists: Artist[];
  selectedArtist: Artist | null;
  loading: boolean;
  error: string | null;
  
  // Filters
  searchQuery: string;
  sortBy: 'name' | 'created_at';
  
  // Actions
  setArtists: (artists: Artist[]) => void;
  addArtist: (artist: Artist) => void;
  updateArtist: (id: string, updates: ArtistUpdate) => void;
  removeArtist: (id: string) => void;
  setSelectedArtist: (artist: Artist | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filters
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'name' | 'created_at') => void;
  
  // Computed
  getFilteredArtists: () => Artist[];
  getArtistBySlug: (slug: string) => Artist | undefined;
  
  // Reset
  reset: () => void;
}

export const useArtistStore = create<ArtistStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      artists: [],
      selectedArtist: null,
      loading: false,
      error: null,
      searchQuery: '',
      sortBy: 'name',
      
      // Actions
      setArtists: (artists) => set({ artists }),
      
      addArtist: (artist) =>
        set((state) => ({
          artists: [artist, ...state.artists],
        })),
      
      updateArtist: (id, updates) =>
        set((state) => ({
          artists: state.artists.map((artist) =>
            artist.id === id ? { ...artist, ...updates } : artist
          ),
        })),
      
      removeArtist: (id) =>
        set((state) => ({
          artists: state.artists.filter((artist) => artist.id !== id),
        })),
      
      setSelectedArtist: (artist) => set({ selectedArtist: artist }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Filters
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      
      // Computed
      getFilteredArtists: () => {
        const { artists, searchQuery, sortBy } = get();
        
        let filtered = artists.filter((artist) => {
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              artist.name.toLowerCase().includes(query) ||
              artist.biography?.toLowerCase().includes(query)
            );
          }
          return true;
        });
        
        // Sort
        filtered = filtered.sort((a, b) => {
          if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        return filtered;
      },
      
      getArtistBySlug: (slug) => {
        const { artists } = get();
        return artists.find((artist) => artist.slug === slug);
      },
      
      // Reset
      reset: () =>
        set({
          artists: [],
          selectedArtist: null,
          loading: false,
          error: null,
          searchQuery: '',
          sortBy: 'name',
        }),
    }),
    {
      name: 'artist-store',
    }
  )
);