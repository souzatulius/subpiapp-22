
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';

export const formatResponses = (responseText: string | null): ResponseQA[] => {
  if (!responseText) return [];
  
  try {
    console.log("Formatting response text:", responseText.substring(0, 100) + "...");
    
    // Split by double newlines to get question-answer pairs
    const pairs = responseText.split('\n\n');
    
    return pairs.map(pair => {
      const lines = pair.split('\n');
      if (lines.length >= 2) {
        // Extract question and answer
        const question = lines[0].replace(/^Pergunta:?\s*/i, '');
        const answer = lines[1].replace(/^Resposta:?\s*/i, '');
        return { question, answer };
      }
      return { question: '', answer: '' };
    }).filter(qa => qa.question && qa.answer);
  } catch (error) {
    console.error("Error formatting responses:", error);
    return [];
  }
};
