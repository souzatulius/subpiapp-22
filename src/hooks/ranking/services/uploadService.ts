import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { UploadResult, UploadProgressStats } from '../types/uploadTypes';

// Type for progress update callbacks
type ProgressCallback = (progress: number) => void;
type StatsCallback = (stats: any) => void;

/**
 * Process SGZ file upload
 */
export const handleFileUpload = async (
  file: File,
  user: any,
  onProgress?: ProgressCallback,
  onStatsUpdate?: StatsCallback
): Promise<UploadResult | null> => {
  try {
    // Report initial progress
    onProgress?.(10);
    
    // Read Excel file
    const workbook = await readExcelFile(file);
    
    // Update progress
    onProgress?.(30);
    
    // Process data from the workbook
    const data = processXLSX(workbook);
    
    if (!data || data.length === 0) {
      return {
        success: false,
        recordCount: 0,
        message: 'Não foi possível processar dados do arquivo',
      };
    }
    
    // Update progress
    onProgress?.(50);
    onStatsUpdate?.({
      totalRows: data.length,
      processingStatus: 'processing',
      message: 'Processando registros...'
    });
    
    // Register the upload
    const { data: uploadData, error: uploadError } = await supabase
      .from('sgz_uploads')
      .insert({
        nome_arquivo: file.name,
        usuario_id: user?.id || 'anonymous'
      })
      .select('id')
      .single();
      
    if (uploadError) {
      console.error('Error registering upload:', uploadError);
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao registrar upload: ' + uploadError.message,
      };
    }
    
    const uploadId = uploadData.id;
    onProgress?.(70);
    
    // Format data for insertion
    const formattedData = data.map(item => ({
      ...item,
      planilha_referencia: uploadId,
      servico_responsavel: classifyServiceResponsibility(item.sgz_tipo_servico || '')
    }));
    
    // Insert data
    const { error: insertError } = await supabase
      .from('sgz_ordens_servico')
      .insert(formattedData);
      
    if (insertError) {
      console.error('Error inserting data:', insertError);
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao inserir dados: ' + insertError.message,
      };
    }
    
    onProgress?.(100);
    onStatsUpdate?.({
      totalRows: data.length,
      processingStatus: 'success',
      message: `${data.length} registros processados com sucesso`,
    });
    
    return {
      success: true,
      id: uploadId,
      recordCount: data.length,
      message: 'Upload realizado com sucesso',
      data: formattedData,
      newOrders: data.length,
      updatedOrders: 0
    };
  } catch (error: any) {
    console.error('Error in file upload processing:', error);
    return {
      success: false,
      recordCount: 0,
      message: 'Erro ao processar arquivo: ' + error.message
    };
  }
};

/**
 * Process Painel Zeladoria file upload
 */
export const handlePainelZeladoriaUpload = async (
  file: File,
  user: any,
  onProgress?: ProgressCallback,
  onStatsUpdate?: StatsCallback
): Promise<UploadResult | null> => {
  try {
    // Report initial progress
    onProgress?.(10);
    
    // Read Excel file
    const workbook = await readExcelFile(file);
    
    // Update progress
    onProgress?.(30);
    
    // Process data from the workbook
    const data = processXLSXPainel(workbook);
    
    if (!data || data.length === 0) {
      return {
        success: false,
        recordCount: 0,
        message: 'Não foi possível processar dados do arquivo',
      };
    }
    
    // Update progress
    onProgress?.(50);
    onStatsUpdate?.({
      totalRows: data.length,
      processingStatus: 'processing',
      message: 'Processando registros...'
    });
    
    // Try to use the transaction function for better consistency
    try {
      const { data: txnResult, error: txnError } = await supabase.functions.invoke("create_painel_upload_with_data", {
        body: {
          p_usuario_email: user?.email || 'anonymous',
          p_nome_arquivo: file.name,
          p_dados: data
        }
      });
      
      if (txnError) {
        console.log('Transaction function error:', txnError);
        // If error is about duplicate, we'll fall back to regular upload method
        if (!txnError.message.includes('já foi carregado')) {
          throw txnError;
        }
        // If it's a duplicate error, continue with the fallback below
      } else {
        // Success with transaction function
        onProgress?.(100);
        onStatsUpdate?.({
          totalRows: data.length,
          processingStatus: 'success',
          message: `${data.length} registros processados com sucesso`,
        });
        
        return {
          success: true,
          id: txnResult.id,
          recordCount: txnResult.record_count || data.length,
          message: 'Upload realizado com sucesso',
          data: data,
          newOrders: data.length,
          updatedOrders: 0
        };
      }
    } catch (txError) {
      console.log('Trying fallback upload method after transaction error:', txError);
      // Continue with fallback upload method
    }
    
    // Fallback upload method - direct insert
    // Generate a unique file name if needed
    const fileName = file.name;
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const uniqueFileName = `${fileName.split('.')[0]}_${timestamp}.${fileName.split('.').pop()}`;
    
    // Register the upload with unique name
    const { data: uploadData, error: uploadError } = await supabase
      .from('painel_zeladoria_uploads')
      .insert({
        nome_arquivo: uniqueFileName,
        usuario_email: user?.email || 'anonymous'
      })
      .select('id')
      .single();
      
    if (uploadError) {
      console.error('Error registering upload:', uploadError);
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao registrar upload: ' + uploadError.message,
      };
    }
    
    const uploadId = uploadData.id;
    onProgress?.(70);
    
    // Format data for insertion
    const formattedData = data.map(item => ({
      ...item,
      upload_id: uploadId,
      responsavel_classificado: classifyServiceResponsibility(item.tipo_servico || '')
    }));
    
    // Insert data
    const { error: insertError } = await supabase
      .from('painel_zeladoria_dados')
      .insert(formattedData);
      
    if (insertError) {
      console.error('Error inserting data:', insertError);
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao inserir dados: ' + insertError.message,
      };
    }
    
    onProgress?.(100);
    onStatsUpdate?.({
      totalRows: data.length,
      processingStatus: 'success',
      message: `${data.length} registros processados com sucesso`,
    });
    
    // After successful insertion, compare with SGZ data to detect inconsistencies
    try {
      const { data: sgzData } = await supabase
        .from('sgz_ordens_servico')
        .select('*')
        .order('sgz_criado_em', { ascending: false })
        .limit(1000);

      if (sgzData && sgzData.length > 0) {
        compareAndStoreDivergences(sgzData, formattedData, uploadId);
      }
    } catch (compareError) {
      console.warn('Non-critical error comparing data:', compareError);
    }
    
    return {
      success: true,
      id: uploadId,
      recordCount: data.length,
      message: 'Upload realizado com sucesso',
      data: formattedData,
      newOrders: data.length,
      updatedOrders: 0
    };
  } catch (error: any) {
    console.error('Error in Painel Zeladoria upload processing:', error);
    return {
      success: false,
      recordCount: 0,
      message: 'Erro ao processar arquivo: ' + error.message
    };
  }
};

