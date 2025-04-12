
export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  errorCount?: number;
  validRows?: number;
  skippedRows?: number;
  estimatedTimeRemaining?: string;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
  value?: any;
}

export interface UploadResult {
  success: boolean;
  recordCount: number;
  message: string;
  id?: string;
  data?: any[];
  newOrders?: number;
  updatedOrders?: number;
  errors?: ValidationError[];
}
