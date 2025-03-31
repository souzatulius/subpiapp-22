
/**
 * Normalizes the questions data to a standard array format regardless of the input type
 * 
 * @param perguntas - Questions data in various possible formats
 * @returns An array of string questions
 */
export const normalizeQuestions = (perguntas: any): string[] => {
  if (!perguntas) return [];
  
  // If it's already an array of strings, return it
  if (Array.isArray(perguntas)) {
    return perguntas.filter(q => typeof q === 'string' && q.trim() !== '');
  }
  
  // If it's an object with numeric keys (comes from Firebase or other sources)
  if (typeof perguntas === 'object' && !Array.isArray(perguntas)) {
    return Object.values(perguntas)
      .filter(q => q && typeof q === 'string' && q.trim() !== '')
      .map(q => String(q));
  }
  
  // If it's a JSON string, try to parse it
  if (typeof perguntas === 'string') {
    try {
      const parsed = JSON.parse(perguntas);
      if (Array.isArray(parsed)) {
        return parsed.filter(q => typeof q === 'string' && q.trim() !== '');
      } else if (typeof parsed === 'object') {
        return Object.values(parsed)
          .filter(q => q && typeof q === 'string' && q.trim() !== '')
          .map(q => String(q));
      }
    } catch (e) {
      // If parsing fails, just return the string as a single question
      return [perguntas];
    }
  }
  
  return [];
};

/**
 * Formats an array or object of questions into an object with numeric keys
 * 
 * @param perguntas - Array or object of questions
 * @returns Object with numeric keys as question indices
 */
export const formatQuestionsToObject = (perguntas: string[] | Record<string, string> | null): Record<string, string> => {
  if (!perguntas) return {};
  
  // If it's already an object, return it
  if (typeof perguntas === 'object' && !Array.isArray(perguntas)) {
    return perguntas;
  }
  
  // Convert array to object with numeric keys
  if (Array.isArray(perguntas)) {
    return perguntas.reduce((acc: Record<string, string>, question: string, index: number) => {
      if (question && question.trim() !== '') {
        acc[index.toString()] = question;
      }
      return acc;
    }, {});
  }
  
  return {};
};

/**
 * Validates if a string is a valid public URL
 * 
 * @param url - URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidPublicUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch (e) {
    return false;
  }
};
