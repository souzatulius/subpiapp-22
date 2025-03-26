
import { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UploadInfo, SGZUpload } from '@/components/ranking/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Helper function to normalize column names (new)
const normalizeColumnName = (name: string): string => {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_');
};

// Map of normalized column names to expected field names (new)
const columnMapping: Record<string, string> = {
  'ordem_de_servico': 'Ordem de Serviço',
  'classificacao_de_servico': 'Classificação de Serviço',
  'fornecedor': 'Fornecedor',
  'criado_em': 'Criado em',
  'status': 'Status',
  'data_do_status': 'Data do Status',
  'bairro': 'Bairro',
  'distrito': 'Distrito'
};

export const useUploadManagement = (user: User | null) => {
  const [lastUpload, setLastUpload] = useState<UploadInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<SGZUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0); // Progress tracking (new)

  const fetchLastUpload = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Buscar o upload mais recente no Supabase
      const { data, error } = await supabase
        .from('sgz_uploads')
        .select('*')
        .order('data_upload', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const upload = data[0];
        setLastUpload({
          id: upload.id,
          fileName: upload.nome_arquivo,
          uploadDate: new Date(upload.data_upload).toLocaleString('pt-BR')
        });
      }
      
      // Buscar todos os uploads para histórico
      const { data: allUploads, error: uploadsError } = await supabase
        .from('sgz_uploads')
        .select('*')
        .order('data_upload', { ascending: false });
      
      if (uploadsError) throw uploadsError;
      
      if (allUploads) {
        setUploads(allUploads);
      }
      
    } catch (error) {
      console.error('Error fetching last upload:', error);
      toast.error('Erro ao buscar o último upload');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const findColumnName = (headers: string[], normalizedTarget: string): string | null => {
    // Try to find exact match first
    const exactMatch = headers.find(header => normalizeColumnName(header) === normalizedTarget);
    if (exactMatch) return exactMatch;
    
    // Try to find similar match
    const similarMatch = headers.find(header => {
      const normalized = normalizeColumnName(header);
      return normalized.includes(normalizedTarget) || normalizedTarget.includes(normalized);
    });
    
    return similarMatch || null;
  };

  const processExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          setUploadProgress(25); // Start processing
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Assume primeira planilha
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Converter para JSON
          const rawJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
          
          // Validar dados
          if (!rawJsonData || rawJsonData.length === 0) {
            throw new Error('A planilha está vazia ou em formato inválido.');
          }

          setUploadProgress(50); // Halfway through processing
          
          // Get headers from first row
          const headers = Object.keys(rawJsonData[0]);
          
          // Check for required columns using normalization
          const requiredColumns = [
            'ordem_de_servico', 
            'classificacao_de_servico',
            'criado_em',
            'status',
            'data_do_status',
            'distrito'
          ];
          
          const missingColumns = requiredColumns.filter(normalizedCol => {
            return !findColumnName(headers, normalizedCol);
          });
          
          if (missingColumns.length > 0) {
            const missingOriginalNames = missingColumns.map(col => columnMapping[col] || col);
            throw new Error(`Colunas obrigatórias ausentes: ${missingOriginalNames.join(', ')}`);
          }
          
          // Normalize the data structure
          const normalizedData = rawJsonData.map(row => {
            const normalizedRow: any = {};
            
            // For each required column, find it in the original data and map it
            requiredColumns.forEach(normalizedCol => {
              const originalColName = findColumnName(headers, normalizedCol);
              if (originalColName) {
                // Map to the expected structure with friendly column names
                normalizedRow[columnMapping[normalizedCol] || normalizedCol] = row[originalColName];
              }
            });
            
            // Additional optional columns
            const fornecedorCol = findColumnName(headers, 'fornecedor');
            if (fornecedorCol) normalizedRow['Fornecedor'] = row[fornecedorCol];
            
            const bairroCol = findColumnName(headers, 'bairro');
            if (bairroCol) normalizedRow['Bairro'] = row[bairroCol];
            
            return normalizedRow;
          });
          
          setUploadProgress(75); // Processing complete
          resolve(normalizedData);
        } catch (error) {
          setUploadProgress(0);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        setUploadProgress(0);
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };
  
  const mapExcelRowToSGZOrdem = (row: any, uploadId: string) => {
    // Determinar o departamento técnico com base no tipo de serviço
    const servicoTipo = row['Classificação de Serviço'] || '';
    
    // Use the database function to map the service to technical department
    const departamentoTecnico = servicoTipo ? supabase.rpc('sgz_map_service_to_area', {
      service_type: servicoTipo
    }) : 'STM';
    
    return {
      ordem_servico: row['Ordem de Serviço'] || '',
      sgz_tipo_servico: servicoTipo,
      sgz_empresa: row['Fornecedor'] || '',
      sgz_criado_em: row['Criado em'] ? new Date(row['Criado em']).toISOString() : new Date().toISOString(),
      sgz_status: row['Status'] || '',
      sgz_modificado_em: row['Data do Status'] ? new Date(row['Data do Status']).toISOString() : null,
      sgz_bairro: row['Bairro'] || '',
      sgz_distrito: row['Distrito'] || '',
      sgz_departamento_tecnico: departamentoTecnico,
      planilha_referencia: uploadId
    };
  };

  const handleUpload = useCallback(async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload');
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10); // Initial progress
      
      // Verificar tipo de arquivo
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error('Formato de arquivo inválido. Por favor, carregue um arquivo Excel (.xlsx ou .xls)');
        setIsLoading(false);
        setUploadProgress(0);
        return;
      }
      
      // Processar arquivo Excel
      const excelData = await processExcelFile(file);
      
      // Criar o registro de upload
      const { data: uploadData, error: uploadError } = await supabase
        .from('sgz_uploads')
        .insert({
          nome_arquivo: file.name,
          usuario_id: user.id,
          processado: false
        })
        .select()
        .single();
      
      if (uploadError) throw uploadError;
      
      const uploadId = uploadData.id;
      
      // Processar e inserir cada linha da planilha
      const ordens = [];
      const ordensParaInserir = [];
      
      for (const row of excelData) {
        const ordem = mapExcelRowToSGZOrdem(row, uploadId);
        ordens.push(ordem);
        
        // Verificar se esta ordem já existe
        const { data: existingOrdem, error: checkError } = await supabase
          .from('sgz_ordens_servico')
          .select('id, sgz_status')
          .eq('ordem_servico', ordem.ordem_servico)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existingOrdem) {
          // Se existir e o status mudou, atualizar
          if (existingOrdem.sgz_status !== ordem.sgz_status) {
            await supabase
              .from('sgz_ordens_servico')
              .update({
                sgz_status: ordem.sgz_status,
                sgz_modificado_em: ordem.sgz_modificado_em,
                planilha_referencia: uploadId
              })
              .eq('id', existingOrdem.id);
          }
        } else {
          // Se não existir, adicionar à lista para inserção
          ordensParaInserir.push(ordem);
        }
      }
      
      setUploadProgress(90); // Almost done
      
      // Inserir novas ordens em lote
      if (ordensParaInserir.length > 0) {
        const { error: insertError } = await supabase
          .from('sgz_ordens_servico')
          .insert(ordensParaInserir);
        
        if (insertError) throw insertError;
      }
      
      // Marcar upload como processado
      await supabase
        .from('sgz_uploads')
        .update({ processado: true })
        .eq('id', uploadId);
      
      // Buscar o upload atualizado
      await fetchLastUpload();
      
      setUploadProgress(100); // Complete
      toast.success(`Planilha SGZ processada com sucesso! ${ordensParaInserir.length} novas ordens inseridas.`);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadProgress(0);
      toast.error(`Erro ao processar a planilha SGZ: ${error.message || 'Falha no processamento'}`);
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchLastUpload, processExcelFile]);

  const handleDeleteUpload = useCallback(async (uploadId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Primeiro excluir as ordens associadas a este upload
      const { error: deleteOrdensError } = await supabase
        .from('sgz_ordens_servico')
        .delete()
        .eq('planilha_referencia', uploadId);
      
      if (deleteOrdensError) throw deleteOrdensError;
      
      // Depois excluir o upload
      const { error: deleteUploadError } = await supabase
        .from('sgz_uploads')
        .delete()
        .eq('id', uploadId);
      
      if (deleteUploadError) throw deleteUploadError;
      
      // Atualizar o último upload
      await fetchLastUpload();
      
      toast.success('Upload e dados relacionados excluídos com sucesso');
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast.error('Erro ao excluir o upload');
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchLastUpload]);
  
  // Carregar o último upload quando o componente montar
  useEffect(() => {
    if (user) {
      fetchLastUpload();
    }
  }, [user, fetchLastUpload]);

  return {
    lastUpload,
    isLoading,
    uploads,
    uploadProgress, // New progress indicator
    fetchLastUpload,
    handleUpload,
    handleDeleteUpload
  };
};
