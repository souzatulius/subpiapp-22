
export interface UploadProgressStats {
  totalRows: number;
  processedRows: number;
  updatedRows: number;
  newRows: number;
  estimatedTimeRemaining?: string;
  stage: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}
