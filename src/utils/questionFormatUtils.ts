
/**
 * Normalizes questions data to a standard array format regardless of input format
 * @param perguntas Questions in various possible formats (array, object, null)
 * @returns Normalized array of question strings
 */
export const normalizeQuestions = (perguntas: string[] | Record<string, string> | null | any): string[] => {
  if (!perguntas) return [];
  
  try {
    // Handle array format
    if (Array.isArray(perguntas)) {
      return perguntas.filter((p): p is string => typeof p === 'string' && p.trim() !== '');
    }
    
    // Handle object format (with numeric keys)
    if (typeof perguntas === 'object') {
      // If it's a Record<string, string> with numeric keys (usually from JSON)
      const entries = Object.entries(perguntas);
      if (entries.length > 0) {
        // Check if keys are numeric strings like "0", "1", "2"
        if (entries.every(([key]) => !isNaN(Number(key)))) {
          return entries
            .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))
            .map(([_, value]) => String(value))
            .filter((v): v is string => typeof v === 'string' && v.trim() !== '');
        }
        
        // If not numeric keys, just take all values
        return Object.values(perguntas)
          .map(value => String(value))
          .filter((v): v is string => typeof v === 'string' && v.trim() !== '');
      }
    }
    
    // Handle string (possibly JSON)
    if (typeof perguntas === 'string') {
      try {
        const parsed = JSON.parse(perguntas);
        return normalizeQuestions(parsed);
      } catch (e) {
        // Not valid JSON, treat as single question
        return [perguntas];
      }
    }
  } catch (error) {
    console.error('Error normalizing questions:', error);
  }
  
  return [];
};

/**
 * Formats an array of questions to an object with numeric keys
 * @param questions Array of question strings
 * @returns Object with numeric keys like {"0": "Question 1", "1": "Question 2"}
 */
export const formatQuestionsToObject = (questions: string[]): Record<string, string> => {
  if (!questions || !Array.isArray(questions)) return {};
  
  return questions.reduce((acc, question, index) => {
    if (question && question.trim() !== '') {
      acc[index.toString()] = question;
    }
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Validates if a string is a valid public URL
 * @param url String to validate
 * @returns Boolean indicating if it's a valid URL
 */
export const isValidPublicUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  try {
    // Basic check to see if the URL has a valid format
    const validUrl = url.trim() !== '' && 
      (url.startsWith('http://') || 
      url.startsWith('https://') || 
      url.startsWith('/storage/'));
    
    return validUrl;
  } catch (e) {
    return false;
  }
};
