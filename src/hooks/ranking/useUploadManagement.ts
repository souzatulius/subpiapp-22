
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { UploadInfo } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUploadManagement = (user: User | null) => {
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLastUpload = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('os_uploads')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString('pt-BR')
        });
      }
    } catch (error) {
      console.error('Error fetching last upload:', error);
      toast.error('Erro ao buscar último upload');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleUpload = async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return;
    }

    setIsLoading(true);
    try {
      // First, create a record in the database
      const { data, error } = await supabase
        .from('os_uploads')
        .insert({
          nome_arquivo: file.name,
          usuario_id: user.id
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Upload the file to Storage (if you're using Supabase Storage)
        const fileUploadId = data[0].id;
        const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
        const filePath = `uploads/${fileUploadId}${fileExtension}`;

        // This part would typically upload to Supabase Storage
        // For this example, we'll just update our state
        setLastUpload({
          id: fileUploadId,
          fileName: file.name,
          uploadDate: new Date().toLocaleString('pt-BR')
        });

        // Here you would typically process the Excel file
        // For this example, we'll just simulate success
        toast.success('Arquivo carregado com sucesso!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao processar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpload = async () => {
    if (!user || !lastUpload) return;

    setIsLoading(true);
    try {
      // Delete the upload record from the database
      const { error } = await supabase
        .from('os_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      // This would typically also delete the file from storage
      // For this example, we'll just update our state
      setLastUpload(null);
      toast.success('Upload removido com sucesso!');
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Erro ao remover upload');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lastUpload,
    isLoading,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  };
};
