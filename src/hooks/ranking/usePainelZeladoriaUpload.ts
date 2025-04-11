
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { UploadResult } from '@/hooks/ranking/types/uploadTypes';
import { UploadProgressStats } from '@/components/ranking/types';

export const usePainelZeladoriaUpload = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState<UploadProgressStats>({
    processedRows: 0,
    totalRows: 0,
    newRows: 0,
    updatedRows: 0,
    stage: 'idle',
  });

  // Função para atualizar o progresso com mais detalhes e simulação de tempo restante
  const updateProgress = useCallback((stage: UploadProgressStats['stage'], data: Partial<UploadProgressStats>) => {
    setUploadStats(prev => {
      const newStats = {
        ...prev,
        ...data,
        stage
      };
      
      // Calcular estimativa de tempo restante para processos longos
      if (stage === 'processing' && newStats.processedRows > 0 && newStats.totalRows > 0) {
        const percentComplete = newStats.processedRows / newStats.totalRows;
        if (percentComplete < 0.99) {
          const remainingRows = newStats.totalRows - newStats.processedRows;
          const processingRate = 0.05; // segundos por linha (ajustar conforme performance real)
          const secondsRemaining = Math.ceil(remainingRows * processingRate);
          
          if (secondsRemaining < 60) {
            newStats.estimatedTimeRemaining = `${secondsRemaining} segundos`;
          } else if (secondsRemaining < 3600) {
            const minutes = Math.floor(secondsRemaining / 60);
            newStats.estimatedTimeRemaining = `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
          } else {
            const hours = Math.floor(secondsRemaining / 3600);
            const minutes = Math.floor((secondsRemaining % 3600) / 60);
            newStats.estimatedTimeRemaining = `${hours}h${minutes}min`;
          }
        } else {
          newStats.estimatedTimeRemaining = 'Finalizando...';
        }
      }
      
      return newStats;
    });
  }, []);

  const handleUploadPainel = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return null;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);
      
      // Inicializar estatísticas de upload
      updateProgress('uploading', {
        processedRows: 0,
        totalRows: 0,
        newRows: 0,
        updatedRows: 0,
        message: 'Iniciando upload do arquivo...'
      });
      
      // Verificar tipo de arquivo
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
        updateProgress('error', {
          message: 'Formato de arquivo inválido'
        });
        setIsLoading(false);
        setUploadProgress(0);
        return null;
      }
      
      // Ler e processar arquivo Excel com progress updates
      const dadosPainel = await new Promise<any[]>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            updateProgress('processing', {
              message: 'Processando planilha...'
            });
            
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
            
            updateProgress('processing', {
              totalRows: jsonData.length,
              message: `Processando ${jsonData.length} registros...`
            });
            
            // Processar em batches para atualizar o progresso
            const batchSize = 50;
            const dadosFormatados: any[] = [];
            
            for (let i = 0; i < jsonData.length; i += batchSize) {
              const batch = jsonData.slice(i, i + batchSize);
              
              // Processar batch
              batch.forEach((row: any, index: number) => {
                const protocolField = row["Ordem de Serviço"] || row["Protocolo"] || "";
                
                if (!protocolField) {
                  console.warn(`Linha ${i + index + 1}: Sem número de protocolo/OS`);
                }
                
                // Mapear campos e converter datas
                dadosFormatados.push({
                  id_os: protocolField,
                  tipo_servico: row["Tipo de Serviço"] || row["Serviço"] || "",
                  status: row["Status"] || "",
                  distrito: row["Distrito"] || "",
                  departamento: row["Departamento"] || row["Setor"] || "",
                  data_abertura: parseExcelDate(row["Data de Abertura"] || ""),
                  data_fechamento: parseExcelDate(row["Data de Fechamento"] || ""),
                  responsavel_real: row["Responsável"] || ""
                });
              });
              
              // Atualizar progresso
              updateProgress('processing', {
                processedRows: Math.min(i + batchSize, jsonData.length),
                message: `Processando registros ${i + 1}-${Math.min(i + batchSize, jsonData.length)} de ${jsonData.length}...`
              });
              
              // Simular um pequeno atraso para visualizar o progresso em arquivos pequenos
              if (jsonData.length < 200) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
            
            updateProgress('processing', {
              processedRows: jsonData.length,
              newRows: dadosFormatados.filter(d => d.id_os).length,
              message: 'Processamento da planilha concluído.'
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
      
      if (!dadosPainel || dadosPainel.length === 0) {
        updateProgress('error', {
          message: 'Não foi possível processar os dados do arquivo'
        });
        toast.error('Não foi possível processar os dados do arquivo');
        setIsLoading(false);
        setUploadProgress(0);
        return null;
      }
      
      updateProgress('processing', {
        message: 'Enviando dados para o servidor...',
        processedRows: 0,
        totalRows: dadosPainel.length
      });
      
      setUploadProgress(50);
      
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
        updateProgress('error', {
          message: 'Erro ao registrar upload no servidor'
        });
        toast.error('Erro ao registrar upload');
        setIsLoading(false);
        setUploadProgress(0);
        return null;
      }
      
      const uploadId = uploadData.id;
      setUploadProgress(70);
      
      // Inserir dados em batches para atualizar o progresso
      const batchSize = 100;
      let processedCount = 0;
      let errorOccurred = false;
      
      for (let i = 0; i < dadosPainel.length; i += batchSize) {
        const batch = dadosPainel.slice(i, i + batchSize).map(item => ({
          ...item,
          upload_id: uploadId
        }));
        
        const { error: batchError } = await supabase
          .from('painel_zeladoria_dados')
          .insert(batch);
          
        if (batchError) {
          console.error('Erro ao inserir batch de dados:', batchError);
          errorOccurred = true;
        } else {
          processedCount += batch.length;
        }
        
        // Atualizar progresso
        updateProgress('processing', {
          processedRows: processedCount,
          message: `Salvando registros ${processedCount} de ${dadosPainel.length}...`
        });
      }
      
      if (errorOccurred) {
        updateProgress('complete', {
          message: `Upload parcial: ${processedCount} de ${dadosPainel.length} registros salvos`
        });
        toast.warning(`Upload parcial: ${processedCount} de ${dadosPainel.length} registros salvos`);
      } else {
        updateProgress('complete', {
          processedRows: dadosPainel.length,
          totalRows: dadosPainel.length,
          newRows: dadosPainel.length,
          message: `${dadosPainel.length} registros processados com sucesso`
        });
        toast.success(`Upload concluído: ${dadosPainel.length} registros processados`);
      }
      
      setUploadProgress(100);
      
      return {
        success: !errorOccurred,
        id: uploadId,
        recordCount: processedCount,
        data: dadosPainel,
        message: errorOccurred 
          ? `Upload parcial: ${processedCount} de ${dadosPainel.length} registros salvos` 
          : 'Upload realizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro no processamento do upload:', error);
      updateProgress('error', {
        message: `Erro: ${error.message || 'Erro desconhecido'}`
      });
      toast.error('Erro ao processar arquivo');
      return {
        success: false,
        recordCount: 0,
        message: `Erro ao processar arquivo: ${error.message}`
      };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateProgress]);

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
    isLoading,
    uploadProgress,
    uploadStats,
    handleUploadPainel
  };
};
