
import { supabase } from '@/integrations/supabase/client';

export const formatQuestionsToObject = (perguntas: string[]): Record<string, string> => {
  // Filter out empty questions and create keyed object
  const filteredPerguntas = perguntas.filter(q => q.trim() !== '');
  
  // Return as { pergunta1: "texto", pergunta2: "texto", ... }
  return filteredPerguntas.reduce((acc, pergunta, index) => {
    return { ...acc, [`pergunta${index + 1}`]: pergunta };
  }, {});
};

export const isValidPublicUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Ensure storage bucket exists
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
