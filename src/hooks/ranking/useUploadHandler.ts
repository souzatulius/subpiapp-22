
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PlanilhaUpload, OrdemServico } from '@/components/ranking/types';

export const useUploadHandler = (
  user: User | null, 
  setIsLoading: (loading: boolean) => void,
  setLastUpload: (upload: PlanilhaUpload | null) => void,
  fetchOrdersData: (uploadId: string) => Promise<void>,
  setUploadProgress?: (progress: number) => void
) => {
  // Function to upload a new file
  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload de arquivos');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Set initial progress
      if (setUploadProgress) {
        setUploadProgress(5);
      }
      
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // First, create an upload record
      const { data: uploadData, error: uploadError } = await supabase
        .from('planilhas_upload')
        .insert({
          arquivo_nome: file.name,
          usuario_upload: user.id,
          status_upload: 'sucesso' // Will be updated after processing
        })
        .select();
      
      if (uploadError) throw uploadError;
      
      if (!uploadData || uploadData.length === 0) {
        throw new Error('Erro ao registrar upload');
      }
      
      const uploadId = uploadData[0].id;
      
      // Update progress
      if (setUploadProgress) {
        setUploadProgress(15);
      }
      
      // Simulate file processing with progress updates
      // In a real implementation, you'd have a backend service that sends progress updates
      const simulateProcessing = async () => {
        // Simulate reading the file
        if (setUploadProgress) {
          setUploadProgress(30);
          await new Promise(resolve => setTimeout(resolve, 800));
          setUploadProgress(45);
          await new Promise(resolve => setTimeout(resolve, 800));
          setUploadProgress(60);
          await new Promise(resolve => setTimeout(resolve, 800));
          setUploadProgress(75);
          await new Promise(resolve => setTimeout(resolve, 800));
          setUploadProgress(90);
          await new Promise(resolve => setTimeout(resolve, 800));
          setUploadProgress(100);
        }
        
        // Update the upload record with the number of processed records
        const { error: updateError } = await supabase
          .from('planilhas_upload')
          .update({
            qtd_ordens_processadas: 100, // Placeholder
            qtd_ordens_validas: 80,      // Placeholder
            status_upload: 'sucesso'
          })
          .eq('id', uploadId);
        
        if (updateError) {
          console.error('Error updating upload status:', updateError);
        }
      };
      
      // Start the processing in the background, but don't await it directly
      // This allows the user to navigate away while processing continues
      const processingPromise = simulateProcessing();
      
      // Update the last upload state
      setLastUpload({
        id: uploadId,
        arquivo_nome: file.name,
        data_upload: new Date().toLocaleString(),
        usuario_upload: user.id,
        qtd_ordens_processadas: 100, // Placeholder
        qtd_ordens_validas: 80,      // Placeholder
        status_upload: 'sucesso'
      });
      
      // Wait for the processing to complete before fetching data
      await processingPromise;
      
      // Fetch the newly uploaded data
      await fetchOrdersData(uploadId);
      
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Não foi possível processar o arquivo');
      // Reset progress on error
      if (setUploadProgress) {
        setUploadProgress(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete the last upload
  const deleteLastUpload = async (lastUpload: PlanilhaUpload | null, generateChartData: (data: any[]) => void) => {
    if (!lastUpload || !user) return;
    
    try {
      setIsLoading(true);
      
      // First, delete all related records
      const { error: ordersError } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('planilha_referencia', lastUpload.id);
      
      if (ordersError) throw ordersError;
      
      // Now delete the upload record
      const { error } = await supabase
        .from('planilhas_upload')
        .delete()
        .eq('id', lastUpload.id);
      
      if (error) throw error;
      
      setLastUpload(null);
      generateChartData([]);
      
      toast.success('Upload removido com sucesso');
    } catch (error: any) {
      console.error('Error removing upload:', error);
      toast.error(error.message || 'Não foi possível remover o arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleFileUpload, deleteLastUpload };
};
