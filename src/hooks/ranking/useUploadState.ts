
import { create } from 'zustand';
import { UploadProgressStats } from './types/uploadTypes';

interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  isUploading: boolean;
  lastRefreshTime: Date | null;
  setSgzProgress: (progress: UploadProgressStats) => void;
  setPainelProgress: (progress: UploadProgressStats) => void;
  setIsUploading: (isUploading: boolean) => void;
  setLastRefreshTime: (time: Date) => void;
  resetProgress: () => void; // Added reset function
}

export const useUploadState = create<UploadState>((set) => ({
  sgzProgress: null,
  painelProgress: null,
  isUploading: false,
  lastRefreshTime: null,
  setSgzProgress: (progress) => set({ sgzProgress: progress }),
  setPainelProgress: (progress) => set({ painelProgress: progress }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
  resetProgress: () => set({ sgzProgress: null, painelProgress: null }) // Reset function implementation
}));
