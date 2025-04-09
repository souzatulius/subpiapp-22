
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';

// Helper function to format the responses text
export const formatResponses = (responseText: string | null): ResponseQA[] => {
  if (!responseText) return [];
  
  // Split by double newlines to get question-answer pairs
  const pairs = responseText.split('\n\n');
  return pairs.map(pair => {
    const lines = pair.split('\n');
    if (lines.length >= 2) {
      // Extract question and answer
      const question = lines[0].replace('Pergunta: ', '');
      const answer = lines[1].replace('Resposta: ', '');
      return { question, answer };
    }
    return { question: '', answer: '' };
  }).filter(qa => qa.question && qa.answer);
};
