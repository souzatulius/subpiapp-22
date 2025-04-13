
import { supabase } from '@/integrations/supabase/client';
import { UploadResult, UploadProgressStats, ValidationError } from '../types/uploadTypes';
import { 
  processExcelFile, 
  mapExcelRowToSGZOrdem
} from '../utils/excelUtils';

// Type for progress update callbacks
type ProgressCallback = (progress: number) => void;
type StatsCallback = (stats: any) => void;

/**
 * Process SGZ file upload with improved validation, error handling, and incremental updates
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
    
    // Process Excel file with validation
    const processingResult = await processExcelFile(file);
    const { data, errors: rawErrors, stats } = processingResult;
    
    // Convert errors to the correct ValidationError type
    const errors: ValidationError[] = rawErrors.map(error => ({
      ...error,
      type: 'error' // Set default type to 'error'
    }));
    
    // Update progress after processing file
    onProgress?.(40);
    onStatsUpdate?.({
      totalRows: stats.totalRows,
      validRows: stats.validRows,
      skippedRows: stats.skippedRows,
      errorCount: stats.errorCount,
      processingStatus: 'processing',
      message: `Analisando ${stats.validRows} registros válidos...`
    });
    
    if (stats.errorCount > 0) {
      console.warn(`Encontrados ${stats.errorCount} erros em ${stats.skippedRows} linhas`);
      const errorSummary = summarizeErrors(errors);
      console.warn('Resumo de erros:', errorSummary);
    }
    
    if (!data || data.length === 0) {
      return {
        success: false,
        recordCount: 0,
        message: stats.errorCount > 0 
          ? `Nenhum dado válido encontrado. ${stats.errorCount} erros.` 
          : 'Não foi possível processar dados do arquivo',
        errors: errors
      };
    }
    
    // Update progress
    onProgress?.(50);
    onStatsUpdate?.({
      totalRows: data.length,
      processingStatus: 'processing',
      message: `Processando ${data.length} registros válidos...`,
      errorCount: stats.errorCount
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
        errors: errors
      };
    }
    
    const uploadId = uploadData.id;
    onProgress?.(60);
    
    // Ensure all departments exist in the database before inserting data
    for (const item of data) {
      if (item.sgz_departamento_tecnico && item.sgz_departamento_tecnico !== '') {
        try {
          // Use the existing ensure_sgz_department_exists function to create the department if it doesn't exist
          await supabase.rpc('ensure_sgz_department_exists', {
            department_name: item.sgz_departamento_tecnico
          });
        } catch (deptError) {
          console.warn('Department registration error:', deptError);
          // If this fails, set a default department
          item.sgz_departamento_tecnico = 'NAO_ESPECIFICADO';
        }
      } else {
        // Default department for empty values
        item.sgz_departamento_tecnico = 'NAO_ESPECIFICADO';
      }
    }
    
    // Format data for insertion and update
    const formattedData = data.map(item => mapExcelRowToSGZOrdem(item, uploadId));
    
    // Check for existing records to decide between update and insert
    let existingRecords = new Map();
    let insertCount = 0;
    let updateCount = 0;
    let insertErrors = 0;
    
    // First, query for existing records by protocol
    const protocolsList = formattedData.map(item => item.protocolo).filter(Boolean);
    
    if (protocolsList.length > 0) {
      // Split into batches to avoid query parameter limits
      const batchSize = 100;
      for (let i = 0; i < protocolsList.length; i += batchSize) {
        const batchProtocols = protocolsList.slice(i, i + batchSize);
        
        const { data: existingItems } = await supabase
          .from('sgz_ordens_servico')
          .select('protocolo, id')
          .in('protocolo', batchProtocols);
        
        if (existingItems) {
          existingItems.forEach(item => {
            existingRecords.set(item.protocolo, item.id);
          });
        }
      }
    }
    
    console.log(`Found ${existingRecords.size} existing records out of ${formattedData.length} total`);
    
    // Separate into records to update and records to insert
    const recordsToInsert = [];
    const recordsToUpdate = [];
    
    formattedData.forEach(item => {
      if (existingRecords.has(item.protocolo)) {
        // For update
        recordsToUpdate.push({
          id: existingRecords.get(item.protocolo),
          ...item,
          updated_at: new Date().toISOString()
        });
      } else {
        // For insert
        recordsToInsert.push(item);
      }
    });
    
    // Process updates first
    const updateBatchSize = 50;
    for (let i = 0; i < recordsToUpdate.length; i += updateBatchSize) {
      const batch = recordsToUpdate.slice(i, i + updateBatchSize);
      
      for (const record of batch) {
        const { error: updateError } = await supabase
          .from('sgz_ordens_servico')
          .update(record)
          .eq('id', record.id);
        
        if (updateError) {
          console.error(`Error updating record ${record.protocolo}:`, updateError);
          insertErrors++;
        } else {
          updateCount++;
        }
      }
      
      // Update progress during processing
      const progressPercent = 60 + Math.floor((i / recordsToUpdate.length) * 20);
      onProgress?.(progressPercent);
      onStatsUpdate?.({
        totalRows: formattedData.length,
        processedRows: i + updateCount,
        updatedRows: updateCount,
        newRows: insertCount,
        errorCount: stats.errorCount + insertErrors,
        processingStatus: 'processing',
        message: `Atualizando registros... (${i + batch.length} de ${recordsToUpdate.length})`,
      });
    }
    
    // Insert new records
    const insertBatchSize = 100;
    for (let i = 0; i < recordsToInsert.length; i += insertBatchSize) {
      const batch = recordsToInsert.slice(i, i + insertBatchSize);
      
      const { error: insertError } = await supabase
        .from('sgz_ordens_servico')
        .insert(batch);
        
      if (insertError) {
        console.error('Error inserting data batch:', insertError);
        insertErrors++;
        
        if (insertError.message.includes('violates foreign key constraint')) {
          return {
            success: false,
            recordCount: insertCount + updateCount,
            message: 'Erro com os departamentos técnicos. Verifique se todos os departamentos existem no sistema.',
            errors: [...errors, {
              row: -1,
              column: 'sgz_departamento_tecnico',
              message: insertError.message,
              type: 'error'
            }]
          };
        }
      } else {
        insertCount += batch.length;
      }
      
      // Update progress during batch processing
      const progressPercent = 80 + Math.floor((i / recordsToInsert.length) * 20);
      onProgress?.(progressPercent);
      onStatsUpdate?.({
        totalRows: formattedData.length,
        processedRows: updateCount + i + batch.length,
        updatedRows: updateCount,
        newRows: insertCount,
        errorCount: stats.errorCount + insertErrors,
        processingStatus: 'processing',
        message: `Processando novos registros (${i + batch.length} de ${recordsToInsert.length})`,
      });
    }
    
    // Final progress update
    onProgress?.(100);
    onStatsUpdate?.({
      totalRows: formattedData.length,
      processedRows: insertCount + updateCount,
      updatedRows: updateCount,
      newRows: insertCount,
      errorCount: stats.errorCount + insertErrors,
      processingStatus: 'success',
      message: `${insertCount} novos registros e ${updateCount} atualizações processados com sucesso.`,
    });
    
    // Save the processed data to localStorage for persistence
    try {
      // Merge with existing data if available
      let existingData = [];
      try {
        const storedData = localStorage.getItem('demo-sgz-data');
        if (storedData) {
          existingData = JSON.parse(storedData);
          
          // Remove duplicates by protocol
          const uniqueProtocols = new Set(formattedData.map(item => item.protocolo));
          existingData = existingData.filter(item => !uniqueProtocols.has(item.protocolo));
        }
      } catch (parseError) {
        console.warn('Error parsing stored data:', parseError);
        existingData = [];
      }
      
      // Merge and save
      const mergedData = [...existingData, ...formattedData];
      localStorage.setItem('demo-sgz-data', JSON.stringify(mergedData));
      localStorage.setItem('demo-last-update', new Date().toISOString());
    } catch (storageError) {
      console.warn('Failed to save data to localStorage:', storageError);
    }
    
    return {
      success: true,
      id: uploadId,
      recordCount: insertCount + updateCount,
      message: stats.errorCount > 0 
        ? `Upload realizado com ${insertCount} novos registros e ${updateCount} atualizações. ${stats.errorCount} erros ignorados.`
        : `Upload realizado com sucesso: ${insertCount} novos registros e ${updateCount} atualizações.`,
      data: formattedData,
      newOrders: insertCount,
      updatedOrders: updateCount,
      errors: errors
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
 * Summarize validation errors into categories
 */
function summarizeErrors(errors: ValidationError[]): Record<string, number> {
  const summary: Record<string, number> = {};
  
  errors.forEach(error => {
    const category = `${error.column}: ${error.message}`;
    summary[category] = (summary[category] || 0) + 1;
  });
  
  return summary;
}

// Export the hook instead of a non-existent function
export { usePainelZeladoriaUpload } from '@/hooks/ranking/usePainelZeladoriaUpload';
