
import { create } from 'zustand';
import { UploadProgressStats, ValidationError } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  isUploading: boolean;
  lastRefreshTime: Date | null;
  validationErrors: ValidationError[];
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setIsUploading: (isUploading: boolean) => void;
  setLastRefreshTime: (time: Date) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  resetProgress: () => void;
  resetAll: () => void;
}

export const useUploadState = create<UploadState>((set) => ({
  sgzProgress: null,
  painelProgress: null,
  isUploading: false,
  lastRefreshTime: null,
  validationErrors: [],
  setSgzProgress: (progress) => set({ sgzProgress: progress }),
  setPainelProgress: (progress) => set({ painelProgress: progress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
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
