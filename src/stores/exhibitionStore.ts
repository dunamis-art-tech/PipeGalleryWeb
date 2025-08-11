import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Database } from '@/types/database';

type Exhibition = Database['public']['Tables']['exhibitions']['Row'];
type ExhibitionInsert = Database['public']['Tables']['exhibitions']['Insert'];
type ExhibitionUpdate = Database['public']['Tables']['exhibitions']['Update'];

interface ExhibitionStore {
  // State
  exhibitions: Exhibition[];
  selectedExhibition: Exhibition | null;
  loading: boolean;
  error: string | null;
  
  // Filters
  statusFilter: 'all' | 'live' | 'scheduled' | 'archived' | 'draft';
  searchQuery: string;
  
  // Actions
  setExhibitions: (exhibitions: Exhibition[]) => void;
  addExhibition: (exhibition: Exhibition) => void;
  updateExhibition: (id: string, updates: ExhibitionUpdate) => void;
  removeExhibition: (id: string) => void;
  setSelectedExhibition: (exhibition: Exhibition | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filters
  setStatusFilter: (status: 'all' | 'live' | 'scheduled' | 'archived' | 'draft') => void;
  setSearchQuery: (query: string) => void;
  
  // Computed
  getFilteredExhibitions: () => Exhibition[];
  getExhibitionBySlug: (slug: string) => Exhibition | undefined;
  
  // Reset
  reset: () => void;
}

export const useExhibitionStore = create<ExhibitionStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      exhibitions: [],
      selectedExhibition: null,
      loading: false,
      error: null,
      statusFilter: 'all',
      searchQuery: '',
      
      // Actions
      setExhibitions: (exhibitions) => set({ exhibitions }),
      
      addExhibition: (exhibition) =>
        set((state) => ({
          exhibitions: [exhibition, ...state.exhibitions],
        })),
      
      updateExhibition: (id, updates) =>
        set((state) => ({
          exhibitions: state.exhibitions.map((exhibition) =>
            exhibition.id === id ? { ...exhibition, ...updates } : exhibition
          ),
        })),
      
      removeExhibition: (id) =>
        set((state) => ({
          exhibitions: state.exhibitions.filter((exhibition) => exhibition.id !== id),
        })),
      
      setSelectedExhibition: (exhibition) => set({ selectedExhibition: exhibition }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Filters
      setStatusFilter: (statusFilter) => set({ statusFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      // Computed
      getFilteredExhibitions: () => {
        const { exhibitions, statusFilter, searchQuery } = get();
        
        return exhibitions.filter((exhibition) => {
          // Status filter
          if (statusFilter !== 'all' && exhibition.status !== statusFilter) {
            return false;
          }
          
          // Search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
              exhibition.title.toLowerCase().includes(query) ||
              exhibition.artist_name.toLowerCase().includes(query) ||
              exhibition.description?.toLowerCase().includes(query)
            );
          }
          
          return true;
        });
      },
      
      getExhibitionBySlug: (slug) => {
        const { exhibitions } = get();
        return exhibitions.find((exhibition) => exhibition.slug === slug);
      },
      
      // Reset
      reset: () =>
        set({
          exhibitions: [],
          selectedExhibition: null,
          loading: false,
          error: null,
          statusFilter: 'all',
          searchQuery: '',
        }),
    }),
    {
      name: 'exhibition-store',
    }
  )
);