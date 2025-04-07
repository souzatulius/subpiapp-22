
// Utility functions for handling question formats and validations

/**
 * Normalizes different question structures into a consistent array format
 */
export const normalizeQuestions = (perguntas: any): string[] => {
  if (!perguntas) return [];
  
  if (Array.isArray(perguntas)) {
    return perguntas;
  }
  
  if (typeof perguntas === 'object') {
    return Object.values(perguntas);
  }
  
  return [];
};

/**
 * Formats questions array into an object with indexed keys
 */
export const formatQuestionsToObject = (questions: string[]): Record<string, string> => {
  if (!questions || !Array.isArray(questions)) return {};
  
  return questions.reduce((acc, question, index) => {
    acc[index.toString()] = question;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Validates if a string is a valid public URL
 */
export const isValidPublicUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || 
           parsedUrl.protocol === 'https:' || 
           url.startsWith('https://') || 
           url.startsWith('http://');
  } catch (e) {
    return false;
  }
};
