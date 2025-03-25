
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { UploadInfo } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUploadManagement = (user: User | null) => {
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLastUpload = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // In a real application, this would fetch from Supabase
      // For demonstration, we'll simulate a last upload
      
      // For development purposes, simulate this data
      setTimeout(() => {
        setLastUpload({
          id: '1',
          fileName: 'dados_sgz_exemplo.xlsx',
          uploadDate: new Date().toLocaleString('pt-BR')
        });
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching last upload:', error);
      toast.error('Erro ao buscar o último upload');
      setIsLoading(false);
    }
  }, [user]);

  const handleUpload = useCallback(async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return;
    }

    try {
      setIsLoading(true);
      
      // Check file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
        setIsLoading(false);
        return;
      }
      
      // In a real application, this would upload the file to Supabase Storage
      // and then process it to insert records into the database
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful upload
      setLastUpload({
        id: '1',
        fileName: file.name,
        uploadDate: new Date().toLocaleString('pt-BR')
      });
      
      toast.success('Planilha SGZ processada com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao processar a planilha SGZ');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleDeleteUpload = useCallback(async () => {
    if (!user || !lastUpload) return;

    try {
      setIsLoading(true);
      
      // In a real application, this would delete records from Supabase
      
      // Simulate deletion time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastUpload(null);
      toast.success('Upload excluído com sucesso');
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Erro ao excluir o upload');
    } finally {
      setIsLoading(false);
    }
  }, [user, lastUpload]);

  return {
    lastUpload,
    isLoading,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  };
};
