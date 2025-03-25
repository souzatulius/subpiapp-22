
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UploadInfo } from '@/components/ranking/types';
import { User } from '@supabase/supabase-js';

export const useUploadManagement = (user: User | null) => {
  const { toast } = useToast();
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastUpload = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('ranking_uploads')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString()
        });
      } else {
        setLastUpload(null);
      }
    } catch (error) {
      console.error('Erro ao buscar último upload:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do último upload.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'xls' && fileExt !== 'xlsx') {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, carregue apenas arquivos XLS ou XLSX.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // First, store the file metadata
      const { data, error } = await supabase
        .from('ranking_uploads')
        .insert({
          usuario_id: user.id,
          nome_arquivo: file.name,
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString()
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow proper error handling in the component
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpload = async () => {
    if (!lastUpload || !user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('ranking_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      setLastUpload(null);
      toast({
        title: "Upload removido",
        description: "O arquivo foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao remover upload:', error);
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
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
