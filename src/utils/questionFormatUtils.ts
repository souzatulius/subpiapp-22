
export const normalizeQuestions = (perguntas: any): string[] => {
  if (!perguntas) return [];
  
  console.log('normalizeQuestions input:', perguntas);

  let result: string[] = [];

  try {
    // Case 1: perguntas is an array already
    if (Array.isArray(perguntas)) {
      console.log('perguntas is an array');
      result = perguntas.filter(p => p && typeof p === 'string');
    } 
    // Case 2: perguntas is a string that can be parsed as JSON
    else if (typeof perguntas === 'string') {
      console.log('perguntas is a string');
      try {
        const parsed = JSON.parse(perguntas);
        result = Array.isArray(parsed) ? parsed.filter(p => p && typeof p === 'string') : [];
      } catch (e) {
        console.log('perguntas string could not be parsed as JSON');
        // Not valid JSON, just use as a single question
        result = [perguntas];
      }
    } 
    // Case 3: perguntas is an object with keys like "0", "1", "2" or "pergunta_1", "pergunta_2"
    else if (typeof perguntas === 'object' && perguntas !== null) {
      console.log('perguntas is an object');
      
      // First, check if it has numeric keys (0, 1, 2...) or pergunta_X keys
      const keys = Object.keys(perguntas);
      const numericFormat = keys.every(k => !isNaN(Number(k)));
      const perguntaFormat = keys.some(k => k.startsWith('pergunta_'));
      
      if (numericFormat) {
        console.log('perguntas has numeric keys');
        // Convert to array preserving the order from keys (0, 1, 2...)
        result = keys
          .sort((a, b) => Number(a) - Number(b))
          .map(k => perguntas[k])
          .filter(p => p && typeof p === 'string');
      } else if (perguntaFormat) {
        console.log('perguntas has pergunta_X keys');
        // Extract all keys starting with pergunta_ and convert to array
        result = keys
          .filter(k => k.startsWith('pergunta_'))
          .sort((a, b) => {
            const numA = parseInt(a.replace('pergunta_', ''));
            const numB = parseInt(b.replace('pergunta_', ''));
            return numA - numB;
          })
          .map(k => perguntas[k])
          .filter(p => p && typeof p === 'string');
      } else {
        console.log('perguntas has other object format');
        // For any other object format, convert values to array
        result = Object.values(perguntas).filter(p => p && typeof p === 'string');
      }
    }
  } catch (error) {
    console.error('Error normalizing questions:', error);
    result = [];
  }

  console.log('normalizeQuestions output:', result);
  return result;
};

// Add these missing utility functions
export const formatQuestionsToObject = (perguntas: string[]): Record<string, string> => {
  const result: Record<string, string> = {};
  
  perguntas.forEach((pergunta, index) => {
    if (pergunta && typeof pergunta === 'string' && pergunta.trim() !== '') {
      result[`pergunta_${index + 1}`] = pergunta.trim();
    }
  });
  
  return result;
};

export const isValidPublicUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
