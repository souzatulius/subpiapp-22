
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UploadInfo, UploadProgress, SGZOrdemServico } from '@/components/ranking/types';
import { User } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

export const useSGZUploadManagement = (user: User | null) => {
  const { toast } = useToast();
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'idle',
    progress: 0
  });

  const resetUploadProgress = () => {
    setUploadProgress({
      status: 'idle',
      progress: 0
    });
  };

  const fetchLastUpload = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('sgz_uploads')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data_upload', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setLastUpload({
          id: data[0].id,
          fileName: data[0].nome_arquivo,
          uploadDate: new Date(data[0].data_upload).toLocaleString()
        });
      }
    } catch (error) {
      console.error('Erro ao buscar último upload:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as informações do último upload.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateExcelData = (data: any[]): { valid: boolean; message?: string } => {
    if (!data || data.length === 0) {
      return { valid: false, message: "Planilha vazia ou sem dados válidos" };
    }

    // Define os campos obrigatórios
    const requiredFields = [
      'ordem_servico',
      'sgz_area_tecnica',
      'sgz_status',
      'sgz_distrito',
      'sgz_bairro',
      'sgz_criado_em',
      'sgz_tipo_servico'
    ];

    // Verifica o primeiro item para conferir os campos
    const firstItem = data[0];
    const missingFields = requiredFields.filter(field => !firstItem.hasOwnProperty(field));
    
    if (missingFields.length > 0) {
      return { 
        valid: false, 
        message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
      };
    }

    // Verifica se a área técnica é válida em todos os itens
    const invalidItems = data.filter(item => 
      item.sgz_area_tecnica !== 'STM' && item.sgz_area_tecnica !== 'STLP'
    );

    if (invalidItems.length > 0) {
      return { 
        valid: false, 
        message: `${invalidItems.length} itens com área técnica inválida. Apenas STM e STLP são permitidos.` 
      };
    }

    // Verifica distritos válidos
    const validDistricts = ['Pinheiros', 'Alto de Pinheiros', 'Itaim Bibi', 'Jardim Paulista'];
    const invalidDistricts = data.filter(item => 
      !validDistricts.includes(item.sgz_distrito) && item.sgz_distrito !== null && item.sgz_distrito !== undefined
    );

    if (invalidDistricts.length > 0) {
      // Aqui apenas alertamos, mas não impedimos o upload
      console.warn(`${invalidDistricts.length} itens com distritos não padrão.`);
    }

    return { valid: true };
  };

  const processExcelFile = async (file: File): Promise<SGZOrdemServico[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Converte para JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Valida os dados
          const validation = validateExcelData(jsonData);
          
          if (!validation.valid) {
            reject(new Error(validation.message));
            return;
          }
          
          // Mapeia para o formato adequado
          const orders = jsonData.map((row: any) => ({
            ordem_servico: row.ordem_servico?.toString(),
            sgz_status: row.sgz_status,
            sgz_area_tecnica: row.sgz_area_tecnica as "STM" | "STLP",
            sgz_bairro: row.sgz_bairro,
            sgz_distrito: row.sgz_distrito,
            sgz_tipo_servico: row.sgz_tipo_servico,
            sgz_fornecedor: row.sgz_fornecedor || null,
            sgz_criado_em: row.sgz_criado_em,
            sgz_data_status: row.sgz_data_status || null,
            sgz_logradouro: row.sgz_logradouro || null,
            sgz_cep: row.sgz_cep || null,
            sgz_numero: row.sgz_numero?.toString() || null,
            sgz_classificacao_servico: row.sgz_classificacao_servico || row.sgz_tipo_servico,
            planilha_referencia: ""
          }));
          
          resolve(orders);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  const uploadOrdersInBatches = async (orders: SGZOrdemServico[], uploadId: string) => {
    const BATCH_SIZE = 50;
    const totalBatches = Math.ceil(orders.length / BATCH_SIZE);
    let processedCount = 0;
    let validCount = 0;
    
    // Configurar progresso para processamento
    setUploadProgress({
      status: 'processing',
      progress: 0,
      message: `Processando registro 0 de ${orders.length}`,
      estimatedTimeRemaining: orders.length * 0.1 // estimativa inicial: 0.1 segundos por registro
    });
    
    const startTime = Date.now();
    let previousTime = startTime;
    let progressInterval: NodeJS.Timeout;
    
    try {
      // Inicia um intervalo para atualizar o tempo estimado
      progressInterval = setInterval(() => {
        if (processedCount === 0) return;
        
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // em segundos
        const timePerRecord = elapsedTime / processedCount;
        const remainingRecords = orders.length - processedCount;
        const estimatedTimeRemaining = timePerRecord * remainingRecords;
        
        setUploadProgress(prev => ({
          ...prev,
          estimatedTimeRemaining
        }));
      }, 1000);
      
      for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, orders.length);
        const batch = orders.slice(start, end).map(order => ({
          ...order,
          planilha_referencia: uploadId
        }));
        
        const { data, error } = await supabase
          .from('sgz_ordens_servico')
          .upsert(batch, { 
            onConflict: 'ordem_servico',
            ignoreDuplicates: false
          });
        
        if (error) {
          console.error(`Erro ao processar lote ${i+1}/${totalBatches}:`, error);
          continue;
        }
        
        // Atualiza contadores
        processedCount += batch.length;
        validCount += data ? data.length : 0;
        
        // Atualiza progresso
        const now = Date.now();
        const batchTime = (now - previousTime) / 1000;
        const recordsPerSecond = batch.length / batchTime;
        const remainingRecords = orders.length - processedCount;
        const estimatedTimeRemaining = recordsPerSecond > 0 ? 
          remainingRecords / recordsPerSecond : 
          0;
        
        setUploadProgress({
          status: 'processing',
          progress: (processedCount / orders.length) * 100,
          message: `Processando registro ${processedCount} de ${orders.length}`,
          estimatedTimeRemaining
        });
        
        previousTime = now;
      }
      
      // Atualiza os contadores no registro de upload
      await supabase
        .from('sgz_uploads')
        .update({
          processado: true,
          qtd_ordens_processadas: processedCount,
          qtd_ordens_validas: validCount
        })
        .eq('id', uploadId);
      
      // Finaliza com sucesso
      setUploadProgress({
        status: 'success',
        progress: 100,
        message: `Processados ${validCount} registros válidos de ${processedCount} total.`
      });
      
      return { processedCount, validCount };
      
    } catch (error) {
      console.error('Erro durante processamento em lotes:', error);
      throw error;
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de arquivos.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress({
        status: 'uploading',
        progress: 10,
        message: 'Analisando planilha...',
        estimatedTimeRemaining: 5
      });

      // Verifica se o arquivo já foi enviado anteriormente
      const { data: existingFiles, error: checkError } = await supabase
        .from('sgz_uploads')
        .select('nome_arquivo')
        .eq('nome_arquivo', file.name)
        .eq('usuario_id', user.id);

      if (checkError) throw checkError;

      if (existingFiles && existingFiles.length > 0) {
        setUploadProgress({
          status: 'error',
          progress: 100,
          error: 'Este arquivo já foi carregado anteriormente.'
        });
        
        toast({
          title: "Arquivo duplicado",
          description: "Este arquivo já foi carregado anteriormente.",
          variant: "destructive",
        });
        return;
      }

      // Processa o arquivo Excel para validação
      setUploadProgress({
        status: 'uploading',
        progress: 30,
        message: 'Processando planilha...',
        estimatedTimeRemaining: 3
      });
      
      const orders = await processExcelFile(file);
      
      if (!orders || orders.length === 0) {
        throw new Error("Nenhum dado válido encontrado na planilha");
      }

      // Cria o registro de upload
      setUploadProgress({
        status: 'uploading',
        progress: 50,
        message: 'Registrando upload...',
        estimatedTimeRemaining: 2
      });
      
      const { data: uploadData, error: uploadError } = await supabase
        .from('sgz_uploads')
        .insert({
          nome_arquivo: file.name,
          usuario_id: user.id,
          processado: false
        })
        .select();

      if (uploadError) throw uploadError;

      if (!uploadData || uploadData.length === 0) {
        throw new Error("Falha ao registrar upload");
      }

      const uploadId = uploadData[0].id;
      
      // Processa os dados em lotes
      const { processedCount, validCount } = await uploadOrdersInBatches(orders, uploadId);
      
      // Atualiza a interface e mostra mensagem de sucesso
      await fetchLastUpload();
      
      toast({
        title: "Upload concluído",
        description: `Processados ${validCount} registros válidos de ${processedCount} total.`,
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      
      setUploadProgress({
        status: 'error',
        progress: 100,
        error: error.message || "Erro desconhecido ao processar arquivo"
      });
      
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível processar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUpload = async () => {
    if (!lastUpload || !user) return;

    try {
      setIsLoading(true);
      
      // Primeiro exclui as ordens de serviço relacionadas
      const { error: ordersError } = await supabase
        .from('sgz_ordens_servico')
        .delete()
        .eq('planilha_referencia', lastUpload.id);

      if (ordersError) throw ordersError;
      
      // Depois exclui o registro de upload
      const { error } = await supabase
        .from('sgz_uploads')
        .delete()
        .eq('id', lastUpload.id)
        .eq('usuario_id', user.id);

      if (error) throw error;

      setLastUpload(null);
      toast({
        title: "Upload removido",
        description: "O arquivo e todos os dados associados foram removidos com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao remover upload:', error);
      toast({
        title: "Erro ao remover",
        description: error.message || "Não foi possível remover o arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lastUpload,
    isLoading,
    uploadProgress,
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload,
    resetUploadProgress
  };
};
