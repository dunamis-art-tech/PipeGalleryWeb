import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIStore {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Navigation
  mobileMenuOpen: boolean;
  
  // Modals
  activeModal: string | null;
  
  // Loading states
  pageLoading: boolean;
  
  // Search
  globalSearchOpen: boolean;
  globalSearchQuery: string;
  
  // Gallery view preferences
  galleryView: 'grid' | 'list';
  gridColumns: 2 | 3 | 4;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setPageLoading: (loading: boolean) => void;
  toggleGlobalSearch: () => void;
  setGlobalSearchQuery: (query: string) => void;
  setGalleryView: (view: 'grid' | 'list') => void;
  setGridColumns: (columns: 2 | 3 | 4) => void;
  
  // Reset
  reset: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        theme: 'system',
        mobileMenuOpen: false,
        activeModal: null,
        pageLoading: false,
        globalSearchOpen: false,
        globalSearchQuery: '',
        galleryView: 'grid',
        gridColumns: 3,
        
        // Actions
        setTheme: (theme) => set({ theme }),
        
        toggleMobileMenu: () =>
          set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
        
        setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
        
        openModal: (modalId) => set({ activeModal: modalId }),
        closeModal: () => set({ activeModal: null }),
        
        setPageLoading: (pageLoading) => set({ pageLoading }),
        
        toggleGlobalSearch: () =>
          set((state) => ({
            globalSearchOpen: !state.globalSearchOpen,
            globalSearchQuery: state.globalSearchOpen ? '' : state.globalSearchQuery,
          })),
        
        setGlobalSearchQuery: (globalSearchQuery) => set({ globalSearchQuery }),
        
        setGalleryView: (galleryView) => set({ galleryView }),
        setGridColumns: (gridColumns) => set({ gridColumns }),
        
        // Reset (but keep theme preferences)
        reset: () =>
          set((state) => ({
            mobileMenuOpen: false,
            activeModal: null,
            pageLoading: false,
            globalSearchOpen: false,
            globalSearchQuery: '',
            galleryView: 'grid',
            gridColumns: 3,
            theme: state.theme, // Keep theme preference
          })),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          galleryView: state.galleryView,
          gridColumns: state.gridColumns,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);