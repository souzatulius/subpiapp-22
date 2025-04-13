
export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
  errorCount?: number;
  estimatedTimeRemaining?: number; // Added for time estimation
}

export interface SGZProgressStats {
  totalRecords: number;
  processed: number;
  success: number;
  failed: number;
  progress: number;
  stage: string;
  validationErrors?: string[];
  message?: string; // Added to match usage in code
  totalRows?: number; // For compatibility
  processedRows?: number; // For compatibility
}

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
