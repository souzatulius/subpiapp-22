
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { useUploadState } from './useUploadState';
import { UploadResult, UploadProgressStats } from '@/hooks/ranking/types/uploadTypes';
import { useAnimatedFeedback } from '@/hooks/use-animated-feedback';

export const usePainelZeladoriaUpload = (user: User | null) => {
  const { 
    painelProgress, 
    setPainelProgress, 
    setIsUploading,
    setLastRefreshTime
  } = useUploadState();
  
  const { showFeedback, updateFeedbackProgress } = useAnimatedFeedback();

  const handleUploadPainel = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      showFeedback('error', 'Você precisa estar logado para fazer upload', { duration: 3000 });
      return null;
    }

    try {
      setIsUploading(true);
      setPainelProgress({
        totalRows: 0,
        processedRows: 0,
        updatedRows: 0,
        newRows: 0,
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
          message: 'Formato de arquivo inválido'
        });
        return null;
      }
      
      // Update progress
      updateProgress(10, 'uploading', 'Lendo arquivo...');
      
      // Ler e processar arquivo Excel
      const dadosPainel = await processarPlanilhaPainel(file);
      
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
      
      // Registrar o upload
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
          message: 'Erro ao registrar upload no banco de dados'
        });
        return null;
      }
      
      const uploadId = uploadData.id;
      updateProgress(50, 'processing', 'Salvando dados...', dadosPainel.length);
      updateFeedbackProgress(50, 'Salvando dados no banco...');
      
      // Inserir dados processados
      const { error: insertError } = await supabase
        .from('painel_zeladoria_dados')
        .insert(dadosPainel.map(item => ({
          ...item,
          upload_id: uploadId
        })));
        
      if (insertError) {
        console.error('Erro ao inserir dados:', insertError);
        showFeedback('error', 'Erro ao salvar dados no banco', { duration: 3000 });
        setPainelProgress({
          ...painelProgress!,
          stage: 'error',
          message: 'Erro ao inserir dados no banco'
        });
        return null;
      }
      
      updateProgress(100, 'complete', `${dadosPainel.length} registros processados com sucesso`, dadosPainel.length, dadosPainel.length);
      updateFeedbackProgress(100, 'Upload finalizado com sucesso');
      
      // Set last refresh time
      setLastRefreshTime(new Date());
      
      return {
        success: true,
        id: uploadId,
        recordCount: dadosPainel.length,
        message: 'Upload realizado com sucesso',
        data: dadosPainel
      };
    } catch (error) {
      console.error('Erro no processamento do upload:', error);
      showFeedback('error', 'Erro ao processar arquivo', { duration: 3000 });
      setPainelProgress({
        ...painelProgress!,
        stage: 'error',
        message: 'Erro ao processar arquivo'
      });
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao processar arquivo'
      };
    }
  }, [user, painelProgress, setPainelProgress, setIsUploading, setLastRefreshTime, showFeedback, updateFeedbackProgress]);

  const updateProgress = (
    progressValue: number,
    stage: 'uploading' | 'processing' | 'complete' | 'error',
    message: string,
    totalRows: number = 0,
    processedRows: number = 0
  ) => {
    setPainelProgress({
      stage,
      message,
      totalRows,
      processedRows,
      newRows: processedRows,
      updatedRows: 0,
    });
  };

  // Processamento da planilha
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
            const protocolField = row["Ordem de Serviço"] || row["Protocolo"] || "";
            
            if (!protocolField) {
              console.warn(`Linha ${index + 1}: Sem número de protocolo/OS`);
            }
            
            // Mapear campos e converter datas
            return {
              id_os: protocolField,
              tipo_servico: row["Tipo de Serviço"] || row["Serviço"] || "",
              status: row["Status"] || "",
              distrito: row["Distrito"] || "",
              departamento: row["Departamento"] || row["Setor"] || "",
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

  // Helper para converter datas do Excel
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
    uploadProgress: painelProgress?.stage === 'complete' ? 100 : painelProgress?.processedRows && painelProgress?.totalRows ? 
      Math.round((painelProgress.processedRows / painelProgress.totalRows) * 100) : 0,
    processamentoPainel: {
      status: painelProgress?.stage || 'uploading',
      message: painelProgress?.message || '',
      recordCount: painelProgress?.processedRows || 0
    },
    handleUploadPainel
  };
};
