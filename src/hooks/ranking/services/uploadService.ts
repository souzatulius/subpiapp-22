
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { processExcelFile, mapExcelRowToSGZOrdem } from '../utils/excelUtils';
import { UploadResult } from '../types/uploadTypes';
import { toast } from 'sonner';

export const fetchLastUpload = async (user: User | null) => {
  if (!user) return { lastUpload: null, uploads: [] };
  
  try {
    // Buscar o upload mais recente no Supabase
    const { data, error } = await supabase
      .from('sgz_uploads')
      .select('*')
      .order('data_upload', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    const lastUpload = data && data.length > 0 ? {
      id: data[0].id,
      fileName: data[0].nome_arquivo,
      uploadDate: new Date(data[0].data_upload).toLocaleString('pt-BR'),
      processed: data[0].processado
    } : null;
    
    // Buscar todos os uploads para histórico
    const { data: allUploads, error: uploadsError } = await supabase
      .from('sgz_uploads')
      .select('*')
      .order('data_upload', { ascending: false });
    
    if (uploadsError) throw uploadsError;
    
    return {
      lastUpload,
      uploads: allUploads || []
    };
    
  } catch (error) {
    console.error('Error fetching last upload:', error);
    toast.error('Erro ao buscar o último upload');
    return { lastUpload: null, uploads: [] };
  }
};

export const handleFileUpload = async (
  file: File, 
  user: User | null,
  onProgress: (progress: number) => void,
  onProcessingStats: (stats: any) => void
): Promise<UploadResult | null> => {
  if (!user) {
    toast.error('Você precisa estar logado para fazer upload');
    return null;
  }

  try {
    onProgress(10);
    onProcessingStats({
      newOrders: 0,
      updatedOrders: 0,
      processingStatus: 'processing'
    });
    
    // Verificar tipo de arquivo
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
      onProgress(0);
      onProcessingStats(prev => ({...prev, processingStatus: 'error', errorMessage: 'Formato de arquivo inválido'}));
      return null;
    }
    
    // Processar arquivo Excel
    onProgress(25);
    const excelData = await processExcelFile(file);
    console.log(`Processed ${excelData.length} rows from Excel file`);
    
    // Criar o registro de upload
    const { data: uploadData, error: uploadError } = await supabase
      .from('sgz_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_id: user.id,
        processado: false
      })
      .select()
      .single();
    
    if (uploadError) throw uploadError;
    
    const uploadId = uploadData.id;
    console.log(`Created upload record with ID: ${uploadId}`);
    
    // Processar e inserir cada linha da planilha
    const ordens = [];
    const ordensParaInserir = [];
    let ordensAtualizadas = 0;
    
    onProgress(50);
    
    for (const row of excelData) {
      const ordem = mapExcelRowToSGZOrdem(row, uploadId);
      ordens.push(ordem);
      
      // Verificar se esta ordem já existe
      const { data: existingOrdem, error: checkError } = await supabase
        .from('sgz_ordens_servico')
        .select('id, sgz_status')
        .eq('ordem_servico', ordem.ordem_servico)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingOrdem) {
        // Se existir e o status mudou, atualizar
        if (existingOrdem.sgz_status !== ordem.sgz_status) {
          const { error: updateError } = await supabase
            .from('sgz_ordens_servico')
            .update({
              sgz_status: ordem.sgz_status,
              sgz_modificado_em: ordem.sgz_modificado_em,
              planilha_referencia: uploadId
            })
            .eq('id', existingOrdem.id);
            
          if (updateError) throw updateError;
          ordensAtualizadas++;
        }
      } else {
        // Se não existir, adicionar à lista para inserção
        ordensParaInserir.push(ordem);
      }
    }
    
    // Update progress based on processing status
    onProgress(85); 
    onProcessingStats({
      newOrders: ordensParaInserir.length,
      updatedOrders: ordensAtualizadas,
      processingStatus: 'processing'
    });
    
    // Inserir novas ordens em lote
    if (ordensParaInserir.length > 0) {
      const { error: insertError } = await supabase
        .from('sgz_ordens_servico')
        .insert(ordensParaInserir);
      
      if (insertError) throw insertError;
      
      console.log(`Inserted ${ordensParaInserir.length} new orders`);
    }
    
    // Marcar upload como processado
    const { error: updateUploadError } = await supabase
      .from('sgz_uploads')
      .update({ processado: true })
      .eq('id', uploadId);
      
    if (updateUploadError) throw updateUploadError;
    console.log(`Marked upload ${uploadId} as processed`);
    
    onProgress(100);
    onProcessingStats({
      newOrders: ordensParaInserir.length,
      updatedOrders: ordensAtualizadas,
      processingStatus: 'success'
    });
    
    toast.success(`Planilha SGZ processada com sucesso! ${ordensParaInserir.length} novas ordens inseridas e ${ordensAtualizadas} atualizadas.`);
    
    // Return the result with proper types
    return {
      id: uploadId,
      data: excelData
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    onProgress(0);
    onProcessingStats({
      newOrders: 0,
      updatedOrders: 0,
      processingStatus: 'error',
      errorMessage: error.message || 'Falha no processamento'
    });
    toast.error(`Erro ao processar a planilha SGZ: ${error.message || 'Falha no processamento'}`);
    return null;
  }
};

export const handleDeleteUpload = async (uploadId: string, user: User | null) => {
  if (!user) return;

  try {
    // Primeiro excluir as ordens associadas a este upload
    const { error: deleteOrdensError } = await supabase
      .from('sgz_ordens_servico')
      .delete()
      .eq('planilha_referencia', uploadId);
    
    if (deleteOrdensError) throw deleteOrdensError;
    
    // Depois excluir o upload
    const { error: deleteUploadError } = await supabase
      .from('sgz_uploads')
      .delete()
      .eq('id', uploadId);
    
    if (deleteUploadError) throw deleteUploadError;
    
    toast.success('Upload e dados relacionados excluídos com sucesso');
    return true;
  } catch (error) {
    console.error('Error deleting upload:', error);
    toast.error('Erro ao excluir o upload');
    return false;
  }
};
