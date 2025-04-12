import { supabase } from '@/integrations/supabase/client';
import { UploadResult, UploadProgressStats } from '../types/uploadTypes';
import { 
  processExcelFile, 
  mapExcelRowToSGZOrdem,
  ValidationError
} from '../utils/excelUtils';

// Type for progress update callbacks
type ProgressCallback = (progress: number) => void;
type StatsCallback = (stats: any) => void;

/**
 * Process SGZ file upload with improved validation and error handling
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
    const { data, errors, stats } = processingResult;
    
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
    
    // Format data for insertion
    const formattedData = data.map(item => mapExcelRowToSGZOrdem(item, uploadId));
    
    // Insert data in batches to prevent oversized payload
    const batchSize = 100;
    let insertedCount = 0;
    let insertErrors = 0;
    
    for (let i = 0; i < formattedData.length; i += batchSize) {
      const batch = formattedData.slice(i, i + batchSize);
      // Insert data
      const { error: insertError, data: insertedData } = await supabase
        .from('sgz_ordens_servico')
        .insert(batch)
        .select();
        
      if (insertError) {
        console.error('Error inserting data batch:', insertError);
        insertErrors++;
        
        if (insertError.message.includes('violates foreign key constraint')) {
          return {
            success: false,
            recordCount: insertedCount,
            message: 'Erro com os departamentos técnicos. Verifique se todos os departamentos existem no sistema.',
            errors: [...errors, {
              row: -1,
              column: 'sgz_departamento_tecnico',
              message: insertError.message
            }]
          };
        }
      } else {
        insertedCount += batch.length;
      }
      
      // Update progress during batch processing
      const progressPercent = 60 + Math.floor((i / formattedData.length) * 40);
      onProgress?.(progressPercent);
      onStatsUpdate?.({
        totalRows: data.length,
        processedRows: i + batch.length,
        errorCount: stats.errorCount + insertErrors,
        processingStatus: 'processing',
        message: `Processando registros (${i + batch.length} de ${data.length})`,
      });
    }
    
    // Final progress update
    onProgress?.(100);
    onStatsUpdate?.({
      totalRows: data.length,
      processedRows: insertedCount,
      errorCount: stats.errorCount + insertErrors,
      processingStatus: 'success',
      message: `${insertedCount} registros processados com sucesso. ${stats.errorCount} erros.`,
    });
    
    return {
      success: true,
      id: uploadId,
      recordCount: insertedCount,
      message: stats.errorCount > 0 
        ? `Upload realizado com ${insertedCount} registros. ${stats.errorCount} erros ignorados.`
        : 'Upload realizado com sucesso',
      data: formattedData,
      newOrders: insertedCount,
      updatedOrders: 0,
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
