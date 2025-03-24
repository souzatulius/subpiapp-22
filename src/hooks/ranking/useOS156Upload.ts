
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { OS156Upload, OS156Item } from '@/components/ranking/types';
import { processPlanilha156, mapAreaTecnica } from './utils/os156DataProcessing';

export const useOS156Upload = (user: User | null, onDataLoaded: (data: OS156Item[]) => void) => {
  const [lastUpload, setLastUpload] = useState<OS156Upload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastUpload = useCallback(async () => {
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
      toast.error("Não foi possível carregar as informações do último upload.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchOSData = async (uploadId: string) => {
    try {
      // First, get count to ensure we're loading all records
      const { count, error: countError } = await supabase
        .from('ordens_156')
        .select('*', { count: 'exact', head: true })
        .eq('upload_id', uploadId);
      
      if (countError) throw countError;
      
      console.log(`Total records for upload ${uploadId}: ${count}`);
      
      // Now fetch all records with pagination if needed
      let allData: OS156Item[] = [];
      const pageSize = 1000;
      let page = 0;
      let hasMore = true;
      
      while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;
        
        const { data, error } = await supabase
          .from('ordens_156')
          .select('*')
          .eq('upload_id', uploadId)
          .range(from, to);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          allData = [...allData, ...data as OS156Item[]];
          page++;
        }
        
        hasMore = data && data.length === pageSize;
      }
      
      console.log(`Loaded ${allData.length} records successfully`);
      onDataLoaded(allData);
    } catch (error) {
      console.error('Erro ao buscar dados das ordens:', error);
      toast.error("Não foi possível carregar os dados das ordens de serviço.");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer upload de arquivos.");
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
      console.log(`Processed ${osItems.length} items from file`);
      
      // Batch insert records in chunks to avoid payload size limits
      const batchSize = 500;
      for (let i = 0; i < osItems.length; i += batchSize) {
        const batch = osItems.slice(i, i + batchSize).map(item => ({
          ...item,
          upload_id: uploadId,
          area_tecnica: mapAreaTecnica(item.tipo_servico) || 'STM', // Default to STM if unknown
          servico_valido: ['PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'].includes(item.distrito)
        }));
        
        const { error: insertError } = await supabase
          .from('ordens_156')
          .insert(batch);
  
        if (insertError) {
          console.error('Error inserting batch:', insertError);
          throw insertError;
        }
        
        console.log(`Inserted batch ${i/batchSize + 1}/${Math.ceil(osItems.length/batchSize)}`);
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
      
      toast.success("Planilha processada com sucesso.");
    } catch (error: any) {
      console.error('Erro ao processar planilha:', error);
      toast.error(error.message || "Não foi possível processar o arquivo.");
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
      
      toast.success("Upload removido com sucesso.");
    } catch (error: any) {
      console.error('Erro ao remover upload:', error);
      toast.error(error.message || "Não foi possível remover o arquivo.");
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
