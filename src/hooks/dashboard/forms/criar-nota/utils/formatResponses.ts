
import { ResponseQA } from '@/components/dashboard/forms/criar-nota/types';

export const formatResponses = (responseText: string | null): ResponseQA[] => {
  if (!responseText) return [];
  
  try {
    console.log("Formatting response text:", responseText.substring(0, 100) + "...");
    
    // Handle different formats of question-answer pairs
    
    // Try first to parse as JSON structure
    if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        const jsonData = JSON.parse(responseText);
        
        if (Array.isArray(jsonData)) {
          return jsonData.map(item => ({
            question: item.question || item.pergunta || '',
            answer: item.answer || item.resposta || ''
          })).filter(qa => qa.question && qa.answer);
        } else if (typeof jsonData === 'object') {
          return Object.entries(jsonData).map(([key, value]) => ({
            question: key,
            answer: String(value)
          })).filter(qa => qa.question && qa.answer);
        }
      } catch (e) {
        console.log("Not a valid JSON format, trying other formats");
      }
    }
    
    // Try to split by double newlines to get question-answer pairs
    const pairs = responseText.split('\n\n');
    
    if (pairs.length > 1) {
      return pairs.map(pair => {
        const lines = pair.split('\n');
        if (lines.length >= 2) {
          // Extract question and answer
          const question = lines[0].replace(/^(Pergunta|Question):?\s*/i, '');
          const answer = lines[1].replace(/^(Resposta|Answer):?\s*/i, '');
          return { question, answer };
        }
        return { question: '', answer: '' };
      }).filter(qa => qa.question && qa.answer);
    }
    
    // Try another format where Q&A might be separated by a single newline
    const lines = responseText.split('\n');
    const result: ResponseQA[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^(Pergunta|Question)\s*\d*:?\s*/) && i + 1 < lines.length) {
        const question = line.replace(/^(Pergunta|Question)\s*\d*:?\s*/, '');
        const nextLine = lines[i + 1].trim();
        if (nextLine.match(/^(Resposta|Answer)\s*\d*:?\s*/)) {
          const answer = nextLine.replace(/^(Resposta|Answer)\s*\d*:?\s*/, '');
          if (question && answer) {
            result.push({ question, answer });
          }
          i++; // Skip the answer line in the next iteration
        }
      }
    }
    
    if (result.length > 0) {
      return result;
    }
    
    // Last resort: try to find question-answer pairs without explicit labels
    const finalResult: ResponseQA[] = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        const question = lines[i].trim();
        const answer = lines[i + 1].trim();
        if (question && answer && question !== answer) {
          finalResult.push({ question, answer });
        }
      }
    }
    
    return finalResult;
    
  } catch (error) {
    console.error("Error formatting responses:", error);
    return [];
  }
};
