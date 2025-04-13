
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
}

export const useUploadState = create<UploadState>()(
  persist(
    (set) => ({
      sgzProgress: null,
      painelProgress: null,
      lastRefreshTime: null,
      isUploading: false,
      validationErrors: [],
      dataSource: 'mock',
      
      setSgzProgress: (progress) => set({ sgzProgress: progress }),
      setPainelProgress: (progress) => set({ painelProgress: progress }),
      setSGZProgress: (progress) => set({ sgzProgress: progress }), // Alias for backward compatibility
      setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
      setIsUploading: (isUploading) => set({ isUploading }),
      resetProgress: () => set({ 
        sgzProgress: null, 
        painelProgress: null,
        validationErrors: []
      }),
      setValidationErrors: (errors) => set({ validationErrors: errors }),
      setDataSource: (source) => set({ dataSource: source })
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
