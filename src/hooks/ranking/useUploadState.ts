
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define types for SGZ progress stats
export interface SGZProgressStats {
  totalRecords: number;
  processed: number;
  success: number;
  failed: number;
  progress: number;
  stage: string;
  validationErrors?: string[];
}

// Upload state interface
interface UploadState {
  sgzProgress: SGZProgressStats | null;
  painelProgress: SGZProgressStats | null;
  lastRefreshTime: Date | string | null;
  dataSource: 'mock' | 'upload' | 'supabase' | null;
  
  setSGZProgress: (stats: SGZProgressStats | null) => void;
  setPainelProgress: (stats: SGZProgressStats | null) => void;
  setLastRefreshTime: (time: Date | string | null) => void;
  resetProgress: () => void;
  setDataSource: (source: 'mock' | 'upload' | 'supabase') => void;
}

export const useUploadState = create<UploadState>()(
  persist(
    (set) => ({
      sgzProgress: null,
      painelProgress: null,
      lastRefreshTime: null,
      dataSource: null,
      
      setSGZProgress: (stats) => set({ sgzProgress: stats }),
      setPainelProgress: (stats) => set({ painelProgress: stats }),
      setLastRefreshTime: (time) => set({ lastRefreshTime: time }),
      resetProgress: () => set({ sgzProgress: null, painelProgress: null }),
      setDataSource: (source) => {
        console.log(`Data source updated to ${source} in useUploadState and localStorage`);
        localStorage.setItem('demo-data-source', source);
        set({ dataSource: source });
      }
    }),
    {
      name: 'upload-state-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Safe handling of lastRefreshTime for storage
        let serializedLastRefreshTime = null;
        
        if (state.lastRefreshTime) {
          if (state.lastRefreshTime instanceof Date) {
            // If it's a Date object, convert to ISO string
            serializedLastRefreshTime = state.lastRefreshTime.toISOString();
          } else if (typeof state.lastRefreshTime === 'string') {
            // If it's already a string, use as is
            serializedLastRefreshTime = state.lastRefreshTime;
          }
        }
        
        return {
          dataSource: state.dataSource,
          lastRefreshTime: serializedLastRefreshTime
        };
      },
    }
  )
);
