
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UploadProgressStats, ValidationError } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  lastRefreshTime: Date | null;
  isUploading: boolean;
  validationErrors: ValidationError[];
  
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setLastRefreshTime: (time: Date) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetProgress: () => void;
  setValidationErrors: (errors: ValidationError[]) => void;
}

export const useUploadState = create<UploadState>()(
  persist(
    (set) => ({
      sgzProgress: null,
      painelProgress: null,
      lastRefreshTime: null,
      isUploading: false,
      validationErrors: [],
      
      setSgzProgress: (progress) => set({ sgzProgress: progress }),
      setPainelProgress: (progress) => set({ painelProgress: progress }),
      setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
      setIsUploading: (isUploading) => set({ isUploading }),
      resetProgress: () => set({ 
        sgzProgress: null, 
        painelProgress: null,
        validationErrors: []
      }),
      setValidationErrors: (errors) => set({ validationErrors: errors })
    }),
    {
      name: 'upload-state',
      partialize: (state) => ({ 
        lastRefreshTime: state.lastRefreshTime,
        // Don't persist progress or errors
      }),
    }
  )
);
