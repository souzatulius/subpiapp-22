
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export interface UploadResult {
  success: boolean;
  recordCount: number;
  message: string;
  id?: string;
  data?: any[];
}

// Added fetchLastUpload function
export const fetchLastUpload = async (user: User | null) => {
  if (!user) {
    return { lastUpload: null, uploads: [] };
  }

  try {
    // Get last upload
    const { data: uploads } = await supabase
      .from('sgz_uploads')
      .select('*')
      .eq('usuario_id', user.id)
      .order('data_upload', { ascending: false });
    
    const lastUpload = uploads && uploads.length > 0 ? {
      id: uploads[0].id,
      fileName: uploads[0].nome_arquivo,
      uploadDate: uploads[0].data_upload,
      processed: uploads[0].processado
    } : null;

    return {
      lastUpload,
      uploads: uploads || []
    };
  } catch (error) {
    console.error('Error fetching last upload:', error);
    return { lastUpload: null, uploads: [] };
  }
};

// Added handleDeleteUpload function
export const handleDeleteUpload = async (uploadId: string, user: User | null): Promise<boolean> => {
  if (!user) {
    toast.error('Você precisa estar logado para excluir uploads');
    return false;
  }

  try {
    // Delete records from sgz_ordens_servico first
    const { error: deleteOrdersError } = await supabase
      .from('sgz_ordens_servico')
      .delete()
      .eq('planilha_referencia', uploadId);
    
    if (deleteOrdersError) {
      console.error('Error deleting orders:', deleteOrdersError);
      toast.error(`Erro ao excluir ordens: ${deleteOrdersError.message}`);
      return false;
    }
    
    // Now delete the upload record
    const { error: deleteUploadError } = await supabase
      .from('sgz_uploads')
      .delete()
      .eq('id', uploadId);
    
    if (deleteUploadError) {
      console.error('Error deleting upload:', deleteUploadError);
      toast.error(`Erro ao excluir upload: ${deleteUploadError.message}`);
      return false;
    }
    
    toast.success('Upload excluído com sucesso');
    return true;
  } catch (error: any) {
    console.error('Error in delete upload operation:', error);
    toast.error(`Erro ao excluir upload: ${error.message}`);
    return false;
  }
};

// Helper function to process Excel file
export const processExcelFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Map Excel row to SGZ structure
export const mapExcelRowToSGZOrdem = (row: any, uploadId: string) => {
  return {
    sgz_status: row.status || 'pendente',
    sgz_tipo_servico: row.tipo_servico || 'Não informado',
    sgz_distrito: row.distrito || 'Não informado',
    sgz_bairro: row.bairro || null,
    sgz_empresa: row.empresa || null,
    sgz_criado_em: row.data_criacao ? new Date(row.data_criacao).toISOString() : new Date().toISOString(),
    sgz_modificado_em: row.data_status ? new Date(row.data_status).toISOString() : new Date().toISOString(),
    ordem_servico: row.ordem_servico || row.numero_os || `OS-${Math.floor(Math.random() * 100000)}`,
    planilha_referencia: uploadId,
    sgz_departamento_tecnico: row.area_tecnica || 'STPO'
  };
};

// Handle file upload for SGZ spreadsheet
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
      onProcessingStats({...{}, processingStatus: 'error', errorMessage: 'Formato de arquivo inválido'});
      return null;
    }
    
    onProgress(25);
    console.log('Processing Excel file...');
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
    
    if (uploadError) {
      console.error('Error creating upload record:', uploadError);
      throw uploadError;
    }
    
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
      
      if (checkError) {
        console.error('Error checking existing order:', checkError);
        throw checkError;
      }
      
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
            
          if (updateError) {
            console.error('Error updating order:', updateError);
            throw updateError;
          }
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
      console.log(`Inserting ${ordensParaInserir.length} new orders...`);
      const { error: insertError } = await supabase
        .from('sgz_ordens_servico')
        .insert(ordensParaInserir);
      
      if (insertError) {
        console.error('Error inserting orders:', insertError);
        throw insertError;
      }
      
      console.log(`Inserted ${ordensParaInserir.length} new orders`);
    }
    
    const { error: updateUploadError } = await supabase
      .from('sgz_uploads')
      .update({ processado: true })
      .eq('id', uploadId);
      
    if (updateUploadError) {
      console.error('Error marking upload as processed:', updateUploadError);
      throw updateUploadError;
    }
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

// Map Excel row to Painel structure
export const mapExcelRowToPainelZeladoria = (row: any, uploadId: string) => {
  return {
    id_os: row.id_os || row.numero_os || `OS-${Math.floor(Math.random() * 100000)}`,
    status: row.status || 'pendente',
    tipo_servico: row.tipo_servico || 'Não informado',
    data_abertura: row.data_abertura ? new Date(row.data_abertura).toISOString() : new Date().toISOString(),
    data_fechamento: row.data_fechamento ? new Date(row.data_fechamento).toISOString() : null,
    distrito: row.distrito || 'Não informado',
    departamento: row.departamento || 'Não informado',
    responsavel_real: row.responsavel || row.responsavel_real || null,
    upload_id: uploadId
  };
};

// Handle file upload for Painel Zeladoria spreadsheet
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
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
      onProgress(0);
      onProcessingStats({
        processingStatus: 'error',
        message: 'Formato de arquivo inválido',
        recordCount: 0
      });
      return null;
    }
    
    onProgress(30);
    console.log('Processing Painel Excel file...');
    const excelData = await processExcelFile(file);
    console.log(`Processed ${excelData.length} rows from Painel Excel file`);
    
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_email: user.email || '',
      })
      .select()
      .single();
    
    if (uploadError) {
      console.error('Error creating painel upload record:', uploadError);
      throw uploadError;
    }
    
    const uploadId = uploadData.id;
    console.log(`Created painel upload record with ID: ${uploadId}`);
    
    onProgress(60);
    
    // Prepare data for insertion
    const dadosParaInserir = excelData.map(row => mapExcelRowToPainelZeladoria(row, uploadId));
    
    onProgress(75);
    console.log(`Inserting ${dadosParaInserir.length} painel records...`);
    
    // Insert each record individually to avoid type issues
    for (const record of dadosParaInserir) {
      const { error: insertError } = await supabase
        .from('painel_zeladoria_dados')
        .insert(record);
        
      if (insertError) {
        console.error('Error inserting painel record:', insertError);
        throw insertError;
      }
    }
    
    onProgress(100);
    onProcessingStats({
      processingStatus: 'success',
      message: 'Dados do Painel processados com sucesso!',
      recordCount: dadosParaInserir.length
    });
    
    toast.success(`Planilha do Painel processada com sucesso! ${dadosParaInserir.length} registros processados.`);
    
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