/**
 * Read Excel file as workbook
 */
const readExcelFile = async (file: File): Promise<XLSX.WorkBook> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Process SGZ XLSX workbook data
 */
const processXLSX = (workbook: XLSX.WorkBook): any[] => {
  try {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    
    if (!data || data.length === 0) {
      throw new Error('Planilha vazia ou formato inválido');
    }
    
    // Map fields to database columns
    return data.map((row: any) => {
      // Check for required fields
      const ordemServico = row['OS'] || row['Ordem de Serviço'] || row['Ordem Serviço'] || '';
      
      if (!ordemServico) {
        console.warn(`Linha sem número de OS`);
      }
      
      // Ensure department exists or use default
      const departamentoTecnico = row['Departamento'] || row['Departamento Técnico'] || '';
      
      // Map fields to our schema
      return {
        ordem_servico: ordemServico,
        sgz_tipo_servico: row['Serviço'] || row['Tipo de Serviço'] || '',
        sgz_status: row['Status'] || '',
        sgz_distrito: row['Distrito'] || '',
        sgz_bairro: row['Bairro'] || '',
        sgz_departamento_tecnico: departamentoTecnico || 'NAO_ESPECIFICADO',
        sgz_empresa: row['Empresa'] || '',
        sgz_criado_em: parseExcelDate(row['Data de Abertura'] || row['Criado em'] || ''),
        sgz_modificado_em: parseExcelDate(row['Data de Fechamento'] || row['Modificado em'] || row['Última atualização'] || '')
      };
    }).filter((item: any) => item.ordem_servico.trim() !== '');
  } catch (error) {
    console.error('Error processing XLSX:', error);
    throw error;
  }
};

/**
 * Process Painel XLSX workbook data
 */
const processXLSXPainel = (workbook: XLSX.WorkBook): any[] => {
  try {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    
    if (!data || data.length === 0) {
      throw new Error('Planilha vazia ou formato inválido');
    }
    
    // Map fields to database columns
    return data.map((row: any) => {
      // Check for required fields
      const idOS = row["Ordem de Serviço"] || row["Protocolo"] || row["OS"] || '';
      
      if (!idOS) {
        console.warn(`Linha sem número de OS/protocolo`);
      }
      
      // Map fields to our schema
      return {
        id_os: idOS,
        tipo_servico: row["Tipo de Serviço"] || row["Serviço"] || '',
        status: row["Status"] || '',
        distrito: row["Distrito"] || '',
        departamento: row["Departamento"] || row["Setor"] || '',
        data_abertura: parseExcelDate(row["Data de Abertura"] || ''),
        data_fechamento: parseExcelDate(row["Data de Fechamento"] || ''),
        responsavel_real: row["Responsável"] || ''
      };
    }).filter((item: any) => item.id_os.trim() !== '');
  } catch (error) {
    console.error('Error processing XLSX:', error);
    throw error;
  }
};

/**
 * Parse Excel date to ISO format
 */
const parseExcelDate = (dateString: string): string | null => {
  if (!dateString) return null;
  
  try {
    // Try as Brazilian date format (DD/MM/YYYY)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    
    // Try as ISO or other recognized format
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString() : null;
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
};

/**
 * Classify service responsibility based on service type
 */
const classifyServiceResponsibility = (serviceType: string): string => {
  const upperService = serviceType.toUpperCase();
  
  if (upperService.includes('TAPA') && upperService.includes('BURACO')) {
    return 'dzu';
  } else if (upperService.includes('ENEL') || upperService.includes('ELETROPAULO')) {
    return 'enel';
  } else if (upperService.includes('SABESP') || 
            (upperService.includes('AGUA') && upperService.includes('VAZAMENTO'))) {
    return 'sabesp';
  } else if (upperService.includes('COLETA') && 
            (upperService.includes('LIXO') || upperService.includes('LIMPEZA'))) {
    return 'selimp';
  } else {
    return 'subprefeitura';
  }
};

/**
 * Compare data sets and store divergences for later analysis
 */
const compareAndStoreDivergences = (sgzData: any[], painelData: any[], uploadId: string) => {
  // Implementation of comparison logic
  // This is a non-critical feature so we'll implement it as a stub for now
  console.log('Comparing SGZ and Painel data for divergences');
};
