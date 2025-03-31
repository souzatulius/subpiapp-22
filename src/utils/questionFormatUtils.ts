
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
