import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { processExcelFile, mapExcelRowToSGZOrdem } from '../utils/excelUtils';
import { UploadResult } from '../types/uploadTypes';
import { toast } from 'sonner';
import { compararBases, salvarComparacaoNaBase } from '../utils/compararBases';

export const fetchLastUpload = async (user: User | null) => {
  if (!user) return { lastUpload: null, uploads: [] };
  
  try {
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
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
      onProgress(0);
      onProcessingStats(prev => ({...prev, processingStatus: 'error', errorMessage: 'Formato de arquivo inválido'}));
      return null;
    }
    
    onProgress(25);
    const excelData = await processExcelFile(file);
    console.log(`Processed ${excelData.length} rows from Excel file`);
    
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
    
    const ordens = [];
    const ordensParaInserir = [];
    let ordensAtualizadas = 0;
    
    onProgress(50);
    
    for (const row of excelData) {
      const ordem = mapExcelRowToSGZOrdem(row, uploadId);
      ordens.push(ordem);
      
      const { data: existingOrdem, error: checkError } = await supabase
        .from('sgz_ordens_servico')
        .select('id, sgz_status')
        .eq('ordem_servico', ordem.ordem_servico)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingOrdem) {
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
        ordensParaInserir.push(ordem);
      }
    }
    
    onProgress(85); 
    onProcessingStats({
      newOrders: ordensParaInserir.length,
      updatedOrders: ordensAtualizadas,
      processingStatus: 'processing'
    });
    
    if (ordensParaInserir.length > 0) {
      const { error: insertError } = await supabase
        .from('sgz_ordens_servico')
        .insert(ordensParaInserir);
      
      if (insertError) throw insertError;
      
      console.log(`Inserted ${ordensParaInserir.length} new orders`);
    }
    
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
    
    return {
      success: true,
      recordCount: excelData.length,
      message: 'Upload processado com sucesso',
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
    return {
      success: false,
      recordCount: 0,
      message: error.message || 'Falha no processamento'
    };
  }
};

export const handleDeleteUpload = async (uploadId: string, user: User | null) => {
  if (!user) return;

  try {
    const { error: deleteOrdensError } = await supabase
      .from('sgz_ordens_servico')
      .delete()
      .eq('planilha_referencia', uploadId);
    
    if (deleteOrdensError) throw deleteOrdensError;
    
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

export const handlePainelZeladoriaUpload = async (
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
      processingStatus: 'processing',
      message: 'Processando dados do Painel da Zeladoria...',
      recordCount: 0
    });
    
    const dadosPainel = await processExcelFile(file);
    onProgress(50);
    
    const { data: sgzData, error: sgzError } = await supabase
      .from('sgz_ordens_servico')
      .select('*');
    
    if (sgzError) throw sgzError;
    
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_email: user.email || '',
      })
      .select()
      .single();
    
    if (uploadError) throw uploadError;
    
    const uploadId = uploadData.id;
    
    const resultadoComparacao = compararBases(sgzData, dadosPainel);
    const comparacaoSalva = await salvarComparacaoNaBase(resultadoComparacao, uploadId);
    
    const dadosParaInserir = dadosPainel.map(row => ({
      id_os: row.id_os,
      status: row.status,
      tipo_servico: row.tipo_servico,
      data_abertura: row.data_abertura,
      data_fechamento: row.data_fechamento,
      distrito: row.distrito,
      departamento: row.departamento,
      responsavel_real: row.responsavel_real,
      upload_id: uploadId
    }));
    
    const { error: insertError } = await supabase
      .from('painel_zeladoria_dados')
      .insert(dadosParaInserir);
    
    if (insertError) throw insertError;
    
    onProgress(100);
    onProcessingStats({
      processingStatus: 'success',
      message: 'Dados do Painel processados com sucesso!',
      recordCount: dadosParaInserir.length,
      comparacaoStats: comparacaoSalva
    });
    
    toast.success(
      `Planilha do Painel processada com ${comparacaoSalva.totalDivergencias} divergências encontradas.`
    );
    
    return {
      success: true,
      recordCount: dadosParaInserir.length,
      message: 'Planilha do Painel processada com sucesso',
      id: uploadId,
      data: dadosParaInserir
    };
  } catch (error: any) {
    console.error('Erro ao processar planilha do Painel:', error);
    onProgress(0);
    onProcessingStats({
      processingStatus: 'error',
      message: error.message || 'Falha no processamento',
      recordCount: 0
    });
    toast.error(`Erro ao processar planilha do Painel: ${error.message || 'Falha no processamento'}`);
    return {
      success: false,
      recordCount: 0,
      message: error.message || 'Falha no processamento'
    };
  }
};
