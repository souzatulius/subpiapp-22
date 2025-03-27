
/**
 * Normalizes questions data from different formats into a consistent array of strings
 * @param input The input questions data that could be in different formats
 * @returns Array of question strings
 */
export const normalizeQuestions = (input: any): string[] => {
  console.log('normalizeQuestions input:', input);
  
  if (!input) return [];

  // If input is an array, filter out empty values
  if (Array.isArray(input)) {
    const result = input.filter(q => q && typeof q === 'string' && q.trim() !== '');
    console.log('normalizeQuestions - input is array, result:', result);
    return result;
  }

  // If input is an object (like perguntas in jsonb format)
  if (typeof input === 'object' && !Array.isArray(input)) {
    // Extract values and filter out empty ones
    const result = Object.values(input)
      .filter(value => value && typeof value === 'string' && value.trim() !== '')
      .map(String);
    
    console.log('normalizeQuestions - input is object, result:', result);
    return result;
  }

  // If input is a string, try to parse it as JSON
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      // Recursively call normalizeQuestions with the parsed value
      return normalizeQuestions(parsed);
    } catch (e) {
      // If parsing fails, treat it as a single question
      const result = input.trim() !== '' ? [input] : [];
      console.log('normalizeQuestions - input is string, result:', result);
      return result;
    }
  }

  console.log('normalizeQuestions - no match, returning empty array');
  return [];
};

/**
 * Formats an array of questions into a standardized object format
 * @param questions Array of question strings
 * @returns Object with questions in format { pergunta_1: "...", pergunta_2: "..." }
 */
export const formatQuestionsToObject = (questions: string[]): Record<string, string> => {
  // Filter out empty questions
  const filteredQuestions = questions.filter(q => q && q.trim() !== '');
  
  // Create a formatted questions object
  const questionsObj: Record<string, string> = {};
  
  filteredQuestions.forEach((question, index) => {
    questionsObj[`pergunta_${index + 1}`] = question;
  });
  
  return questionsObj;
};

/**
 * Validates if a URL is a valid public URL (not a blob URL)
 * @param url The URL to validate
 * @returns Boolean indicating if the URL is a valid public URL
 */
export const isValidPublicUrl = (url: string): boolean => {
  return !!url && url.startsWith('http') && !url.startsWith('blob:');
};
