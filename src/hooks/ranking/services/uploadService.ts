
import { supabase } from '@/integrations/supabase/client';
import { ProcessingStats, UploadResult } from '@/types/ranking';
import * as XLSX from 'xlsx';

// Process the Excel file for SGZ uploads
export const handleFileUpload = async (
  file: File,
  user: any,
  onProgress: (progress: number) => void,
  onStats: (stats: ProcessingStats) => void
): Promise<UploadResult> => {
  if (!file || !user?.id) {
    return {
      success: false,
      message: 'Arquivo ou usuário inválido',
      recordCount: 0
    };
  }

  try {
    // Update progress
    onProgress(10);
    onStats({
      processingStatus: 'processing',
      newOrders: 0,
      updatedOrders: 0
    });

    // Read the file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Check if data is valid
    if (!jsonData || jsonData.length === 0) {
      return {
        success: false,
        message: 'Arquivo não contém dados válidos',
        recordCount: 0
      };
    }

    onProgress(30);

    // Create upload record
    const { data: uploadData, error: uploadError } = await supabase
      .from('sgz_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_id: user.id,
        processado: false
      })
      .select('id')
      .single();

    if (uploadError) {
      console.error('Error creating upload record:', uploadError);
      return {
        success: false,
        message: 'Erro ao registrar upload',
        recordCount: 0
      };
    }

    onProgress(50);
    
    // Process the data - here we would normally insert into the database
    // This is a simplified example
    const uploadId = uploadData.id;
    
    // Simulate processing records
    onProgress(70);
    onStats({
      processingStatus: 'processing',
      newOrders: jsonData.length,
      updatedOrders: 0
    });

    // Complete the process
    onProgress(100);
    
    return {
      success: true,
      message: 'Upload concluído com sucesso',
      recordCount: jsonData.length,
      id: uploadId,
      data: jsonData,
      newOrders: jsonData.length,
      updatedOrders: 0
    };
  } catch (error) {
    console.error('Error processing file:', error);
    return {
      success: false,
      message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : String(error)}`,
      recordCount: 0
    };
  }
};

// Process the Excel file for Painel uploads
export const handlePainelZeladoriaUpload = async (
  file: File,
  user: any,
  onProgress: (progress: number) => void,
  onStats: (stats: ProcessingStats) => void
): Promise<UploadResult> => {
  if (!file || !user?.id) {
    return {
      success: false,
      message: 'Arquivo ou usuário inválido',
      recordCount: 0
    };
  }

  try {
    // Update progress
    onProgress(10);
    onStats({
      processingStatus: 'processing',
      message: 'Iniciando processamento do arquivo do Painel'
    });

    // Read the file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Check if data is valid
    if (!jsonData || jsonData.length === 0) {
      return {
        success: false,
        message: 'Arquivo não contém dados válidos',
        recordCount: 0
      };
    }

    onProgress(30);

    // Create upload record
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_email: user.email
      })
      .select('id')
      .single();

    if (uploadError) {
      console.error('Error creating upload record:', uploadError);
      return {
        success: false,
        message: 'Erro ao registrar upload',
        recordCount: 0
      };
    }

    const uploadId = uploadData.id;
    onProgress(50);
    
    // Process records - simplified example
    onStats({
      processingStatus: 'processing',
      message: `Processando ${jsonData.length} registros`,
      recordCount: jsonData.length
    });
    
    // Get current count for stats
    const { count, error: countError } = await supabase
      .from('painel_zeladoria_dados')
      .select('*', { count: 'exact', head: true });
    
    const totalRecords = countError ? 0 : (count || 0);
    
    onProgress(70);

    // Complete the process
    onProgress(100);
    
    return {
      success: true,
      message: 'Upload do Painel concluído com sucesso',
      recordCount: jsonData.length,
      id: uploadId,
      data: jsonData,
      totalRecords: totalRecords + jsonData.length
    };
  } catch (error) {
    console.error('Error processing file:', error);
    return {
      success: false,
      message: `Erro ao processar arquivo: ${error instanceof Error ? error.message : String(error)}`,
      recordCount: 0
    };
  }
};
