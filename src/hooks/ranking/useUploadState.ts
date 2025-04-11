
import { create } from 'zustand';
import { UploadProgressStats } from '@/components/ranking/types';

export interface UploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  isUploading: boolean;
  lastRefreshTime: Date | null;
  
  // Update actions
  setSgzProgress: (progress: UploadProgressStats | null) => void;
  setPainelProgress: (progress: UploadProgressStats | null) => void;
  setIsUploading: (status: boolean) => void;
  setLastRefreshTime: (time: Date | null) => void;
  resetProgress: () => void;
}

const initialProgressState: UploadProgressStats = {
  totalRows: 0,
  processedRows: 0,
  updatedRows: 0,
  newRows: 0,
  stage: 'idle',
};

export const useUploadState = create<UploadState>((set) => ({
  sgzProgress: null,
  painelProgress: null,
  isUploading: false,
  lastRefreshTime: null,
  
  setSgzProgress: (progress) => set({ sgzProgress: progress }),
  setPainelProgress: (progress) => set({ painelProgress: progress }),
  setIsUploading: (status) => set({ isUploading: status }),
  setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
  resetProgress: () => set({ 
    sgzProgress: null, 
    painelProgress: null,
    isUploading: false 
  }),
}));

// Utility function to estimate remaining time
export const calculateEstimatedTime = (stats: UploadProgressStats): string => {
  if (stats.processedRows === 0 || stats.totalRows === 0) return "Calculando...";
  
  const percentComplete = stats.processedRows / stats.totalRows;
  if (percentComplete >= 0.99) return "Menos de 5 segundos";
  
  // Estimate based on typical processing rate
  const remainingRows = stats.totalRows - stats.processedRows;
  const estimatedSecondsPerRow = 0.05; // Adjust based on actual performance
  const secondsRemaining = Math.ceil(remainingRows * estimatedSecondsPerRow);
  
  if (secondsRemaining < 60) return `${secondsRemaining} segundos`;
  if (secondsRemaining < 3600) {
    const minutes = Math.floor(secondsRemaining / 60);
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
};
