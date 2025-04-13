
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
    // Update localStorage when dataSource changes
    if (source) {
      localStorage.setItem('demo-data-source', source);
      console.log(`Data source updated to ${source} in useUploadState`);
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
