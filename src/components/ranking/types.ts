
export interface UploadProgressStats {
  processedRows: number;
  totalRows: number;
  newRows: number;
  updatedRows: number;
  stage: 'idle' | 'uploading' | 'processing' | 'complete' | 'error' | 'empty';
  message?: string;
  estimatedTimeRemaining?: string;
}

export interface UploadStats {
  sgz?: UploadProgressStats;
  painel?: UploadProgressStats;
  lastRefreshed?: Date;
}
