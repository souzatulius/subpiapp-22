
import { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UploadInfo, SGZUpload, ProcessingStats, UploadResult } from './types/uploadTypes';
import { fetchLastUpload, handleFileUpload, handleDeleteUpload } from './services/uploadService';

export const useUploadManagement = (user: User | null) => {
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<SGZUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    newOrders: 0,
    updatedOrders: 0,
    processingStatus: 'idle'
  });

  const refreshLastUpload = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    const result = await fetchLastUpload(user);
    setLastUpload(result.lastUpload);
    setUploads(result.uploads);
    setIsLoading(false);
  }, [user]);

  const handleUpload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setIsLoading(true);
    
    try {
      const result = await handleFileUpload(
        file, 
        user,
        (progress) => setUploadProgress(progress),
        (stats) => setProcessingStats(stats)
      );
      
      if (result) {
        await refreshLastUpload();
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshLastUpload]);

  const deleteUpload = useCallback(async (uploadId: string) => {
    setIsLoading(true);
    
    const success = await handleDeleteUpload(uploadId, user);
    
    if (success) {
      await refreshLastUpload();
    }
    
    setIsLoading(false);
  }, [user, refreshLastUpload]);
  
  // Load the last upload when the component mounts
  useEffect(() => {
    if (user) {
      refreshLastUpload();
    }
  }, [user, refreshLastUpload]);

  return {
    lastUpload,
    isLoading,
    uploads,
    uploadProgress,
    processingStats,
    fetchLastUpload: refreshLastUpload,
    handleUpload,
    handleDeleteUpload: deleteUpload
  };
};
