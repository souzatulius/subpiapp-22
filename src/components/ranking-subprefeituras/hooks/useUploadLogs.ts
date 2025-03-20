
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { UploadLog } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching and managing upload logs
 */
export const useUploadLogs = () => {
  const [uploadLogs, setUploadLogs] = useState<UploadLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchUploadLogs = useCallback(async () => {
    try {
      setLoading(true);
      // Use uploads_ordens_servico table which exists in the database schema
      const { data, error } = await supabase
        .from('uploads_ordens_servico')
        .select('*')
        .order('data_upload', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs de upload:', error);
        toast({
          title: "Erro ao buscar logs de upload!",
          description: "Ocorreu um problema ao carregar os logs de upload.",
          variant: "destructive",
        });
      }

      if (data) {
        setUploadLogs(data as UploadLog[]);
      }
    } catch (error: any) {
      console.error('Erro inesperado ao buscar logs de upload:', error);
      toast({
        title: "Erro inesperado!",
        description: "Ocorreu um problema inesperado ao carregar os logs de upload.",
        variant: "destructive",
      });
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
