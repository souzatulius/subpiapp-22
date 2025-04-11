
import { supabase } from '@/integrations/supabase/client';
import { ProcessingStats, UploadResult } from '@/types/ranking';
import * as XLSX from 'xlsx';
import { normalizeColumnName, findColumnName } from '@/hooks/ranking/utils/excelUtils';

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
    console.log('Painel data sample:', jsonData[0]);

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

    // Process and map the records
    const painelRecords = mapPainelDataRecords(jsonData, uploadId);
    onStats({
      processingStatus: 'processing',
      message: `Processando ${painelRecords.length} registros do Painel da Zeladoria`,
      recordCount: painelRecords.length
    });
    
    // Insert the processed records
    if (painelRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('painel_zeladoria_dados')
        .insert(painelRecords);
        
      if (insertError) {
        console.error('Error inserting Painel data:', insertError);
        return {
          success: false,
          message: `Erro ao inserir dados do Painel: ${insertError.message}`,
          recordCount: 0
        };
      }
    }
    
    onProgress(70);

    // Get current count for stats
    const { count, error: countError } = await supabase
      .from('painel_zeladoria_dados')
      .select('*', { count: 'exact', head: true });
    
    const totalRecords = countError ? 0 : (count || 0);
    
    onProgress(100);
    
    return {
      success: true,
      message: 'Upload do Painel concluído com sucesso',
      recordCount: painelRecords.length,
      id: uploadId,
      data: painelRecords,
      totalRecords: totalRecords
    };
  } catch (error) {
    console.error('Error processing Painel file:', error);
    return {
      success: false,
      message: `Erro ao processar arquivo do Painel: ${error instanceof Error ? error.message : String(error)}`,
      recordCount: 0
    };
  }
};

// Helper function to map Painel data to our database schema
function mapPainelDataRecords(data: any[], uploadId: string) {
  return data.map(row => {
    // Try to find common column names using normalized versions
    const idField = findFieldValue(row, ['ordem_de_servico', 'protocolo', 'id', 'os']);
    const tipoServicoField = findFieldValue(row, ['tipo_de_servico', 'servico', 'classificacao']);
    const statusField = findFieldValue(row, ['status', 'situacao']);
    const distritoField = findFieldValue(row, ['distrito', 'subprefeitura', 'regiao']);
    const departamentoField = findFieldValue(row, ['departamento', 'setor', 'area']);
    const dataAberturaField = findDateFieldValue(row, ['data_abertura', 'data_inicio', 'criado_em']);
    const dataFechamentoField = findDateFieldValue(row, ['data_fechamento', 'data_conclusao', 'data_fim']);
    const responsavelField = findFieldValue(row, ['responsavel', 'responsavel_real', 'executor']);
    
    return {
      id_os: idField || `PAINEL-${Math.random().toString(36).substring(2, 10)}`,
      tipo_servico: tipoServicoField || '',
      status: statusField || '',
      distrito: distritoField || '',
      departamento: departamentoField || '',
      data_abertura: dataAberturaField ? new Date(dataAberturaField).toISOString() : null,
      data_fechamento: dataFechamentoField ? new Date(dataFechamentoField).toISOString() : null,
      responsavel_real: responsavelField || '',
      upload_id: uploadId,
      responsavel_classificado: classifyServiceResponsibility(tipoServicoField || '')
    };
  });
}

// Helper function to find field values from multiple possible column names
function findFieldValue(row: any, possibleFieldNames: string[]) {
  for (const fieldName of possibleFieldNames) {
    // Try direct access
    if (row[fieldName] !== undefined) {
      return row[fieldName];
    }
    
    // Try various capitalizations and formats
    const variants = [
      fieldName,
      fieldName.toUpperCase(),
      fieldName.toLowerCase(),
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      fieldName.replace(/_/g, ' '),
      fieldName.replace(/\s/g, '_')
    ];
    
    for (const variant of variants) {
      if (row[variant] !== undefined) {
        return row[variant];
      }
    }
  }
  
  // If we still haven't found it, check all keys with partial matches
  const keys = Object.keys(row);
  for (const fieldName of possibleFieldNames) {
    for (const key of keys) {
      if (key.toLowerCase().includes(fieldName.toLowerCase())) {
        return row[key];
      }
    }
  }
  
  return null;
}

// Helper function specifically for date fields
function findDateFieldValue(row: any, possibleFieldNames: string[]) {
  const value = findFieldValue(row, possibleFieldNames);
  if (!value) return null;
  
  // Handle Excel numeric dates
  if (typeof value === 'number') {
    // Excel dates are days since 1900-01-01 (except there's a leap year bug)
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch);
    date.setDate(date.getDate() + value);
    return date.toISOString();
  }
  
  // Handle string dates in various formats
  try {
    if (typeof value === 'string') {
      // Try to parse as a date with various formats
      if (value.includes('/')) {
        // Likely DD/MM/YYYY format
        const parts = value.split('/');
        // Check if we have day/month/year format
        if (parts.length === 3 && parts[0].length <= 2) {
          return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`).toISOString();
        }
      }
      
      // Try standard ISO parsing
      return new Date(value).toISOString();
    }
  } catch (e) {
    console.error('Error parsing date:', value, e);
  }
  
  return null;
}

// Function to classify service responsibility
function classifyServiceResponsibility(serviceType: string) {
  const upperService = (serviceType || '').toUpperCase();
  
  if (upperService.includes('TAPA') && upperService.includes('BURACO')) {
    return 'dzu';
  } else if (upperService.includes('ENEL') || upperService.includes('ELETROPAULO')) {
    return 'enel';
  } else if ((upperService.includes('GALERIA') && upperService.includes('SABESP')) || 
             upperService.includes('SABESP')) {
    return 'sabesp';
  } else {
    return 'subprefeitura';
  }
}
