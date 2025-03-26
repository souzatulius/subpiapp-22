
import { Demanda } from '../types';

export const useRespostaValidation = () => {
  /**
   * Validates if a response is valid for submission
   */
  const validateResposta = (selectedDemanda: Demanda | null, resposta: Record<string, string>) => {
    // Check if we have a selected demand
    if (!selectedDemanda) {
      return {
        isValid: false,
        message: "Nenhuma demanda selecionada"
      };
    }

    // Check if resposta has any values
    if (Object.keys(resposta).length === 0) {
      return {
        isValid: false,
        message: "Resposta não pode ser vazia"
      };
    }

    // Check if all questions are answered
    const hasUnansweredQuestions = Object.values(resposta).some(answer => !answer.trim());
    if (hasUnansweredQuestions) {
      return {
        isValid: false,
        message: "Por favor, responda todas as perguntas da demanda"
      };
    }

    return { isValid: true };
  };

  return { validateResposta };
};
