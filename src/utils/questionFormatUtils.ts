
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
      return perguntas.filter(p => p && p.trim() !== '');
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
            .map(([_, value]) => value)
            .filter(v => v && v.trim() !== '');
        }
        
        // If not numeric keys, just take all values
        return Object.values(perguntas)
          .filter(v => v && v.trim() !== '');
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
