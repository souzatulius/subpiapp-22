
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { UploadResult } from '@/hooks/ranking/types/uploadTypes';

export const usePainelZeladoriaUpload = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processamentoPainel, setProcessamentoPainel] = useState({
    status: 'idle' as 'idle' | 'processing' | 'success' | 'error',
    message: '',
    recordCount: 0
  });

  const handleUploadPainel = useCallback(async (file: File): Promise<UploadResult | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return null;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);
      setProcessamentoPainel({
        status: 'processing',
        message: 'Processando dados do Painel da Zeladoria...',
        recordCount: 0
      });
      
      // Verificar tipo de arquivo
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
        setIsLoading(false);
        setUploadProgress(0);
        setProcessamentoPainel({
          status: 'error',
          message: 'Formato de arquivo inválido',
          recordCount: 0
        });
        return null;
      }
      
      // Ler e processar arquivo Excel
      const dadosPainel = await processarPlanilhaPainel(file);
      setUploadProgress(30);
      
      // Verificar se os dados foram processados corretamente
      if (!dadosPainel || dadosPainel.length === 0) {
        toast.error('Não foi possível processar os dados do arquivo');
        setIsLoading(false);
        setUploadProgress(0);
        setProcessamentoPainel({
          status: 'error',
          message: 'Falha ao processar dados',
          recordCount: 0
        });
        return null;
      }
      
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
        toast.error('Erro ao registrar upload');
        setIsLoading(false);
        setUploadProgress(0);
        return null;
      }
      
      const uploadId = uploadData.id;
      setUploadProgress(70);
      
      // Inserir dados processados
      const { error: insertError } = await supabase
        .from('painel_zeladoria_dados')
        .insert(dadosPainel.map(item => ({
          ...item,
          upload_id: uploadId
        })));
        
      if (insertError) {
        console.error('Erro ao inserir dados:', insertError);
        toast.error('Erro ao salvar dados no banco');
        setIsLoading(false);
        setUploadProgress(0);
        return null;
      }
      
      setUploadProgress(100);
      
      // Atualizar status de processamento
      setProcessamentoPainel({
        status: 'success',
        message: `${dadosPainel.length} registros processados com sucesso`,
        recordCount: dadosPainel.length
      });
      
      toast.success(`Upload concluído: ${dadosPainel.length} registros processados`);
      
      return {
        success: true,
        recordCount: dadosPainel.length,
        message: 'Upload realizado com sucesso'
      };
    } catch (error) {
      console.error('Erro no processamento do upload:', error);
      toast.error('Erro ao processar arquivo');
      setProcessamentoPainel({
        status: 'error',
        message: 'Erro ao processar arquivo',
        recordCount: 0
      });
      return {
        success: false,
        recordCount: 0,
        message: 'Erro ao processar arquivo'
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
    isLoading,
    uploadProgress,
    processamentoPainel,
    handleUploadPainel
  };
};
