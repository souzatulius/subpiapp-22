
import { OS156Item } from '@/components/ranking/types';

// Helper to parse Excel/CSV data and map to the correct format
export const processPlanilha156 = async (file: File): Promise<OS156Item[]> => {
  try {
    // In a real implementation, we would parse the Excel file
    // For this demo, we're just returning a placeholder
    console.log('Processing file:', file.name);
    
    // This is a placeholder for the actual parsing logic
    return [];
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error('Não foi possível processar o arquivo. Verifique se está no formato correto.');
  }
};

export const mapAreaTecnica = (tipoServico: string): 'STM' | 'STLP' | null => {
  const stlpServices = [
    'AREAS AJARDINADAS',
    'AREAS AJARDINADAS MANUAL (TIPO A)',
    'HIDROJATO (MICRODRENAGEM MECANIZADA)',
    'LIMPEZA DE CORREGOS',
    'LIMPEZA MANUAL DE CORREGOS',
    'MICRODRENAGEM',
    'PODA REMOCAO ARVORES',
    'PODA REMOCAO MANEJO ARVORE'
  ];
  
  const stmServices = [
    'SERRALHERIA',
    'CONSERVACAO GALERIAS',
    'MANUTENCAO CONSERVACAO GALERIAS',
    'CONSERVACAO LOGRADOUROS',
    'CONSERVACAO LOGRADOUROS PUBLICOS',
    'GALERIAS SABESP'
  ];
  
  if (stlpServices.includes(tipoServico)) return 'STLP';
  if (stmServices.includes(tipoServico)) return 'STM';
  return null;
};
