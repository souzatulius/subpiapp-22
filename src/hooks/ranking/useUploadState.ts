
import { create } from 'zustand';
import { UploadProgressStats, ValidationError } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  isUploading: boolean;
  lastRefreshTime: Date | null;
  validationErrors: ValidationError[];
  dataSource: 'mock' | 'upload' | 'supabase' | null;
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setIsUploading: (isUploading: boolean) => void;
  setLastRefreshTime: (time: Date) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  setDataSource: (source: 'mock' | 'upload' | 'supabase' | null) => void;
  resetProgress: () => void;
  resetAll: () => void;
}

export const useUploadState = create<UploadState>((set) => ({
  sgzProgress: null,
  painelProgress: null,
  isUploading: false,
  lastRefreshTime: null,
  validationErrors: [],
  dataSource: null,
  setSgzProgress: (progress) => set({ sgzProgress: progress }),
  setPainelProgress: (progress) => set({ painelProgress: progress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  setDataSource: (source) => {
    // Synchronize with localStorage
    if (source) {
      // Update localStorage when dataSource changes
      localStorage.setItem('demo-data-source', source);
      console.log(`Data source updated to ${source} in useUploadState and localStorage`);
    } else {
      // If null is passed, check if there's a value in localStorage
      const storedSource = localStorage.getItem('demo-data-source') as 'mock' | 'upload' | 'supabase' | null;
      if (storedSource) {
        console.log(`Using data source from localStorage: ${storedSource}`);
        set({ dataSource: storedSource });
        return;
      }
    }
    set({ dataSource: source });
  },
  resetProgress: () => set({ 
    sgzProgress: null, 
    painelProgress: null,
    validationErrors: [] 
  }),
  resetAll: () => set({
    sgzProgress: null,
    painelProgress: null,
    isUploading: false,
    validationErrors: []
  })
}));
