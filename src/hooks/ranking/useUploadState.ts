
import { create } from 'zustand';
import { UploadProgressStats } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  lastRefreshTime: Date | null;
  isUploading: boolean;
  
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setLastRefreshTime: (time: Date) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetProgress: () => void;
}

export const useUploadState = create<UploadState>((set) => ({
  sgzProgress: null,
  painelProgress: null,
  lastRefreshTime: null,
  isUploading: false,
  
  setSgzProgress: (progress) => set({ sgzProgress: progress }),
  setPainelProgress: (progress) => set({ painelProgress: progress }),
  setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
  setIsUploading: (isUploading) => set({ isUploading }),
  resetProgress: () => set({ sgzProgress: null, painelProgress: null })
}));
