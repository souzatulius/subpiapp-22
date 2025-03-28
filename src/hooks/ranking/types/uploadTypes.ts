
import { User } from '@supabase/supabase-js';

export interface UploadInfo {
  id: string;
  fileName: string;
  uploadDate: string;
  processed: boolean;
}

export interface SGZUpload {
  id: string;
  nome_arquivo: string;
  data_upload: string;
  processado: boolean;
  usuario_id: string;
}

export interface UploadResult {
  id: string;
  data: any[];
}

export interface ProcessingStats {
  newOrders: number;
  updatedOrders: number;
  processingStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}
