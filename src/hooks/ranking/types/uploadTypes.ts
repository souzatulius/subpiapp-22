
export interface UploadResult {
  success: boolean;
  id?: string;
  recordCount: number;
  newOrders?: number;
  updatedOrders?: number;
  message: string;
  data?: any[];
}

export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
  estimatedTimeRemaining?: string;
}

export interface UploadStats {
  sgz?: UploadProgressStats;
  painel?: UploadProgressStats;
  lastRefreshed?: Date;
}

export interface ProcessingStats {
  newOrders?: number;
  updatedOrders?: number;
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  totalRows?: number;
  message?: string;
  totalServiceOrders?: number;
  totalRecords?: number;
  recordCount?: number;
}
