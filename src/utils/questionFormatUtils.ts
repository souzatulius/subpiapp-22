
/**
 * Normalize questions from different format sources
 * @param questionsData Can be array of strings, object with keys as indices, or JSON string
 * @returns Array of question strings
 */
export const normalizeQuestions = (questionsData: any): string[] => {
  if (!questionsData) return [];
  
  // If it's a string, try to parse it as JSON
  if (typeof questionsData === 'string') {
    try {
      questionsData = JSON.parse(questionsData);
    } catch (e) {
      // If it can't be parsed, return it as a single-item array
      return [questionsData];
    }
  }
  
  // If it's an array, return it directly
  if (Array.isArray(questionsData)) {
    return questionsData;
  }
  
  // If it's an object, extract the values
  if (typeof questionsData === 'object') {
    // Check if it's a numerically-indexed object like {0: "question1", 1: "question2"}
    const values = Object.values(questionsData);
    if (values.length > 0) {
      return values.map(v => String(v));
    }
  }
  
  // Default: empty array
  return [];
};
