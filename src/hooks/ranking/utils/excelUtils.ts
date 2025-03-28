
import * as XLSX from 'xlsx';

// Helper function to normalize column names
export const normalizeColumnName = (name: string): string => {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_');
};

// Map of normalized column names to expected field names
export const columnMapping: Record<string, string> = {
  'ordem_de_servico': 'Ordem de Serviço',
  'classificacao_de_servico': 'Classificação de Serviço',
  'fornecedor': 'Fornecedor',
  'criado_em': 'Criado em',
  'status': 'Status',
  'data_do_status': 'Data do Status',
  'bairro': 'Bairro',
  'distrito': 'Distrito'
};

export const findColumnName = (headers: string[], normalizedTarget: string): string | null => {
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

export const processExcelFile = async (file: File): Promise<any[]> => {
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
        const rawJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
        
        // Validar dados
        if (!rawJsonData || rawJsonData.length === 0) {
          throw new Error('A planilha está vazia ou em formato inválido.');
        }
        
        // Get headers from first row
        const headers = Object.keys(rawJsonData[0]);
        console.log("Detected headers:", headers);
        
        // Debug headers normalization
        headers.forEach(header => {
          console.log(`Original: "${header}" -> Normalized: "${normalizeColumnName(header)}"`);
        });
        
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
        
        resolve(normalizedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const mapExcelRowToSGZOrdem = (row: any, uploadId: string) => {
  // Determinar o departamento técnico com base no tipo de serviço
  const servicoTipo = row['Classificação de Serviço'] || '';
  let departamentoTecnico = 'STM'; // Default value
  
  // Map service type to technical department using consistent rules
  const servicoTipoUpper = servicoTipo.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // STLP keywords
  const stlpKeywords = [
    'AREAS AJARDINADAS', 'AREAS AJARDINADAS MANUAL', 
    'HIDROJATO', 'MICRODRENAGEM MECANIZADA', 
    'LIMPEZA DE CORREGOS', 'LIMPEZA MANUAL DE CORREGOS', 
    'MICRODRENAGEM', 'PODA', 'REMOCAO', 'ARVORES', 'MANEJO'
  ];
  
  if (stlpKeywords.some(keyword => servicoTipoUpper.includes(keyword))) {
    departamentoTecnico = 'STLP';
  }
  
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
