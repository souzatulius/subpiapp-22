
export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
  errorCount?: number;
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
}
