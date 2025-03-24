
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { OS156Upload, OS156Item } from '@/components/ranking/types';
import { processPlanilha156, mapAreaTecnica } from './utils/os156DataProcessing';

export const useOS156Upload = (user: User | null, onDataLoaded: (data: OS156Item[]) => void) => {
  const { toast } = useToast();
  const [lastUpload, setLastUpload] = useState<OS156Upload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastUpload = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
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
          nome_arquivo: data[0].nome_arquivo,
          data_upload: new Date(data[0].data_upload).toLocaleString(),
          processado: data[0].processado
        });
        
        // If there's a last upload, fetch its data
        await fetchOSData(data[0].id);
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

  const fetchOSData = async (uploadId: string) => {
    try {
      const { data, error } = await supabase
        .from('ordens_156')
        .select('*')
        .eq('upload_id', uploadId);

      if (error) throw error;

      if (data) {
        onDataLoaded(data as OS156Item[]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados das ordens:', error);
      toast({
        title: "Erro ao carregar ordens",
        description: "Não foi possível carregar os dados das ordens de serviço.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create upload record in database
      const { data: uploadData, error: uploadError } = await supabase
        .from('os_uploads')
        .insert({
          usuario_id: user.id,
          nome_arquivo: file.name,
        })
        .select();

      if (uploadError) throw uploadError;

      if (!uploadData || uploadData.length === 0) {
        throw new Error("Erro ao registrar upload");
      }

      const uploadId = uploadData[0].id;
      
      // Process the file data
      const osItems = await processPlanilha156(file);
      
      // For each OS item, determine its technical area and save to database
      const processedItems = osItems.map(item => ({
        ...item,
        upload_id: uploadId,
        area_tecnica: mapAreaTecnica(item.tipo_servico) || 'STM', // Default to STM if unknown
        servico_valido: ['PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'].includes(item.distrito)
      }));
      
      // Insert OS items
      if (processedItems.length > 0) {
        const { error: insertError } = await supabase
          .from('ordens_156')
          .insert(processedItems);
  
        if (insertError) throw insertError;
      }
      
      // Call the function to process the upload (detect changes, etc.)
      const { error: functionError } = await supabase.rpc('processar_upload_os_156', {
        upload_id: uploadId
      });
      
      if (functionError) throw functionError;

      // Update the last upload state and fetch its data
      setLastUpload({
        id: uploadId,
        nome_arquivo: file.name,
        data_upload: new Date().toLocaleString(),
        processado: true
      });
      
      await fetchOSData(uploadId);

      toast({
        title: "Upload concluído",
        description: "A planilha foi processada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao processar planilha:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLastUpload = async () => {
    if (!lastUpload || !user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('os_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      setLastUpload(null);
      onDataLoaded([]);
      
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
    handleFileUpload,
    deleteLastUpload
  };
};
