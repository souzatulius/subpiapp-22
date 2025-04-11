
export interface UploadResult {
  success: boolean;
  message?: string;
  recordCount: number;
  id?: string;
  data?: any[];
  newOrders?: number;
  updatedOrders?: number;
}

export interface UploadProgressStats {
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  totalRows: number;
  processedRows: number;
  message?: string;
  newRows?: number;
  updatedRows?: number;
  estimatedTimeRemaining?: string;
  processingStatus?: string;
}

export interface RankingUploadState {
  sgzProgress: UploadProgressStats | null;
  painelProgress: UploadProgressStats | null;
  lastRefreshTime: Date | null;
}
