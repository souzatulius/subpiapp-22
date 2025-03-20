
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { UploadLog } from '../types';

/**
 * Hook for fetching and managing upload logs
 */
export const useUploadLogs = () => {
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchUploadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('uploads_ordens_servico')  // Correct table name
        .select('*')
        .order('data_upload', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs de upload:', error);
        toast({
          title: "Erro ao buscar logs de upload!",
          description: "Ocorreu um problema ao carregar os logs.",
          variant: "destructive",
        });
      }

      if (data) {
        setUploadLogs(data as UploadLog[]);
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUploadLogs();
  }, [fetchUploadLogs]);

  return {
    uploadLogs,
    loading,
    fetchUploadLogs
  };
};
