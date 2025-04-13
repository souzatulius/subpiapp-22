
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
      
      // IMPROVED: Check for existing records by ID_OS to handle updates
      const existingIds = new Map();
      let updateCount = 0;
      let insertCount = 0;
      
      // Try to get existing records from database or localStorage for demo
      try {
        const idsList = dadosPainel.map(item => item.id_os).filter(Boolean);
        
        if (idsList.length > 0) {
          // Check database first
          const { data: existingItems } = await supabase
            .from('painel_zeladoria_dados')
            .select('id_os, id')
            .in('id_os', idsList);
          
          if (existingItems && existingItems.length > 0) {
            existingItems.forEach(item => {
              existingIds.set(item.id_os, item.id);
            });
            console.log(`Found ${existingItems.length} existing items in database`);
          } else {
            // Check localStorage as fallback for demo
            try {
              const storedData = localStorage.getItem('demo-painel-data');
              if (storedData) {
                const parsedData = JSON.parse(storedData);
                parsedData.forEach((item: any, index: number) => {
                  if (item.id_os && idsList.includes(item.id_os)) {
                    existingIds.set(item.id_os, index);
                  }
                });
                console.log(`Found ${existingIds.size} existing items in localStorage`);
              }
            } catch (parseError) {
              console.error('Error parsing stored data:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error checking existing records:', error);
      }
      
      updateProgress(60, 'processing', 'Processando registros...', dadosPainel.length, 0);
      
      // Register the upload
      const { data: uploadData, error: uploadError } = await supabase
        .from('painel_zeladoria_uploads')
        .insert({
          usuario_email: user.email,
          nome_arquivo: file.name
        })
        .select('id')
        .single();

      if (uploadError) {
        console.error('Erro ao registrar upload:', uploadError);
        showFeedback('error', 'Erro ao registrar upload', { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: 'Erro ao registrar upload'
        });
        return null;
      }
      
      const uploadId = uploadData.id;
      updateProgress(70, 'processing', 'Processando registros...', dadosPainel.length, dadosPainel.length * 0.3);
      
      // Prepare data for insertion with upload_id
      const dadosComUpload = dadosPainel.map(item => ({
        ...item,
        upload_id: uploadId
      }));
      
      // Process records with update or insert
      for (let i = 0; i < dadosComUpload.length; i++) {
        const item = dadosComUpload[i];
        let success = false;
        
        if (existingIds.has(item.id_os)) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('painel_zeladoria_dados')
            .update(item)
            .eq('id', existingIds.get(item.id_os));
          
          if (!updateError) {
            updateCount++;
            success = true;
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('painel_zeladoria_dados')
            .insert([item]);
            
          if (!insertError) {
            insertCount++;
            success = true;
          }
        }
        
        // Update progress during processing
        if (i % 10 === 0 || i === dadosComUpload.length - 1) {
          const progress = 70 + Math.floor((i / dadosComUpload.length) * 30);
          updateProgress(
            progress, 
            'processing', 
            `Processando registros (${i+1} de ${dadosComUpload.length})...`, 
            dadosComUpload.length, 
            i + 1
          );
          updateFeedbackProgress(progress, `Processando registros (${i+1} de ${dadosComUpload.length})...`);
        }
      }
      
      // Save to localStorage for demo persistence
      try {
        let existingData = [];
        try {
          const storedData = localStorage.getItem('demo-painel-data');
          if (storedData) {
            existingData = JSON.parse(storedData);
            
            // Remove duplicates before merging
            const newIds = new Set(dadosPainel.map(item => item.id_os));
            existingData = existingData.filter((item: any) => !newIds.has(item.id_os));
          }
        } catch (error) {
          console.error('Error parsing stored data:', error);
          existingData = [];
        }
        
        // Merge and save
        localStorage.setItem('demo-painel-data', JSON.stringify([...existingData, ...dadosPainel]));
        localStorage.setItem('demo-last-update', new Date().toISOString());
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
      }
      
      updateProgress(100, 'complete', `${insertCount} novos registros e ${updateCount} atualizações processados com sucesso`, dadosPainel.length, dadosPainel.length);
      updateFeedbackProgress(100, 'Upload finalizado com sucesso');
      
      // Set data source to upload explicitly
      localStorage.setItem('demo-data-source', 'upload');
      
      // Set last refresh time
      setLastRefreshTime(new Date());
      
      return {
        success: true,
        id: uploadId,
        recordCount: insertCount + updateCount,
        message: `Upload realizado com sucesso: ${insertCount} novos registros e ${updateCount} atualizações`,
        data: dadosPainel,
        newOrders: insertCount,
        updatedOrders: updateCount
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
      newRows: processed,
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
