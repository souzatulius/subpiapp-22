
export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  estimatedTimeRemaining?: string;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export interface UploadResult {
  success: boolean;
  recordCount: number;
  message: string;
  id?: string;
  data?: any[];
  newOrders?: number;
  updatedOrders?: number;
}
