
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export const usePainelZeladoriaUpload = (user: User | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processamentoPainel, setProcessamentoPainel] = useState({
    status: 'idle' as 'idle' | 'processing' | 'success' | 'error',
    message: '',
    recordCount: 0
  });

  const handleUploadPainel = useCallback(async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return;
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
        return;
      }
      
      // Ler e processar arquivo Excel
      const dadosPainel = await processarPlanilhaPainel(file);
      setUploadProgress(50);
      
      // Criar registro de upload
      const { data: uploadData, error: uploadError } = await supabase
        .from('painel_zeladoria')
        .insert({
          nome_arquivo: file.name,
          usuario_id: user.id,
          processado: false,
          dados: dadosPainel
        })
        .select()
        .single();
      
      if (uploadError) throw uploadError;
      
      // Atualizar registro como processado
      const { error: updateError } = await supabase
        .from('painel_zeladoria')
        .update({ processado: true })
        .eq('id', uploadData.id);
        
      if (updateError) throw updateError;
      
      setUploadProgress(100);
      setProcessamentoPainel({
        status: 'success',
        message: 'Dados do Painel processados com sucesso!',
        recordCount: dadosPainel.length
      });
      
      toast.success(`Planilha do Painel da Zeladoria processada com sucesso! ${dadosPainel.length} registros importados.`);
      return uploadData.id;
    } catch (error: any) {
      console.error('Erro ao processar planilha do Painel:', error);
      setUploadProgress(0);
      setProcessamentoPainel({
        status: 'error',
        message: error.message || 'Falha no processamento',
        recordCount: 0
      });
      toast.error(`Erro ao processar planilha do Painel: ${error.message || 'Falha no processamento'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    uploadProgress,
    processamentoPainel,
    handleUploadPainel
  };
};

// Função interna para processar a planilha do Painel da Zeladoria
async function processarPlanilhaPainel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
        
        if (!jsonData || jsonData.length === 0) {
          throw new Error('A planilha está vazia ou em formato inválido.');
        }
        
        // Validar estrutura mínima da planilha
        const firstRow = jsonData[0] as any;
        const requiredKeys = ['Protocolo', 'Data de entrada', 'Tipo'];
        
        for (const key of requiredKeys) {
          if (!Object.keys(firstRow).some(k => k.includes(key))) {
            throw new Error(`Coluna obrigatória não encontrada: ${key}`);
          }
        }
        
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}
