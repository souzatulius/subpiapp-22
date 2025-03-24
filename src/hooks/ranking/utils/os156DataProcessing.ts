
import { OS156Item } from '@/components/ranking/types';
import * as XLSX from 'xlsx';

// Helper to parse Excel/CSV data and map to the correct format
export const processPlanilha156 = async (file: File): Promise<OS156Item[]> => {
  try {
    // Read the Excel file
    const data = await readExcelFile(file);
    console.log(`Excel file read with ${data.length} rows`);
    
    // Map the data to our format
    const mappedData = mapExcelDataToOSItems(data);
    console.log(`Mapped ${mappedData.length} rows to OS156Item format`);
    
    return mappedData;
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Não foi possível processar o arquivo. Verifique se está no formato correto.');
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
}

// Map the Excel data to our OS156Item format
const mapExcelDataToOSItems = (data: any[]): OS156Item[] => {
  // These are typical column names in SGZ exports - adjust as needed based on actual data
  return data.map((row, index) => {
    // Try different possible column names for each field
    const numeroOS = row['NUMERO OS'] || row['OS'] || row['NUMERO_OS'] || row['Número OS'] || `OS-${index}`;
    const status = row['STATUS'] || row['Status'] || '';
    const tipoServico = row['TIPO SERVICO'] || row['TIPO_SERVICO'] || row['Tipo Serviço'] || row['SERVIÇO'] || '';
    const logradouro = row['LOGRADOURO'] || row['Logradouro'] || row['ENDEREÇO'] || '';
    const bairro = row['BAIRRO'] || row['Bairro'] || '';
    const distrito = row['DISTRITO'] || row['Distrito'] || '';
    const empresa = row['EMPRESA'] || row['Empresa'] || '';
    const dataCriacao = row['DATA CRIACAO'] || row['DATA_CRIACAO'] || row['Data Criação'] || row['DATA'] || new Date().toISOString();
    const dataStatus = row['DATA STATUS'] || row['DATA_STATUS'] || row['Data Status'] || row['ATUALIZAÇÃO'] || new Date().toISOString();
    
    // Calculate days open
    const tempoAberto = calculateDaysOpen(dataCriacao, status);
    
    return {
      numero_os: String(numeroOS),
      status,
      tipo_servico: tipoServico,
      logradouro,
      bairro,
      distrito,
      empresa,
      data_criacao: formatDate(dataCriacao),
      data_status: formatDate(dataStatus),
      tempo_aberto: tempoAberto,
      area_tecnica: '', // Will be mapped later
      servico_valido: true // Will be set later
    };
  });
};

// Helper to calculate days open
const calculateDaysOpen = (dateString: string, status: string): number => {
  try {
    const startDate = new Date(dateString);
    const endDate = status === 'CONC' ? new Date(dateString) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Ensure at least 1 day
  } catch (error) {
    return 1; // Default to 1 day if calculation fails
  }
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

export const mapAreaTecnica = (tipoServico: string): 'STM' | 'STLP' | null => {
  if (!tipoServico) return null;
  
  const tipoUpper = tipoServico.toUpperCase();
  
  const stlpServices = [
    'AREAS AJARDINADAS',
    'AREAS AJARDINADAS MANUAL',
    'HIDROJATO',
    'MICRODRENAGEM MECANIZADA',
    'LIMPEZA DE CORREGOS',
    'LIMPEZA MANUAL DE CORREGOS',
    'MICRODRENAGEM',
    'PODA',
    'REMOCAO',
    'ARVORES',
    'MANEJO'
  ];
  
  const stmServices = [
    'SERRALHERIA',
    'CONSERVACAO GALERIAS',
    'MANUTENCAO',
    'GALERIAS',
    'CONSERVACAO LOGRADOUROS',
    'LOGRADOUROS PUBLICOS',
    'SABESP',
    'TAPA BURACO'
  ];
  
  if (stlpServices.some(service => tipoUpper.includes(service))) return 'STLP';
  if (stmServices.some(service => tipoUpper.includes(service))) return 'STM';
  return null;
};
