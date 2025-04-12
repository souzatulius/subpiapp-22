
import * as XLSX from 'xlsx';

// Helper function to normalize column names
export const normalizeColumnName = (name: string): string => {
  return name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

// Standard column mapping for SGZ files
export const standardColumnMapping: Record<string, string> = {
  'ordem_de_servico': 'ordem_servico',
  'os': 'ordem_servico',
  'classificacao_de_servico': 'sgz_tipo_servico',
  'classificacao_servico': 'sgz_tipo_servico',
  'tipo_de_servico': 'sgz_tipo_servico',
  'tipo_servico': 'sgz_tipo_servico',
  'servico': 'sgz_tipo_servico',
  'fornecedor': 'sgz_empresa',
  'empresa': 'sgz_empresa',
  'criado_em': 'sgz_criado_em',
  'data_de_abertura': 'sgz_criado_em',
  'abertura': 'sgz_criado_em',
  'status': 'sgz_status',
  'data_do_status': 'sgz_modificado_em',
  'data_status': 'sgz_modificado_em',
  'ultima_atualizacao': 'sgz_modificado_em',
  'data_de_fechamento': 'sgz_modificado_em',
  'bairro': 'sgz_bairro',
  'distrito': 'sgz_distrito'
};

// Required columns for SGZ files (normalized names)
export const requiredSgzColumns = [
  'ordem_de_servico',
  'classificacao_de_servico',
  'criado_em',
  'status',
  'data_do_status',
  'distrito'
];

// Helper to find column in headers by normalized name
export const findColumnByNormalizedName = (headers: string[], targetNormalized: string): string | null => {
  // Try to find exact match first
  const exactMatch = headers.find(header => normalizeColumnName(header) === targetNormalized);
  if (exactMatch) return exactMatch;
  
  // Try to find similar match (partial match)
  const similarMatch = headers.find(header => {
    const normalized = normalizeColumnName(header);
    return normalized.includes(targetNormalized) || targetNormalized.includes(normalized);
  });
  
  return similarMatch || null;
};

// Error validation types
export type ValidationError = {
  row: number;
  column: string;
  message: string;
  value?: any;
};

export type ProcessingResult = {
  data: any[];
  errors: ValidationError[];
  stats: {
    totalRows: number;
    validRows: number;
    skippedRows: number;
    errorCount: number;
  };
};

// Validate a date value
export const validateDate = (value: any): boolean => {
  if (!value) return false;
  
  // If it's already a Date object
  if (value instanceof Date) return !isNaN(value.getTime());
  
  const date = new Date(value);
  return !isNaN(date.getTime());
};

// Parse Excel date to ISO format (handling different formats)
export const parseExcelDate = (dateString: string | number): string | null => {
  if (!dateString) return null;
  
  try {
    // If it's a number (Excel serial date)
    if (typeof dateString === 'number') {
      // Excel dates are counted from 1900-01-01
      const excelEpoch = new Date(1900, 0, 1);
      const daysSinceEpoch = dateString - 1; // Excel counts 1900-01-01 as day 1
      const millisecondsSinceEpoch = daysSinceEpoch * 24 * 60 * 60 * 1000;
      const date = new Date(excelEpoch.getTime() + millisecondsSinceEpoch);
      return date.toISOString();
    }
    
    // Check for Brazilian date format (DD/MM/YYYY)
    if (typeof dateString === 'string') {
      const brazilianDatePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
      const matches = dateString.match(brazilianDatePattern);
      if (matches) {
        const [, day, month, year] = matches;
        const fullYear = year.length === 2 ? `20${year}` : year;
        const date = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
      
      // Try as ISO or other recognized format
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
};

// Process Excel file with improved validation
export const processExcelFile = async (file: File): Promise<ProcessingResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        // Assume primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Converter para JSON
        const rawJsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
        
        // Validation result
        const result: ProcessingResult = {
          data: [],
          errors: [],
          stats: {
            totalRows: rawJsonData.length,
            validRows: 0,
            skippedRows: 0,
            errorCount: 0
          }
        };
        
        // Validate data
        if (!rawJsonData || rawJsonData.length === 0) {
          reject(new Error('A planilha está vazia ou em formato inválido.'));
          return;
        }
        
        // Get headers from first row
        const originalHeaders = Object.keys(rawJsonData[0]);
        
        // Debug headers normalization
        console.log("Detected headers:", originalHeaders);
        const normalizedHeaders = originalHeaders.map(header => ({
          original: header,
          normalized: normalizeColumnName(header)
        }));
        console.log("Normalized headers:", normalizedHeaders);
        
        // Check for required columns using normalization
        const missingColumns = requiredSgzColumns.filter(requiredCol => {
          return !originalHeaders.some(header => 
            normalizeColumnName(header) === requiredCol || 
            normalizeColumnName(header).includes(requiredCol) ||
            requiredCol.includes(normalizeColumnName(header))
          );
        });
        
        if (missingColumns.length > 0) {
          reject(new Error(`Colunas obrigatórias ausentes: ${missingColumns.join(', ')}`));
          return;
        }
        
        // Process each row with validation
        rawJsonData.forEach((row, index) => {
          const rowNumber = index + 2; // +2 because Excel starts at 1 and we have a header row
          const rowErrors: ValidationError[] = [];
          const mappedRow: any = {};
          
          // Check required fields
          for (const requiredCol of requiredSgzColumns) {
            const originalHeader = findColumnByNormalizedName(
              originalHeaders, 
              requiredCol
            );
            
            if (!originalHeader || !row[originalHeader]) {
              rowErrors.push({
                row: rowNumber,
                column: requiredCol,
                message: `Campo obrigatório não preenchido: ${requiredCol}`
              });
            }
          }
          
          // Validate and map fields if no missing required fields
          if (rowErrors.length === 0) {
            // Find "ordem_de_servico" column
            const osColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'ordem_de_servico' ||
              normalizeColumnName(header) === 'os'
            );
            
            if (!osColumn || !row[osColumn]) {
              rowErrors.push({
                row: rowNumber,
                column: 'Ordem de Serviço',
                message: 'Número de ordem de serviço não encontrado'
              });
            } else {
              mappedRow.ordem_servico = String(row[osColumn]).trim();
            }
            
            // Find and validate service type
            const serviceColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'classificacao_de_servico' ||
              normalizeColumnName(header) === 'tipo_de_servico' ||
              normalizeColumnName(header) === 'servico'
            );
            
            if (serviceColumn) {
              mappedRow.sgz_tipo_servico = row[serviceColumn] || '';
            }
            
            // Find and validate created date
            const createdDateColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'criado_em' ||
              normalizeColumnName(header) === 'data_de_abertura'
            );
            
            if (createdDateColumn) {
              const parsedDate = parseExcelDate(row[createdDateColumn]);
              if (!parsedDate) {
                rowErrors.push({
                  row: rowNumber,
                  column: createdDateColumn,
                  message: 'Data de criação inválida',
                  value: row[createdDateColumn]
                });
              } else {
                mappedRow.sgz_criado_em = parsedDate;
              }
            }
            
            // Find and validate status date
            const statusDateColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'data_do_status' ||
              normalizeColumnName(header) === 'data_status' ||
              normalizeColumnName(header) === 'ultima_atualizacao'
            );
            
            if (statusDateColumn && row[statusDateColumn]) {
              const parsedDate = parseExcelDate(row[statusDateColumn]);
              if (!parsedDate) {
                rowErrors.push({
                  row: rowNumber,
                  column: statusDateColumn,
                  message: 'Data de status inválida',
                  value: row[statusDateColumn]
                });
              } else {
                mappedRow.sgz_modificado_em = parsedDate;
              }
            } else {
              mappedRow.sgz_modificado_em = null;
            }
            
            // Map status
            const statusColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'status'
            );
            
            if (statusColumn) {
              mappedRow.sgz_status = row[statusColumn] || '';
            }
            
            // Map district
            const districtColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'distrito'
            );
            
            if (districtColumn) {
              mappedRow.sgz_distrito = row[districtColumn] || '';
            }
            
            // Map neighborhood
            const neighborhoodColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'bairro'
            );
            
            if (neighborhoodColumn) {
              mappedRow.sgz_bairro = row[neighborhoodColumn] || '';
            } else {
              mappedRow.sgz_bairro = '';
            }
            
            // Map company/supplier
            const companyColumn = originalHeaders.find(header => 
              normalizeColumnName(header) === 'fornecedor' ||
              normalizeColumnName(header) === 'empresa'
            );
            
            if (companyColumn) {
              mappedRow.sgz_empresa = row[companyColumn] || '';
            } else {
              mappedRow.sgz_empresa = '';
            }
            
            // Determine technical department based on service type
            mappedRow.sgz_departamento_tecnico = mapServiceToDepartment(mappedRow.sgz_tipo_servico);
          }
          
          // If row has errors, add to errors and skip
          if (rowErrors.length > 0) {
            result.errors.push(...rowErrors);
            result.stats.errorCount += rowErrors.length;
            result.stats.skippedRows += 1;
          } else {
            // If no errors, add to valid data
            result.data.push(mappedRow);
            result.stats.validRows += 1;
          }
        });
        
        resolve(result);
      } catch (error: any) {
        reject(new Error(`Erro ao processar o arquivo: ${error.message}`));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Map SGZ service type to technical department
export const mapServiceToDepartment = (servicoTipo: string): string => {
  // Default value
  let departamentoTecnico = 'STM'; 
  
  if (!servicoTipo) return departamentoTecnico;
  
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
  
  return departamentoTecnico;
};

// Map service responsibility based on service type
export const mapServiceResponsibility = (servicoTipo: string): string => {
  const upperService = (servicoTipo || '').toUpperCase();
  
  if (upperService.includes('TAPA') && upperService.includes('BURACO')) {
    return 'dzu';
  } else if (upperService.includes('ENEL') || upperService.includes('ELETROPAULO')) {
    return 'enel';
  } else if (upperService.includes('SABESP') || 
            (upperService.includes('AGUA') && upperService.includes('VAZAMENTO'))) {
    return 'sabesp';
  } else if (upperService.includes('COLETA') && 
            (upperService.includes('LIXO') || upperService.includes('LIMPEZA'))) {
    return 'selimp';
  } else {
    return 'subprefeitura';
  }
};

// Map Excel row to SGZ Ordem with improved validation
export const mapExcelRowToSGZOrdem = (row: any, uploadId: string) => {
  return {
    ordem_servico: row.ordem_servico || '',
    sgz_tipo_servico: row.sgz_tipo_servico || '',
    sgz_empresa: row.sgz_empresa || '',
    sgz_criado_em: row.sgz_criado_em || new Date().toISOString(),
    sgz_status: row.sgz_status || '',
    sgz_modificado_em: row.sgz_modificado_em || null,
    sgz_bairro: row.sgz_bairro || '',
    sgz_distrito: row.sgz_distrito || '',
    sgz_departamento_tecnico: row.sgz_departamento_tecnico || 'STM',
    servico_responsavel: mapServiceResponsibility(row.sgz_tipo_servico || ''),
    planilha_referencia: uploadId
  };
};
