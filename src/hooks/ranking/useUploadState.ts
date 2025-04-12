
import { create } from 'zustand';

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  uploadStage: 'uploading' | 'processing' | 'complete' | 'error';
  lastRefreshTime: Date | null;
  
  setIsUploading: (isUploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStage: (stage: 'uploading' | 'processing' | 'complete' | 'error') => void;
  setLastRefreshTime: (time: Date) => void;
}

export const useUploadState = create<UploadState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  uploadStage: 'uploading',
  lastRefreshTime: null,
  
  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
  setUploadStage: (stage) => set({ uploadStage: stage }),
  setLastRefreshTime: (time: Date) => set({ lastRefreshTime: time })
}));
