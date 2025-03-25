
import * as XLSX from 'xlsx';
import { SGZOrdemServico, isValidSGZAreaTecnica, SGZAreaTecnica } from '@/types/sgz';
import { supabase } from '@/integrations/supabase/client';

/**
 * Maps service type to technical area (STM or STLP)
 */
export const mapAreaTecnica = async (tipoServico: string): Promise<SGZAreaTecnica> => {
  try {
    // Use the database function to determine the area
    const { data, error } = await supabase.rpc('sgz_map_service_to_area', {
      service_type: tipoServico || ''
    });
    
    if (error) throw error;
    
    // Validate the result is either STM or STLP
    if (isValidSGZAreaTecnica(data)) {
      return data;
    } else {
      console.error('Invalid area returned from database function:', data);
      throw new Error(`Área técnica inválida: ${data}. Apenas STM ou STLP são permitidas.`);
    }
  } catch (err) {
    console.error('Error mapping area técnica:', err);
    
    // Fallback to client-side mapping if the RPC call fails
    const stlpKeywords = [
      'AREAS AJARDINADAS', 'AREAS AJARDINADAS MANUAL', 
      'HIDROJATO', 'MICRODRENAGEM MECANIZADA', 
      'LIMPEZA DE CORREGOS', 'LIMPEZA MANUAL DE CORREGOS', 
      'MICRODRENAGEM', 'PODA', 'REMOCAO', 'ARVORES', 'MANEJO'
    ];
    
    const upperTipoServico = tipoServico?.toUpperCase() || '';
    
    if (stlpKeywords.some(keyword => upperTipoServico.includes(keyword))) {
      return 'STLP';
    }
    
    return 'STM'; // Default to STM
  }
};

/**
 * Process Excel file and extract service orders
 */
export const processExcelFile = async (file: File): Promise<SGZOrdemServico[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume the first sheet contains the data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const validOrdens: SGZOrdemServico[] = [];
        const errors: string[] = [];
        
        // Map to our data structure
        for (const row of jsonData as any[]) {
          try {
            const dataCriacao = row['Data Criação'] ? new Date(row['Data Criação']) : new Date();
            const dataStatus = row['Data Status'] ? new Date(row['Data Status']) : new Date();
            
            // Calculate days open
            const diffTime = Math.abs(dataStatus.getTime() - dataCriacao.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Get the area_tecnica from the database function
            const tipoServico = row['Tipo de Serviço'] || row['Classificação'] || '';
            let areaTecnica: SGZAreaTecnica;
            
            // If area is specified directly in the Excel file
            if (row['Área Técnica']) {
              const specifiedArea = row['Área Técnica'].toString().trim().toUpperCase();
              if (isValidSGZAreaTecnica(specifiedArea)) {
                areaTecnica = specifiedArea as SGZAreaTecnica;
              } else {
                throw new Error(`Valor de Área Técnica inválido: ${specifiedArea}. Apenas STM ou STLP são permitidos.`);
              }
            } else {
              // Derive from service type
              areaTecnica = await mapAreaTecnica(tipoServico);
            }
            
            validOrdens.push({
              ordem_servico: row['Ordem de Serviço'] || row['OS'] || '',
              sgz_classificacao_servico: tipoServico,
              sgz_area_tecnica: areaTecnica,
              sgz_fornecedor: row['Fornecedor'] || row['Empresa'] || '',
              sgz_status: row['Status'] || '',
              sgz_data_status: dataStatus.toISOString(),
              sgz_criado_em: dataCriacao.toISOString(),
              sgz_prioridade: row['Prioridade'] || '',
              sgz_logradouro: row['Logradouro'] || '',
              sgz_numero: row['Número'] || row['Numero'] || '',
              sgz_bairro: row['Bairro'] || '',
              sgz_distrito: row['Distrito'] || '',
              sgz_cep: row['CEP'] || '',
              sgz_dias_ate_status_atual: diffDays
            });
          } catch (rowError: any) {
            errors.push(rowError.message);
          }
        }
        
        // If there are errors, reject with detailed information
        if (errors.length > 0) {
          reject(new Error(`Erro ao processar planilha: ${errors.join('; ')}`));
          return;
        }
        
        // Filter out records with empty order number
        const finalOrdens = validOrdens.filter(ordem => ordem.ordem_servico.trim() !== '');
        
        if (finalOrdens.length === 0) {
          reject(new Error('Nenhuma ordem de serviço válida encontrada na planilha.'));
          return;
        }
        
        resolve(finalOrdens);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};
