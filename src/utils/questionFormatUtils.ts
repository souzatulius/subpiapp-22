
import { supabase } from '@/integrations/supabase/client';

/**
 * Formats an array of question strings into an object with numbered keys
 * @param perguntas Array of question strings
 * @returns Object with keys like pergunta1, pergunta2, etc.
 */
export const formatQuestionsToObject = (perguntas: string[]): Record<string, string> => {
  // Filter out empty questions and create keyed object
  const filteredPerguntas = perguntas.filter(q => q.trim() !== '');
  
  // Return as { pergunta1: "texto", pergunta2: "texto", ... }
  return filteredPerguntas.reduce((acc, pergunta, index) => {
    return { ...acc, [`pergunta${index + 1}`]: pergunta };
  }, {});
};

/**
 * Checks if a URL is valid and properly formatted as a public URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidPublicUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    
    // Check for common storage URL patterns
    const isStorageUrl = url.includes('/storage/v1/object/public/') || 
                         url.includes('/storage/v1/object/sign/');
    
    // Return true if it's a valid URL
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Normalizes question data from various formats into a string array
 * @param perguntas Questions data in various possible formats
 * @returns Normalized array of question strings
 */
export const normalizeQuestions = (perguntas: any): string[] => {
  if (!perguntas) return [];
  
  // If perguntas is already an array, filter out empty strings and return
  if (Array.isArray(perguntas)) {
    return perguntas.filter(q => q && typeof q === 'string' && q.trim() !== '');
  }
  
  // If perguntas is an object with keys like pergunta1, pergunta2, etc.
  if (typeof perguntas === 'object' && perguntas !== null) {
    const keys = Object.keys(perguntas).sort((a, b) => {
      // Sort by numeric part if keys are like pergunta1, pergunta2...
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
    
    return keys.map(key => perguntas[key])
      .filter(q => q && typeof q === 'string' && q.trim() !== '');
  }
  
  // If perguntas is a string, try to parse it as JSON
  if (typeof perguntas === 'string') {
    try {
      const parsed = JSON.parse(perguntas);
      return normalizeQuestions(parsed); // Recursively handle the parsed result
    } catch (e) {
      // If parsing fails, treat it as a single question
      return [perguntas];
    }
  }
  
  return [];
};

/**
 * Ensures that the 'demandas' storage bucket exists in Supabase
 */
export const ensureDemandsBucketExists = async (): Promise<void> => {
  try {
    // Check if bucket exists
    const { data, error } = await supabase.storage.getBucket('demandas');
    
    if (error && error.message.includes('does not exist')) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabase.storage.createBucket('demandas', {
        public: true,
        fileSizeLimit: 10485760 // 10MB in bytes
      });
      
      if (createError) {
        console.error('Error creating demandas bucket:', createError);
      } else {
        console.log('Created demandas storage bucket');
      }
    }
  } catch (error) {
    console.error('Error checking/creating demandas bucket:', error);
  }
};

// Initialize the bucket check when this module is imported
ensureDemandsBucketExists();
