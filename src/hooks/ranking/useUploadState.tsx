
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UploadProgressStats, ValidationError } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  lastRefreshTime: Date | null;
  isUploading: boolean;
  validationErrors: ValidationError[];
  dataSource?: 'mock' | 'upload' | 'supabase';
  
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setSGZProgress: (progress: UploadProgressStats) => void; // Alias for backward compatibility
  setLastRefreshTime: (time: Date) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetProgress: () => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setDataSource: (source: 'mock' | 'upload' | 'supabase') => void;
  loadPersistedState: () => void;
}

export const useUploadState = create<UploadState>()(
  persist(
    (set, get) => ({
      sgzProgress: null,
      painelProgress: null,
      lastRefreshTime: null,
      isUploading: false,
      validationErrors: [],
      dataSource: 'mock',
      
      setSgzProgress: (progress) => set({ sgzProgress: progress }),
      setPainelProgress: (progress) => set({ painelProgress: progress }),
      setSGZProgress: (progress) => set({ sgzProgress: progress }), // Alias for backward compatibility
      setLastRefreshTime: (time) => {
        set({ lastRefreshTime: time });
        // Also update localStorage for better cross-component state sharing
        try {
          localStorage.setItem('demo-last-update', time.toISOString());
        } catch (e) {
          console.warn('Failed to save lastRefreshTime to localStorage:', e);
        }
      },
      setIsUploading: (isUploading) => set({ isUploading }),
      resetProgress: () => set({ 
        sgzProgress: null, 
        painelProgress: null,
        validationErrors: []
      }),
      setValidationErrors: (errors) => set({ validationErrors: errors }),
      setDataSource: (source) => {
        set({ dataSource: source });
        // Also update localStorage for better cross-component state sharing
        try {
          localStorage.setItem('demo-data-source', source);
        } catch (e) {
          console.warn('Failed to save dataSource to localStorage:', e);
        }
      },
      loadPersistedState: () => {
        try {
          // Try to load from localStorage first (for better cross-component state sharing)
          const savedSource = localStorage.getItem('demo-data-source');
          const savedLastUpdate = localStorage.getItem('demo-last-update');
          
          if (savedSource) {
            set({ dataSource: savedSource as 'mock' | 'upload' | 'supabase' });
          }
          
          if (savedLastUpdate) {
            set({ lastRefreshTime: new Date(savedLastUpdate) });
          }
        } catch (e) {
          console.warn('Error loading persisted state:', e);
        }
      }
    }),
    {
      name: 'upload-state',
      partialize: (state) => ({ 
        lastRefreshTime: state.lastRefreshTime ? state.lastRefreshTime.toISOString() : null,
        dataSource: state.dataSource
        // Don't persist progress or errors
      }),
    }
  )
);
