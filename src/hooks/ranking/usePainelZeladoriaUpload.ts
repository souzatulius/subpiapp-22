import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { useUploadState } from './useUploadState';
import { UploadProgressStats, UploadResult } from '@/hooks/ranking/types/uploadTypes';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const usePainelZeladoriaUpload = (user: User | null) => {
  const { 
    painelProgress, 
    setPainelProgress,
    setLastRefreshTime
  } = useUploadState();
  
  const { showFeedback, updateFeedbackProgress } = useAnimatedFeedback();

  const handleUploadPainel = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      showFeedback('error', 'Você precisa estar logado para fazer upload', { duration: 3000 });
      return null;
    }

    try {
      setPainelProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
        totalRecords: 0,
        processed: 0,
        success: 0,
        failed: 0,
        progress: 0,
        stage: 'uploading',
        message: 'Iniciando upload do arquivo do Painel...'
      });
      
      showFeedback('loading', 'Iniciando upload do arquivo do Painel...', { 
        duration: 0,
        progress: 10,
        stage: 'Enviando'
      });
      
      // Verificar tipo de arquivo
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showFeedback('error', 'Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)', { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: 'Formato de arquivo inválido',
          totalRows: 0,
          processedRows: 0,
          updatedRows: 0,
          newRows: 0
        });
        return null;
      }
      
      // Update progress
      updateProgress(10, 'uploading', 'Lendo arquivo...');
      
      // Ler e processar arquivo Excel
      let dadosPainel;
      try {
        dadosPainel = await processarPlanilhaPainel(file);
        
        // Verificar se os dados foram processados corretamente
        if (!dadosPainel || dadosPainel.length === 0) {
          showFeedback('error', 'Não foi possível processar os dados do arquivo', { duration: 3000 });
          setPainelProgress({
            ...painelProgress!,
            stage: 'error',
            message: 'Falha ao processar dados'
          });
          return null;
        }
        
        updateProgress(30, 'processing', 'Validando dados...', dadosPainel.length);
        updateFeedbackProgress(30, 'Validando dados...');
      } catch (error) {
        console.error('Erro ao processar planilha:', error);
        showFeedback('error', 'Erro ao processar o arquivo Excel', { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: 'Erro ao processar o arquivo Excel'
        });
        return null;
      }
      
      updateProgress(50, 'processing', 'Enviando dados para processamento...', dadosPainel.length);
      updateFeedbackProgress(50, 'Enviando dados para processamento...');
      
      // Usar nossa Edge Function para fazer o upload com transação
      let responseData;
      let responseError;
      
      try {
        // Initial request with detailed error logging
        console.log('Enviando dados para Edge Function:', {
          email: user.email,
          fileName: file.name,
          recordCount: dadosPainel.length
        });
        
        const initialResponse = await supabase.functions.invoke("create_painel_upload_with_data", {
          body: {
            p_usuario_email: user.email,
            p_nome_arquivo: file.name,
            p_dados: dadosPainel
          }
        });
        
        // Log detailed response information
        console.log('Edge Function response:', {
          data: initialResponse.data,
          error: initialResponse.error
        });
        
        responseData = initialResponse.data;
        responseError = initialResponse.error;
        
        // If we got an error response but no error object, try to extract more details
        if (!responseData && !responseError) {
          console.error('Edge function returned no data or error object');
          
          responseError = {
            message: `Error: Unknown error with edge function`
          };
        }
      } catch (err: any) {
        console.error('Exception during function invocation:', err);
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: err.cause
        });
        
        showFeedback('error', `Erro na chamada: ${err.message || 'Erro desconhecido'}`, { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: `Erro na chamada: ${err.message || 'Erro desconhecido'}`
        });
        return null;
      }

      if (responseError) {
        console.error('Erro na função de upload:', responseError);
        // Check if the error is related to duplicate file
        if (responseError.message && responseError.message.includes('já foi carregado')) {
          // Use a modified filename to force uniqueness
          const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
          const ext = file.name.lastIndexOf('.') > 0 
            ? file.name.substring(file.name.lastIndexOf('.'))
            : '';
          const baseName = file.name.lastIndexOf('.') > 0
            ? file.name.substring(0, file.name.lastIndexOf('.'))
            : file.name;
          
          const uniqueFileName = `${baseName}_${timestamp}${ext}`;
          
          console.log('Retrying with unique filename:', uniqueFileName);
          showFeedback('loading', 'Arquivo já existe, tentando com nome único...', { duration: 1500 });
          
          try {
            // Retry with unique filename
            const retryResponse = await supabase.functions.invoke("create_painel_upload_with_data", {
              body: {
                p_usuario_email: user.email,
                p_nome_arquivo: uniqueFileName,
                p_dados: dadosPainel
              }
            });
            
            console.log('Retry response:', {
              data: retryResponse.data,
              error: retryResponse.error
            });
            
            if (retryResponse.error) {
              throw new Error(retryResponse.error.message || 'Erro desconhecido');
            }
            
            // Use the retry data
            responseData = retryResponse.data;
            responseError = null;
          } catch (retryErr: any) {
            console.error('Error on retry:', retryErr);
            showFeedback('error', `Erro ao processar upload: ${retryErr.message || 'Erro desconhecido'}`, { duration: 3000 });
            setPainelProgress({
              ...painelProgress!,
              stage: 'error',
              message: `Erro ao processar upload: ${retryErr.message || 'Erro desconhecido'}`
            });
            return null;
          }
        } else {
          // For other errors, check if it's related to department constraint
          if (responseError.message && responseError.message.includes('violates foreign key constraint')) {
            showFeedback('error', 'Erro: Alguns departamentos no arquivo não existem no sistema. Por favor, verifique os dados.', { duration: 5000 });
          } else {
            // For other errors, just show the error
            showFeedback('error', `Erro ao processar upload: ${responseError.message || 'Erro desconhecido'}`, { duration: 3000 });
          }
          
          setPainelProgress({
            ...painelProgress!,
            stage: 'error',
            message: `Erro ao processar upload: ${responseError.message || 'Erro desconhecido'}`
          });
          return null;
        }
      }
      
      if (!responseData || responseData.error) {
        const errorMsg = responseData?.error || 'Erro desconhecido no servidor';
        console.error('Erro retornado pela função:', errorMsg);
        showFeedback('error', `Erro no servidor: ${errorMsg}`, { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: `Erro no servidor: ${errorMsg}`
        });
        return null;
      }
      
      const uploadId = responseData.id;
      const recordCount = responseData.record_count || dadosPainel.length;
      
      updateProgress(100, 'complete', `${recordCount} registros processados com sucesso`, recordCount, recordCount);
      updateFeedbackProgress(100, 'Upload finalizado com sucesso');
      
      // Set data source to upload explicitly
      localStorage.setItem('demo-data-source', 'upload');
      localStorage.setItem('demo-painel-data', JSON.stringify(dadosPainel));
      localStorage.setItem('demo-last-update', new Date().toISOString());
      
      // Set last refresh time
      setLastRefreshTime(new Date());
      
      return {
        success: true,
        id: uploadId,
        recordCount: recordCount,
        message: 'Upload realizado com sucesso',
        data: dadosPainel
      };
    } catch (error: any) {
      console.error('Erro no processamento do upload:', error);
      showFeedback('error', `Erro ao processar arquivo: ${error.message || 'Erro desconhecido'}`, { duration: 3000 });
      setPainelProgress({
        ...painelProgress!,
        stage: 'error',
        message: `Erro ao processar arquivo: ${error.message || 'Erro desconhecido'}`,
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0
      });
      
      return {
        success: false,
        recordCount: 0,
        message: `Erro ao processar arquivo: ${error.message || 'Erro desconhecido'}`
      };
    }
  }, [user, painelProgress, setPainelProgress, setLastRefreshTime, showFeedback, updateFeedbackProgress]);

  const updateProgress = (
    progressValue: number,
    stage: 'uploading' | 'processing' | 'complete' | 'error',
    message: string,
    totalRecords: number = 0,
    processed: number = 0
  ) => {
    setPainelProgress({
      stage,
      message,
      totalRows: totalRecords,
      processedRows: processed,
      updatedRows: 0,
      newRows: 0,
      totalRecords,
      processed,
      success: processed,
      failed: 0,
      progress: progressValue,
    });
  };

  const processarPlanilhaPainel = async (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Converter para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          
          if (!jsonData || jsonData.length === 0) {
            reject(new Error('Planilha vazia ou com formato inválido'));
            return;
          }
          
          // Validar e mapear campos
          const dadosFormatados = jsonData.map((row: any, index: number) => {
            // Verificar existência de campos obrigatórios
            // NOTE: Using "Ordem de Serviço" as the protocol field
            const protocolField = row["Ordem de Serviço"] || row["Protocolo"] || row["OS"] || "";
            
            if (!protocolField) {
              console.warn(`Linha ${index + 1}: Sem número de protocolo/OS`);
            }
            
            // Get department and ensure it's not empty
            let departamento = row["Departamento"] || row["Setor"] || "";
            
            // If department is empty, assign a default value
            if (!departamento) {
              departamento = "NAO_ESPECIFICADO";
            }
            
            // Mapear campos e converter datas
            return {
              id_os: protocolField,
              tipo_servico: row["Tipo de Serviço"] || row["Serviço"] || "",
              status: row["Status"] || "",
              distrito: row["Distrito"] || "",
              departamento: departamento,
              data_abertura: parseExcelDate(row["Data de Abertura"] || ""),
              data_fechamento: parseExcelDate(row["Data de Fechamento"] || ""),
              responsavel_real: row["Responsável"] || ""
            };
          });
          
          resolve(dadosFormatados.filter((item: any) => item.id_os));
        } catch (error) {
          console.error("Erro ao processar a planilha:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const parseExcelDate = (dateString: string) => {
    if (!dateString) return null;
    
    try {
      // Tentar converter primeiro como data brasileira (DD/MM/YYYY)
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`).toISOString();
      }
      
      // Caso contrário, tentar como ISO ou outro formato reconhecido
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.toISOString() : null;
    } catch (error) {
      console.error("Erro ao converter data:", error);
      return null;
    }
  };

  return {
    isLoading: !!painelProgress && ['uploading', 'processing'].includes(painelProgress.stage),
    uploadProgress: painelProgress?.progress || 0,
    processamentoPainel: {
      status: painelProgress?.stage || 'uploading',
      message: painelProgress?.message || '',
      recordCount: painelProgress?.processedRows || 0
    },
    handleUploadPainel
  };
};
