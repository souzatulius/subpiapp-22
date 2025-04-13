
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SGZProgressStats, ValidationError } from './types/uploadTypes';

// Upload state interface
interface UploadState {
  sgzProgress: SGZProgressStats | null;
  painelProgress: SGZProgressStats | null;
  lastRefreshTime: Date | string | null;
  dataSource: 'mock' | 'upload' | 'supabase' | null;
  isUploading: boolean;
  validationErrors: ValidationError[];
  
  setSGZProgress: (stats: SGZProgressStats | null) => void;
  setPainelProgress: (stats: SGZProgressStats | null) => void;
  setSgzProgress: (stats: SGZProgressStats) => void; // Alias for compatibility
  setLastRefreshTime: (time: Date | string | null) => void;
  resetProgress: () => void;
  setDataSource: (source: 'mock' | 'upload' | 'supabase') => void;
  setIsUploading: (isUploading: boolean) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
}

export const useUploadState = create<UploadState>()(
  persist(
    (set) => ({
      sgzProgress: null,
      painelProgress: null,
      lastRefreshTime: null,
      dataSource: null,
      isUploading: false,
      validationErrors: [],
      
      setSGZProgress: (stats) => set({ sgzProgress: stats }),
      setPainelProgress: (stats) => set({ painelProgress: stats }),
      setSgzProgress: (stats) => set({ sgzProgress: stats }), // Alias for compatibility
      setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
      resetProgress: () => set({ sgzProgress: null, painelProgress: null, validationErrors: [] }),
      setDataSource: (source) => {
        console.log(`Data source updated to ${source} in useUploadState and localStorage`);
        localStorage.setItem('demo-data-source', source);
        set({ dataSource: source });
      },
      setIsUploading: (isUploading) => set({ isUploading }),
      setValidationErrors: (errors) => set({ validationErrors: errors })
    }),
    {
      name: 'upload-state-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Safe handling of lastRefreshTime for storage
        let serializedLastRefreshTime = null;
        
        if (state.lastRefreshTime) {
          if (state.lastRefreshTime instanceof Date) {
            // If it's a Date object, convert to ISO string
            serializedLastRefreshTime = state.lastRefreshTime.toISOString();
          } else if (typeof state.lastRefreshTime === 'string') {
            // If it's already a string, use as is
            serializedLastRefreshTime = state.lastRefreshTime;
          }
        }
        
        return {
          dataSource: state.dataSource,
          lastRefreshTime: serializedLastRefreshTime
        };
      },
    }
  )
);
