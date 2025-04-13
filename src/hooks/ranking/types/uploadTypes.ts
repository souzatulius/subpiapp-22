
// Unified progress stats interface that combines both SGZProgressStats and UploadProgressStats
export interface UploadProgressStats {
  // Common fields for progress tracking
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
  errorCount?: number;
  estimatedTimeRemaining?: number; // Added for time estimation

  // Additional fields for backward compatibility
  totalRecords?: number;
  processed?: number;
  success?: number;
  failed?: number;
  progress?: number;
  validationErrors?: string[];
}

// This interface is now an alias to UploadProgressStats for backward compatibility
export type SGZProgressStats = UploadProgressStats;

export interface ValidationError {
  row?: number;
  column?: string;
  message: string;
  type: 'error' | 'warning';
  value?: any;
}

export interface UploadResult {
  success: boolean;
  message: string;
  data?: any[];
  errors?: ValidationError[];
  id?: string;
  recordCount?: number; 
  newOrders?: number;
  updatedOrders?: number;
}
