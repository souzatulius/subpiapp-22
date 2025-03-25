
import * as XLSX from 'xlsx';
import { SGZOrdemServico } from '@/types/sgz';

/**
 * Maps service type to technical area (STM or STLP)
 */
export const mapAreaTecnica = (tipoServico: string): 'STM' | 'STLP' => {
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
};

/**
 * Process Excel file and extract service orders
 */
export const processExcelFile = async (file: File): Promise<SGZOrdemServico[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Assume the first sheet contains the data
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to our data structure
        const ordens: SGZOrdemServico[] = jsonData.map((row: any) => {
          const dataCriacao = row['Data Criação'] ? new Date(row['Data Criação']) : new Date();
          const dataStatus = row['Data Status'] ? new Date(row['Data Status']) : new Date();
          
          // Calculate days open
          const diffTime = Math.abs(dataStatus.getTime() - dataCriacao.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return {
            ordem_servico: row['Ordem de Serviço'] || row['OS'] || '',
            sgz_classificacao_servico: row['Tipo de Serviço'] || row['Classificação'] || '',
            sgz_area_tecnica: mapAreaTecnica(row['Tipo de Serviço'] || row['Classificação'] || ''),
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
          };
        });
        
        // Filter out records with empty order number
        const validOrdens = ordens.filter(ordem => ordem.ordem_servico.trim() !== '');
        
        resolve(validOrdens);
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
