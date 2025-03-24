
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

// Process a spreadsheet file and insert the data into the database
export const useExcelProcessor = () => {
  const processExcelFile = async (file: File, user: User | null): Promise<string | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload de arquivos');
      return null;
    }
    
    try {
      // Read the Excel file
      const data = await readExcelFile(file);
      console.log(`Excel file read with ${data.length} rows`);
      
      // Create an upload record
      const { data: uploadData, error: uploadError } = await supabase
        .from('planilhas_upload')
        .insert({
          arquivo_nome: file.name,
          usuario_upload: user.id,
          qtd_ordens_processadas: data.length,
          qtd_ordens_validas: 0, // Will be updated after processing
          status_upload: 'sucesso' // Will be updated after processing
        })
        .select();
      
      if (uploadError) throw uploadError;
      
      if (!uploadData || uploadData.length === 0) {
        throw new Error('Erro ao registrar upload');
      }
      
      const uploadId = uploadData[0].id;
      
      // Map the Excel data to database format and insert
      const validRows = await insertOrdersData(data, uploadId);
      
      // Update the upload record with the number of valid rows
      const { error: updateError } = await supabase
        .from('planilhas_upload')
        .update({
          qtd_ordens_validas: validRows,
          status_upload: validRows > 0 ? 'sucesso' : 'parcial'
        })
        .eq('id', uploadId);
      
      if (updateError) throw updateError;
      
      return uploadId;
    } catch (error) {
      console.error('Error processing Excel file:', error);
      toast.error('Erro ao processar arquivo Excel');
      return null;
    }
  };
  
  // Read the Excel file and return the data as an array of objects
  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };
  
  // Insert the orders data into the database
  const insertOrdersData = async (data: any[], uploadId: string): Promise<number> => {
    let validCount = 0;
    
    // Process in batches to avoid payload size limits
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const ordersToInsert = batch.map((row) => {
        // Extract values from row, handling different possible column names
        const ordem = row['OS'] || row['ORDEM'] || row['NUMERO OS'] || row['NUMERO_OS'] || row['Número OS'] || '';
        const classificacao = row['CLASSIFICACAO'] || row['TIPO SERVICO'] || row['SERVICO'] || row['CLASSIFICAÇÃO'] || '';
        const contrato = row['CONTRATO'] || '';
        const fornecedor = row['FORNECEDOR'] || row['EMPRESA'] || '';
        const criado = row['DATA CRIACAO'] || row['DATA'] || row['CRIADO EM'] || new Date().toISOString();
        const status = row['STATUS'] || '';
        const dataStatus = row['DATA STATUS'] || row['DATA_STATUS'] || row['ATUALIZAÇÃO'] || new Date().toISOString();
        const prioridade = row['PRIORIDADE'] || '';
        const logradouro = row['LOGRADOURO'] || row['ENDERECO'] || row['ENDEREÇO'] || '';
        const numero = row['NUMERO'] || '';
        const bairro = row['BAIRRO'] || '';
        const distrito = row['DISTRITO'] || '';
        const cep = row['CEP'] || '';
        
        // Convert dates to proper format
        const criadoEm = formatDate(criado);
        const statusEm = formatDate(dataStatus);
        
        // Check if this is a valid district (basic validation)
        const validDistricts = ['PINHEIROS', 'ALTO DE PINHEIROS', 'JARDIM PAULISTA', 'ITAIM BIBI'];
        const isValidDistrict = validDistricts.includes(distrito.toUpperCase());
        
        if (isValidDistrict) {
          validCount++;
        }
        
        return {
          ordem_servico: ordem.toString(),
          classificacao_servico: classificacao,
          contrato: contrato,
          fornecedor: fornecedor,
          criado_em: criadoEm,
          status: status,
          data_status: statusEm,
          prioridade: prioridade,
          logradouro: logradouro,
          numero: numero,
          bairro: bairro,
          distrito: distrito,
          cep: cep,
          planilha_referencia: uploadId
        };
      });
      
      // Filter out invalid entries (at minimum, we need an order number)
      const validOrders = ordersToInsert.filter(order => order.ordem_servico);
      
      if (validOrders.length > 0) {
        const { error } = await supabase
          .from('ordens_servico')
          .insert(validOrders);
        
        if (error) {
          console.error('Error inserting batch:', error);
          throw error;
        }
      }
    }
    
    return validCount;
  };
  
  // Helper to format dates consistently
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch (error) {
      return new Date().toISOString(); // Default to current date if parsing fails
    }
  };
  
  return { processExcelFile };
};
